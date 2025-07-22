// src/data/projects/asset-management.ts

export const assetManagementData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 3,
      totalProjects: 4,
      prevProjectSlug: "portfolio-website",
      nextProjectSlug: "calculator"
   },

   header: {
      title: "แอปจัดการทรัพย์สินมือถือ",
      description: "แอปพลิเคชันมือถือสำหรับจัดการทรัพย์สิน พร้อมฟีเจอร์สแกน QR Code และรายงานแบบ Real-time",
      tags: ["Flutter", "Mobile App", "QR Scanner", "Real-time", "Cross-Platform"],
      githubUrl: "https://github.com/Russidan-Nadee/asset-management-mobile"
   },

   infoBar: {
      duration: "4 เดือน",
      status: "Internship Project",
      company: "Thai Parkerizing",
      technologies: ["Flutter", "Node.js", "Express", "MySQL"]
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
            content: "เพิ่มความสะดวกในการจัดการทรัพย์สินภาคสนาม • ลดเวลาในการตรวจสอบและบันทึกข้อมูล • รองรับการทำงานแบบ Offline • สร้าง Mobile Experience ที่ดีสำหรับเจ้าหน้าที่"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "QR Code Scanner",
               description: "สแกน QR Code เพื่อเข้าถึงข้อมูลทรัพย์สินได้ทันที"
            },
            {
               title: "Asset Registration",
               description: "ลงทะเบียนทรัพย์สินใหม่พร้อมถ่ายรูปและกรอกข้อมูล"
            },
            {
               title: "Real-time Updates",
               description: "อัพเดทสถานะทรัพย์สินและซิงค์กับเซิร์ฟเวอร์แบบ Real-time"
            },
            {
               title: "Offline Support",
               description: "ทำงานได้แม้ไม่มีอินเทอร์เน็ต และซิงค์ข้อมูลเมื่อกลับมาออนไลน์"
            },
            {
               title: "Photo Capture",
               description: "ถ่ายรูปทรัพย์สินและอัพโหลดไปยังระบบ"
            },
            {
               title: "Location Tracking",
               description: "บันทึกตำแหน่งที่ตั้งของทรัพย์สินด้วย GPS"
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
            "QR Code Scanner Interface",
            "Asset Details View",
            "Asset Registration Form",
            "Camera & Photo Capture",
            "Reports & Analytics",
            "Offline Mode Indicator",
            "Settings & Profile"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Mobile Framework": "Flutter 3.x",
            "Programming Language": "Dart",
            "Backend API": "Node.js + Express",
            "Database": "MySQL with Prisma ORM",
            "State Management": "Provider + Riverpod",
            "Local Storage": "SQLite (sqflite)",
            "Image Handling": "image_picker, image_cropper",
            "QR Scanner": "qr_code_scanner",
            "HTTP Client": "dio",
            "Authentication": "JWT Token"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "Offline Data Synchronization",
                  description: "การจัดการข้อมูลแบบ Offline และซิงค์เมื่อกลับมาออนไลน์"
               },
               {
                  title: "Camera & Image Optimization",
                  description: "การจัดการรูปภาพให้มีคุณภาพดีแต่ไฟล์ไม่ใหญ่เกินไป"
               },
               {
                  title: "QR Code Performance",
                  description: "การทำให้ QR Scanner ทำงานได้รวดเร็วและแม่นยำ"
               },
               {
                  title: "Battery Optimization",
                  description: "การจัดการการใช้พลังงานให้มีประสิทธิภาพ"
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
               title: "การใช้งานจริงในองค์กร",
               description: "แอปถูกนำไปใช้งานจริงโดยเจ้าหน้าที่ใน Department pilot"
            },
            {
               title: "ความเร็วในการทำงาน",
               description: "ลดเวลาในการตรวจสอบทรัพย์สินจาก 5-10 นาที เหลือ 1-2 นาที ต่อรายการ"
            },
            {
               title: "ความแม่นยำข้อมูล",
               description: "ลดข้อผิดพลาดจากการป้อนข้อมูลด้วยมือลง 90%"
            },
            {
               title: "User Experience",
               description: "ได้รับ Feedback เชิงบวกจากผู้ใช้งานเรื่องความสะดวกและใช้งานง่าย"
            },
            {
               title: "Performance",
               description: "แอปทำงานได้ราบรื่นและใช้แบตเตอรี่อย่างมีประสิทธิภาพ"
            }
         ],
         futureGoals: {
            title: "แผนการพัฒนาต่อ",
            items: [
               { description: "เพิ่ม Push Notifications สำหรับการแจ้งเตือนสำคัญ" },
               { description: "ระบบ Barcode Scanner รองรับ Barcode หลายรูปแบบ" },
               { description: "Dashboard Analytics แบบ Mobile-optimized" },
               { description: "เพิ่ม Voice Commands สำหรับการใช้งานแฮนด์ฟรี" },
               { description: "ระบบ Machine Learning สำหรับ Auto-categorization" },
               { description: "เชื่อมต่อกับ IoT Devices เพื่อ Real-time Monitoring" }
            ]
         }
      }
   }
}