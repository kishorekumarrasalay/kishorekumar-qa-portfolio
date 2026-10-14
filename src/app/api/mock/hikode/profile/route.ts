import { NextResponse } from "next/server";

export const runtime = "nodejs";

let candidateProfile = {
  id: "CAN-5502",
  name: "Kishore Kumar",
  title: "Quality Analyst & Automation Enthusiast",
  skills: ["Manual Testing", "Test Case Design", "Playwright with TypeScript", "Postman", "Git / GitHub"],
  avatarUrl: null as string | null,
  noticePeriodDays: 15,
  resumeFileName: "Kishore_Kumar_QA_Resume.pdf",
};

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: candidateProfile,
    environment: "MOCK Sandbox",
  });
}

export async function PUT(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Bearer authorization token required." },
      { status: 401 }
    );
  }

  try {
    const raw = await req.text();
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Bad Request", message: "Payload cannot be empty." },
        { status: 400 }
      );
    }

    const body = JSON.parse(raw) as Partial<typeof candidateProfile>;
    candidateProfile = {
      ...candidateProfile,
      ...body,
    };

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: candidateProfile,
      environment: "MOCK Sandbox",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Bad Request", message: String(error) },
      { status: 400 }
    );
  }
}
