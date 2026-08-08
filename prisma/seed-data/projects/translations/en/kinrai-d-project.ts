// src/data/projects/translations/en/kinrai-d-project.ts

import { ProjectData } from "../../types";

export const kinraiDData: ProjectData = {
  navigation: {
    backLink: "/portfolio",
    backText: "Back to Portfolio",
    projectNumber: 0, // Will be calculated dynamically
    totalProjects: 0, // Will be calculated dynamically
    prevProjectSlug: undefined, // Will be calculated dynamically
    nextProjectSlug: undefined, // Will be calculated dynamically
  },
  header: {
    title: "Kinrai-D",
    description:
      "A cross-platform food randomizer app that helps users discover new dishes in a fun and engaging way",
    tags: ["2025", "App", "Cross-Platform", "Food", "Random"],
    githubUrl: "https://github.com/Russidan-Nadee/Kinrai-D",
    demoUrl: undefined,
    liveUrl: "https://kinrai-d.vercel.app/",
  },
  infoBar: {
    duration: "4 months",
    status: "Completed",
    company: "Personal Project",
    technologies: ["Flutter", "Nest.js", "PostgreSQL", "Supabase"],
    labels: {
      duration: "Duration",
      status: "Status",
      company: "Company",
      technology: "Technology",
    },
  },
  tabsContent: {
    tabs: {
      overview: "Overview",
      features: "Features",
      gallery: "Gallery",
      technical: "Technical",
      results: "Results",
    },
    overview: {
      title: "Project Overview",
      imageAlt: "Kinrai-D app overview screenshot",
      about: {
        title: "About the Project",
        paragraphs: [
          'Kinrai-D is a food randomizer application designed to solve the everyday "what should I eat?" problem. Users can jump straight in via Guest Login without needing to register an account.',
          "Built with Flutter for cross-platform support, Nest.js as the backend, and PostgreSQL via Supabase. The app features food filtering, a Dislike system to skip unwanted dishes, an Admin Menu for managing food items, and full multi-language support.",
        ],
      },
      objectives: {
        title: "Objectives",
        content:
          "Create an application that helps users make food decisions effortlessly through randomization, personalized filters, and a Dislike system — while providing an Admin panel for menu management and supporting multiple languages for global usability.",
      },
    },
    features: {
      title: "Key Features",
      items: [
        {
          title: "Guest Login",
          description:
            "Access the app instantly without registration, supporting anonymous user sessions",
        },
        {
          title: "Food Randomization",
          description:
            "Randomly pick a meal from the database in one tap to solve daily food indecision",
        },
        {
          title: "Dislike System",
          description:
            "Tap Dislike to skip unwanted dishes and get a new random suggestion immediately",
        },
        {
          title: "Filter by Preference",
          description:
            "Filter food results by user-selected categories and preferences for more relevant suggestions",
        },
        {
          title: "Admin Menu",
          description:
            "Admin panel for adding, removing, and editing food items in the database",
        },
        {
          title: "Multi-Language Support",
          description:
            "Built-in i18n system supporting multiple languages for a global user base",
        },
      ],
    },
    gallery: {
      title: "Gallery",
      items: [
        "Kinrai-D app main screen",
        "Food randomization system and results",
        "Favorites management page",
        "Review and rating system",
        "Food search and filtering",
      ],
    },
    technical: {
      title: "Technical Details",
      details: {
        Framework: "Flutter, Nest.js",
        Language: "Dart, TypeScript",
        Platform: "Cross-Platform (iOS, Android, Web)",
        Database: "PostgreSQL, Prisma ORM",
        "Cloud Service": "Supabase",
        "Version Control": "Git, GitHub",
      },
      challenges: {
        title: "Challenges",
        items: [
          {
            title: "Guest Login System",
            description:
              "Designing authentication that supports both registered users and guests without data conflicts",
          },
          {
            title: "Filter & Dislike Logic",
            description:
              "Building accurate and performant filtering combined with the dislike exclusion system",
          },
          {
            title: "Cross-Platform Multi-Language",
            description:
              "Ensuring consistent i18n behavior across iOS, Android, and Web platforms",
          },
        ],
      },
    },
    results: {
      title: "Results",
      items: [
        {
          title: "Cross-Platform Application",
          description:
            "Developed an application that works smoothly on iOS, Android, and Web platforms",
        },
        {
          title: "Randomization with Dislike & Filter",
          description:
            "Integrated randomization, dislike, and filter systems that work together to surface meals users actually want",
        },
        {
          title: "Admin Dashboard",
          description:
            "Built an Admin panel for managing the food database with ease",
        },
        {
          title: "Multi-Language Support",
          description:
            "Delivered full i18n support enabling users from different countries to use the app comfortably",
        },
      ],
      futureGoals: {
        title: "Future Goals",
        items: [
          {
            description:
              "Add AI-powered food recommendations based on Dislike history and filter preferences",
          },
          {
            description:
              "Develop full User Account system with randomization history tracking",
          },
          {
            description:
              "Expand food database to include international cuisines",
          },
          {
            description:
              "Enhance Admin Dashboard with usage statistics and reporting",
          },
        ],
      },
    },
  },
};
