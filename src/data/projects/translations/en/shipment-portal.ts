// src/data/projects/translations/en/shipment-portal.ts

export const shipmentPortalData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 9,
      totalProjects: 9,
      prevProjectSlug: undefined,
      nextProjectSlug: "master-data-service"
   },

   header: {
      title: "Shipment Portal",
      description: "An internal portal for FastShip staff to track and manage shipments, from a high-level list view down to individual shipment detail",
      tags: ["2026", "Web", "Enterprise", "Internal Tool"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "Over 1 month (ongoing)",
      status: "Live",
      company: "FastShip",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
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
         title: "Staff Portal for Shipment Tracking & Management",
         imageAlt: "Shipment list page of Shipment Portal",
         about: {
            title: "About the Project",
            paragraphs: [
               "Shipment Portal is an internal web application for FastShip, built with Next.js (App Router) and TypeScript. It gives staff a single place to track shipment status, review individual shipment details, and manage pickup requests.",
               "Data-heavy pages like the list and detail views are server-rendered for fast loading. The portal has no database of its own and reads primarily through a central backend service, aside from a small legacy tracking lookup that still queries an older database while that piece is being migrated."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Give staff a single tool for tracking and managing shipments instead of switching between multiple systems • Consolidate everything related to a shipment onto one page to cut down lookup time • Structure the app so the remaining legacy dependency can be migrated away gradually"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Filterable Shipment List",
               description: "Browse all shipments, filter by status, search, and bookmark items of interest"
            },
            {
               title: "Shipment Detail View",
               description: "Consolidates sender, recipient, customs, invoice, and tracking status onto a single page"
            },
            {
               title: "Pickup Management",
               description: "Dedicated view for pickup requests and their progress, separate from the shipment list"
            },
            {
               title: "Agent Performance Dashboard",
               description: "A readable summary of shipping performance broken down by agent"
            },
            {
               title: "Exceptions View",
               description: "Surfaces shipments with issues or abnormal status so they can be reviewed quickly"
            },
            {
               title: "Role-based Authentication",
               description: "Staff sign-in with access scoped to their role"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Shipment List Overview",
            "Shipment Detail Page",
            "Pickup Detail View",
            "Agent Performance Dashboard"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Framework": "Next.js 15 (App Router)",
            "Language": "TypeScript",
            "Styling": "Tailwind CSS v4 with a design token system",
            "Authentication": "Session-based, scoped by role",
            "Error Tracking": "Sentry",
            "Rendering": "Server-side rendering for data-heavy pages"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "Gradual Migration",
                  description: "Had to keep the app fully functional while some data still comes from a legacy source and other parts have already moved to the new backend service"
               },
               {
                  title: "[To be added]",
                  description: "Additional challenge details for this project will be added later"
               }
            ]
         }
      },

      results: {
         title: "Results",
         items: [
            {
               title: "Consolidated Shipment Tracking",
               description: "Staff no longer need to switch between multiple systems to see everything about a shipment"
            },
            {
               title: "[To be added]",
               description: "Result details for this project will be added later"
            }
         ],
         futureGoals: {
            title: "Future Goals",
            items: [
               { description: "Fully migrate away from the remaining legacy dependency" },
               { description: "[To be added] Future goals will be added later" }
            ]
         }
      }
   }
}
