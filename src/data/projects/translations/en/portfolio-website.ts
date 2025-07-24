// src/data/projects/translations/en/portfolio-website.ts

export const portfolioWebsiteData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 2,
      totalProjects: 4,
      prevProjectSlug: "asset-dashboard",
      nextProjectSlug: "asset-management"
   },

   header: {
      title: "Personal Portfolio Website",
      description: "Multilingual personal portfolio website built with Next.js and TypeScript featuring Dark Mode",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Multilingual", "Responsive"],
      githubUrl: "https://github.com/Russidan-Nadee/portfolio"
   },

   infoBar: {
      duration: "2 months",
      status: "Personal Project",
      company: "Self-Development",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
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
         title: "Modern and User-friendly Portfolio Website",
         imageAlt: "Homepage of the Portfolio Website",
         about: {
            title: "About the Project",
            paragraphs: [
               "A personal portfolio website designed to showcase work, skills, and work experience using modern and efficient technologies.",
               "The system supports 3 languages (Thai, English, Japanese) with Dark/Light Mode and responsive design that works well on all devices."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Create a professional online presence • Demonstrate ability to use new technologies • Provide a channel for contacting employers and clients • Practice Frontend development skills"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Multilingual Support",
               description: "Support for 3 languages: Thai, English, Japanese with real-time language switching"
            },
            {
               title: "Dark/Light Mode",
               description: "Theme switcher that changes themes according to preference"
            },
            {
               title: "Responsive Design",
               description: "Designed to work well on mobile, tablet, and computer"
            },
            {
               title: "Interactive Portfolio",
               description: "Interactive portfolio display with filter"
            },
            {
               title: "Contact Integration",
               description: "Contact system connected to Social Media and Email"
            },
            {
               title: "SEO Optimized",
               description: "SEO and Meta Tags optimization for Search Engine"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Landing Page",
            "About Me Page",
            "Portfolio Showcase",
            "Contact Page",
            "Dark Mode Interface",
            "Mobile Responsive View"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Framework": "Next.js 14 (App Router)",
            "Language": "TypeScript",
            "Styling": "Tailwind CSS",
            "Animations": "GSAP, CSS Transitions",
            "Icons": "React Icons, Lucide React",
            "Fonts": "Google Fonts (Inter, Geist)",
            "Deployment": "Netlify",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "Multilingual Implementation",
                  description: "Managing multilingual data and Dynamic Content Loading"
               },
               {
                  title: "Performance Optimization",
                  description: "Optimizing performance for fast loading and SEO-friendly"
               },
               {
                  title: "User-friendly UI",
                  description: "Making the website easy to use and accessible for all users"
               },
               {
                  title: "Responsive Layout",
                  description: "Designing to fit all screen sizes"
               }
            ]
         }
      },

      results: {
         title: "Results",
         items: [
            {
               title: "Functional Website",
               description: "Deployed on Vercel, ready to use and showcase work"
            },
            {
               title: "Enhanced Frontend Skills",
               description: "Mastered Next.js, TypeScript and Modern Web Development"
            },
            {
               title: "Professional Portfolio",
               description: "Have a website that demonstrates capabilities and serves as a good representative"
            },
            {
               title: "Performance Score",
               description: "Achieved high Lighthouse scores in SEO and Accessibility"
            }
         ],
         futureGoals: {
            title: "Development Plans",
            items: [
               { description: "Add new projects to Portfolio as they meet goals" }
            ]
         }
      }
   }
}