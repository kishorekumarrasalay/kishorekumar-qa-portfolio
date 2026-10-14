import { NextResponse } from "next/server";

export const runtime = "nodejs";

const appliedSet = new Set<string>();

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Bad Request", message: "Application payload cannot be empty." },
        { status: 400 }
      );
    }

    const body = JSON.parse(raw) as {
      jobId?: string;
      candidateId?: string;
      resumeUrl?: string;
      adminAction?: string;
    };

    // Check for 403 Forbidden scenario (candidate attempting admin action)
    if (body.adminAction) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Forbidden: Candidate role lacks 'jobs:archive' administrative permission.",
          code: "INSUFFICIENT_PERMISSIONS",
        },
        { status: 403 }
      );
    }

    if (!body.jobId || !body.candidateId) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Missing required application parameters: 'jobId' and 'candidateId'.",
          code: "VALIDATION_FAILED",
        },
        { status: 422 }
      );
    }

    // Check file extension if resumeUrl provided
    if (body.resumeUrl && (body.resumeUrl.endsWith(".exe") || body.resumeUrl.endsWith(".bat"))) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Security Policy Violation: Executable binary files (.exe / .bat) are strictly disallowed.",
          code: "MALWARE_RISK_DETECTED",
        },
        { status: 400 }
      );
    }

    const appKey = `${body.candidateId}:${body.jobId}`;
    const isDuplicate = appliedSet.has(appKey);
    appliedSet.add(appKey);

    return NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Duplicate application registered (Simulated defect BUG-HK-01 allowed duplicate submit)"
          : "Application submitted successfully to employer queue.",
        applicationId: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        jobId: body.jobId,
        candidateId: body.candidateId,
        appliedAt: new Date().toISOString(),
        isDuplicateSubmission: isDuplicate,
        environment: "MOCK Sandbox",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Bad Request", message: String(error) },
      { status: 400 }
    );
  }
}
