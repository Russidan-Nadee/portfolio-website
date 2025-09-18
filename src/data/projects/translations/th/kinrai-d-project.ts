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
      githubUrl: undefined,
      demoUrl: undefined,
      liveUrl: undefined,
   },
   infoBar: {
      duration: '4 เดือน',
      status: 'กำลังพัฒนา',
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
         imageAlt: '',
         about: {
            title: 'เกี่ยวกับโครงการ',
            paragraphs: [
               'Kinrai-D คือแอปพลิเคชันสุ่มอาหารที่ออกแบบมาเพื่อช่วยให้ผู้ใช้ค้นหาและเลือกอาหารได้อย่างสนุกสนาน โดยใช้ระบบการสุ่มที่ช่วยลดปัญหาในการตัดสินใจเลือกอาหาร',
               'แอปพลิเคชันนี้ถูกพัฒนาด้วย Flutter เพื่อรองรับการใช้งานข้ามแพลตฟอร์ม และใช้ Nest.js เป็น backend พร้อมฐานข้อมูล PostgreSQL ผ่าน Supabase',
            ],
         },
         objectives: {
            title: 'วัตถุประสงค์',
            content: 'สร้างแอปพลิเคชันที่ช่วยให้ผู้ใช้สามารถค้นหาอาหารใหม่ๆ ได้อย่างสะดวกและสนุกสนาน ลดเวลาในการตัดสินใจ และเพิ่มประสบการณ์ในการลองอาหารหลากหลายประเภท',
         },
      },
      features: {
         title: 'ฟีเจอร์หลัก',
         items: [
            {
               title: 'ระบบสุ่มอาหาร',
               description: 'สุ่มเลือกอาหารจากฐานข้อมูลที่หลากหลาย พร้อมตัวกรองตามประเภทและความชอบ',
            },
            {
               title: 'การจัดการรายการโปรด',
               description: 'บันทึกและจัดการรายการอาหารที่ชื่นชอบ เพื่อการเข้าถึงที่ง่ายขึ้น',
            },
            {
               title: 'ระบบประเมินและรีวิว',
               description: 'ให้คะแนนและเขียนรีวิวอาหารที่ได้ลองแล้ว เพื่อช่วยผู้ใช้คนอื่น',
            },
            {
               title: 'การค้นหาขั้นสูง',
               description: 'ค้นหาอาหารตามหมวดหมู่ ส่วนผสม ราคา และระดับความเผ็ด',
            },
            {
               title: 'โหมดออฟไลน์',
               description: 'ใช้งานได้แม้ไม่มีอินเทอร์เน็ต พร้อมซิงค์ข้อมูลเมื่อเชื่อมต่อกลับ',
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
                  title: 'อัลกอริธึมการสุ่มที่ชาญฉลาด',
                  description: 'พัฒนาระบบสุ่มที่คำนึงถึงความชอบและประวัติการเลือกของผู้ใช้',
               },
               {
                  title: 'การจัดการข้อมูลออฟไลน์',
                  description: 'ออกแบบระบบซิงค์ข้อมูลที่ทำงานได้ทั้งออนไลน์และออฟไลน์',
               },
               {
                  title: 'UI/UX ที่ใช้งานง่ายข้ามแพลตฟอร์ม',
                  description: 'สร้างประสบการณ์ผู้ใช้ที่สม่ำเสมอในทุกแพลตฟอร์ม',
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
               title: 'ระบบ Backend ที่มีประสิทธิภาพ',
               description: 'สร้าง API ที่รวดเร็วและปลอดภัยด้วย Nest.js และ Supabase',
            },
            {
               title: 'ประสบการณ์ผู้ใช้ที่น่าสนใจ',
               description: 'ออกแบบ UI/UX ที่ทำให้การเลือกอาหารเป็นเรื่องสนุกและง่ายดาย',
            },
         ],
         futureGoals: {
            title: 'เป้าหมายในอนาคต',
            items: [
               {
                  description: 'เพิ่มฟีเจอร์แนะนำอาหารด้วย AI และ Machine Learning',
               },
               {
                  description: 'พัฒนาระบบแชร์รีวิวและแนะนำอาหารกับเพื่อน',
               },
               {
                  description: 'เพิ่มการรองรับหลายภาษาและอาหารนานาชาติ',
               },
               {
                  description: 'พัฒนาฟีเจอร์การจองร้านอาหารและสั่งอาหาร',
               },
            ],
         },
      },
   },
}