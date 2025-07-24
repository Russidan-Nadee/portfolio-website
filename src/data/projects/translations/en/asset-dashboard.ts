// src/data/projects/translations/en/asset-dashboard.ts

export const assetDashboardData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 1,
      totalProjects: 4,
      prevProjectSlug: undefined,
      nextProjectSlug: "portfolio-website"
   },

   header: {
      title: "RFID Asset Management System",
      description: "Comprehensive asset management system using RFID technology to reduce costs and improve efficiency",
      tags: ["Cross-Platform", "RFID Technology", "2025"],
      githubUrl: "https://github.com/Russidan-Nadee/intern-project-rfid"
   },

   infoBar: {
      duration: "6 months",
      status: "Developer Intern",
      company: "Thai Parkerizing",
      technologies: ["Flutter", "Node.js", "MySQL"],
      labels: {
         duration: "Development Duration",
         status: "Status",
         company: "Company",
         technology: "Core Technologies"
      }
   },

   tabsContent: {
      tabs: {
         overview: "Overview",
         features: "Features",
         gallery: "Gallery",
         technical: "Technical Details",
         results: "Results"
      },

      overview: {
         title: "Comprehensive RFID Asset Management System",
         imageAlt: "Main interface of RFID Asset Management System",
         about: {
            title: "About the Project",
            paragraphs: [
               "An RFID-based asset management system developed to reduce company costs that would otherwise be spent on expensive external software by creating an in-house solution tailored to specific needs.",
               "This system is designed as a cross-platform solution supporting Mobile App, Web Application, and Windows Desktop App to ensure usability in all scenarios."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Deploy within the department to test efficiency and improve the system • In the future, if the system performs well, expand usage throughout the company to enhance overall asset management efficiency"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Dashboard",
               description: "Dashboard displaying asset statistics and data in graphical format"
            },
            {
               title: "Scan",
               description: "Scan RFID tags to view information and update asset status"
            },
            {
               title: "Search",
               description: "Search assets by asset number, name, category, or other related information"
            },
            {
               title: "Export",
               description: "Export reports as CSV or Excel files"
            },
            {
               title: "Settings",
               description: "Configure system settings, manage users and access permissions, language and theme"
            },
            {
               title: "Sync",
               description: "Synchronize data between Mobile, Web, and Desktop App"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Dashboard Overview",
            "RFID Scanning Interface",
            "Asset Search & Filter",
            "Asset Details View",
            "Export Reports",
            "Settings Panel"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Frontend (Mobile)": "Flutter, Dart",
            "Frontend (Web)": "Flutter Web",
            "Frontend (Desktop)": "Flutter Desktop",
            "Backend": "Node.js, Express.js",
            "Database": "MySQL, Prisma ORM",
            "RFID Integration": "RFID Reader API",
            "Authentication": "JWT Token-based"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "Cross-platform Compatibility",
                  description: "Ensuring consistent system performance across all platforms (Mobile, Web, Desktop)"
               },
               {
                  title: "RFID Integration",
                  description: "Connecting with RFID Reader devices and processing tag data"
               },
               {
                  title: "Real-time Synchronization",
                  description: "Real-time data synchronization between multiple devices"
               },
               {
                  title: "Database Performance",
                  description: "Optimizing database performance when dealing with large amounts of asset data"
               },
               {
                  title: "User Experience",
                  description: "Designing UI/UX that is user-friendly and responsive across all devices"
               }
            ]
         }
      },

      results: {
         title: "Results",
         items: [
            {
               title: "Development Status",
               description: "Project is currently in development (Phase 1) expected to be completed in Q4/2025"
            },
            {
               title: "Cost Savings",
               description: "Expected to save over ≈76.21% on external software purchasing costs"
            },
            {
               title: "Work Efficiency",
               description: "Reduce asset counting time from days to just hours"
            },
            {
               title: "UX/UI Friendly",
               description: "Received positive feedback from users regarding convenience and ease of use"
            }
         ],
         futureGoals: {
            title: "Future Goals",
            items: [
               { description: "Expand usage to the entire company if department testing results meet targets" },
               { description: "Implement advanced security systems" },
               { description: "Integrate with company ERP system for centralized management" },
               { description: "Develop notification system for asset status changes" },
               { description: "Add asset disposal system" }
            ]
         }
      }
   }
}