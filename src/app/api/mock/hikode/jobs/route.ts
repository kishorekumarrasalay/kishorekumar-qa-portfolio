import { NextResponse } from "next/server";

export const runtime = "nodejs";

const mockJobs = [
  {
    id: "JOB-101",
    title: "Senior QA Automation Engineer",
    company: "CloudScale Technologies",
    location: "Hyderabad, India (Hybrid)",
    salary: "₹14,00,000 - ₹20,00,000",
    tags: ["Playwright", "TypeScript", "Postman", "CI/CD"],
    type: "Full-Time",
    postedDaysAgo: 2,
    openPositions: 2,
  },
  {
    id: "JOB-102",
    title: "SDET I — Web & API Testing",
    company: "FinFlow Global",
    location: "Bengaluru, India (Remote)",
    salary: "₹10,00,000 - ₹15,00,000",
    tags: ["API Testing", "Playwright", "Jest", "Git"],
    type: "Full-Time",
    postedDaysAgo: 4,
    openPositions: 1,
  },
  {
    id: "JOB-103",
    title: "QA Test Lead (Manual & Automation)",
    company: "NexGen Logistics",
    location: "Hyderabad, India (On-site)",
    salary: "₹18,00,000 - ₹24,00,000",
    tags: ["Test Strategy", "Defect Lifecycle", "Postman", "Agile"],
    type: "Full-Time",
    postedDaysAgo: 1,
    openPositions: 3,
  },
  {
    id: "JOB-104",
    title: "Junior QA Engineer (Entry-Level / 1 yr)",
    company: "Ratnam Solutions Demo Corp",
    location: "Hyderabad, India",
    salary: "₹4,50,000 - ₹6,50,000",
    tags: ["Manual Testing", "Test Cases", "Bug Reporting", "Learning Playwright"],
    type: "Full-Time",
    postedDaysAgo: 5,
    openPositions: 2,
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  let filtered = mockJobs;
  if (q) {
    filtered = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q)) ||
        job.company.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    jobs: filtered.slice(0, limit),
    query: q || null,
    environment: "MOCK Sandbox",
  });
}
