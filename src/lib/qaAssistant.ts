import { portfolioData } from "@/data/portfolio";

export interface QaLink {
  label: string;
  href: string;
  download?: boolean;
}

export interface QaProjectCard {
  title: string;
  tags: string[];
  href: string;
  hrefLabel: string;
}

export interface QaMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  codeSnippet?: string;
  links?: QaLink[];
  cards?: QaProjectCard[];
  scrollTo?: string;
  /** Streamed LLM reply — skip typewriter animation */
  live?: boolean;
}

export interface Suggestion {
  label: string;
  query: string;
}

export const SUGGESTIONS: Suggestion[] = [
  { label: "🐞 Bug Sandbox", query: "Open bug hunt sandbox" },
  { label: "🧪 Playwright Suite", query: "Tell me about Playwright automation" },
  { label: "📡 API & Postman", query: "How does Kishore test APIs?" },
  { label: "👨 About Kishore", query: "Tell me about Kishore" },
  { label: "💼 Live Products", query: "What live products has he tested?" },
  { label: "📄 Download CV", query: "Download resume" },
];

const { site, hero, about, experience, skills, portfolio, personalProjects, social } =
  portfolioData;

const PHONE_NUMBER = "+91 94909 46159";
const PHONE_HREF = "tel:+919490946159";

const PROJECT_TAGS: Record<string, string[]> = {
  HiKode: ["Manual Testing", "API Testing", "Bug Reports"],
  "NSO — Belgian Waffle": ["Functional", "Regression", "Sanity"],
};

function professionalCards(): QaProjectCard[] {
  return portfolio.projects.map((p) => ({
    title: p.title,
    tags: PROJECT_TAGS[p.title] ?? [p.tag],
    href: "#portfolio",
    hrefLabel: "View Project",
  }));
}

export function getWelcomeMessage(): QaMessage {
  return {
    id: "welcome",
    role: "assistant",
    text: `👋 Hi, I'm Spark AI — Kishore's QA Assistant!\n\nI can answer questions about:\n✅ Manual & API Testing   ✅ Playwright & TypeScript\n✅ Live Tested Products    ✅ Test Automation Roadmap\n\nFeel free to type a query or click any of the action buttons below!`,
  };
}

export function getOutroMessage(): QaMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: `Have a question or career opportunity for Kishore?\nFeel free to reach out via Email or LinkedIn.`,
    links: [
      { label: "📧 Email Kishore", href: `mailto:${social.email}` },
      { label: "💼 LinkedIn Profile", href: social.linkedin },
    ],
  };
}

function reply(
  text: string,
  extras?: Partial<Omit<QaMessage, "id" | "role" | "text">>
): QaMessage {
  return { id: crypto.randomUUID(), role: "assistant", text, ...extras };
}

// ── Extended Intent responses ──
const RESPONSES: Record<string, () => QaMessage> = {
  playwright: () =>
    reply(
      `Kishore builds E2E web automation using Playwright & TypeScript with the Page Object Model (POM).\nHere is a sample spec structure from his codebase:`,
      {
        codeSnippet: `// tests/e2e/checkout.spec.ts\nimport { test, expect } from '@playwright/test';\n\ntest('Verify cart checkout discount formula', async ({ page }) => {\n  await page.goto('/checkout');\n  await page.fill('#promo-code', 'WAFFLE20');\n  await page.click('#apply-btn');\n  await expect(page.locator('.cart-total')).toHaveText('₹599.97');\n});`,
        links: [
          { label: "⚡ Try Playwright Demo", href: "#qa-sandbox" },
          { label: "View Skills", href: "#skills" },
        ],
      }
    ),
  api: () =>
    reply(
      `Kishore performs robust API testing using Postman — verifying REST & SOAP endpoints, HTTP status codes, JSONPath schema assertions, and Bearer Token auth.\nSample test assertion:`,
      {
        codeSnippet: `// Postman Tests Tab\npm.test("Status code is 200 OK", function () {\n    pm.response.to.have.status(200);\n    pm.expect(pm.response.json().status).to.eql("success");\n});`,
        links: [
          { label: "📡 Open API Test Runner", href: "#qa-sandbox" },
          { label: "View Skills", href: "#skills" },
        ],
      }
    ),
  manual: () =>
    reply(
      `Manual testing is Kishore's core expertise. He executes functional, regression, smoke, sanity, and exploratory testing across live web platforms, logging defects with full step-by-step documentation in Google Sheets.`,
      {
        links: [
          { label: "🐞 Live Bug Hunt", href: "#qa-sandbox" },
          { label: "View Skills", href: "#skills" },
        ],
      }
    ),
  bug_sandbox: () =>
    reply(
      `You can test Kishore's interactive QA Lab directly on this page!\nIt features a Live Bug Hunt Sandbox, Postman API runner, and a sample Test Case Explorer.`,
      { links: [{ label: "🚀 Open QA Sandbox", href: "#qa-sandbox" }] }
    ),
  sql: () =>
    reply(
      `Kishore uses SQL to perform backend data validation during testing — verifying records in database tables, checking foreign keys, and ensuring UI inputs correctly reflect in the backend.`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    ),
  skills: () => {
    const learning = skills.bentoCards
      .find((c) => c.id === "learning")
      ?.items.join(", ");
    return reply(
      `Kishore's core QA toolkit:\n\n• Manual Testing (Functional, Regression, Smoke, Sanity, Exploratory)\n• Automation: Playwright with TypeScript (Page Object Model)\n• API Testing: Postman, REST & SOAP, JSONPath, Auth types\n• Database: SQL (basic queries)\n• Tools: Google Sheets (Bug Tracking), Git & GitHub, Excel\n\nCurrently upskilling in: ${learning}`,
      { links: [{ label: "View Skills", href: "#skills" }] }
    );
  },
  automation: () => {
    const p = personalProjects.projects[0];
    const github = "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} (${p.status})\n\n${p.description}\n\nTech: ${p.techStack.join(", ")}`,
      {
        cards: [
          {
            title: p.title,
            tags: p.techStack.slice(0, 4),
            href: github,
            hrefLabel: "View GitHub Repo",
          },
        ],
      }
    );
  },
  personalProjects: () => {
    const p = personalProjects.projects[0];
    const github = "githubUrl" in p && p.githubUrl ? p.githubUrl : social.github;
    return reply(
      `${p.title} (${p.status})\n\n${p.description}`,
      {
        cards: [
          {
            title: p.title,
            tags: p.techStack.slice(0, 4),
            href: github,
            hrefLabel: "View Project",
          },
        ],
      }
    );
  },
  projects: () =>
    reply(`Here are the live products Kishore has tested at Ratnam Solutions:`, {
      cards: professionalCards(),
      links: [{ label: "Personal Projects", href: "#personal-projects" }],
    }),
  certifications: () => {
    const certList =
      "items" in experience.certifications &&
      Array.isArray(experience.certifications.items)
        ? experience.certifications.items
            .map((c) => `🏆 ${c.title} (${c.issuer} — ${c.date})`)
            .join("\n")
        : "";
    return reply(
      `Completed Certifications:\n${certList}\n\n${experience.certifications.description}\n\nUpskilling Focus:\n• ${experience.certifications.tags.join("\n• ")}`,
      { links: [{ label: "View Experience & Certifications", href: "#experience" }] }
    );
  },
  phone: () =>
    reply(`Phone: ${PHONE_NUMBER}`, {
      links: [{ label: "Call Kishore", href: PHONE_HREF }],
    }),
  email: () =>
    reply(`Email: ${social.email}`, {
      links: [{ label: "Send Email", href: `mailto:${social.email}` }],
    }),
  github: () =>
    reply(
      `Kishore uses Git & GitHub for version control and automation repositories.\n\nGitHub Profile: ${social.github}`,
      { links: [{ label: "Open GitHub", href: social.github }] }
    ),
  jira: () =>
    reply(
      `Kishore uses Google Sheets daily for defect lifecycle management — writing detailed bug reports (Steps to reproduce, Expected vs Actual, Severity, Screenshots) and maintaining test logs.`,
      { links: [{ label: "🐞 Try Defect Tracker (Google Sheets)", href: "#qa-sandbox" }] }
    ),
  linkedin: () =>
    reply(`LinkedIn Profile: ${social.linkedin}`, {
      links: [{ label: "Open LinkedIn", href: social.linkedin }],
    }),
  contact: () =>
    reply(
      `I'd be happy to connect with you!\n\n📧 Email: ${social.email}\n💼 LinkedIn: Visit profile below\n💻 GitHub: Explore repositories\n\nKishore is actively open to Quality Analyst and SDET roles.`,
      {
        links: [
          { label: "📧 Email Me", href: `mailto:${social.email}` },
          { label: "💼 LinkedIn", href: social.linkedin },
          { label: "💻 GitHub", href: social.github },
          { label: "📄 Download CV", href: about.downloads[0].href, download: true },
        ],
      }
    ),
  resume: () => {
    const cv = about.downloads[0];
    return reply(`Certainly! Preparing Kishore's updated resume for download:`, {
      links: [
        { label: "⬇ Download CV (PDF)", href: cv.href, download: true },
        { label: "Go to About Section", href: "#about" },
      ],
    });
  },
  experience: () => {
    const jobs = experience.work.items
      .map((j) => `• ${j.title} @ ${j.company} (${j.period})\n  ${j.description}`)
      .join("\n\n");
    return reply(`Kishore's work experience:\n\n${jobs}`, {
      links: [{ label: "View Experience", href: "#experience" }],
    });
  },
  education: () =>
    reply(
      `${about.education.degree}\n${about.education.college}\n${about.education.period}\n\n${about.education.summary}`,
      { links: [{ label: "View About", href: "#about" }] }
    ),
  about: () =>
    reply(
      `${site.name} is a ${site.role} at Ratnam Solutions Private Limited. ${hero.bio}`,
      {
        links: [
          { label: "View About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
      }
    ),
};

// ── Intent definitions (priority order) ──
interface Intent {
  id: string;
  phrases?: string[];
  keywords?: string[];
}

const INTENTS: Intent[] = [
  { id: "playwright", keywords: ["playwright", "e2e", "cypress", "selenium"] },
  { id: "api", phrases: ["api testing"], keywords: ["api", "postman", "rest", "soap", "json"] },
  { id: "bug_sandbox", phrases: ["bug hunt", "bug sandbox", "qa lab"], keywords: ["sandbox", "lab", "hunt"] },
  {
    id: "manual",
    phrases: ["manual testing"],
    keywords: ["manual", "functional", "regression", "smoke", "sanity", "exploratory"],
  },
  { id: "sql", keywords: ["sql", "database", "databases", "query"] },
  { id: "jira", keywords: ["jira", "bug", "bugs", "defect", "defects", "ticket", "kanban"] },
  {
    id: "skills",
    phrases: ["what tools", "which tools", "tech stack", "tools does", "skills does", "what skills"],
    keywords: ["tools", "tool", "skills", "skill", "stack", "toolkit", "technologies"],
  },
  { id: "automation", phrases: ["automation framework", "show automation"], keywords: ["automation", "framework", "sdet"] },
  { id: "personalProjects", phrases: ["personal project", "personal projects", "own project", "side project", "own build"] },
  { id: "projects", phrases: ["qa projects", "show projects", "your projects", "tested projects"], keywords: ["projects", "project", "portfolio"] },
  { id: "certifications", keywords: ["certification", "certifications", "certificate", "certificates", "certified"] },
  { id: "experience", phrases: ["work experience"], keywords: ["experience", "career", "companies"] },
  { id: "education", keywords: ["education", "college", "degree", "study", "studied", "graduation"] },
  { id: "phone", phrases: ["contact number", "phone number"], keywords: ["phone", "mobile", "call", "whatsapp"] },
  { id: "email", keywords: ["email", "gmail", "mail"] },
  { id: "github", phrases: ["git hub", "git and github"], keywords: ["github", "git", "repo", "repository"] },
  { id: "linkedin", phrases: ["linked in"], keywords: ["linkedin"] },
  { id: "contact", phrases: ["contact details", "get in touch", "how to reach", "hire"], keywords: ["contact", "reach", "hire"] },
  { id: "resume", phrases: ["download resume", "download cv"], keywords: ["resume", "cv"] },
  {
    id: "about",
    phrases: ["about kishore", "about you", "tell me about", "who is kishore", "background"],
    keywords: ["about", "background", "intro", "summary", "profile"],
  },
];

const GREETINGS = new Set([
  "hi", "hii", "hiii", "hiya", "hey", "heyy", "hello", "helo", "yo", "sup", "greetings", "namaste",
]);

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isGreeting(norm: string, tokens: string[]): boolean {
  if (norm.startsWith("good morning") || norm.startsWith("good evening") || norm.startsWith("good afternoon")) {
    return true;
  }
  if (tokens.length > 3) return false;
  return tokens.some((t) => {
    if (GREETINGS.has(t)) return true;
    if (t.length >= 4 && levenshtein(t, "hello") <= 1) return true;
    return false;
  });
}

function scoreIntent(norm: string, tokens: string[], intent: Intent): number {
  let score = 0;
  for (const p of intent.phrases ?? []) {
    if (norm.includes(p)) score += 3;
  }
  const tokenSet = new Set(tokens);
  for (const k of intent.keywords ?? []) {
    if (tokenSet.has(k)) score += 1;
  }
  return score;
}

export function getAssistantReply(input: string): QaMessage {
  const norm = input.toLowerCase().trim();
  const tokens = norm.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

  let bestId: string | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = scoreIntent(norm, tokens, intent);
    if (score > bestScore) {
      bestScore = score;
      bestId = intent.id;
    }
  }

  if (bestId && bestScore > 0) {
    return RESPONSES[bestId]();
  }

  if (isGreeting(norm, tokens) || tokens.includes("help")) {
    return reply(
      `👋 Hi! Welcome to ${site.name}'s QA Portfolio.\nI'm your AI QA Assistant. Ask me anything about my experience, projects, testing skills, certifications, or resume.`
    );
  }

  return reply(
    `Sorry, I can't answer questions outside ${site.name}'s portfolio. I'm here to help you explore my professional experience, QA skills, projects, resume, and contact details.`,
    {
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#portfolio" },
        { label: "Contact", href: "#contact" },
      ],
    }
  );
}
