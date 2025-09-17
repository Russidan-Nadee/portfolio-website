// src/data/projects/translations/th/asset-dashboard.ts

export const assetDashboardData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 2,
      totalProjects: 5,
      prevProjectSlug: "invest-fam",
      nextProjectSlug: "portfolio-website"
   },

   header: {
      title: "ระบบจัดการทรัพย์สินด้วย RFID",
      description: "ระบบจัดการทรัพย์สินแบบครบวงจรด้วยเทคโนโลยี RFID สำหรับลดค่าใช้จ่ายและเพิ่มประสิทธิภาพ",
      tags: ["2025", "Cross-platform", "Enterprise", "การจัดการ", "หลายภาษา", "Light/Dark", "RFID"],
      githubUrl: "https://github.com/Russidan-Nadee/intern-project-rfid"
   },

   infoBar: {
      duration: "6 เดือน",
      status: "กำลังพัฒนา",
      company: "Thai Parkerizing",
      technologies: ["Flutter", "Express", "MySQL"],
      labels: {
         duration: "ระยะเวลาพัฒนา",
         status: "สถานะ",
         company: "บริษัท",
         technology: "เทคโนโลยีหลัก"
      }
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
            content: "นำไปใช้งานภายในแผนกเพื่อทดสอบประสิทธิภาพและปรับปรุงระบบ • อนาคตหากระบบทำงานได้ดี จะขยายการใช้งานไปยังทั้งบริษัทเพื่อเพิ่มประสิทธิภาพในการจัดการทรัพย์สินโดยรวม"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Dashboard",
               description: "แดชบอร์ดแสดงสถิติและข้อมูลทรัพย์สินในรูปแบบกราฟ"
            },
            {
               title: "Scan",
               description: "สแกน RFID Tag เพื่อดูข้อมูลและอัพเดทสถานะทรัพย์สิน"
            },
            {
               title: "Search",
               description: "ค้นหาทรัพย์สินด้วยเลขครุภัณฑ์, ชื่อ, หรือหมวดหมู่ หรือข้อมูลอื่นๆที่เกี่ยวข้อง"
            },
            {
               title: "Export",
               description: "ส่งออกรายงานเป็นไฟล์ CSV หรือ Excel"
            },
            {
               title: "Setting",
               description: "ตั้งค่าระบบ, จัดการผู้ใช้งาน และกำหนดสิทธิ์การเข้าถึง ภาษา และธีม"
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
            "Framework": "Flutter, Node.js",
            "Language": "Dart, JavaScript",
            "Database": "MySQL, Prisma ORM",
            "Platform": "Mobile, Web, Desktop, Android, iOS",
            "Authentication": "JWT",
            "Integration": "RFID Reader API",
            "Version Control": "Git, GitHub"
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
               },
               {
                  title: "User Experience",
                  description: "การออกแบบ UI/UX ที่ใช้งานง่ายและตอบสนองได้ดีบนทุกอุปกรณ์"
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
               description: "คาดการณ์ว่าจะประหยัดค่าซื้อซอฟต์แวร์ภายนอกได้มากกว่า ≈76.21%"
            },
            {
               title: "ประสิทธิภาพการทำงาน",
               description: "ลดเวลาในการตรวจนับทรัพย์สินจาก วัน เหลือเพียง ชั่วโมง"
            },
            {
               title: "UX/UI Friendly",
               description: "ได้รับ Feedback เชิงบวกจากผู้ใช้งานเรื่องความสะดวกและใช้งานง่าย"
            }
         ],
         futureGoals: {
            title: "เป้าหมายในอนาคต",
            items: [
               { description: "ขยายการใช้งานไปยังทั้งบริษัทหากผลการทดสอบใน Department เป็นไปตามเป้าหมาย" },
               { description: "เพิ่มระบบความปลอดภัยขั้นสูง" },
               { description: "เชื่อมต่อกับระบบ ERP ของบริษัทเพื่อการจัดการแบบรวมศูนย์" },
               { description: "พัฒนาระบบแจ้งเตือนเมื่อทรัพย์สินมีการเปลี่ยนแปลงสถานะ" },
               { description: "เพิ่มระบบตัดจ่ายทรัพย์สิน" }
            ]
         }
      }
   }
}