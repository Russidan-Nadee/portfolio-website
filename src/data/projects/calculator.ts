// src/data/projects/calculator.ts

export const calculatorData = {
   navigation: {
      backLink: "/portfolio",
      backText: "กลับไปหน้าผลงาน",
      projectNumber: 4,
      totalProjects: 4,
      prevProjectSlug: "asset-management",
      nextProjectSlug: undefined
   },

   header: {
      title: "แอปเครื่องคิดเลขขั้นสูง",
      description: "เครื่องคิดเลขที่มีฟีเจอร์ครบครัน สร้างด้วย Python และ Tkinter พร้อม UI ที่ใช้งานง่าย",
      tags: ["Python", "Tkinter", "Desktop App", "GUI"],
      githubUrl: "https://github.com/Russidan-Nadee/calculator-app"
   },

   infoBar: {
      duration: "2 สัปดาห์",
      status: "Personal Project",
      company: "Self-Development",
      technologies: ["Python", "Tkinter", "Math"]
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
         title: "แอปเครื่องคิดเลขขั้นสูงสร้างด้วย Python",
         imageAlt: "หน้าจอหลักของแอปเครื่องคิดเลข",
         about: {
            title: "เกี่ยวกับโปรเจค",
            paragraphs: [
               "แอปเครื่องคิดเลขที่พัฒนาขึ้นเพื่อศึกษาการใช้งาน Python GUI Programming ด้วย Tkinter โดยมุ่งเน้นการสร้าง User Interface ที่สวยงามและใช้งานง่าย",
               "โปรเจคนี้เป็นส่วนหนึ่งของการเรียนรู้ Python Programming และการพัฒนา Desktop Application ซึ่งครอบคลุมทั้งการคำนวณพื้นฐานและขั้นสูง"
            ]
         },
         objectives: {
            title: "วัตถุประสงค์",
            content: "เรียนรู้การพัฒนา Desktop Application ด้วย Python • ฝึกใช้ Tkinter สำหรับสร้าง GUI • ทำความเข้าใจ Event Handling และ User Input Validation"
         }
      },

      features: {
         title: "ฟีเจอร์หลัก",
         items: [
            {
               title: "Basic Operations",
               description: "การคำนวณพื้นฐาน บวก ลบ คูณ หาร"
            },
            {
               title: "Scientific Functions",
               description: "ฟังก์ชันทางวิทยาศาสตร์ เช่น sin, cos, tan, log"
            },
            {
               title: "Memory Functions",
               description: "เก็บและเรียกใช้ค่าที่คำนวณแล้ว (MC, MR, M+, M-)"
            },
            {
               title: "History",
               description: "ประวัติการคำนวณที่ผ่านมา"
            },
            {
               title: "Keyboard Support",
               description: "รองรับการกดปุ่มจากคีย์บอร์ด"
            },
            {
               title: "Error Handling",
               description: "จัดการข้อผิดพลาดในการคำนวณ"
            }
         ]
      },

      gallery: {
         title: "ภาพหน้าจอ",
         items: [
            "Main Calculator Interface",
            "Scientific Mode",
            "Memory Functions Panel",
            "Calculation History",
            "Settings Menu",
            "Error Display Example"
         ]
      },

      technical: {
         title: "รายละเอียดเทคนิค",
         details: {
            "Programming Language": "Python 3.8+",
            "GUI Framework": "Tkinter (built-in)",
            "Math Library": "Math, NumPy",
            "Architecture": "Event-Driven Programming",
            "Design Pattern": "MVC (Model-View-Controller)",
            "Testing": "Unit Testing with pytest"
         },
         challenges: {
            title: "ความท้าทาย",
            items: [
               {
                  title: "UI Responsiveness",
                  description: "การทำให้ Interface ตอบสนองได้ดีกับการกดปุ่มเร็วๆ"
               },
               {
                  title: "Expression Parsing",
                  description: "การแปลงข้อความที่ป้อนเข้ามาให้เป็นสมการทางคณิตศาสตร์"
               },
               {
                  title: "Error Prevention",
                  description: "ป้องกันข้อผิดพลาดจากการหารด้วยศูนย์และ Invalid Input"
               },
               {
                  title: "Memory Management",
                  description: "จัดการหน่วยความจำสำหรับเก็บประวัติการคำนวณ"
               }
            ]
         }
      },

      results: {
         title: "ผลลัพธ์",
         items: [
            {
               title: "ความสำเร็จของโปรเจค",
               description: "สามารถสร้างแอปเครื่องคิดเลขที่ใช้งานได้จริงและมีฟีเจอร์ครบครัน"
            },
            {
               title: "ทักษะที่ได้รับ",
               description: "เชี่ยวชาญ Python GUI Programming และ Event-Driven Architecture"
            },
            {
               title: "การใช้งาน",
               description: "ใช้เป็นเครื่องมือส่วนตัวในการคำนวณประจำวัน"
            },
            {
               title: "Code Quality",
               description: "โค้ดมีโครงสร้างที่ดี แยกส่วนชัดเจน และมี Documentation"
            }
         ],
         futureGoals: {
            title: "แผนการพัฒนาต่อ",
            items: [
               { description: "เพิ่มโหมดการคำนวณเกี่ยวกับการเงิน (Financial Calculator)" },
               { description: "สร้าง Unit Converter สำหรับแปลงหน่วยต่างๆ" },
               { description: "เพิ่ม Graph Plotting สำหรับแสดงกราฟฟังก์ชัน" },
               { description: "พัฒนา Dark/Light Theme Switcher" },
               { description: "ปรับปรุง UI ให้ทันสมัยและใช้งานง่ายยิ่งขึ้น" }
            ]
         }
      }
   }
}