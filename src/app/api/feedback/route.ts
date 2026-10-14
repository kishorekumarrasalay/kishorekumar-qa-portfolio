import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory store (resets on cold start — acceptable for a portfolio)
const votes: { msgId: string; vote: "up" | "down"; ts: number }[] = [];

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const row = ipHits.get(ip);
  if (!row || now > row.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (row.count >= MAX_PER_WINDOW) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = (await req.json()) as { msgId?: string; vote?: "up" | "down" };
  if (!body.msgId || !["up", "down"].includes(body.vote ?? "")) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  votes.push({ msgId: body.msgId, vote: body.vote as "up" | "down", ts: Date.now() });
  console.log("[feedback]", body.msgId, body.vote, `total=${votes.length}`);

  return NextResponse.json({ ok: true });
}
