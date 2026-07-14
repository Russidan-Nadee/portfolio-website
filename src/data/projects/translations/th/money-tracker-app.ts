// src/data/projects/translations/th/money-tracker-app.ts

export const moneyTrackerData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 7,
      totalProjects: 7,
      prevProjectSlug: undefined,
      nextProjectSlug: "kinrai-d-project"
   },

   header: {
      title: "Money Tracker App",
      description: "ระบบติดตามรายรับ-รายจ่ายส่วนตัว ดึงข้อมูลธุรกรรมจากอีเมลแจ้งเตือนธนาคารอัตโนมัติ พร้อมแดชบอร์ดสรุปยอดคงเหลือแบบเรียลไทม์",
      tags: ["2026", "Personal", "Automation", "Fintech", "Full-stack"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "2 เดือน (ต่อเนื่อง)",
      status: "ใช้งานจริง",
      company: "โปรเจคส่วนตัว",
      technologies: ["Next.js", "Prisma", "Supabase"],
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
         title: "ระบบติดตามการเงินส่วนตัวแบบอัตโนมัติ",
         imageAlt: "หน้าแดชบอร์ดหลักของ Money Tracker App",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "Money Tracker App เป็นเว็บแอปพลิเคชันส่วนตัวสำหรับติดตามรายรับ-รายจ่าย พัฒนาด้วย Next.js 16 (App Router) และ TypeScript โดยจุดเด่นคือระบบดึงข้อมูลธุรกรรมจากอีเมลแจ้งเตือนของธนาคารอัตโนมัติผ่าน Gmail API แทนการกรอกข้อมูลด้วยมือ",
               "ระบบเก็บ timestamp ของอีเมลล่าสุดที่ดึงมาแล้วไว้ในฐานข้อมูล และดึงอีเมลใหม่จากธนาคาร Krungthai และ Kasikornbank ต่อจากจุดนั้นโดยอัตโนมัติทุกครั้งที่เปิดแอป (ไม่ใช่ scheduled cron job) จากนั้นแกะข้อมูล (parse) แล้วบันทึกลงฐานข้อมูล Supabase (PostgreSQL) ผ่าน Prisma ORM โดยตรวจสอบรายการซ้ำด้วย reference number ก่อนบันทึกทุกครั้ง"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "ลดภาระการบันทึกรายรับ-รายจ่ายด้วยมือ • ให้เห็นภาพรวมทางการเงินแบบเรียลไทม์ผ่านแดชบอร์ด • วางโครงสร้างระบบให้ขยายรองรับธนาคารอื่นเพิ่มได้ในอนาคต"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Gmail Auto-Fetch",
               description: "ดึงอีเมลแจ้งเตือนธุรกรรมใหม่ต่อจาก timestamp ล่าสุดโดยอัตโนมัติทุกครั้งที่เปิดแอป"
            },
            {
               title: "Email Parsing",
               description: "แกะข้อมูลรายการโอนเงินจาก HTML email ของธนาคารแต่ละแห่ง"
            },
            {
               title: "Duplicate Prevention",
               description: "ตรวจสอบ reference number ก่อนบันทึก ป้องกันรายการซ้ำลงฐานข้อมูล"
            },
            {
               title: "Multi-bank Support",
               description: "รองรับอีเมลแจ้งเตือนจากธนาคารกรุงไทยและกสิกรไทย"
            },
            {
               title: "Balance Dashboard",
               description: "แสดงยอดคงเหลือแยกตามบัญชี พร้อมสรุปรายรับ-รายจ่าย"
            },
            {
               title: "Transaction Table",
               description: "ตารางแสดงรายการธุรกรรมทั้งหมด พร้อมสีแยกรายรับ/รายจ่าย"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
         items: [
            "Dashboard Overview",
            "Transaction Table",
            "Balance Summary",
            "Gmail Sync Flow"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Framework": "Next.js 16 (App Router)",
            "Language": "TypeScript",
            "Database": "Supabase (PostgreSQL), Prisma 7 ORM",
            "Integration": "Gmail API (OAuth 2.0)",
            "Sync Strategy": "ดึงข้อมูลต่อจาก timestamp ล่าสุดทุกครั้งที่เปิดแอป (ไม่ใช่ cron job)",
            "Styling": "Tailwind CSS 4",
            "Deployment": "Vercel"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "[รอเพิ่มเติม]",
                  description: "จะเพิ่มรายละเอียดความท้าทายของโปรเจคนี้ทีหลัง"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "ใช้งานจริงในชีวิตประจำวัน",
               description: "ระบบดึงข้อมูลอัตโนมัติทุกครั้งที่เปิดแอปโดยอ้างอิงจาก timestamp ล่าสุด และใช้ติดตามการเงินส่วนตัวจริง"
            },
            {
               title: "[รอเพิ่มเติม]",
               description: "จะเพิ่มรายละเอียดผลลัพธ์ของโปรเจคนี้ทีหลัง"
            }
         ],
         futureGoals: {
            title: "เป้าหมายในอนาคต",
            items: [
               { description: "[รอเพิ่มเติม] จะเพิ่มเป้าหมายในอนาคตทีหลัง" }
            ]
         }
      }
   }
}
