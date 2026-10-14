import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface LeadEntry {
  name: string;
  email: string;
  message: string;
  ts: number;
}

// In-memory store
const leads: LeadEntry[] = [];

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
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
    return NextResponse.json({ error: "Too many submissions. Try again in a minute." }, { status: 429 });
  }

  const body = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 500);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  leads.push({ name, email, message, ts: Date.now() });
  console.log("[lead]", { name, email, message: message.slice(0, 50) });

  return NextResponse.json({ ok: true });
}
