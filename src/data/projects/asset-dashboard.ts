// src/data/projects/asset-dashboard.ts

export const assetDashboardData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 1,
      totalProjects: 4,
      prevProjectSlug: undefined,
      nextProjectSlug: "portfolio-website"
   },

   header: {
      title: "ระบบจัดการทรัพย์สินด้วย RFID",
      description: "ระบบจัดการทรัพย์สินแบบครบวงจรด้วยเทคโนโลยี RFID สำหรับลดค่าใช้จ่ายและเพิ่มประสิทธิภาพ",
      tags: ["Cross-Platform", "RFID Technology", "2025", "กำลังพัฒนา"],
      githubUrl: "https://github.com/Russidan-Nadee/intern-project-rfid"
   },

   infoBar: {
      duration: "6 เดือน",
      status: "Developer Intern",
      company: "Thai Parkerizing",
      technologies: ["Flutter", "Node.js", "MySQL"]
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
         title: "ระบบจัดการทรัพย์สินด้วยเทคโนโลยี RFID แบบครบวงจร",
         imageAlt: "รูปภาพหลักของระบบ RFID Asset Management",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "ระบบจัดการทรัพย์สินด้วยเทคโนโลยี RFID ที่พัฒนาขึ้นเพื่อลดค่าใช้จ่ายของบริษัทที่จะต้องไปซื้อซอฟต์แวร์ราคาแพงจากภายนอก โดยการพัฒนาระบบเองให้ตรงตามความต้องการ",
               "ระบบนี้ถูกออกแบบให้เป็น Cross-platform รองรับทั้ง Mobile App, Web Application และ Windows Desktop App เพื่อให้สามารถใช้งานได้ในทุกสถานการณ์"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "Phase 1: นำไปใช้งานภายใน Department เพื่อทดสอบประสิทธิภาพและปรับปรุงระบบ • อนาคต: หากระบบทำงานได้ดี จะขยายการใช้งานไปยังทั้งบริษัทเพื่อเพิ่มประสิทธิภาพในการจัดการทรัพย์สินโดยรวม"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Dashboard",
               description: "แดชบอร์ดแสดงสถิติและข้อมูลทรัพย์สินแบบ Real-time"
            },
            {
               title: "Scan",
               description: "สแกน RFID Tag เพื่อดูข้อมูลและอัพเดทสถานะทรัพย์สิน"
            },
            {
               title: "Search",
               description: "ค้นหาทรัพย์สินด้วยเลขครุภัณฑ์, ชื่อ, หรือหมวดหมู่"
            },
            {
               title: "Export",
               description: "ส่งออกรายงานเป็นไฟล์ Excel, PDF หรือ CSV"
            },
            {
               title: "Setting",
               description: "ตั้งค่าระบบ, จัดการผู้ใช้งาน และกำหนดสิทธิ์การเข้าถึง"
            },
            {
               title: "Sync",
               description: "ซิงค์ข้อมูลระหว่าง Mobile, Web และ Desktop App"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
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
         title: "รายละเอียดเทคนิค",
         details: {
            "Frontend (Mobile)": "Flutter, Dart",
            "Frontend (Web)": "Flutter Web",
            "Frontend (Desktop)": "Flutter Desktop (Windows)",
            "Backend": "Node.js, Express.js",
            "Database": "MySQL, Prisma ORM",
            "RFID Integration": "NFC/RFID Reader API",
            "Authentication": "JWT Token-based"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "Cross-platform Compatibility",
                  description: "การทำให้ระบบทำงานได้สม่ำเสมอบนทุกแพลตฟอร์ม (Mobile, Web, Desktop)"
               },
               {
                  title: "RFID Integration",
                  description: "การเชื่อมต่อกับอุปกรณ์ RFID Reader และการประมวลผลข้อมูล Tag"
               },
               {
                  title: "Real-time Synchronization",
                  description: "การซิงค์ข้อมูลแบบ Real-time ระหว่างหลายอุปกรณ์"
               },
               {
                  title: "Database Performance",
                  description: "การปรับปรุงประสิทธิภาพฐานข้อมูลเมื่อข้อมูลทรัพย์สินมีจำนวนมาก"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "สถานะการพัฒนา",
               description: "โปรเจคอยู่ระหว่างการพัฒนา (Phase 1) คาดว่าจะเสร็จสมบูรณ์ในไตรมาส 4/2025"
            },
            {
               title: "การประหยัดค่าใช้จ่าย",
               description: "คาดการณ์ว่าจะประหยัดค่าซื้อซอฟต์แวร์ภายนอกได้มากกว่า 80%"
            },
            {
               title: "ประสิทธิภาพการทำงาน",
               description: "ลดเวลาในการตรวจนับทรัพย์สินจาก 2-3 วัน เหลือเพียง 2-3 ชั่วโมง"
            },
            {
               title: "ความพร้อมใช้งาน",
               description: "ระบบจะรองรับการใช้งานทั้ง Online และ Offline Mode"
            }
         ],
         futureGoals: {
            title: "เป้าหมายในอนาคต",
            items: [
               { description: "ขยายการใช้งานไปยังทั้งบริษัทหากผลการทดสอบใน Department เป็นไปตามเป้าหมาย" },
               { description: "เพิ่มฟีเจอร์ AI สำหรับการพยากรณ์การบำรุงรักษาทรัพย์สิน" },
               { description: "พัฒนา Mobile App สำหรับการใช้งานภาคสนาม" },
               { description: "เชื่อมต่อกับระบบ ERP ของบริษัทเพื่อการจัดการแบบรวมศูนย์" }
            ]
         }
      }
   }
}