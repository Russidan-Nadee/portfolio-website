// src/data/projects/translations/en/asset-management.ts

export const assetManagementData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 4,
      totalProjects: 5,
      prevProjectSlug: "portfolio-website",
      nextProjectSlug: "calculator"
   },

   header: {
      title: "Asset Management Mobile App",
      description: "Mobile application for asset management",
      tags: ["2025", "Mobile App", "Education", "Management"],
      githubUrl: "https://github.com/Russidan-Nadee/learn-flutter-express"
   },

   infoBar: {
      duration: "3 months",
      status: "Archived",
      company: "Self-Development",
      technologies: ["Flutter", "Express", "MySQL"],
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
         title: "Mobile Application for Corporate Asset Management",
         imageAlt: "Main screen of Asset Management Mobile App",
         about: {
            title: "About the Project",
            paragraphs: [
               "A mobile application developed with Flutter to assist staff in managing organizational assets, focusing on field operation convenience and real-time data access.",
               "This app is part of a larger Asset Management system, serving as a mobile interface connected to the same central database."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Practice developing comprehensive mobile applications • Reduce time for data checking and recording • Create a good mobile experience for staff"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Asset Registration",
               description: "Register new assets with complete information input"
            },
            {
               title: "Login & Authentication",
               description: "Secure login system for users"
            },
            {
               title: "Real-time Updates",
               description: "Update asset status and sync with server in real-time"
            },
            {
               title: "Reports Generation",
               description: "Generate reports and export data in various formats"
            },
            {
               title: "User Management",
               description: "User management system and access permissions"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Login & Dashboard Screen",
            "Asset Details View",
            "Asset Registration Form",
            "Camera & Photo Capture",
            "Reports & Analytics"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Framework": "Flutter 3.x, Express.js",
            "Language": "Dart, JavaScript",
            "Database": "MySQL, Prisma ORM",
            "Platform": "Mobile",
            "Authentication": "JWT",
            "HTTP Client": "dio",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "Authentication Flow",
                  description: "Managing secure login system and identity verification"
               },
               {
                  title: "Data Synchronization",
                  description: "Real-time data synchronization between Mobile App and Backend Server"
               },
               {
                  title: "UI/UX Design",
                  description: "Designing user-friendly and responsive UI for mobile devices"
               },
               {
                  title: "Performance Optimization",
                  description: "Optimizing app performance for fast and smooth operation"
               },
               {
                  title: "Cross-platform Compatibility",
                  description: "Making the app work well on both iOS and Android"
               }
            ]
         }
      },

      results: {
         title: "Results",
         items: [
            {
               title: "Work Speed",
               description: "Reduced asset checking time from 5-10 minutes to 1-2 minutes per item"
            },
            {
               title: "Data Accuracy",
               description: "Reduced manual data entry errors"
            },
            {
               title: "User Experience",
               description: "Received positive feedback from users regarding convenience and ease of use"
            },
            {
               title: "Learning Mobile App Development with Flutter",
               description: "Learned application development with Flutter"
            },
            {
               title: "Learning Backend Development with Node.js and Express",
               description: "Learned Backend API development connected to MySQL database"
            },
            {
               title: "Learning Authentication System with JWT",
               description: "Learned login system and identity verification with JWT Token"
            }
         ],
         futureGoals: {
            title: "Development Plans",
            items: [
               { description: "Add Push Notifications for important alerts" },
               { description: "QR Code Scanner for QR Code scanning" },
               { description: "Barcode Scanner for barcode scanning" },
               { description: "Mobile-optimized Dashboard Analytics" }
            ]
         }
      }
   }
}