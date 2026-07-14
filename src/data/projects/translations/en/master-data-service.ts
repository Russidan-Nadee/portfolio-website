// src/data/projects/translations/en/master-data-service.ts

export const masterDataServiceData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 8,
      totalProjects: 8,
      prevProjectSlug: undefined,
      nextProjectSlug: "money-tracker-app"
   },

   header: {
      title: "Master Data Service",
      description: "A backend microservice that centralizes several core data domains behind a single API for the FastShip platform",
      tags: ["2026", "Backend", "Microservice", "API", "Enterprise"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "2 months (ongoing)",
      status: "Live",
      company: "FastShip",
      technologies: ["Bun", "ElysiaJS", "MySQL"],
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
         title: "Backend Microservice for Core Platform Data",
         imageAlt: "Swagger API documentation page of Master Data Service",
         about: {
            title: "About the Project",
            paragraphs: [
               "Master Data Service is a backend microservice for the FastShip platform, built with Bun and ElysiaJS. It centralizes several data domains and pieces of logic that used to be scattered across a legacy monolith behind a single authenticated API, making it easier for other teams to consume and for the service itself to maintain.",
               "The service is organized into independent modules by business domain, each with its own controller/service/schema layers, backed by a MySQL database via Drizzle ORM. Authentication is handled via a JWT-based scheme tied to the company's central identity system."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Extract logic that was scattered across a legacy monolith into a more maintainable microservice • Provide a central API for core platform data that other teams can call • Establish a module-based architecture that can be extended with new domains in the future"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Master Data Management",
               description: "Full CRUD management of the platform's core reference data, designed to be extended with new data types over time"
            },
            {
               title: "Geoname & Postcode Lookup",
               description: "Looks up countries, states/provinces, cities, and postal codes, including dedicated Thai postcode search"
            },
            {
               title: "External API Integrations",
               description: "Connects to external services such as the GeoNames API and Zoho to pull in location and related data"
            },
            {
               title: "JWT-based Authentication",
               description: "Verifies API access using JWT tokens tied to the company's central identity system"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Swagger API Documentation",
            "Health Check Endpoint",
            "Master Data CRUD Response"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Runtime": "Bun 1.3",
            "Framework": "ElysiaJS v1.4",
            "Language": "TypeScript",
            "Database": "MySQL via Drizzle ORM",
            "Authentication": "JWT-based Authentication",
            "API Docs": "Swagger UI (auto-generated)",
            "Code Quality": "ESLint, Prettier, Husky pre-commit hooks"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "Ensuring Correctness During Migration",
                  description: "Needed the new service's calculations to match the legacy system exactly, so dedicated comparison and benchmark scripts were built to validate results between the two systems before cutover"
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
               title: "Consolidated Multiple Domains into One Microservice",
               description: "Moved logic that used to be scattered across the legacy monolith into an independently deployable service"
            },
            {
               title: "[To be added]",
               description: "Result details for this project will be added later"
            }
         ],
         futureGoals: {
            title: "Future Goals",
            items: [
               { description: "Extend the service with new modules following the established module-based architecture" },
               { description: "[To be added] Future goals will be added later" }
            ]
         }
      }
   }
}
