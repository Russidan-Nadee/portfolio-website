// prisma/seed.ts
// Migrates existing hardcoded skills (src/components/about/SkillsGrid.tsx) into the DB.
// Run with: npx tsx prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const categoryNames: Record<string, { th: string; en: string; ja: string }> = {
   frontend: { th: 'ฟรอนต์เอนด์', en: 'Frontend', ja: 'フロントエンド' },
   backend: { th: 'แบ็กเอนด์', en: 'Backend', ja: 'バックエンド' },
   database: { th: 'ฐานข้อมูล', en: 'Database', ja: 'データベース' },
   devtools: { th: 'เครื่องมือพัฒนา', en: 'Dev Tools', ja: '開発ツール' },
   ai: { th: 'AI', en: 'AI', ja: 'AI' },
   infrastructure: { th: 'โครงสร้างพื้นฐาน', en: 'Infrastructure', ja: 'インフラ' },
   business: { th: 'เครื่องมือธุรกิจ', en: 'Business Tools', ja: 'ビジネスツール' },
}

const skillsByCategory = {
   frontend: [
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', descriptions: { en: 'Dynamic programming language for interactive web applications', th: 'ภาษาโปรแกรมมิ่งแบบไดนามิกสำหรับแอปพลิเคชันเว็บแบบอินเทอร์แอคทีฟ', ja: 'インタラクティブなWebアプリケーション用の動的プログラミング言語' } },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org', descriptions: { en: 'Strongly typed JavaScript for scalable applications', th: 'JavaScript ที่มีการกำหนดประเภทข้อมูลสำหรับแอปพลิเคชันขนาดใหญ่', ja: 'スケーラブルなアプリケーション用の強く型付けされたJavaScript' } },
      { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', url: 'https://dart.dev', descriptions: { en: 'Client-optimized language for mobile and web apps', th: 'ภาษาที่ปรับแต่งสำหรับแอปมือถือและเว็บ', ja: 'モバイルとWebアプリ用にクライアント最適化された言語' } },
      { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', descriptions: { en: 'Styling language for creating beautiful web interfaces', th: 'ภาษาสำหรับจัดรูปแบบเว็บไซต์ให้สวยงาม', ja: '美しいWebインターフェースを作成するためのスタイリング言語' } },
      { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', descriptions: { en: 'Markup language for structuring web content', th: 'ภาษามาร์กอัปสำหรับจัดโครงสร้างเนื้อหาเว็บ', ja: 'Webコンテンツの構造化のためのマークアップ言語' } },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org', descriptions: { en: 'React framework for production-ready applications', th: 'เฟรมเวิร์ก React สำหรับแอปพลิเคชันที่พร้อมใช้งานจริง', ja: 'プロダクションレディなアプリケーション用のReactフレームワーク' } },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', url: 'https://flutter.dev', descriptions: { en: 'UI toolkit for cross-platform mobile applications', th: 'ชุดเครื่องมือ UI สำหรับแอปมือถือข้ามแพลตฟอร์ม', ja: 'クロスプラットフォームモバイルアプリケーション用のUIツールキット' } },
      { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', url: 'https://tailwindcss.com', descriptions: { en: 'Utility-first CSS framework for rapid UI development', th: 'เฟรมเวิร์ก CSS แบบ utility-first สำหรับพัฒนา UI อย่างรวดเร็ว', ja: '高速UI開発のためのユーティリティファーストCSSフレームワーク' } },
   ],
   backend: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org', descriptions: { en: 'JavaScript runtime for server-side development', th: 'รันไทม์ JavaScript สำหรับพัฒนาฝั่งเซิร์ฟเวอร์', ja: 'サーバーサイド開発用のJavaScriptランタイム' } },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://python.org', descriptions: { en: 'Versatile programming language for web and data science', th: 'ภาษาโปรแกรมมิ่งที่หลากหลายสำหรับเว็บและวิทยาศาสตร์ข้อมูล', ja: 'Webとデータサイエンスのための多用途プログラミング言語' } },
      { name: 'Nest.js', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/NestJS.svg', url: 'https://nestjs.com', descriptions: { en: 'Scalable Node.js framework for enterprise applications', th: 'เฟรมเวิร์ก Node.js ที่ขยายได้สำหรับแอปพลิเคชันองค์กร', ja: 'エンタープライズアプリケーション用のスケーラブルNode.jsフレームワーク' } },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', url: 'https://expressjs.com', descriptions: { en: 'Minimal and flexible Node.js web framework', th: 'เฟรมเวิร์กเว็บ Node.js ที่เรียบง่ายและยืดหยุ่น', ja: 'ミニマルで柔軟なNode.js Webフレームワーク' } },
      { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', url: 'https://www.prisma.io', descriptions: { en: 'Next-generation ORM for type-safe database access', th: 'ORM รุ่นใหม่สำหรับการเข้าถึงฐานข้อมูลแบบ type-safe', ja: 'タイプセーフなデータベースアクセスのための次世代ORM' } },
      { name: 'Bun', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg', url: 'https://bun.sh', descriptions: { en: 'Fast all-in-one JavaScript runtime, bundler, and package manager', th: 'JavaScript runtime, bundler และ package manager ที่รวดเร็วในเครื่องมือเดียว', ja: '高速なオールインワンJavaScriptランタイム、バンドラー、パッケージマネージャー' } },
      { name: 'Elysia', icon: 'https://elysiajs.com/assets/elysia.svg', url: 'https://elysiajs.com', descriptions: { en: 'Ergonomic web framework for Bun with end-to-end type safety', th: 'เว็บเฟรมเวิร์กสำหรับ Bun ที่ใช้งานง่ายพร้อม type safety ครบวงจร', ja: 'エンドツーエンドの型安全性を備えたBun用の使いやすいWebフレームワーク' } },
   ],
   database: [
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', url: 'https://www.postgresql.org', descriptions: { en: 'Advanced open-source relational database system', th: 'ระบบฐานข้อมูลเชิงสัมพันธ์แบบโอเพนซอร์สขั้นสูง', ja: '高度なオープンソースリレーショナルデータベースシステム' } },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com', descriptions: { en: 'Popular relational database management system', th: 'ระบบจัดการฐานข้อมูลเชิงสัมพันธ์ที่ได้รับความนิยม', ja: '人気のリレーショナルデータベース管理システム' } },
   ],
   devtools: [
      { name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg', url: 'https://postman.com', descriptions: { en: 'API development and testing platform', th: 'แพลตฟอร์มสำหรับพัฒนาและทดสอบ API', ja: 'API開発・テストプラットフォーム' } },
      { name: 'Bruno', icon: 'https://cdn.simpleicons.org/bruno', url: 'https://www.usebruno.com', descriptions: { en: 'Open-source API client for exploring and testing APIs', th: 'API client แบบ open-source สำหรับสำรวจและทดสอบ API', ja: 'APIの探索とテストのためのオープンソースAPIクライアント' } },
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', url: 'https://git-scm.com', descriptions: { en: 'Distributed version control system for tracking code changes', th: 'ระบบควบคุมเวอร์ชันแบบ distributed สำหรับติดตามการเปลี่ยนแปลงโค้ด', ja: 'コードの変更を追跡するための分散バージョン管理システム' } },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com', descriptions: { en: 'Version control and collaboration platform', th: 'แพลตฟอร์มสำหรับควบคุมเวอร์ชันและร่วมงาน', ja: 'バージョン管理・コラボレーションプラットフォーム' } },
      { name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg', url: 'https://visualstudio.microsoft.com', descriptions: { en: 'Comprehensive IDE for .NET development', th: 'IDE ที่ครบครันสำหรับพัฒนา .NET', ja: '.NET開発用の包括的なIDE' } },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', url: 'https://code.visualstudio.com', descriptions: { en: 'Lightweight yet powerful source code editor', th: 'โปรแกรมแก้ไขโค้ดที่เบาแต่ทรงพลัง', ja: '軽量でありながら強力なソースコードエディタ' } },
      { name: 'SonarQube', icon: '/icons/skills/sonarqube.svg', url: 'https://www.sonarsource.com/products/sonarqube', descriptions: { en: 'Code quality and security analysis platform', th: 'แพลตฟอร์มวิเคราะห์คุณภาพโค้ดและความปลอดภัย', ja: 'コード品質とセキュリティ分析プラットフォーム' } },
      { name: 'ESLint', icon: '/icons/skills/eslint.webp', url: 'https://eslint.org', descriptions: { en: 'Pluggable linter for identifying and fixing JavaScript/TypeScript issues', th: 'เครื่องมือ linter สำหรับตรวจจับและแก้ไขปัญหาในโค้ด JavaScript/TypeScript', ja: 'JavaScript/TypeScriptの問題を検出・修正するプラガブルなリンター' } },
      { name: 'Prettier', icon: '/icons/skills/prettier.svg', url: 'https://prettier.io', descriptions: { en: 'Opinionated code formatter for consistent code style', th: 'เครื่องมือจัดรูปแบบโค้ดอัตโนมัติเพื่อความสม่ำเสมอของสไตล์โค้ด', ja: '一貫したコードスタイルのための意見の強いコードフォーマッター' } },
      { name: 'Sentry', icon: '/icons/skills/sentry.jpeg', url: 'https://sentry.io', descriptions: { en: 'Application monitoring platform for error tracking and performance', th: 'แพลตฟอร์มติดตามข้อผิดพลาดและประสิทธิภาพของแอปพลิเคชัน', ja: 'エラートラッキングとパフォーマンス監視のためのアプリケーション監視プラットフォーム' } },
      { name: 'Obsidian', icon: 'https://cdn.simpleicons.org/obsidian', url: 'https://obsidian.md', descriptions: { en: 'Knowledge base and note-taking app with powerful linking capabilities', th: 'แอปจดบันทึกและจัดการความรู้ที่มีความสามารถในการเชื่อมโยงที่ทรงพลัง', ja: '強力なリンク機能を持つナレッジベースとノート作成アプリ' } },
      { name: 'DBeaver', icon: 'https://dbeaver.io/wp-content/uploads/2015/09/beaver-head.png', url: 'https://dbeaver.io', descriptions: { en: 'Universal database management and SQL client tool', th: 'เครื่องมือจัดการฐานข้อมูลและ SQL client แบบ universal', ja: '汎用データベース管理・SQLクライアントツール' } },
   ],
   ai: [
      { name: 'Claude', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg', url: 'https://claude.ai', descriptions: { en: "Anthropic's AI assistant for analysis, writing, and coding", th: 'AI assistant ของ Anthropic สำหรับวิเคราะห์ เขียน และเขียนโค้ด', ja: '分析、ライティング、コーディングのためのAnthropicのAIアシスタント' } },
      { name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/960px-ChatGPT-Logo.svg.png', url: 'https://chatgpt.com', descriptions: { en: "OpenAI's conversational AI for productivity and creativity", th: 'AI สนทนาของ OpenAI สำหรับเพิ่มประสิทธิภาพและความคิดสร้างสรรค์', ja: '生産性と創造性のためのOpenAIの会話型AI' } },
      { name: 'Openclaw', icon: 'https://assets.zonalogo.com/technology/openclaw.ai/logo-dark-1774244116749.svg', url: 'https://openclaw.ai', descriptions: { en: 'AI-powered platform for legal and document analysis', th: 'แพลตฟอร์ม AI สำหรับวิเคราะห์เอกสารและงานด้านกฎหมาย', ja: 'AIを活用した法律・文書分析プラットフォーム' } },
   ],
   infrastructure: [
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', url: 'https://supabase.com', descriptions: { en: 'Open-source Firebase alternative with PostgreSQL', th: 'ทางเลือก Firebase แบบโอเพนซอร์สที่ใช้ PostgreSQL', ja: 'PostgreSQLを使用したオープンソースのFirebase代替' } },
      { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', url: 'https://vercel.com', descriptions: { en: 'Platform for frontend frameworks and static sites', th: 'แพลตฟอร์มสำหรับเฟรมเวิร์กหน้าบ้านและเว็บไซต์แบบสแตติก', ja: 'フロントエンドフレームワークと静的サイトのプラットフォーム' } },
      { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', url: 'https://netlify.com', descriptions: { en: 'All-in-one platform for modern web projects', th: 'แพลตฟอร์มครบเครื่องสำหรับโปรเจกต์เว็บสมัยใหม่', ja: '現代的なWebプロジェクトのためのオールインワンプラットフォーム' } },
      { name: 'Cloudflare', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg', url: 'https://cloudflare.com', descriptions: { en: 'Global CDN and web security platform', th: 'แพลตฟอร์ม CDN และความปลอดภัยเว็บระดับโลก', ja: 'グローバルCDNとWebセキュリティプラットフォーム' } },
      { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', url: 'https://aws.amazon.com', descriptions: { en: 'Comprehensive cloud computing platform for scalable applications', th: 'แพลตฟอร์ม cloud computing ครบวงจรสำหรับแอปพลิเคชันที่ขยายได้', ja: 'スケーラブルなアプリケーション向けの包括的なクラウドコンピューティングプラットフォーム' } },
      { name: 'Railway', icon: 'https://cdn.simpleicons.org/railway', url: 'https://railway.app', descriptions: { en: 'Simple cloud platform for deploying and scaling applications', th: 'แพลตฟอร์ม cloud ที่ใช้งานง่ายสำหรับ deploy และ scale แอปพลิเคชัน', ja: 'アプリケーションのデプロイとスケーリングのためのシンプルなクラウドプラットフォーム' } },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', url: 'https://www.docker.com', descriptions: { en: 'Platform for building and running containerized applications', th: 'แพลตฟอร์มสำหรับสร้างและรันแอปพลิเคชันแบบ container', ja: 'コンテナ化されたアプリケーションの構築と実行のためのプラットフォーム' } },
      { name: 'ArgoCD', icon: 'https://cdn.simpleicons.org/argo', url: 'https://argoproj.github.io/cd', descriptions: { en: 'GitOps continuous delivery tool for Kubernetes', th: 'เครื่องมือ GitOps continuous delivery สำหรับ Kubernetes', ja: 'Kubernetes向けのGitOps継続的デリバリーツール' } },
      { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', url: 'https://www.linux.org', descriptions: { en: 'Open-source operating system for server and development environments', th: 'ระบบปฏิบัติการ open-source สำหรับ server และสภาพแวดล้อมการพัฒนา', ja: 'サーバーと開発環境のためのオープンソースOS' } },
      { name: 'VPS', icon: 'https://cdn-icons-png.freepik.com/512/4731/4731530.png', url: 'https://en.wikipedia.org/wiki/Virtual_private_server', descriptions: { en: 'Virtual Private Server management for hosting and deploying applications', th: 'การจัดการ Virtual Private Server สำหรับ host และ deploy แอปพลิเคชัน', ja: 'アプリケーションのホスティングとデプロイのためのVPS管理' } },
      { name: 'VM', icon: 'https://az-icons.com/export/icons/309920908febbbaef8beb77510228f10.svg', url: 'https://en.wikipedia.org/wiki/Virtual_machine', descriptions: { en: 'Virtual Machine setup and management for isolated environments', th: 'การตั้งค่าและจัดการ Virtual Machine สำหรับสภาพแวดล้อมแบบ isolated', ja: '分離された環境のための仮想マシンのセットアップと管理' } },
      { name: 'VirtualBox', icon: 'https://cdn.simpleicons.org/virtualbox', url: 'https://www.virtualbox.org', descriptions: { en: 'Free open-source virtualization software for running multiple OS', th: 'ซอฟต์แวร์ virtualization แบบ open-source สำหรับรันหลาย OS พร้อมกัน', ja: '複数のOSを実行するための無料オープンソース仮想化ソフトウェア' } },
   ],
   business: [
      { name: 'Zoho Desk', icon: '/icons/skills/zoho-desk.svg', url: 'https://www.zoho.com/desk', descriptions: { en: 'Cloud-based helpdesk and CRM platform for customer support', th: 'แพลตฟอร์ม helpdesk และ CRM บนคลาวด์สำหรับงานซัพพอร์ตลูกค้า', ja: 'カスタマーサポート向けのクラウドベースのヘルプデスク・CRMプラットフォーム' } },
      { name: 'Zoho CRM', icon: '/icons/skills/zoho-crm.svg', url: 'https://www.zoho.com/crm', descriptions: { en: 'Cloud-based CRM platform for sales, marketing, and customer management', th: 'แพลตฟอร์ม CRM บนคลาวด์สำหรับงานขาย การตลาด และบริหารความสัมพันธ์ลูกค้า', ja: '営業・マーケティング・顧客管理のためのクラウドベースCRMプラットフォーム' } },
   ],
} as const

async function main() {
   const existing = await prisma.category.count()
   if (existing > 0) {
      console.log(`Skipping: ${existing} category(ies) already exist. Delete them first if you want to reseed.`)
      return
   }

   let categoryOrder = 0
   for (const [key, skills] of Object.entries(skillsByCategory)) {
      const category = await prisma.category.create({
         data: { name: categoryNames[key], order: categoryOrder++ },
      })

      let skillOrder = 0
      for (const skill of skills) {
         await prisma.skill.create({
            data: {
               name: skill.name,
               icon: skill.icon,
               url: skill.url,
               description: skill.descriptions,
               categoryId: category.id,
               order: skillOrder++,
               featured: false,
            },
         })
      }
      console.log(`Seeded category "${key}" with ${skills.length} skills`)
   }
}

main()
   .then(() => prisma.$disconnect())
   .catch(async (err) => {
      console.error(err)
      await prisma.$disconnect()
      process.exit(1)
   })
