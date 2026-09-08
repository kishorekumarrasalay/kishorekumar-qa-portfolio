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

export const portfolioData = {
  // ----- Site-wide (name, logo, SEO, footer) -----
  site: {
    name: "Kishore Kumar",
    role: "Quality Analyst",
    logo: "KK",
    profileImage: "/profile.jpg",
    copyrightYear: 2026,
    meta: {
      title: "Kishore Kumar — Quality Analyst",
      description:
        "Quality Analyst portfolio — manual testing, API testing, and automation toward an SDET role.",
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
    github: "https://github.com/kishorekumarrasalay-02",
    email: "kishorekumarrasalay05@gmail.com",
  },

  // ----- Home / Hero section -----
  hero: {
    bio: "Quality Analyst with hands-on experience in manual testing, specializing in functional, regression, smoke, sanity, and exploratory testing. Currently testing the NSO Belgian Waffle Supply Chain Management application and the Hikode job application at Ratnam Solutions Private Limited. Continuously enhancing my skills in REST API testing, Playwright, and TypeScript to build scalable automation solutions and advance toward an SDET role.",
    roleCycle: [
      "Quality Analyst",
      "Manual Tester",
      "Aspiring SDET",
    ],
    typewriterLines: [
      "Testing... ✓ Passed",
      "Regression Suite... ✓ Passed",
      "Bug #247... 🔍 Investigating",
    ],
  },

  // ----- Metrics band (below hero) — edit values here -----
  metrics: {
    items: [
      { label: "Bugs logged", value: 180, suffix: "+", prefix: "" },
      { label: "Test cases written", value: 150, suffix: "+", prefix: "" },
      { label: "Products tested", value: 4, suffix: "", prefix: "" },
      { label: "Months experience", value: 1, suffix: "", prefix: "" },
    ],
  },

  // ----- About section -----
  about: {
    sectionTitle: "About Me",
    whoIAm: {
      title: "Who I Am",
      paragraphs: [
        "I began my QA journey as an intern and grew into a full-time Quality Analyst role, now contributing across four live products spanning web platforms. I specialize in manual testing — functional, regression, smoke, sanity, and exploratory — combined with structured bug tracking in Jira and clear test documentation.",
        "I'm actively expanding my skill set into API testing with Postman and automation with Playwright and TypeScript, working toward a long-term goal of becoming an SDET.",
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
      "Attention to Detail",
      "Bug Analysis",
      "Test Documentation",
      "Problem Solving",
      "Team Collaboration",
      "Continuous Learning",
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
          description:
            "Performing manual testing (functional, regression, smoke, sanity, exploratory) and API testing across HiKode and NSO — Belgian Waffle — web platforms. Managing bug tracking and test documentation in Jira.",
        },
        {
          title: "Quality Analyst Intern",
          company: "Ratnam Solutions Private Limited",
          period: "Mar 2026 – Jun 2026",
          description:
            "Learned core QA fundamentals including SDLC/STLC, test case writing, and defect lifecycle management while contributing to live product testing.",
        },
      ],
    },
    certifications: {
      title: "Certifications",
      description:
        "Actively upskilling in API testing with Postman, test automation with Playwright and TypeScript, and Generative AI for software testing.",
      tags: [
        "API Testing with Postman",
        "Playwright with TypeScript",
        "Generative AI for Software Testing",
      ],
    },
  },

  // ----- Technical Skills -----
  skills: {
    sectionTitle: "Technical Skills",
    bentoCards: [
      {
        id: "testing",
        title: "Testing Expertise",
        icon: "testing" as const,
        colSpan: 2,
        rowSpan: 2,
        items: [
          "Manual Testing",
          "Functional Testing",
          "Regression Testing",
          "Smoke Testing",
          "Sanity Testing",
          "Exploratory Testing",
          "API Testing with Postman",
          "Bug Reporting",
          "Test Case Design",
          "Test Documentation",
        ],
      },
      {
        id: "languages",
        title: "Languages & Frameworks",
        icon: "languages" as const,
        colSpan: 1,
        rowSpan: 1,
        items: ["TypeScript", "Page Object Model", "SQL (basic queries)"],
      },
      {
        id: "tools",
        title: "Tools",
        icon: "tools" as const,
        colSpan: 1,
        rowSpan: 1,
        items: [
          "Jira",
          "Postman",
          "Playwright",
          "Git & GitHub",
          "Excel / Google Sheets (Test Documentation)",
        ],
      },
      {
        id: "api",
        title: "API & Data Validation",
        icon: "api" as const,
        colSpan: 1,
        rowSpan: 1,
        items: [
          "JSONPath / Schema Validation",
          "REST & SOAP APIs",
          "Authentication Types (Basic, Bearer Token, OAuth 2.0, API Keys)",
        ],
      },
      {
        id: "learning",
        title: "Currently Learning",
        icon: "learning" as const,
        colSpan: 1,
        rowSpan: 1,
        learning: true,
        items: ["CI/CD Basics", "Jenkins Fundamentals"],
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
          "Supply Chain Management web application. Focused on functional, regression, and sanity testing.",
        tag: "Web",
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
          "https://github.com/kishorekumarrasalay-02/hikode-playwright-automation",
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
        why: "While my current role focuses on manual testing (functional, regression, smoke, and exploratory testing across live products), I wanted to apply automation concepts to a real, practical application rather than just tutorials — so I chose HiKode as my testing ground.",
        currentFocusTitle: "Current Focus",
        currentFocus:
          "Actively adding new test cases, refining the framework structure, and improving reusability of components. This is an ongoing project, not a finished deliverable.",
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
        value: "kishorekumarrasalay-02",
        href: "https://github.com/kishorekumarrasalay-02",
        type: "github" as const,
        emoji: "🐙",
      },
      {
        label: "Location",
        value: "Hyderabad Telangana India",
        href: null,
        type: "location" as const,
        emoji: "📍",
      },
    ],
  },
} as const;

// Convenience exports (components use portfolioData directly)
export type PersonalProjectStatus = "In Progress" | "Completed" | "Planned";
