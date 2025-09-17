// src/data/projects/translations/th/asset-management.ts

export const assetManagementData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 4,
      totalProjects: 5,
      prevProjectSlug: "portfolio-website",
      nextProjectSlug: "calculator"
   },

   header: {
      title: "แอปจัดการทรัพย์สินมือถือ",
      description: "แอปพลิเคชันมือถือสำหรับจัดการทรัพย์สิน",
      tags: ["2025", "แอปมือถือ", "การศึกษา", "การจัดการ"],
      githubUrl: "https://github.com/Russidan-Nadee/learn-flutter-express"
   },

   infoBar: {
      duration: "3 เดือน",
      status: "เก็บถาวร",
      company: "Self-Development",
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
         title: "แอปพลิเคชันมือถือสำหรับจัดการทรัพย์สินองค์กร",
         imageAlt: "หน้าจอหลักของแอป Asset Management Mobile",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "แอปพลิเคชันมือถือที่พัฒนาด้วย Flutter สำหรับช่วยเหลือเจ้าหน้าที่ในการจัดการทรัพย์สินขององค์กร โดยเน้นความสะดวกในการใช้งานภาคสนามและการเข้าถึงข้อมูลแบบ Real-time",
               "แอปนี้เป็นส่วนหนึ่งของระบบ Asset Management ที่ใหญ่กว่า ทำหน้าที่เป็น Mobile Interface ที่เชื่อมต่อกับฐานข้อมูลกลางเดียวกัน"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "เพิ่มฝึกฝนการพัฒนาแอปพลิเคชันมือถือแบบครบวงจร • ลดเวลาในการตรวจสอบและบันทึกข้อมูล • สร้าง Mobile Experience ที่ดีสำหรับเจ้าหน้าที่"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Asset Registration",
               description: "ลงทะเบียนทรัพย์สินใหม่พร้อมกรอกข้อมูล"
            },
            {
               title: "Login & Authentication",
               description: "ระบบล็อกอินที่ปลอดภัยสำหรับผู้ใช้งาน"
            },
            {
               title: "Real-time Updates",
               description: "อัพเดทสถานะทรัพย์สินและซิงค์กับเซิร์ฟเวอร์แบบ Real-time"
            },
            {
               title: "Reports Generation",
               description: "สร้างรายงานและส่งออกข้อมูลในรูปแบบต่างๆ"
            },
            {
               title: "User Management",
               description: "ระบบจัดการผู้ใช้งานและสิทธิ์การเข้าถึง"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
         items: [
            "Login & Dashboard Screen",
            "Asset Details View",
            "Asset Registration Form",
            "Camera & Photo Capture",
            "Reports & Analytics"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Framework": "Flutter 3.x, Express.js",
            "Language": "Dart, JavaScript",
            "Database": "MySQL, Prisma ORM",
            "Platform": "Mobile",
            "Authentication": "JWT",
            "HTTP Client": "dio",
            "Version Control": "Git, GitHub"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "Authentication Flow",
                  description: "การจัดการระบบล็อกอินและการยืนยันตัวตนที่ปลอดภัย"
               },
               {
                  title: "Data Synchronization",
                  description: "การซิงค์ข้อมูลระหว่าง Mobile App และ Backend Server แบบ Real-time"
               },
               {
                  title: "UI/UX Design",
                  description: "การออกแบบ UI ที่ใช้งานง่ายและตอบสนองได้ดีบนอุปกรณ์มือถือ"
               },
               {
                  title: "Performance Optimization",
                  description: "การปรับปรุงประสิทธิภาพของแอปให้ทำงานได้รวดเร็วและราบรื่น"
               },
               {
                  title: "Cross-platform Compatibility",
                  description: "การทำให้แอปทำงานได้ดีทั้งบน iOS และ Android"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "ความเร็วในการทำงาน",
               description: "ลดเวลาในการตรวจสอบทรัพย์สินจาก 5-10 นาที เหลือ 1-2 นาที ต่อรายการ"
            },
            {
               title: "ความแม่นยำข้อมูล",
               description: "ลดข้อผิดพลาดจากการป้อนข้อมูลด้วยมือลง"
            },
            {
               title: "User Experience",
               description: "ได้รับ Feedback เชิงบวกจากผู้ใช้งานเรื่องความสะดวกและใช้งานง่าย"
            },
            {
               title: "เรียนรู้การพัฒนา Mobile App ด้วย Flutter",
               description: "เรียนรู้การพัฒนาแอปพลิเคชันด้วยFlutter"
            },
            {
               title: "เรียนรู้การพัฒนา Backend ด้วย Node.js และ Express",
               description: "เรียนรู้การพัฒนา Backend API ที่เชื่อมต่อกับฐานข้อมูล MySQL"
            },
            {
               title: "เรียนรู้การทำระบบ Authentication ด้วย JWT",
               description: "เรียนรู้การทำระบบล็อกอินและการยืนยันตัวตนด้วย JWT Token"
            }
         ],
         futureGoals: {
            title: "แผนการพัฒนาต่อ",
            items: [
               { description: "เพิ่ม Push Notifications สำหรับการแจ้งเตือนสำคัญ" },
               { description: "QR Code Scanner สําหรับการสแกน QR Code" },
               { description: "Barcode Scanner สําหรับการสแกนบาร์โค้ด" },
               { description: "Dashboard Analytics แบบ Mobile-optimized" }
            ]
         }
      }
   }
}