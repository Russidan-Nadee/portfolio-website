// prisma/seed-experience.ts
// One-off seed: migrates real work/education entries
// (originally hardcoded in locales/*.json) into the Experience table.
// Run with: npx tsx prisma/seed-experience.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const experiences = [
  {
    type: "work",
    title: {
      th: "นักพัฒนา Full Stack",
      en: "Full Stack Developer",
      ja: "フルスタック開発者",
    },
    company: "CloudCommerce",
    startDate: "2026-05",
    endDate: null,
    isCurrent: true,
    description: {
      th: "ดูแลและบำรุงรักษาระบบเดิม พร้อม migrate ระบบไปสู่สถาปัตยกรรม Microservice รับผิดชอบการพัฒนาในระดับ service โดยทำงานร่วมกับ senior developer ที่ดูแลสถาปัตยกรรมระบบโดยรวม",
      en: "Maintaining legacy systems and migrating existing functionality into individual Microservice services. Focused on service-level development while collaborating with senior developers who oversee the overall system architecture.",
      ja: "既存システムの保守を行いながら、機能をMicroserviceアーキテクチャへ移行。サービスレベルの開発を担当し、システム全体のアーキテクチャを管理するシニア開発者と協力して業務を進めています。",
    },
    skills: ["TypeScript", "Bun", "Elysia", "Microservices"],
    icon: "FaLaptopCode",
  },
  {
    type: "work",
    title: {
      th: "นักพัฒนาฝึกงาน",
      en: "Developer Intern",
      ja: "開発者インターン",
    },
    company: "Thai Parkerizing",
    startDate: "2025-04",
    endDate: "2025-10",
    isCurrent: false,
    description: {
      th: "พัฒนาระบบจัดการสินทรัพย์ข้ามแพลตฟอร์มพร้อมการรวม RFID โดยใช้ Flutter, Node.js, Express และ MySQL สร้างโซลูชันแบบเต็มรูปแบบรวมถึงแอปมือถือ เว็บแอปพลิเคชัน และแอปเดสก์ท็อป Windows",
      en: "Developed Cross-platform Asset Management System with RFID integration using Flutter, Node.js, Express, and MySQL. Created full-stack solution including mobile app, web application, and Windows desktop app.",
      ja: "Flutter、Node.js、Express、MySQLを使用して、RFID統合を備えたクロスプラットフォーム資産管理システムを開発。モバイルアプリ、Webアプリケーション、Windowsデスクトップアプリを含むフルスタックソリューションを作成。",
    },
    skills: [
      "Flutter",
      "Node.js",
      "Express",
      "MySQL",
      "RFID",
      "Cross-platform",
    ],
    icon: "FaLaptopCode",
  },
  {
    type: "education",
    title: {
      th: "ปริญญาตรี",
      en: "Bachelor's Degree",
      ja: "学士号",
    },
    company: "Silpakorn University",
    startDate: "2022-06",
    endDate: "2025-03",
    isCurrent: false,
    description: {
      th: "ระบบอิเล็กทรอนิกส์และคอมพิวเตอร์ - การศึกษาอย่างครอบคลุมเกี่ยวกับระบบคอมพิวเตอร์ อิเล็กทรอนิกส์ การพัฒนาซอฟต์แวร์ และสถาปัตยกรรมระบบ คาดว่าจะจบการศึกษา: มีนาคม 2568",
      en: "Electronic and Computer Systems - Comprehensive study of computer systems, electronics, software development, and system architecture. Expected graduation: March 2025.",
      ja: "電子・コンピュータシステム - コンピュータシステム、電子工学、ソフトウェア開発、システム設計の包括的な研究。卒業予定：2025年3月。",
    },
    skills: [
      "Electronics",
      "Computer Systems",
      "Software Development",
      "System Architecture",
    ],
    icon: "FaGraduationCap",
  },
  {
    type: "education",
    title: {
      th: "มัธยม - แผนวิทย์-คณิต",
      en: "High School - Science-Math Program",
      ja: "高等学校 - 理数科",
    },
    company: "Khlong Yang Pracha Nusan School",
    startDate: "2019-05",
    endDate: "2021-03",
    isCurrent: false,
    description: {
      th: "จบมัธยมปลายแผนวิทย์-คณิต มีพื้นฐานด้านคณิตศาสตร์และวิทยาศาสตร์ที่เหมาะสำหรับการศึกษาต่อด้านวิทยาการคอมพิวเตอร์",
      en: "Completed high school education with focus on Science and Mathematics program, building strong foundation in mathematical thinking and scientific principles essential for computer science studies.",
      ja: "理数科で高等学校教育を修了し、コンピュータサイエンスの学習に不可欠な数学的思考と科学的原理の強固な基礎を築きました。",
    },
    skills: ["Mathematics", "Physics", "Chemistry", "Logical Thinking"],
    icon: "MdSchool",
  },
] as const;

async function main() {
  const existing = await prisma.experience.count();
  if (existing > 0) {
    console.log(
      `Skipping: ${existing} experience(s) already exist. Delete them first if you want to reseed.`
    );
    return;
  }

  for (const experience of experiences) {
    await prisma.experience.create({
      data: { ...experience, skills: [...experience.skills] },
    });
  }
  console.log(`Seeded ${experiences.length} experience(s)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
