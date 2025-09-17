// src/data/projects/translations/en/calculator.ts

export const calculatorData = {
   navigation: {
      backLink: "/portfolio",
      backText: "Back to Portfolio",
      projectNumber: 5,
      totalProjects: 5,
      prevProjectSlug: "asset-management",
      nextProjectSlug: undefined
   },

   header: {
      title: "Advanced Calculator App",
      description: "Feature-rich calculator built with Python and Tkinter with user-friendly UI",
      tags: ["2025", "Desktop App", "Education", "Tools", "Scientific", "Memory"],
      demoUrl: "https://github.com/Russidan-Nadee/python-calculator/releases/download/v1.0/Python-Calculator.exe",
      githubUrl: "https://github.com/Russidan-Nadee/calculator_intern_test"
   },

   infoBar: {
      duration: "2 weeks",
      status: "Completed",
      company: "Self-Development",
      technologies: ["Python"],
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
         title: "Calculator App Built with Python",
         imageAlt: "Main screen of the Calculator App",
         about: {
            title: "About the Project",
            paragraphs: [
               "A calculator application developed to study Python GUI Programming with Tkinter, focusing on creating a beautiful and user-friendly User Interface.",
               "This project is part of learning Python Programming and Desktop Application development, covering both basic and advanced calculations."
            ]
         },
         objectives: {
            title: "Objectives",
            content: "Learn Desktop Application development with Python • Practice using Tkinter for GUI creation • Understand Event Handling and User Input Validation"
         }
      },

      features: {
         title: "Key Features",
         items: [
            {
               title: "Basic Operations",
               description: "Basic calculations: addition, subtraction, multiplication, division"
            },
            {
               title: "Scientific Functions",
               description: "Scientific functions such as sin, cos, tan, log"
            },
            {
               title: "Keyboard Support",
               description: "Support for keyboard input"
            },
            {
               title: "Error Handling",
               description: "Handle calculation errors"
            }
         ]
      },

      gallery: {
         title: "Screenshots",
         items: [
            "Main Calculator Interface",
            "Scientific Mode",
            "Memory Functions Panel",
            "Calculation History",
            "Error Display Example"
         ]
      },

      technical: {
         title: "Technical Details",
         details: {
            "Framework": "Tkinter",
            "Language": "Python 3.8",
            "Platform": "Desktop",
            "Architecture": "MVC",
            "Features": "Scientific, Memory",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "Challenges",
            items: [
               {
                  title: "UI Responsiveness",
                  description: "Making the interface responsive to rapid button presses"
               },
               {
                  title: "Expression Parsing",
                  description: "Converting input text into mathematical equations"
               },
               {
                  title: "Error Prevention",
                  description: "Preventing errors from division by zero and invalid input"
               },
               {
                  title: "Memory Management",
                  description: "Managing memory for storing calculation history"
               }
            ]
         }
      },

      results: {
         title: "Results",
         items: [
            {
               title: "Project Success",
               description: "Successfully created a functional calculator app with comprehensive features"
            },
            {
               title: "Skills Gained",
               description: "Improved Python language skills and GUI development with Tkinter"
            },
            {
               title: "Usage",
               description: "Used as a personal tool for daily calculations"
            },
            {
               title: "Code Quality",
               description: "Code has good structure, clear separation, and documentation"
            }
         ],
         futureGoals: {
            title: "Development Plans",
            items: [
               { description: "Make it easier to use like expensive calculators" }
            ]
         }
      }
   }
}