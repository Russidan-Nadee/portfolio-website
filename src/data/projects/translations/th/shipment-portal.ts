// src/data/projects/translations/th/shipment-portal.ts

export const shipmentPortalData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 9,
      totalProjects: 9,
      prevProjectSlug: undefined,
      nextProjectSlug: "master-data-service"
   },

   header: {
      title: "Shipment Portal",
      description: "พอร์ทัลสำหรับเจ้าหน้าที่ FastShip ใช้ติดตามและจัดการพัสดุ ตั้งแต่ภาพรวมรายการจนถึงรายละเอียดการจัดส่งแต่ละชิ้น",
      tags: ["2026", "Web", "Enterprise", "Internal Tool"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "1 เดือนกว่า (ต่อเนื่อง)",
      status: "ใช้งานจริง",
      company: "FastShip",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
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
         title: "พอร์ทัลติดตามและจัดการพัสดุสำหรับเจ้าหน้าที่",
         imageAlt: "หน้ารายการพัสดุของ Shipment Portal",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "Shipment Portal เป็นเว็บแอปพลิเคชันภายในของ FastShip พัฒนาด้วย Next.js (App Router) และ TypeScript ให้เจ้าหน้าที่ใช้ติดตามสถานะพัสดุ ดูรายละเอียดการจัดส่งแต่ละชิ้น และจัดการงานรับพัสดุ (pickup) ได้จากที่เดียว",
               "หน้าที่มีข้อมูลเยอะอย่างหน้ารายการและหน้ารายละเอียด render แบบ server-side เพื่อความเร็วในการโหลด ระบบไม่มีฐานข้อมูลของตัวเอง แต่เรียกใช้ backend service กลางของบริษัทผ่าน API เป็นหลัก ยกเว้นการค้นหา tracking บางส่วนที่ยังต่อฐานข้อมูล legacy อยู่ระหว่างการย้ายระบบ"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "ให้เจ้าหน้าที่มีเครื่องมือกลางสำหรับติดตามและจัดการพัสดุแทนการสลับไปมาหลายระบบ • รวมข้อมูลที่เกี่ยวข้องกับการจัดส่งแต่ละชิ้นไว้ในหน้าเดียว ลดเวลาค้นหาข้อมูล • วางโครงสร้างให้ย้ายออกจากระบบ legacy ได้อย่างค่อยเป็นค่อยไป"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "รายการพัสดุพร้อมตัวกรอง",
               description: "ดูภาพรวมพัสดุทั้งหมด กรองตามสถานะ ค้นหา และบุ๊กมาร์กรายการที่สนใจ"
            },
            {
               title: "หน้ารายละเอียดพัสดุ",
               description: "รวมข้อมูลผู้ส่ง ผู้รับ ศุลกากร ใบกำกับสินค้า และสถานะการติดตามไว้ในหน้าเดียว"
            },
            {
               title: "การจัดการงานรับพัสดุ (Pickup)",
               description: "ดูรายละเอียดคำขอรับพัสดุและสถานะความคืบหน้าแยกต่างหากจากรายการจัดส่ง"
            },
            {
               title: "แดชบอร์ดประสิทธิภาพ Agent",
               description: "สรุปภาพรวมประสิทธิภาพการจัดส่งของแต่ละ agent ในรูปแบบที่อ่านง่าย"
            },
            {
               title: "หน้าติดตามรายการผิดปกติ",
               description: "แยกพัสดุที่มีปัญหาหรือสถานะผิดปกติไว้ให้ตรวจสอบได้เร็วขึ้น"
            },
            {
               title: "ระบบยืนยันตัวตนตามสิทธิ์การใช้งาน",
               description: "ล็อกอินสำหรับเจ้าหน้าที่ พร้อมจำกัดสิทธิ์การเข้าถึงตาม role"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
         items: [
            "Shipment List Overview",
            "Shipment Detail Page",
            "Pickup Detail View",
            "Agent Performance Dashboard"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Framework": "Next.js 15 (App Router)",
            "Language": "TypeScript",
            "Styling": "Tailwind CSS v4 ผ่านระบบ design token",
            "Authentication": "Session-based ตามสิทธิ์การใช้งาน",
            "Error Tracking": "Sentry",
            "Rendering": "Server-side rendering สำหรับหน้าที่มีข้อมูลเยอะ"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "ย้ายระบบแบบค่อยเป็นค่อยไป",
                  description: "ต้องออกแบบให้หน้าเว็บใช้งานได้ปกติระหว่างที่ข้อมูลบางส่วนยังอยู่บนระบบ legacy และบางส่วนย้ายมาเรียกผ่าน backend service ใหม่แล้ว"
               },
               {
                  title: "[รอเพิ่มเติม]",
                  description: "จะเพิ่มรายละเอียดความท้าทายอื่นของโปรเจคนี้ทีหลัง"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "รวมเครื่องมือติดตามพัสดุไว้ในที่เดียว",
               description: "เจ้าหน้าที่ไม่ต้องสลับไปมาหลายระบบเพื่อดูข้อมูลการจัดส่งแต่ละชิ้นอีกต่อไป"
            },
            {
               title: "[รอเพิ่มเติม]",
               description: "จะเพิ่มรายละเอียดผลลัพธ์ของโปรเจคนี้ทีหลัง"
            }
         ],
         futureGoals: {
            title: "เป้าหมายในอนาคต",
            items: [
               { description: "ย้ายส่วนที่ยังพึ่งพาระบบ legacy ออกให้หมด" },
               { description: "[รอเพิ่มเติม] จะเพิ่มเป้าหมายในอนาคตทีหลัง" }
            ]
         }
      }
   }
}
