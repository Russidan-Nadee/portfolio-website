// src/data/projects/translations/th/kinrai-d-project.ts

import { ProjectData } from '../../types'

export const kinraiDData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'กลับไปหน้าผลงาน',
      projectNumber: 0, // Will be calculated dynamically
      totalProjects: 0, // Will be calculated dynamically
      prevProjectSlug: undefined, // Will be calculated dynamically
      nextProjectSlug: undefined, // Will be calculated dynamically
   },
   header: {
      title: 'Kinrai-D',
      description: 'แอปพลิเคชันสุ่มอาหารแบบข้ามแพลตฟอร์มที่ช่วยให้ผู้ใช้ค้นหาอาหารใหม่ๆ ได้อย่างสนุกสนาน',
      tags: ['2025', 'แอปพลิเคชัน', 'ข้ามแพลตฟอร์ม', 'อาหาร', 'การสุ่ม'],
      githubUrl: "https://github.com/Russidan-Nadee/Kinrai-D",
      demoUrl: undefined,
      liveUrl: "https://kinrai-d.vercel.app/",
   },
   infoBar: {
      duration: '4 เดือน',
      status: 'เสร็จสิ้นแล้ว',
      company: 'โครงการส่วนตัว',
      technologies: ['Flutter', 'Nest.js', 'PostgreSQL', 'Supabase'],
      labels: {
         duration: 'ระยะเวลา',
         status: 'สถานะ',
         company: 'บริษัท',
         technology: 'เทคโนโลยี',
      },
   },
   tabsContent: {
      tabs: {
         overview: 'ภาพรวม',
         features: 'ฟีเจอร์',
         gallery: 'แกลเลอรี่',
         technical: 'เทคนิค',
         results: 'ผลลัพธ์',
      },
      overview: {
         title: 'ภาพรวมโครงการ',
         imageAlt: 'ภาพรวมแอปพลิเคชัน Kinrai-D',
         about: {
            title: 'เกี่ยวกับโครงการ',
            paragraphs: [
               'Kinrai-D คือแอปพลิเคชันสุ่มอาหารที่ออกแบบมาเพื่อช่วยแก้ปัญหา "กินอะไรดี" ผู้ใช้สามารถเข้าใช้งานได้ทันทีผ่านระบบ Guest Login โดยไม่ต้องสมัครสมาชิก',
               'แอปพลิเคชันนี้ถูกพัฒนาด้วย Flutter เพื่อรองรับการใช้งานข้ามแพลตฟอร์ม และใช้ Nest.js เป็น backend พร้อมฐานข้อมูล PostgreSQL ผ่าน Supabase รองรับระบบหลายภาษา และมี Admin Menu สำหรับจัดการเมนูอาหาร',
            ],
         },
         objectives: {
            title: 'วัตถุประสงค์',
            content: 'สร้างแอปพลิเคชันที่ช่วยให้ผู้ใช้ตัดสินใจเลือกอาหารได้ง่ายขึ้น ด้วยระบบสุ่มอาหาร การกรองตาม filter และระบบ Dislike เพื่อให้ได้เมนูที่ถูกใจ พร้อมระบบ Admin สำหรับจัดการเมนูและรองรับผู้ใช้หลายภาษา',
         },
      },
      features: {
         title: 'ฟีเจอร์หลัก',
         items: [
            {
               title: 'Guest Login',
               description: 'เข้าใช้งานแอปได้ทันทีโดยไม่ต้องสมัครสมาชิก รองรับการใช้งานแบบไม่ระบุตัวตน',
            },
            {
               title: 'ระบบสุ่มอาหาร',
               description: 'สุ่มเมนูอาหารจากฐานข้อมูลได้อย่างง่ายดาย ช่วยแก้ปัญหา "กินอะไรดี" ในทุกวัน',
            },
            {
               title: 'ระบบ Dislike',
               description: 'กด Dislike เพื่อข้ามเมนูที่ไม่ชอบและสุ่มอาหารใหม่ได้ทันที',
            },
            {
               title: 'กรองอาหารตาม Filter',
               description: 'กรองเมนูอาหารตามหมวดหมู่และตัวเลือกที่ผู้ใช้กำหนดเอง เพื่อผลลัพธ์ที่ตรงใจ',
            },
            {
               title: 'Admin Menu',
               description: 'ระบบจัดการสำหรับแอดมินในการเพิ่ม ลด และแก้ไขเมนูอาหารในฐานข้อมูล',
            },
            {
               title: 'รองรับหลายภาษา',
               description: 'ระบบ i18n รองรับหลายภาษา ให้ผู้ใช้จากทั่วโลกใช้งานได้อย่างสะดวก',
            },
         ],
      },
      gallery: {
         title: 'รูปภาพ',
         items: [
            'หน้าหลักของแอป Kinrai-D',
            'ระบบสุ่มอาหารและผลลัพธ์',
            'หน้าจัดการรายการโปรด',
            'ระบบรีวิวและให้คะแนน',
            'การค้นหาและกรองอาหาร',
         ],
      },
      technical: {
         title: 'รายละเอียดเทคนิค',
         details: {
            'Framework': 'Flutter, Nest.js',
            'Language': 'Dart, TypeScript',
            'Platform': 'Cross-Platform (iOS, Android, Web)',
            'Database': 'PostgreSQL, Prisma ORM',
            'Cloud Service': 'Supabase',
            'Version Control': 'Git, GitHub',
         },
         challenges: {
            title: 'ความท้าทาย',
            items: [
               {
                  title: 'ระบบ Guest Login',
                  description: 'ออกแบบระบบ authentication ที่รองรับทั้งผู้ใช้ทั่วไปและ Guest โดยไม่กระทบสิทธิ์ระหว่างกัน',
               },
               {
                  title: 'Logic การกรองและ Dislike',
                  description: 'พัฒนาระบบ filter และ dislike ที่ทำงานร่วมกันได้อย่างถูกต้องและมีประสิทธิภาพ',
               },
               {
                  title: 'ระบบหลายภาษาข้ามแพลตฟอร์ม',
                  description: 'สร้างระบบ i18n ที่ทำงานสม่ำเสมอบน iOS, Android และ Web',
               },
            ],
         },
      },
      results: {
         title: 'ผลลัพธ์',
         items: [
            {
               title: 'แอปพลิเคชันข้ามแพลตฟอร์ม',
               description: 'พัฒนาแอปพลิเคชันที่ทำงานได้บน iOS, Android และ Web อย่างราบรื่น',
            },
            {
               title: 'ระบบสุ่มพร้อม Dislike & Filter',
               description: 'ระบบสุ่มอาหารที่ผสานกับ Dislike และ Filter ช่วยให้ได้เมนูที่ตรงใจผู้ใช้จริงๆ',
            },
            {
               title: 'Admin Dashboard',
               description: 'ระบบ Admin สำหรับจัดการเมนูอาหารในฐานข้อมูลได้อย่างสะดวก',
            },
            {
               title: 'รองรับหลายภาษา',
               description: 'แอปรองรับหลายภาษา ให้ผู้ใช้จากทั่วโลกสามารถใช้งานได้อย่างสะดวกสบาย',
            },
         ],
         futureGoals: {
            title: 'เป้าหมายในอนาคต',
            items: [
               {
                  description: 'เพิ่มฟีเจอร์แนะนำอาหารด้วย AI ตามประวัติ Dislike และ Filter ของผู้ใช้',
               },
               {
                  description: 'พัฒนาระบบ User Account เต็มรูปแบบ พร้อมบันทึกประวัติการสุ่ม',
               },
               {
                  description: 'เพิ่มเมนูอาหารนานาชาติและขยายฐานข้อมูลให้ครอบคลุมมากขึ้น',
               },
               {
                  description: 'พัฒนา Admin Dashboard ให้มีสถิติและรายงานการใช้งาน',
               },
            ],
         },
      },
   },
}