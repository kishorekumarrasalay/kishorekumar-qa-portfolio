import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { KB } from "@/data/kishore-knowledge";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const MAX_MESSAGE_LEN = 1200; // longer for recruiter mode (JD paste)

const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function rateLimit(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (row.count >= MAX_PER_WINDOW) return false;
  row.count += 1;
  return true;
}

function buildSystemPrompt(mode: string): string {
  const skillsList = KB.skills
    .map((s) => `  • ${s.category}: ${s.items.join(", ")}`)
    .join("\n");

  const base = `You are Spark AI, the assistant for ${KB.name}'s QA portfolio website.
You answer ONLY from the verified knowledge base below. Never invent facts, skills, certifications, or employers.
If asked about something not in the knowledge base, say it is not available and share ${KB.email} and ${KB.linkedin}.
Be concise (2–5 short paragraphs max), professional, and honest.

## Profile
- Name: ${KB.name}
- Role: ${KB.role}
- Experience: ${KB.stats.monthsExperience}+ months
- Email: ${KB.email}
- LinkedIn: ${KB.linkedin}
- GitHub: ${KB.github}
- Location: ${KB.location}
- Availability: ${KB.availability}

## Stats (from portfolio stats bar)
- Bugs logged: ${KB.stats.bugsLogged}+
- Test cases written: ${KB.stats.testCasesWritten}+
- Products tested: ${KB.stats.productsTested}

## Bio
${KB.bio}

## Skills
${skillsList}

## Currently Learning
${KB.currentlyLearning.join(", ")}

## Experience
${KB.experience.map((e) => `- ${e.title} @ ${e.company} (${e.period}): ${e.description}`).join("\n")}

## Personal Projects
${KB.personalProjects.map((p) => `- ${p.title} (${p.status}): ${p.description}\n  Tech: ${p.techStack.join(", ")}`).join("\n")}

## Education
${KB.education.degree}, ${KB.education.college} (${KB.education.period})

## Why Hire ${KB.name}
${KB.whyHire.map((w) => `- ${w}`).join("\n")}

## Learning Roadmap
${KB.learningRoadmap.map((r) => `- ${r.skill} (${r.status}): ${r.goal}`).join("\n")}

## Resume
Download: ${KB.resumeHref}
`;

  if (mode === "recruiter") {
    return (
      base +
      `\n## RECRUITER MODE
The user has pasted a job description. Analyze it against the knowledge base above and respond with:
1. **Matching Skills** — skills Kishore already has that match the JD
2. **Skills Still Being Learned** — skills in the JD that Kishore is actively learning
3. **Gaps** — skills in the JD that Kishore does not currently have (be honest)
4. **Fit Summary** — a short, honest paragraph about whether Kishore is a good fit
Do NOT claim skills that are not in the knowledge base. Do NOT mention SQL, Jenkins, or Cursor.`
    );
  }

  if (mode === "test_feature") {
    return (
      base +
      `\n## TEST MY FEATURE MODE
The user has described a feature name. Generate a QA test plan:
1. A summary of what needs to be tested
2. A markdown table of test cases (columns: ID | Test Case | Type | Steps | Expected Result)
   - Include at least 3 positive, 2 negative, and 2 edge cases
3. Any important edge cases to watch for
Keep the table clean and easy to copy.`
    );
  }

  if (mode === "bug_report") {
    return (
      base +
      `\n## BUG REPORT GENERATOR MODE
The user has described a bug in plain language. Generate a professional bug report:
- **Bug ID**: BUG-XXX (auto-generate)
- **Title**: One line summary
- **Description**: What is happening
- **Steps to Reproduce**: Numbered list
- **Expected Result**: What should happen
- **Actual Result**: What actually happens
- **Severity**: Critical / High / Medium / Low (choose appropriate)
- **Priority**: P1 / P2 / P3 / P4 (choose appropriate)
- **Environment**: Web browser / OS (infer from description or use generic)
Keep it in a clean format the user can copy directly into a bug tracker.`
    );
  }

  if (mode === "interview") {
    return (
      base +
      `\n## MOCK INTERVIEW MODE
You are conducting a mock QA interview. Ask manual testing questions one at a time.
After the user answers, give brief feedback (correct / partially correct / incorrect and why), then ask the next question.
After 5 questions, give a final score (X/5) with overall feedback.
Focus on: test case design, defect life cycle, types of testing, STLC, and real-world scenarios.
Do not ask about SQL, Jenkins, or any skill not in the knowledge base.`
    );
  }

  if (mode === "quiz") {
    return (
      base +
      `\n## QA QUIZ MODE
Present a 5-question QA quiz. Show one question at a time with multiple choice options (A, B, C, D).
After the user answers, show whether it is correct and briefly explain why.
After all 5, show the final score (X/5) and encourage the user.
Topics: types of testing, STLC, defect severity vs priority, test case writing, and exploratory testing.`
    );
  }

  return base;
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Chat API is not configured. Set ANTHROPIC_API_KEY on the server.",
          fallback: true,
        },
        { status: 503 }
      );
    }

    const body = (await req.json()) as {
      message?: string;
      history?: { role: "user" | "assistant"; content: string }[];
      mode?: string;
    };

    const message = (body.message ?? "").trim();
    if (!message || message.length > MAX_MESSAGE_LEN) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE_LEN} characters.` },
        { status: 400 }
      );
    }

    const mode = body.mode ?? "default";
    const history = (body.history ?? []).slice(-8);
    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: mode === "recruiter" || mode === "test_feature" ? 1200 : 700,
      system: buildSystemPrompt(mode),
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json(
      { error: "Something went wrong generating a reply." },
      { status: 500 }
    );
  }
}
