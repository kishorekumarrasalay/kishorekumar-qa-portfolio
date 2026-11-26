import type { Metadata } from "next";

export type ModuleTested = {
  name: string;
  description: string;
};

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
  modulesTested?: ModuleTested[];
  approach: {
    design: string;
    points?: string[];
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
  customMetrics?: { label: string; value: string | number }[];
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
      role: "Quality Analyst — functional, regression, smoke, sanity, and exploratory testing; bug tracking in Google Sheets.",
    },
    testingScope: [
      "Functional testing of auth, profiles, and job flows",
      "Regression and smoke suites before releases",
      "Exploratory testing on navigation and forms",
      "API practice with Postman (auth, CRUD endpoints)",
    ],
    approach: {
      design:
        "Wrote structured test cases from user stories, prioritized critical paths (login, apply, messaging), and logged defects with clear repro steps in Google Sheets.",
      tools: ["Google Sheets", "Postman", "Chrome DevTools"],
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
      role: "Quality Analyst — functional, regression, and sanity testing with Google Sheets defect tracking.",
    },
    testingScope: [
      "Order and inventory workflows",
      "Regression before production pushes",
      "Sanity checks on critical modules",
      "UI consistency and permission-related paths",
    ],
    modulesTested: [
      {
        name: "Store Creation",
        description:
          "Tested store setup workflows, store metadata configuration, branch onboarding parameters, and location mappings to ensure accurate store initialization across the supply chain network.",
      },
      {
        name: "Middleware",
        description:
          "Tested data synchronization, API integration endpoints, background event payload processing, and data flow validation between store POS terminals and central inventory systems.",
      },
      {
        name: "Invoice Application",
        description:
          "Tested billing calculations, GST and tax breakdowns, promotional discount application formulas, invoice state management, and document export accuracy.",
      },
      {
        name: "Indent & Entries",
        description:
          "Tested purchase requisition flows including Local Purchase and Company Purchase modules, wastage logging entries, and inventory return processing with automated stock balance updates.",
      },
    ],
    approach: {
      design:
        "Mapped business flows into checklists and test cases; validated happy paths and negative cases for status transitions.",
      tools: ["Google Sheets", "Chrome DevTools"],
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
  {
    slug: "burger-king-mini-game",
    title: "Burger King Mini Game",
    tag: "Web",
    summary:
      "Children's promotional web game with manual QA focused on functional, exploratory and child-safety testing.",
    context: {
      product:
        "Burger Storm is a free three-lane runner for children aged 8 to 15, played while waiting for a burger order. Players collect ingredients, dodge obstacles, build burgers and compete on leaderboards across 14 worlds. Because players are children, privacy, parental consent and fair play were as important as the features.",
      role: "Quality Analyst, covering functional, exploratory, usability and compliance testing, with defects tracked in Google Sheets.",
    },
    testingScope: [
      "Registration, login, secret code and recovery email flows",
      "Parental consent and privacy settings",
      "Core gameplay: lives, speed, obstacles, power-ups, scoring and combos",
      "Worlds, unlocks, weather and daily challenge",
      "Profile, leaderboard (today, all time, week, worlds) and ranks",
      "Offline behaviour, performance and compatibility",
    ],
    modulesTested: [
      {
        name: "Account and Registration",
        description:
          "Game name rules, secret code (6 digits), validation, back-button behaviour, duplicate names",
      },
      {
        name: "Recovery and Withdrawal",
        description:
          "Recovery email, secret code email, consent withdrawal, 30-day access period, account deletion",
      },
      {
        name: "Parental Consent",
        description:
          "Consent screen, privacy notice, optional leaderboard sharing, parent confirmation step",
      },
      {
        name: "Gameplay",
        description:
          "Lanes and controls, obstacles, ingredients, burger building, power-ups, speed and scoring rules",
      },
      {
        name: "Profile and Leaderboard",
        description:
          "Stats, best score, looks, ranks, city and world boards, search",
      },
    ],
    approach: {
      design: "",
      points: [
        "Read the game mechanics document and listed the rules with numbers.",
        "Played the game 100+ times and tested each screen on its own.",
        "Used boundary value, negative and exploratory testing.",
        "Reviewed child privacy and consent flows.",
        "Raised requirement gaps with the BA, such as username reuse after deletion and leaderboard behaviour during the 30-day period.",
      ],
      tools: ["Google Sheets", "Excel", "Screen recording"],
    },
    sampleArtifacts: {
      testCases: [
        {
          id: "BK-REG-002",
          title: "Username allows only permitted characters",
          steps: "Enter @#$%^&* as the game name, add a valid code, submit",
          expected: "Validation error is shown and registration is blocked",
        },
        {
          id: "BK-WDR-003",
          title: "Leaderboard entry kept during the 30-day period",
          steps: "Withdraw consent, then open the leaderboard",
          expected: "Entry stays visible during the 30 days",
        },
      ],
      bugReport: {
        id: "BK-002",
        title: "Secret code email is not sent after changing the recovery email",
        severity: "Critical",
        steps:
          "1. Log in to the game\n2. Go to account settings\n3. Change the recovery email\n4. Request the secret code email",
        expected: "The email is sent to the updated recovery email.",
        actual: "No secret code email is received.",
      },
    },
    metrics: {
      bugsFound: 15,
      testCasesExecuted: 666,
      regressionCycles: 100,
    },
    customMetrics: [
      { label: "Test cases designed", value: 666 },
      { label: "Defects logged (14 unique)", value: 15 },
      { label: "Manual game plays", value: "100+" },
    ],
    outcome:
      "The testing found one Critical and 13 Major defects, mostly in the account, recovery and leaderboard flows.",
    learnings: [
      "Child-focused products need extra checks on consent, data removal and clear messages.",
      "Early requirement questions, such as 12 versus 14 worlds, prevented rework later.",
      "Short, repeatable steps and video evidence made the defects easy to reproduce.",
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
