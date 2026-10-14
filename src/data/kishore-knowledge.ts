/**
 * Kishore Kumar — Central Knowledge Base
 * Single source of truth for the Spark AI assistant.
 * All stats, skills, projects, and contact pulled from portfolioData.
 * Never add facts here that are not verified.
 */
import { portfolioData } from "@/data/portfolio";

const { site, about, experience, skills, personalProjects, social, metrics } =
  portfolioData;

export const KB = {
  name: site.name,
  role: site.role,
  email: social.email,
  linkedin: social.linkedin,
  github: social.github,
  phone: "+91 94909 46159",
  location: "Hyderabad, Telangana, India",

  /** Stats pulled directly from the metrics bar — single source of truth */
  stats: {
    bugsLogged: metrics.items.find((i) => i.label === "Bugs logged")?.value ?? 120,
    testCasesWritten:
      metrics.items.find((i) => i.label === "Test cases written")?.value ?? 350,
    productsTested:
      metrics.items.find((i) => i.label === "Products tested")?.value ?? 2,
    monthsExperience:
      metrics.items.find((i) => i.label === "Months experience")?.value ?? 6,
  },

  bio: about.whoIAm.paragraphs.join(" "),

  skills: skills.bentoCards
    .filter((c) => c.id !== "learning")
    .map((c) => ({ category: c.title, items: [...c.items] })),

  currentlyLearning:
    skills.bentoCards.find((c) => c.id === "learning")?.items ?? [],

  experience: experience.work.items.map((j) => ({
    title: j.title,
    company: j.company,
    period: j.period,
    description: j.description,
  })),

  certifications:
    "items" in experience.certifications &&
    Array.isArray(experience.certifications.items)
      ? experience.certifications.items.map((c) => ({
          title: c.title,
          issuer: c.issuer,
          date: c.date,
        }))
      : [],

  education: {
    degree: about.education.degree,
    college: about.education.college,
    period: about.education.period,
  },

  personalProjects: personalProjects.projects.map((p) => ({
    title: p.title,
    description: p.description,
    status: p.status,
    techStack: [...p.techStack],
    githubUrl: "githubUrl" in p ? (p.githubUrl as string) : social.github,
  })),

  resumeHref: about.downloads[0]?.href ?? "/cv.pdf",

  /** Hard-coded facts about roadmap — matches Currently Learning card */
  learningRoadmap: [
    {
      skill: "Playwright with TypeScript",
      goal: "Build a robust E2E automation framework using POM pattern",
      status: "In Progress",
    },
    {
      skill: "Postman API Automation",
      goal: "Automate API test collections and run them in CI",
      status: "In Progress",
    },
    {
      skill: "Git and GitHub CI/CD",
      goal: "Set up GitHub Actions to run Playwright tests on every PR",
      status: "In Progress",
    },
    {
      skill: "Test Automation Frameworks",
      goal: "Deepen understanding of framework architecture for SDET path",
      status: "Planned",
    },
  ],

  availability:
    "Actively open to Quality Analyst and SDET roles. Available for full-time positions in Hyderabad or remote.",

  whyHire: [
    "6+ months of hands-on QA experience across two live products at Ratnam Solutions.",
    `Logged ${metrics.items.find((i) => i.label === "Bugs logged")?.value ?? 120}+ bugs and written ${metrics.items.find((i) => i.label === "Test cases written")?.value ?? 350}+ test cases with clear documentation.`,
    "Fast learner actively building Playwright automation skills toward an SDET career path.",
    "Strong manual testing foundation: functional, regression, smoke, sanity, exploratory, and UAT.",
    "Honest about skill gaps — currently learning automation and CI/CD rather than claiming expertise.",
  ],
} as const;

export type KnowledgeBase = typeof KB;
