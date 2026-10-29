/**
 * =============================================================================
 * PORTFOLIO CONTENT — edit this file to update your entire website
 * =============================================================================
 *
 * You do NOT need to change component files (.tsx) for content updates.
 * Just edit the values below, save, and refresh your browser.
 *
 * Tips:
 * - Profile photo: replace `public/profile.jpg`
 * - CV / cover letter: add `public/cv.pdf` and `public/cover-letter.pdf`
 * - To add a work job, portfolio project, or personal project: copy an existing
 *   item in the array and change the text
 * - To hide a nav link: remove that entry from `navLinks`
 * =============================================================================
 */

/** Returns the number of months since the given start date (default: first day as intern). */
export function getMonthsExperience(startDateStr = "2026-03-18"): number {
  const start = new Date(startDateStr);
  const now = new Date();
  const diffInDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(diffInDays / 30.4375));
}

export const portfolioData = {
  // ----- Site-wide (name, logo, SEO, footer) -----
  site: {
    name: "Kishore Kumar",
    role: "Quality Analyst",
    logo: "KK",
    profileImage: "/profile.jpg",
    copyrightYear: 2026,
    meta: {
      title: "Kishore Kumar | Manual QA Tester & Aspiring SDET | Hyderabad",
      description:
        "Manual QA Tester in Hyderabad. Functional, regression and API testing with Postman. Building Playwright + TypeScript automation toward an SDET role.",
    },
  },

  // ----- Top navigation -----
  navLinks: [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    {
      label: "Personal Projects",
      mobileLabel: "Projects",
      href: "/#personal-projects",
    },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  // ----- Social links (used in hero & contact) -----
  social: {
    linkedin: "https://www.linkedin.com/in/kishorekumarrasalay",
    github: "https://github.com/kishorekumarrasalay",
    email: "kishorekumarrasalay05@gmail.com",
  },

  // ----- Home / Hero section -----
  hero: {
    tagline: "Manual Tester | API Testing | Moving toward SDET",
    bio: "I test web applications at Ratnam Solutions Private Limited, including HiKode and NSO Belgian Waffle, covering functional, regression, smoke, sanity and exploratory testing. I log and track defects in Google Sheets and test REST APIs with Postman. I am building Playwright + TypeScript automation skills through a personal project to grow into an SDET role.",
    roleCycle: [
      "Quality Analyst",
    ],
    typewriterLines: [
      "Testing... ✓ Passed",
      "Regression Suite... ✓ Passed",
      "Bug #247... 🔍 Investigating",
    ],
  },

  // ----- Metrics band (below hero) — computed dynamically where needed -----
  metrics: {
    items: [
      { label: "Bugs logged", value: 120, suffix: "+", prefix: "" },
      { label: "Test cases written", value: 350, suffix: "+", prefix: "" },
      { label: "Products tested", value: 2, suffix: "", prefix: "" },
      // NOTE: "Months experience" is rendered from getMonthsExperience() in MetricsBand
      { label: "Months experience", value: getMonthsExperience("2026-03-18"), suffix: "+", prefix: "" },
    ],
  },

  // ----- About section -----
  about: {
    sectionTitle: "About Me",
    whoIAm: {
      title: "Who I Am",
      paragraphs: [
        "I started my QA journey as an intern in March 2026 and moved into a full-time Quality Analyst role in June 2026. Day to day I run functional, regression, smoke, sanity and exploratory tests, write clear test cases, and report reproducible bugs. I test APIs manually with Postman and I am learning Playwright with TypeScript so I can automate the checks I run by hand.",
      ],
    },
    downloads: [
      { label: "Download CV", href: "/cv.pdf" },
      { label: "Download Cover Letter", href: "/cover-letter.pdf" },
    ],
    education: {
      title: "Education",
      degree:
        "Bachelor of Technology in Electronics and Communication Engineering",
      college:
        "Rajeev Gandhi Memorial College of Engineering and Technology",
      period: "2018 – 2022",
      summary:
        "Built a strong analytical and problem-solving foundation that carried into a career in software quality.",
    },
    coreCompetenciesTitle: "Core Competencies",
    coreCompetencies: [
      "Clear, reproducible bug reports",
      "Test case design: positive, negative and boundary",
      "Exploratory testing of web workflows",
      "Manual REST API testing with Postman",
      "Defect lifecycle tracking in Google Sheets",
    ],
  },

  // ----- Experience & Certifications -----
  experience: {
    sectionTitle: "Experience & Certifications",
    work: {
      title: "Work Experience",
      items: [
        {
          title: "Quality Analyst (Full-Time)",
          company: "Ratnam Solutions Private Limited",
          period: "Jun 2026 – Present",
          bullets: [
            "Perform functional, regression, smoke, sanity and exploratory testing on HiKode and NSO Belgian Waffle web platforms.",
            "Test REST APIs manually using Postman.",
            "Write test cases and track defects and test documentation in Google Sheets.",
            // [TODO: add one real, measurable result here — e.g. "Reduced critical escapes by X% over N sprints"]
          ],
          description: "",
        },
        {
          title: "Quality Analyst Intern",
          company: "Ratnam Solutions Private Limited",
          period: "Mar 2026 – Jun 2026",
          bullets: [],
          description:
            "Learned core QA fundamentals including SDLC/STLC, test case writing, and defect lifecycle management while contributing to web application testing.",
        },
      ],
    },
    certifications: {
      title: "Certifications & Currently Learning",
      description:
        "Actively upskilling in Playwright with TypeScript automation, API testing with Postman, and Generative AI for software testing.",
      tags: [
        "Playwright with TypeScript",
        "API Testing with Postman",
        "Generative AI for Software Testing",
      ],
      items: [
        {
          title: "Learn Generative AI for Software Testing",
          issuer: "Udemy",
          instructor: "Pavan Kumar",
          date: "Aug 17, 2026",
          duration: "9 total hours",
          credentialId: "UC-d029426d-bcbd-4a57-bad6-1f0962aba653",
          credentialUrl:
            "https://ude.my/UC-d029426d-bcbd-4a57-bad6-1f0962aba653",
        },
      ],
    },
  },

  // ----- Technical Skills — three honest tiers -----
  skills: {
    sectionTitle: "Technical Skills",
    bentoCards: [
      {
        id: "testing",
        title: "Hands-on — Testing",
        icon: "testing" as const,
        items: [
          "Functional Testing",
          "Regression Testing",
          "Smoke Testing",
          "Sanity Testing",
          "Exploratory Testing",
          "Test Case Design",
          "Bug Reporting",
          "Test Documentation",
          "API Testing with Postman",
          "REST APIs",
          "Bearer Token",
          "Google Sheets",
          "Excel",
        ],
      },
      {
        id: "playwright",
        title: "Practicing — Automation",
        icon: "playwright" as const,
        items: [
          "Playwright with TypeScript",
          "Page Object Model (POM)",
          "Git",
          "GitHub",
          "VS Code",
        ],
      },
      {
        id: "learning",
        title: "Learning",
        icon: "learning" as const,
        learning: true,
        items: [
          "Advanced Playwright",
          "Postman API Automation",
          "CI/CD Pipelines",
          "Test Automation Frameworks",
          "Generative AI for Testing",
          // Items moved here pending confirmation they were used professionally:
          // SOAP APIs, OAuth 2.0, JSONPath, JSON Schema Validation, UAT, Jira, API Keys
          "SOAP APIs",
          "OAuth 2.0",
          "JSONPath",
          "JSON Schema Validation",
          "UAT Testing",
          "Jira",
          "API Keys",
        ],
      },
    ],
  },

  // ----- Projects (work products you tested) -----
  portfolio: {
    sectionTitle: "Projects",
    projects: [
      {
        title: "HiKode",
        slug: "hikode",
        description:
          "Job application and professional networking platform. Performed manual and exploratory testing on the web application, with ongoing API testing practice using Postman.",
        tag: "Web",
      },
      {
        title: "NSO — Belgian Waffle",
        slug: "nso-belgian-waffle",
        description:
          "Supply Chain Management web application for Belgian Waffle Co.",
        tag: "Web",
        bullets: [
          "Owned testing across Store Creation, Middleware and Invoice modules.",
          "Covered Indent and Entries: Local/Company Purchase, Wastage, and Return.",
          "Functional, regression and sanity testing with defects tracked in Google Sheets.",
        ],
      },
    ],
  },

  // ----- Testimonials -----
  testimonials: {
    sectionTitle: "Recommendations",
    items: [
      {
        quote:
          "Kishore is thorough, reliable, and always documents defects with clear steps to reproduce. A strong asset on release cycles.",
        name: "Manager (placeholder)",
        role: "Engineering Lead",
      },
      {
        quote:
          "He brings a calm, detail-oriented approach to exploratory testing and catches edge cases others miss.",
        name: "Colleague (placeholder)",
        role: "QA Peer",
      },
      {
        quote:
          "Great collaborator — communicates bug severity well and follows through until verification is complete.",
        name: "LinkedIn Recommendation (placeholder)",
        role: "Product Team",
      },
    ],
  },

  // ----- Personal Projects (your own builds) -----
  personalProjects: {
    sectionTitle: "Personal Projects",
    projects: [
      {
        title: "HiKode Test Automation Framework",
        status: "In Progress" as const,
        githubUrl:
          "https://github.com/kishorekumarrasalay/hikode-playwright-automation",
        description:
          "A self-driven automation testing project built on HiKode, a job application and professional networking platform. As a Manual Tester by profession, I started this project independently to build hands-on automation skills and work toward transitioning into an SDET role.",
        buildingTitle: "What I'm Building",
        building: [
          "End-to-end UI test automation using Playwright with TypeScript",
          "Framework structured around the Page Object Model (POM) for scalability and maintainability",
          "Covering key HiKode workflows such as login, registration, job search, and application flows",
          "Planning to extend into API testing using Playwright's request context",
        ],
        whyTitle: "Why This Project",
        why: "While my current role focuses on manual testing (functional, regression, smoke, and exploratory testing across web applications), I wanted to apply automation concepts to a real, practical application rather than just tutorials — so I chose HiKode as my testing ground.",
        currentFocusTitle: "Current Focus",
        currentFocus:
          "Actively adding new test cases, refining the framework structure, and improving reusability of components.",
        progressTitle: "Progress",
        // [TODO: To show the Progress block, provide real non-null values below:
        //  - testCasesAutomated: number of test cases automated (e.g. 25)
        //  - workflowsCovered: workflows covered (e.g. "Login, Registration, Job Search")
        //  - lastUpdated: last updated date (e.g. "October 2026")
        // The block is automatically hidden while any of these values remain null]
        progress: {
          testCasesAutomated: null as number | null, // test cases automated (add number here)
          workflowsCovered: null as string | null,   // workflows covered (add string here)
          lastUpdated: null as string | null,        // last updated (add string here)
        },
        techStackTitle: "Tech Stack",
        techStack: [
          "Playwright",
          "TypeScript",
          "Page Object Model",
          "API Testing (Planned)",
        ],
      },
    ],
  },

  // ----- Contact -----
  contact: {
    sectionTitle: "Get In Touch",
    subtitle:
      "Feel free to reach out for opportunities, collaborations, or a friendly hello.",
    emailCta: "Email Me",
    copyEmailLabel: "Copy Email",
    copyEmailSuccess: "Copied!",
    items: [
      {
        label: "Email",
        value: "kishorekumarrasalay05@gmail.com",
        href: "mailto:kishorekumarrasalay05@gmail.com",
        type: "email" as const,
        emoji: "📧",
      },
      {
        label: "Phone",
        value: "+91 94909 46159",
        href: "tel:+919490946159",
        type: "phone" as const,
        emoji: "📱",
      },
      {
        label: "LinkedIn",
        value: "kishorekumarrasalay",
        href: "https://www.linkedin.com/in/kishorekumarrasalay",
        type: "linkedin" as const,
        emoji: "💼",
      },
      {
        label: "GitHub",
        value: "kishorekumarrasalay",
        href: "https://github.com/kishorekumarrasalay",
        type: "github" as const,
        emoji: "🐙",
      },
      {
        label: "Location",
        value: "Hyderabad, Telangana, India",
        href: null,
        type: "location" as const,
        emoji: "📍",
      },
    ],
  },
} as const;

// Convenience exports (components use portfolioData directly)
export type PersonalProjectStatus = "In Progress" | "Completed" | "Planned";
