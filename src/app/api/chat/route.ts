import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { portfolioData } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const MAX_MESSAGE_LEN = 500;

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

function buildSystemPrompt() {
  const { site, about, experience, skills, portfolio, personalProjects, social } =
    portfolioData;

  return `You are the QA Assistant for ${site.name}'s portfolio website.
Answer ONLY questions about ${site.name}'s QA background, skills, projects, experience, resume, and contact.
If asked something off-topic, politely redirect to those topics.
Keep answers concise (2–5 short paragraphs max), factual, and professional.
Do not invent employers, certifications, or metrics that are not listed below.

## Profile
- Name: ${site.name}
- Role: ${site.role}
- Email: ${social.email}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}
- Location: Hyderabad, Telangana, India

## About
${about.whoIAm.paragraphs.join("\n")}

## Experience
${experience.work.items
  .map((i) => `- ${i.title} @ ${i.company} (${i.period}): ${i.description}`)
  .join("\n")}

## Skills
${skills.bentoCards.map((c) => `- ${c.title}: ${c.items.join(", ")}`).join("\n")}

## Work products tested
${portfolio.projects.map((p) => `- ${p.title}: ${p.description}`).join("\n")}

## Case study highlights
${caseStudies
  .map(
    (c) =>
      `- ${c.title}: bugs~${c.metrics.bugsFound}, cases~${c.metrics.testCasesExecuted}`
  )
  .join("\n")}

## Personal projects
${personalProjects.projects
  .map((p) => `- ${p.title} (${p.status}): ${p.description}`)
  .join("\n")}

## Certifications / learning
Completed Certificates:
${
  "items" in experience.certifications &&
  Array.isArray(experience.certifications.items)
    ? experience.certifications.items
        .map(
          (c) =>
            `- ${c.title} by ${c.issuer} (Instructor: ${c.instructor}, ${c.date}, ${c.duration}) [Credential: ${c.credentialUrl}]`
        )
        .join("\n")
    : ""
}
${experience.certifications.description}
Tags: ${experience.certifications.tags.join(", ")}
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
          error:
            "Chat API is not configured. Set ANTHROPIC_API_KEY on the server.",
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
        { error: "Message must be between 1 and 500 characters." },
        { status: 400 }
      );
    }

    const history = (body.history ?? []).slice(-8);
    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system: buildSystemPrompt(),
      messages: [
        ...history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
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
