import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Bad Request", message: "Empty login payload provided." },
        { status: 400 }
      );
    }

    const body = JSON.parse(raw) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Unprocessable Entity", message: "Email and password fields are required." },
        { status: 422 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Unprocessable Entity", message: "Invalid email format." },
        { status: 422 }
      );
    }

    // Realistic authentication check
    if (password === "wrong_password" || password === "invalid") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid email or password credentials provided.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Authentication successful",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDQU4tNTUwMiIsIm5hbWUiOiJLaXNob3JlIEt1bWFyIiwicm9sZSI6ImNhbmRpZGF0ZSJ9",
        expiresIn: 3600,
        user: {
          id: "CAN-5502",
          email,
          name: "Kishore Kumar",
          role: "Candidate",
        },
        environment: "MOCK Sandbox",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Bad Request", message: String(error) },
      { status: 400 }
    );
  }
}
