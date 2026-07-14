// src/data/projects/translations/th/master-data-service.ts

export const masterDataServiceData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 8,
      totalProjects: 8,
      prevProjectSlug: undefined,
      nextProjectSlug: "money-tracker-app"
   },

   header: {
      title: "Master Data Service",
      description: "Backend microservice ที่รวมศูนย์ข้อมูลหลักหลายส่วนไว้เบื้องหลัง API เดียวสำหรับแพลตฟอร์ม FastShip",
      tags: ["2026", "Backend", "Microservice", "API", "Enterprise"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "2 เดือน (ต่อเนื่อง)",
      status: "ใช้งานจริง",
      company: "FastShip",
      technologies: ["Bun", "ElysiaJS", "MySQL"],
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
         title: "Backend Microservice สำหรับข้อมูลหลักของแพลตฟอร์ม",
         imageAlt: "หน้า Swagger API Documentation ของ Master Data Service",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "Master Data Service เป็น backend microservice ของแพลตฟอร์ม FastShip พัฒนาด้วย Bun และ ElysiaJS ทำหน้าที่รวมศูนย์ข้อมูลและ logic หลายส่วนที่เคยกระจัดกระจายอยู่ใน legacy monolith ไว้เบื้องหลัง API เดียวที่มี authentication ร่วมกัน ช่วยให้ทีมอื่นเรียกใช้ข้อมูลกลางได้สะดวกและดูแลระบบง่ายขึ้น",
               "ระบบแบ่งเป็นโมดูลอิสระต่อกันตามโดเมนธุรกิจ แต่ละโมดูลมีชั้น controller/service/schema ของตัวเอง เชื่อมต่อฐานข้อมูล MySQL ผ่าน Drizzle ORM และตรวจสอบสิทธิ์ผู้ใช้งานด้วยระบบ JWT-based authentication ที่เชื่อมกับระบบยืนยันตัวตนกลางของบริษัท"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "แยก logic ที่กระจัดกระจายอยู่ใน legacy monolith ออกมาเป็น microservice ที่ดูแลง่ายขึ้น • ให้ API กลางสำหรับข้อมูลหลักที่ทีมอื่นเรียกใช้ได้ • วางสถาปัตยกรรมแบบ module-based ให้ขยายเพิ่ม domain ใหม่ได้ในอนาคต"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Master Data Management",
               description: "จัดการข้อมูลอ้างอิงหลักของแพลตฟอร์มแบบ CRUD ครบวงจร ออกแบบให้ขยายเพิ่มประเภทข้อมูลใหม่ได้ในอนาคต"
            },
            {
               title: "Geoname & Postcode Lookup",
               description: "ค้นหาข้อมูลประเทศ, รัฐ/จังหวัด, เมือง และรหัสไปรษณีย์ รองรับการค้นหารหัสไปรษณีย์ไทยแบบเจาะจง"
            },
            {
               title: "External API Integrations",
               description: "เชื่อมต่อกับบริการภายนอกอย่าง GeoNames API และ Zoho เพื่อดึงข้อมูลตำแหน่งและข้อมูลที่เกี่ยวข้องมารวมไว้ในที่เดียว"
            },
            {
               title: "JWT-based Authentication",
               description: "ตรวจสอบสิทธิ์การเข้าถึง API ด้วยระบบ JWT ที่เชื่อมกับระบบยืนยันตัวตนกลางของบริษัท"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
         items: [
            "Swagger API Documentation",
            "Health Check Endpoint",
            "Master Data CRUD Response"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Runtime": "Bun 1.3",
            "Framework": "ElysiaJS v1.4",
            "Language": "TypeScript",
            "Database": "MySQL ผ่าน Drizzle ORM",
            "Authentication": "JWT-based Authentication",
            "API Docs": "Swagger UI (auto-generated)",
            "Code Quality": "ESLint, Prettier, Husky pre-commit hooks"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "การรักษาความถูกต้องระหว่าง Migration",
                  description: "ต้องมั่นใจว่าผลลัพธ์การคำนวณตรงกับระบบ legacy เดิมทุกกรณี จึงสร้างสคริปต์เปรียบเทียบและ benchmark ผลลัพธ์ระหว่างสองระบบก่อน cutover จริง"
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
               title: "รวมศูนย์หลายโดเมนเข้าเป็น Microservice เดียว",
               description: "ย้าย logic ที่เคยกระจัดกระจายอยู่ใน legacy monolith มาไว้ใน service ที่ deploy แยกอิสระได้"
            },
            {
               title: "[รอเพิ่มเติม]",
               description: "จะเพิ่มรายละเอียดผลลัพธ์ของโปรเจคนี้ทีหลัง"
            }
         ],
         futureGoals: {
            title: "เป้าหมายในอนาคต",
            items: [
               { description: "ขยายเพิ่มโมดูลใหม่ตามสถาปัตยกรรมแบบ module-based ที่วางไว้" },
               { description: "[รอเพิ่มเติม] จะเพิ่มเป้าหมายในอนาคตทีหลัง" }
            ]
         }
      }
   }
}
