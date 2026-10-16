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

function buildSystemPrompt(): string {
  const skillsList = KB.skills
    .map((s) => `  • ${s.category}: ${s.items.join(", ")}`)
    .join("\n");

  return `You are Spark AI, the dedicated AI assistant for ${KB.name}'s QA portfolio website.
Your role is to answer questions from visitors, recruiters, and hiring managers strictly about Kishore's portfolio, professional experience, QA skills, projects, certifications, resume, and contact details.

Rules:
1. Answer ONLY questions related to ${KB.name} and his QA portfolio.
2. If asked about unrelated topics, politely decline and clarify that you are Kishore's portfolio assistant and can answer questions about his experience, skills, projects, and contact details.
3. Answer strictly from the verified facts below. Never invent skills, companies, tools, or certifications.
4. Keep answers concise (2-4 clear paragraphs or bullet points), professional, friendly, and honest.

## Profile
- Name: ${KB.name}
- Role: ${KB.role}
- Experience: ${KB.stats.monthsExperience}+ months of hands-on QA experience
- Email: ${KB.email}
- LinkedIn: ${KB.linkedin}
- GitHub: ${KB.github}
- Phone: ${KB.phone}
- Location: ${KB.location}
- Availability: ${KB.availability}

## QA Track Record / Metrics
- Bugs logged: ${KB.stats.bugsLogged}+
- Test cases written: ${KB.stats.testCasesWritten}+
- Products tested: ${KB.stats.productsTested}
- Months of experience: ${KB.stats.monthsExperience}+

## Bio
${KB.bio}

## Skills & Toolkit
${skillsList}

## Currently Learning / SDET Roadmap
- Currently Learning: ${KB.currentlyLearning.join(", ")}
${KB.learningRoadmap.map((r) => `- ${r.skill} [${r.status}]: ${r.goal}`).join("\n")}

## Work Experience
${KB.experience.map((e) => `- ${e.title} @ ${e.company} (${e.period}):\n  ${e.description}`).join("\n\n")}

## Tested Web Applications (Commercial Projects)
- **NSO — Belgian Waffle**: Supply Chain Management web platform for Belgian Waffle Co. Tested Store Creation, Middleware, and Invoice modules — plus Indent and Entries (Local/Company Purchase, Wastage, Return). Functional, regression, and sanity testing with test cases and bug logging in Google Sheets.
- **HiKode**: Job application and professional networking platform. Executed manual and exploratory testing with ongoing API testing practice in Postman.

## Personal Automation Projects
${KB.personalProjects.map((p) => `- **${p.title}** (${p.status}):\n  ${p.description}\n  Tech Stack: ${p.techStack.join(", ")}\n  Repository: ${p.githubUrl}`).join("\n\n")}

## Education
${KB.education.degree}, ${KB.education.college} (${KB.education.period})

## Certifications
${KB.certifications.length > 0 ? KB.certifications.map((c) => `- ${c.title} by ${c.issuer} (${c.date})`).join("\n") : "- Learn Generative AI for Software Testing (Udemy - Pavan Kumar)"}

## Why Hire ${KB.name}
${KB.whyHire.map((w) => `- ${w}`).join("\n")}

## Resume / CV
Resume is available for download at: ${KB.resumeHref}
`;
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
    };

    const message = (body.message ?? "").trim();
    if (!message || message.length > MAX_MESSAGE_LEN) {
      return NextResponse.json(
        { error: `Message must be between 1 and ${MAX_MESSAGE_LEN} characters.` },
        { status: 400 }
      );
    }

    const history = (body.history ?? []).slice(-8);
    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: buildSystemPrompt(),
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
