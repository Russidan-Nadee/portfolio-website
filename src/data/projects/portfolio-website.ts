// src/data/projects/portfolio-website.ts

export const portfolioWebsiteData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 2,
      totalProjects: 4,
      prevProjectSlug: "asset-dashboard",
      nextProjectSlug: "asset-management"
   },

   header: {
      title: "เว็บไซต์พอร์ตโฟลิโอส่วนตัว",
      description: "เว็บไซต์แสดงผลงานส่วนตัวที่รองรับหลายภาษา สร้างด้วย Next.js และ TypeScript พร้อมระบบ Dark Mode",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Multilingual", "Responsive"],
      githubUrl: "https://github.com/Russidan-Nadee/portfolio"
   },

   infoBar: {
      duration: "2 เดือน",
      status: "Personal Project",
      company: "Self-Development",
      technologies: ["Next.js", "TypeScript", "Tailwind"]
   },

   tabsContent: {
      tabs: {
         overview: "ภาพรวม",
         features: "ฟีเจอร์",
         gallery: "ภาพหน้าจอ",
         technical: "รายละเอียดเทคนิค",
         results: "ผลลัพธ์"
      },

      overview: {
         title: "เว็บไซต์พอร์ตโฟลิโอที่ทันสมัยและใช้งานง่าย",
         imageAlt: "หน้าแรกของเว็บไซต์พอร์ตโฟลิโอ",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "เว็บไซต์พอร์ตโฟลิโอส่วนตัวที่ออกแบบมาเพื่อแสดงผลงาน ทักษะ และประสบการณ์ในการทำงาน โดยใช้เทคโนโลยีที่ทันสมัยและมีประสิทธิภาพ",
               "ระบบรองรับ 3 ภาษา (ไทย, อังกฤษ, ญี่ปุ่น) พร้อมกับ Dark/Light Mode และการออกแบบที่ตอบสนองได้ดีบนทุกอุปกรณ์"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "สร้างตัวตนออนไลน์ที่เป็นมืออาชีพ • แสดงความสามารถในการใช้เทคโนโลยีใหม่ • เป็นช่องทางในการติดต่อกับนายจ้างและลูกค้า • ฝึกฝนทักษะการพัฒนา Frontend"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Multilingual Support",
               description: "รองรับ 3 ภาษา: ไทย, อังกฤษ, ญี่ปุ่น พร้อมระบบเปลี่ยนภาษาแบบ Real-time"
            },
            {
               title: "Dark/Light Mode",
               description: "ระบบ Theme Switcher ที่เปลี่ยนธีมได้ตามความต้องการ"
            },
            {
               title: "Responsive Design",
               description: "ออกแบบให้ใช้งานได้ดีบนมือถือ แท็บเล็ต และคอมพิวเตอร์"
            },
            {
               title: "Interactive Portfolio",
               description: "แสดงผลงานแบบ Interactive พร้อม Filter"
            },
            {
               title: "Contact Integration",
               description: "ระบบติดต่อที่เชื่อมต่อกับ Social Media และ Email"
            },
            {
               title: "SEO Optimized",
               description: "ปรับแต่ง SEO และ Meta Tags สำหรับ Search Engine"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
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
         title: "รายละเอียดเทคนิค",
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
            title: "ความท้าทาย",
            items: [
               {
                  title: "Multilingual Implementation",
                  description: "การจัดการข้อมูลหลายภาษาและ Dynamic Content Loading"
               },
               {
                  title: "Performance Optimization",
                  description: "การปรับแต่งประสิทธิภาพให้โหลดเร็วและ SEO-friendly"
               },
               {
                  title: "User-friendly UI",
                  description: "ทำให้ website ทำงานง่ายและเข้าถึงได้สำหรับผู้ใช้ทุกคน"
               },
               {
                  title: "Responsive Layout",
                  description: "การออกแบบให้เหมาะสมกับหน้าจอทุกขนาด"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "เว็บไซต์ใช้งานได้จริง",
               description: "Deploy แล้วบน Vercel พร้อมใช้งานและแสดงผลงาน"
            },
            {
               title: "ทักษะ Frontend ที่เพิ่มขึ้น",
               description: "เชี่ยวชาญ Next.js, TypeScript และ Modern Web Development"
            },
            {
               title: "Portfolio มืออาชีพ",
               description: "มีเว็บไซต์ที่แสดงความสามารถและเป็นตัวแทนที่ดี"
            },
            {
               title: "Performance Score",
               description: "ได้คะแนน Lighthouse สูงมากในด้าน SEO, Accessibility"
            }
         ],
         futureGoals: {
            title: "แผนการพัฒนาต่อ",
            items: [
               { description: "เพิ่มโปรเจกต์ใหม่ๆใน Portfolio ที่มีการใช้งานเป็นไปตามเป้าหมาย" }
            ]
         }
      }
   }
}