import type { Metadata } from "next";

export type CaseStudy = {
  slug: string;
  title: string;
  tag: string;
  summary: string;
  context: {
    product: string;
    role: string;
  };
  testingScope: string[];
  approach: {
    design: string;
    tools: string[];
  };
  sampleArtifacts: {
    testCases: { id: string; title: string; steps: string; expected: string }[];
    bugReport: {
      id: string;
      title: string;
      severity: string;
      steps: string;
      actual: string;
      expected: string;
    };
  };
  metrics: {
    bugsFound: number;
    testCasesExecuted: number;
    regressionCycles: number;
  };
  outcome: string;
  learnings: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "hikode",
    title: "HiKode",
    tag: "Web",
    summary:
      "Manual and exploratory QA for a job application and professional networking platform, with growing API coverage in Postman.",
    context: {
      product:
        "HiKode is a job application and professional networking web platform used by candidates and recruiters.",
      role: "Quality Analyst — functional, regression, smoke, sanity, and exploratory testing; bug tracking in Jira.",
    },
    testingScope: [
      "Functional testing of auth, profiles, and job flows",
      "Regression and smoke suites before releases",
      "Exploratory testing on navigation and forms",
      "API practice with Postman (auth, CRUD endpoints)",
    ],
    approach: {
      design:
        "Wrote structured test cases from user stories, prioritized critical paths (login, apply, messaging), and logged defects with clear repro steps in Jira.",
      tools: ["Jira", "Postman", "Chrome DevTools", "Google Sheets"],
    },
    sampleArtifacts: {
      testCases: [
        {
          id: "TC-HK-001",
          title: "User can log in with valid credentials",
          steps: "Open login → enter valid email/password → submit",
          expected: "User lands on dashboard; session cookie set",
        },
        {
          id: "TC-HK-014",
          title: "Job application submits with required fields",
          steps: "Open job → Apply → fill required fields → submit",
          expected: "Success toast; application appears in My Applications",
        },
      ],
      bugReport: {
        id: "BUG-HK-042",
        title: "Apply button remains disabled after filling all required fields",
        severity: "Major",
        steps:
          "1. Open a job posting 2. Fill all required fields 3. Observe Apply button",
        actual: "Apply stays disabled with no validation message",
        expected: "Apply enables when required fields are valid",
      },
    },
    metrics: {
      bugsFound: 65,
      testCasesExecuted: 140,
      regressionCycles: 12,
    },
    outcome:
      "Helped stabilize release candidates through consistent regression and clear defect communication with engineering.",
    learnings: [
      "Edge cases around form validation need early exploratory passes",
      "Pairing API checks with UI flows catches contract mismatches sooner",
    ],
  },
  {
    slug: "nso-belgian-waffle",
    title: "NSO — Belgian Waffle",
    tag: "Web",
    summary:
      "Supply Chain Management web app QA focused on functional, regression, and sanity coverage.",
    context: {
      product:
        "NSO — Belgian Waffle is a supply chain management web application used for order and inventory workflows.",
      role: "Quality Analyst — functional, regression, and sanity testing with Jira defect tracking.",
    },
    testingScope: [
      "Order and inventory workflows",
      "Regression before production pushes",
      "Sanity checks on critical modules",
      "UI consistency and permission-related paths",
    ],
    approach: {
      design:
        "Mapped business flows into checklists and test cases; validated happy paths and negative cases for status transitions.",
      tools: ["Jira", "Excel / Google Sheets", "Chrome DevTools"],
    },
    sampleArtifacts: {
      testCases: [
        {
          id: "TC-NSO-008",
          title: "Create purchase order with valid line items",
          steps: "Navigate to Orders → New → add items → save",
          expected: "PO created with Draft status and correct totals",
        },
        {
          id: "TC-NSO-022",
          title: "Reject order with mandatory reason",
          steps: "Open PO → Reject → leave reason blank → submit",
          expected: "Validation error; reject blocked until reason entered",
        },
      ],
      bugReport: {
        id: "BUG-NSO-019",
        title: "Inventory quantity goes negative after partial cancel",
        severity: "Critical",
        steps:
          "1. Create PO with qty 10 2. Receive 4 3. Cancel remaining 4. Check stock",
        actual: "Stock shows -2",
        expected: "Stock never below zero; remaining qty adjusted correctly",
      },
    },
    metrics: {
      bugsFound: 48,
      testCasesExecuted: 110,
      regressionCycles: 9,
    },
    outcome:
      "Reduced last-minute production surprises by tightening sanity checklists around inventory mutations.",
    learnings: [
      "State machines (order status) need explicit transition matrices in test design",
      "Critical severity bugs around stock need immediate regression tagging",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAllCaseStudySlugs() {
  return caseStudies.map((c) => c.slug);
}

export function caseStudyMetadata(study: CaseStudy): Metadata {
  return {
    title: `${study.title} Case Study`,
    description: study.summary,
    openGraph: {
      title: `${study.title} — QA Case Study | Kishore Kumar`,
      description: study.summary,
      type: "article",
    },
  };
}
