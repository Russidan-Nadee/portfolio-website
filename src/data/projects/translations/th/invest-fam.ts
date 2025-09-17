// src/data/projects/translations/th/invest-fam.ts

import { ProjectData } from '../../types'

export const investFamData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'กลับไปหน้าผลงาน',
      projectNumber: 5,
      totalProjects: 5,
      prevProjectSlug: undefined,
      nextProjectSlug: 'asset-dashboard',
   },
   header: {
      title: 'InvestFam',
      description: 'แพลตฟอร์มครบครันสำหรับการวางแผนการเงินและเครื่องมือคำนวณการลงทุนฟรี',
      tags: ['เว็บไซต์', 'การลงทุน', 'เครื่องมือการเงิน', 'Next.js'],
      githubUrl: undefined,
      demoUrl: 'https://invest-fam.com',
   },
   infoBar: {
      duration: '2024 - ปัจจุบัน',
      status: 'เสร็จสมบูรณ์',
      company: 'โครงการส่วนตัว',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PWA'],
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
         imageAlt: 'InvestFam Website Preview',
         about: {
            title: 'เกี่ยวกับโครงการ',
            paragraphs: [
               'InvestFam คือแพลตฟอร์มเว็บที่ให้บริการเครื่องมือการวางแผนการเงินและคำนวณการลงทุนฟรี เพื่อช่วยให้ผู้ใช้สามารถตัดสินใจทางการเงินได้อย่างมีข้อมูล',
               'แอปพลิเคชันนี้รองรับการใช้งานแบบ Progressive Web App (PWA) และมีการรองรับภาษาไทยและอังกฤษ พร้อมด้วยเครื่องมือคำนวณหลากหลายประเภท',
            ],
         },
         objectives: {
            title: 'วัตถุประสงค์',
            content: 'สร้างแพลตฟอร์มที่ให้เครื่องมือการเงินฟรีและเข้าถึงง่าย เพื่อช่วยให้ผู้ใช้สามารถวางแผนการเงินและการลงทุนได้อย่างมีประสิทธิภาพ',
         },
      },
      features: {
         title: 'ฟีเจอร์หลัก',
         items: [
            {
               title: 'เครื่องคำนวณกองทุนรวม',
               description: 'คำนวณผลตอบแทนจากการลงทุนกองทุนรวมพร้อมค่าธรรมเนียมต่างๆ',
            },
            {
               title: 'เครื่องคำนวณ DCA',
               description: 'คำนวณผลตอบแทนจากการลงทุนแบบ Dollar Cost Averaging',
            },
            {
               title: 'เครื่องคำนวณเป้าหมายการออม',
               description: 'วางแผนการออมเพื่อบรรลุเป้าหมายทางการเงิน',
            },
            {
               title: 'เครื่องคำนวณสินเชื่อ',
               description: 'คำนวณเงินกู้และดอกเบี้ยสำหรับการวางแผนทางการเงิน',
            },
            {
               title: 'เครื่องคำนวณภาษี',
               description: 'คำนวณภาษีเงินได้และวางแผนภาษี',
            },
         ],
      },
      gallery: {
         title: 'รูปภาพ',
         items: [
            'หน้าหลักของแอป InvestFam',
            'เครื่องคำนวณกองทุนรวม',
            'เครื่องคำนวณ DCA',
            'เครื่องคำนวณเป้าหมายการออม',
            'เครื่องคำนวณสินเชื่อและภาษี',
         ],
      },
      technical: {
         title: 'รายละเอียดเทคนิค',
         details: {
            'Frontend': 'Next.js 14, TypeScript, Tailwind CSS',
            'Features': 'PWA, Responsive Design, Multi-language',
            'Deployment': 'Netlify',
            'Version': '1.2.1',
         },
         challenges: {
            title: 'ความท้าทาย',
            items: [
               {
                  title: 'การคำนวณทางการเงินที่ซับซ้อน',
                  description: 'สร้างอัลกอริธึมสำหรับการคำนวณผลตอบแทนและค่าธรรมเนียมที่แม่นยำ',
               },
               {
                  title: 'การออกแบบ UX ที่เข้าใจง่าย',
                  description: 'ออกแบบให้ผู้ใช้ทั่วไปเข้าใจเครื่องมือทางการเงินได้ง่าย',
               },
               {
                  title: 'การรองรับหลายภาษา',
                  description: 'ให้บริการในภาษาไทยและอังกฤษอย่างสมบูรณ์',
               },
            ],
         },
      },
      results: {
         title: 'ผลลัพธ์',
         items: [
            {
               title: 'แพลตฟอร์มที่ครบครัน',
               description: 'สร้างเว็บแอปพลิเคชันที่มีเครื่องมือคำนวณทางการเงินครบครัน พร้อมใช้งานจริง',
            },
            {
               title: 'การเข้าถึงที่ง่าย',
               description: 'ให้บริการเครื่องมือการเงินฟรีที่ใครๆ ก็สามารถเข้าถึงได้',
            },
            {
               title: 'ประสบการณ์ผู้ใช้ที่ดี',
               description: 'ออกแบบ UI/UX ที่ใช้งานง่ายและเข้าใจง่ายสำหรับคนทั่วไป',
            },
         ],
         futureGoals: {
            title: 'เป้าหมายในอนาคต',
            items: [
               {
                  description: 'เพิ่มเครื่องมือคำนวณทางการเงินประเภทใหม่ๆ',
               },
               {
                  description: 'พัฒนาฟีเจอร์การบันทึกและติดตามข้อมูลการเงิน',
               },
               {
                  description: 'เพิ่มการวิเคราะห์และรายงานข้อมูลการลงทุน',
               },
               {
                  description: 'พัฒนา Mobile App สำหรับ iOS และ Android',
               },
            ],
         },
      },
   },
}