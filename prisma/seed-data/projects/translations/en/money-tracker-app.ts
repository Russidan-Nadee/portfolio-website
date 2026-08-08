// src/data/projects/translations/en/money-tracker-app.ts

export const moneyTrackerData = {
  navigation: {
    backLink: "/portfolio",
    backText: "Back to Portfolio",
    projectNumber: 7,
    totalProjects: 7,
    prevProjectSlug: undefined,
    nextProjectSlug: "kinrai-d-project",
  },

  header: {
    title: "Money Tracker App",
    description:
      "A personal expense tracker that automatically pulls transaction data from bank notification emails, with a real-time balance dashboard",
    tags: ["2026", "Personal", "Automation", "Fintech", "Full-stack"],
    githubUrl: undefined,
  },

  infoBar: {
    duration: "2 months (ongoing)",
    status: "Live",
    company: "Personal Project",
    technologies: ["Next.js", "Prisma", "Supabase"],
    labels: {
      duration: "Development Duration",
      status: "Status",
      company: "Company",
      technology: "Core Technologies",
    },
  },

  tabsContent: {
    tabs: {
      overview: "Overview",
      features: "Features",
      gallery: "Gallery",
      technical: "Technical Details",
      results: "Results",
    },

    overview: {
      title: "Automated Personal Finance Tracking System",
      imageAlt: "Main dashboard of Money Tracker App",
      about: {
        title: "About the Project",
        paragraphs: [
          "Money Tracker App is a personal web application for tracking income and expenses, built with Next.js 16 (App Router) and TypeScript. Its key feature is automatically pulling transaction data from bank notification emails via the Gmail API instead of manual entry.",
          "The system stores the timestamp of the last email it fetched, then automatically fetches new emails from Krungthai and Kasikornbank from that point onward every time the app is opened (not a scheduled cron job). It then parses the transaction data and saves it to a Supabase (PostgreSQL) database via Prisma ORM, checking a unique reference number before saving to prevent duplicates.",
        ],
      },
      objectives: {
        title: "Objectives",
        content:
          "Reduce the manual effort of logging income and expenses • Provide a real-time overview of personal finances through a dashboard • Build a structure that can be extended to support more banks in the future",
      },
    },

    features: {
      title: "Key Features",
      items: [
        {
          title: "Gmail Auto-Fetch",
          description:
            "Automatically fetches new transaction emails since the last saved timestamp every time the app is opened",
        },
        {
          title: "Email Parsing",
          description:
            "Parses transaction data from each bank's HTML notification emails",
        },
        {
          title: "Duplicate Prevention",
          description:
            "Checks a unique reference number before saving to avoid duplicate records",
        },
        {
          title: "Multi-bank Support",
          description:
            "Supports notification emails from Krungthai and Kasikornbank",
        },
        {
          title: "Balance Dashboard",
          description:
            "Shows balances per account along with an income/expense summary",
        },
        {
          title: "Transaction Table",
          description:
            "Lists all transactions with color-coded income and expense amounts",
        },
      ],
    },

    gallery: {
      title: "Screenshots",
      items: [
        "Dashboard Overview",
        "Transaction Table",
        "Balance Summary",
        "Gmail Sync Flow",
      ],
    },

    technical: {
      title: "Technical Details",
      details: {
        Framework: "Next.js 16 (App Router)",
        Language: "TypeScript",
        Database: "Supabase (PostgreSQL), Prisma 7 ORM",
        Integration: "Gmail API (OAuth 2.0)",
        "Sync Strategy": "Timestamp-based fetch on app open (no cron job)",
        Styling: "Tailwind CSS 4",
        Deployment: "Vercel",
      },
      challenges: {
        title: "Challenges",
        items: [
          {
            title: "[To be added]",
            description:
              "Challenge details for this project will be added later",
          },
        ],
      },
    },

    results: {
      title: "Results",
      items: [
        {
          title: "In Daily Use",
          description:
            "Automatically fetches new data every time the app is opened, based on the last saved timestamp, and is actively used to track real personal finances",
        },
        {
          title: "[To be added]",
          description: "Result details for this project will be added later",
        },
      ],
      futureGoals: {
        title: "Future Goals",
        items: [
          { description: "[To be added] Future goals will be added later" },
        ],
      },
    },
  },
};
