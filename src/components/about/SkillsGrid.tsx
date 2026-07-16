'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'
import AnimatedSection from '../ui/AnimatedSection'

gsap.registerPlugin(ScrollTrigger)

interface SkillsGridProps {
   translations: any
}

// แยกหมวดหมู่ skills with multilingual descriptions
const skillsByCategory = {
   frontend: [
      {
         name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
         descriptions: {
            en: 'Dynamic programming language for interactive web applications',
            th: 'ภาษาโปรแกรมมิ่งแบบไดนามิกสำหรับแอปพลิเคชันเว็บแบบอินเทอร์แอคทีฟ',
            ja: 'インタラクティブなWebアプリケーション用の動的プログラミング言語'
         }
      },
      {
         name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org',
         descriptions: {
            en: 'Strongly typed JavaScript for scalable applications',
            th: 'JavaScript ที่มีการกำหนดประเภทข้อมูลสำหรับแอปพลิเคชันขนาดใหญ่',
            ja: 'スケーラブルなアプリケーション用の強く型付けされたJavaScript'
         }
      },
      {
         name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', url: 'https://dart.dev',
         descriptions: {
            en: 'Client-optimized language for mobile and web apps',
            th: 'ภาษาที่ปรับแต่งสำหรับแอปมือถือและเว็บ',
            ja: 'モバイルとWebアプリ用にクライアント最適化された言語'
         }
      },
      {
         name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
         descriptions: {
            en: 'Styling language for creating beautiful web interfaces',
            th: 'ภาษาสำหรับจัดรูปแบบเว็บไซต์ให้สวยงาม',
            ja: '美しいWebインターフェースを作成するためのスタイリング言語'
         }
      },
      {
         name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
         descriptions: {
            en: 'Markup language for structuring web content',
            th: 'ภาษามาร์กอัปสำหรับจัดโครงสร้างเนื้อหาเว็บ',
            ja: 'Webコンテンツの構造化のためのマークアップ言語'
         }
      },
      {
         name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org',
         descriptions: {
            en: 'React framework for production-ready applications',
            th: 'เฟรมเวิร์ก React สำหรับแอปพลิเคชันที่พร้อมใช้งานจริง',
            ja: 'プロダクションレディなアプリケーション用のReactフレームワーク'
         }
      },
      {
         name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', url: 'https://flutter.dev',
         descriptions: {
            en: 'UI toolkit for cross-platform mobile applications',
            th: 'ชุดเครื่องมือ UI สำหรับแอปมือถือข้ามแพลตฟอร์ม',
            ja: 'クロスプラットフォームモバイルアプリケーション用のUIツールキット'
         }
      },
      {
         name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', url: 'https://tailwindcss.com',
         descriptions: {
            en: 'Utility-first CSS framework for rapid UI development',
            th: 'เฟรมเวิร์ก CSS แบบ utility-first สำหรับพัฒนา UI อย่างรวดเร็ว',
            ja: '高速UI開発のためのユーティリティファーストCSSフレームワーク'
         }
      }
   ],
   backend: [
      {
         name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org',
         descriptions: {
            en: 'JavaScript runtime for server-side development',
            th: 'รันไทม์ JavaScript สำหรับพัฒนาฝั่งเซิร์ฟเวอร์',
            ja: 'サーバーサイド開発用のJavaScriptランタイム'
         }
      },
      {
         name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://python.org',
         descriptions: {
            en: 'Versatile programming language for web and data science',
            th: 'ภาษาโปรแกรมมิ่งที่หลากหลายสำหรับเว็บและวิทยาศาสตร์ข้อมูล',
            ja: 'Webとデータサイエンスのための多用途プログラミング言語'
         }
      },
      {
         name: 'Nest.js', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/NestJS.svg', url: 'https://nestjs.com',
         descriptions: {
            en: 'Scalable Node.js framework for enterprise applications',
            th: 'เฟรมเวิร์ก Node.js ที่ขยายได้สำหรับแอปพลิเคชันองค์กร',
            ja: 'エンタープライズアプリケーション用のスケーラブルNode.jsフレームワーク'
         }
      },
      {
         name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', url: 'https://expressjs.com',
         descriptions: {
            en: 'Minimal and flexible Node.js web framework',
            th: 'เฟรมเวิร์กเว็บ Node.js ที่เรียบง่ายและยืดหยุ่น',
            ja: 'ミニマルで柔軟なNode.js Webフレームワーク'
         }
      },
      {
         name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', url: 'https://www.prisma.io',
         descriptions: {
            en: 'Next-generation ORM for type-safe database access',
            th: 'ORM รุ่นใหม่สำหรับการเข้าถึงฐานข้อมูลแบบ type-safe',
            ja: 'タイプセーフなデータベースアクセスのための次世代ORM'
         }
      },
      {
         name: 'Bun', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg', url: 'https://bun.sh',
         descriptions: {
            en: 'Fast all-in-one JavaScript runtime, bundler, and package manager',
            th: 'JavaScript runtime, bundler และ package manager ที่รวดเร็วในเครื่องมือเดียว',
            ja: '高速なオールインワンJavaScriptランタイム、バンドラー、パッケージマネージャー'
         }
      },
      {
         name: 'Elysia', icon: 'https://elysiajs.com/assets/elysia.svg', url: 'https://elysiajs.com',
         descriptions: {
            en: 'Ergonomic web framework for Bun with end-to-end type safety',
            th: 'เว็บเฟรมเวิร์กสำหรับ Bun ที่ใช้งานง่ายพร้อม type safety ครบวงจร',
            ja: 'エンドツーエンドの型安全性を備えたBun用の使いやすいWebフレームワーク'
         }
      }
   ],
   database: [
      {
         name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', url: 'https://www.postgresql.org',
         descriptions: {
            en: 'Advanced open-source relational database system',
            th: 'ระบบฐานข้อมูลเชิงสัมพันธ์แบบโอเพนซอร์สขั้นสูง',
            ja: '高度なオープンソースリレーショナルデータベースシステム'
         }
      },
      {
         name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com',
         descriptions: {
            en: 'Popular relational database management system',
            th: 'ระบบจัดการฐานข้อมูลเชิงสัมพันธ์ที่ได้รับความนิยม',
            ja: '人気のリレーショナルデータベース管理システム'
         }
      }
   ],
   devtools: [
      {
         name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg', url: 'https://postman.com',
         descriptions: {
            en: 'API development and testing platform',
            th: 'แพลตฟอร์มสำหรับพัฒนาและทดสอบ API',
            ja: 'API開発・テストプラットフォーム'
         }
      },
      {
         name: 'Bruno', icon: 'https://cdn.simpleicons.org/bruno', url: 'https://www.usebruno.com',
         descriptions: {
            en: 'Open-source API client for exploring and testing APIs',
            th: 'API client แบบ open-source สำหรับสำรวจและทดสอบ API',
            ja: 'APIの探索とテストのためのオープンソースAPIクライアント'
         }
      },
      {
         name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', url: 'https://git-scm.com',
         descriptions: {
            en: 'Distributed version control system for tracking code changes',
            th: 'ระบบควบคุมเวอร์ชันแบบ distributed สำหรับติดตามการเปลี่ยนแปลงโค้ด',
            ja: 'コードの変更を追跡するための分散バージョン管理システム'
         }
      },
      {
         name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com',
         descriptions: {
            en: 'Version control and collaboration platform',
            th: 'แพลตฟอร์มสำหรับควบคุมเวอร์ชันและร่วมงาน',
            ja: 'バージョン管理・コラボレーションプラットフォーム'
         }
      },
      {
         name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg', url: 'https://visualstudio.microsoft.com',
         descriptions: {
            en: 'Comprehensive IDE for .NET development',
            th: 'IDE ที่ครบครันสำหรับพัฒนา .NET',
            ja: '.NET開発用の包括的なIDE'
         }
      },
      {
         name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', url: 'https://code.visualstudio.com',
         descriptions: {
            en: 'Lightweight yet powerful source code editor',
            th: 'โปรแกรมแก้ไขโค้ดที่เบาแต่ทรงพลัง',
            ja: '軽量でありながら強力なソースコードエディタ'
         }
      },
      {
         name: 'SonarQube', icon: '/icons/skills/sonarqube.svg', url: 'https://www.sonarsource.com/products/sonarqube',
         descriptions: {
            en: 'Code quality and security analysis platform',
            th: 'แพลตฟอร์มวิเคราะห์คุณภาพโค้ดและความปลอดภัย',
            ja: 'コード品質とセキュリティ分析プラットフォーム'
         }
      },
      {
         name: 'ESLint', icon: '/icons/skills/eslint.webp', url: 'https://eslint.org',
         descriptions: {
            en: 'Pluggable linter for identifying and fixing JavaScript/TypeScript issues',
            th: 'เครื่องมือ linter สำหรับตรวจจับและแก้ไขปัญหาในโค้ด JavaScript/TypeScript',
            ja: 'JavaScript/TypeScriptの問題を検出・修正するプラガブルなリンター'
         }
      },
      {
         name: 'Prettier', icon: '/icons/skills/prettier.svg', url: 'https://prettier.io',
         descriptions: {
            en: 'Opinionated code formatter for consistent code style',
            th: 'เครื่องมือจัดรูปแบบโค้ดอัตโนมัติเพื่อความสม่ำเสมอของสไตล์โค้ด',
            ja: '一貫したコードスタイルのための意見の強いコードフォーマッター'
         }
      },
      {
         name: 'Sentry', icon: '/icons/skills/sentry.jpeg', url: 'https://sentry.io',
         descriptions: {
            en: 'Application monitoring platform for error tracking and performance',
            th: 'แพลตฟอร์มติดตามข้อผิดพลาดและประสิทธิภาพของแอปพลิเคชัน',
            ja: 'エラートラッキングとパフォーマンス監視のためのアプリケーション監視プラットフォーム'
         }
      },
      {
         name: 'Obsidian', icon: 'https://cdn.simpleicons.org/obsidian', url: 'https://obsidian.md',
         descriptions: {
            en: 'Knowledge base and note-taking app with powerful linking capabilities',
            th: 'แอปจดบันทึกและจัดการความรู้ที่มีความสามารถในการเชื่อมโยงที่ทรงพลัง',
            ja: '強力なリンク機能を持つナレッジベースとノート作成アプリ'
         }
      },
      {
         name: 'DBeaver', icon: 'https://dbeaver.io/wp-content/uploads/2015/09/beaver-head.png', url: 'https://dbeaver.io',
         descriptions: {
            en: 'Universal database management and SQL client tool',
            th: 'เครื่องมือจัดการฐานข้อมูลและ SQL client แบบ universal',
            ja: '汎用データベース管理・SQLクライアントツール'
         }
      }
   ],
   ai: [
      {
         name: 'Claude', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg', url: 'https://claude.ai',
         descriptions: {
            en: "Anthropic's AI assistant for analysis, writing, and coding",
            th: 'AI assistant ของ Anthropic สำหรับวิเคราะห์ เขียน และเขียนโค้ด',
            ja: '分析、ライティング、コーディングのためのAnthropicのAIアシスタント'
         }
      },
      {
         name: 'ChatGPT', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/960px-ChatGPT-Logo.svg.png', url: 'https://chatgpt.com',
         descriptions: {
            en: "OpenAI's conversational AI for productivity and creativity",
            th: 'AI สนทนาของ OpenAI สำหรับเพิ่มประสิทธิภาพและความคิดสร้างสรรค์',
            ja: '生産性と創造性のためのOpenAIの会話型AI'
         }
      },
      {
         name: 'Openclaw', icon: 'https://assets.zonalogo.com/technology/openclaw.ai/logo-dark-1774244116749.svg', url: 'https://openclaw.ai',
         descriptions: {
            en: 'AI-powered platform for legal and document analysis',
            th: 'แพลตฟอร์ม AI สำหรับวิเคราะห์เอกสารและงานด้านกฎหมาย',
            ja: 'AIを活用した法律・文書分析プラットフォーム'
         }
      },
   ],
   infrastructure: [
      {
         name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', url: 'https://supabase.com',
         descriptions: {
            en: 'Open-source Firebase alternative with PostgreSQL',
            th: 'ทางเลือก Firebase แบบโอเพนซอร์สที่ใช้ PostgreSQL',
            ja: 'PostgreSQLを使用したオープンソースのFirebase代替'
         }
      },
      {
         name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', url: 'https://vercel.com',
         descriptions: {
            en: 'Platform for frontend frameworks and static sites',
            th: 'แพลตฟอร์มสำหรับเฟรมเวิร์กหน้าบ้านและเว็บไซต์แบบสแตติก',
            ja: 'フロントエンドフレームワークと静的サイトのプラットフォーム'
         }
      },
      {
         name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', url: 'https://netlify.com',
         descriptions: {
            en: 'All-in-one platform for modern web projects',
            th: 'แพลตฟอร์มครบเครื่องสำหรับโปรเจกต์เว็บสมัยใหม่',
            ja: '現代的なWebプロジェクトのためのオールインワンプラットフォーム'
         }
      },
      {
         name: 'Cloudflare', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg', url: 'https://cloudflare.com',
         descriptions: {
            en: 'Global CDN and web security platform',
            th: 'แพลตฟอร์ม CDN และความปลอดภัยเว็บระดับโลก',
            ja: 'グローバルCDNとWebセキュリティプラットフォーム'
         }
      },
      {
         name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', url: 'https://aws.amazon.com',
         descriptions: {
            en: 'Comprehensive cloud computing platform for scalable applications',
            th: 'แพลตฟอร์ม cloud computing ครบวงจรสำหรับแอปพลิเคชันที่ขยายได้',
            ja: 'スケーラブルなアプリケーション向けの包括的なクラウドコンピューティングプラットフォーム'
         }
      },
      {
         name: 'Railway', icon: 'https://cdn.simpleicons.org/railway', url: 'https://railway.app',
         descriptions: {
            en: 'Simple cloud platform for deploying and scaling applications',
            th: 'แพลตฟอร์ม cloud ที่ใช้งานง่ายสำหรับ deploy และ scale แอปพลิเคชัน',
            ja: 'アプリケーションのデプロイとスケーリングのためのシンプルなクラウドプラットフォーム'
         }
      },
      {
         name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', url: 'https://www.docker.com',
         descriptions: {
            en: 'Platform for building and running containerized applications',
            th: 'แพลตฟอร์มสำหรับสร้างและรันแอปพลิเคชันแบบ container',
            ja: 'コンテナ化されたアプリケーションの構築と実行のためのプラットフォーム'
         }
      },
      {
         name: 'ArgoCD', icon: 'https://cdn.simpleicons.org/argo', url: 'https://argoproj.github.io/cd',
         descriptions: {
            en: 'GitOps continuous delivery tool for Kubernetes',
            th: 'เครื่องมือ GitOps continuous delivery สำหรับ Kubernetes',
            ja: 'Kubernetes向けのGitOps継続的デリバリーツール'
         }
      },
      {
         name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', url: 'https://www.linux.org',
         descriptions: {
            en: 'Open-source operating system for server and development environments',
            th: 'ระบบปฏิบัติการ open-source สำหรับ server และสภาพแวดล้อมการพัฒนา',
            ja: 'サーバーと開発環境のためのオープンソースOS'
         }
      },
      {
         name: 'VPS', icon: 'https://cdn-icons-png.freepik.com/512/4731/4731530.png', url: 'https://en.wikipedia.org/wiki/Virtual_private_server',
         descriptions: {
            en: 'Virtual Private Server management for hosting and deploying applications',
            th: 'การจัดการ Virtual Private Server สำหรับ host และ deploy แอปพลิเคชัน',
            ja: 'アプリケーションのホスティングとデプロイのためのVPS管理'
         }
      },
      {
         name: 'VM', icon: 'https://az-icons.com/export/icons/309920908febbbaef8beb77510228f10.svg', url: 'https://en.wikipedia.org/wiki/Virtual_machine',
         descriptions: {
            en: 'Virtual Machine setup and management for isolated environments',
            th: 'การตั้งค่าและจัดการ Virtual Machine สำหรับสภาพแวดล้อมแบบ isolated',
            ja: '分離された環境のための仮想マシンのセットアップと管理'
         }
      },
      {
         name: 'VirtualBox', icon: 'https://cdn.simpleicons.org/virtualbox', url: 'https://www.virtualbox.org',
         descriptions: {
            en: 'Free open-source virtualization software for running multiple OS',
            th: 'ซอฟต์แวร์ virtualization แบบ open-source สำหรับรันหลาย OS พร้อมกัน',
            ja: '複数のOSを実行するための無料オープンソース仮想化ソフトウェア'
         }
      }
   ],
   business: [
      {
         name: 'Zoho Desk', icon: '/icons/skills/zoho-desk.svg', url: 'https://www.zoho.com/desk',
         descriptions: {
            en: 'Cloud-based helpdesk and CRM platform for customer support',
            th: 'แพลตฟอร์ม helpdesk และ CRM บนคลาวด์สำหรับงานซัพพอร์ตลูกค้า',
            ja: 'カスタマーサポート向けのクラウドベースのヘルプデスク・CRMプラットフォーム'
         }
      },
      {
         name: 'Zoho CRM', icon: '/icons/skills/zoho-crm.svg', url: 'https://www.zoho.com/crm',
         descriptions: {
            en: 'Cloud-based CRM platform for sales, marketing, and customer management',
            th: 'แพลตฟอร์ม CRM บนคลาวด์สำหรับงานขาย การตลาด และบริหารความสัมพันธ์ลูกค้า',
            ja: '営業・マーケティング・顧客管理のためのクラウドベースCRMプラットフォーム'
         }
      }
   ]
}

export default function SkillsGrid({ translations }: SkillsGridProps) {
   const [locale, setLocale] = useState('en')

   const skillsRef = useRef<HTMLDivElement>(null)
   const categoryGridRefs = useRef<(HTMLDivElement | null)[]>([])
   const headerRef = useRef<HTMLDivElement>(null)
   const titleRef = useRef<HTMLHeadingElement>(null)
   const subtitleRef = useRef<HTMLParagraphElement>(null)
   const learningRef = useRef<HTMLParagraphElement>(null)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

   // Helper function to get translations based on locale
   const getTranslations = (locale: string) => {
      switch (locale) {
         case 'th':
            return th
         case 'ja':
            return ja
         default:
            return en
      }
   }

   const currentTranslations = translations || getTranslations(locale)

   // Language change handler
   useEffect(() => {
      setLocale(localStorage.getItem('lang') || 'en')
      const handleLanguageChange = (e: any) => setLocale(e.detail.language)
      window.addEventListener('languageChange', handleLanguageChange)
      return () => window.removeEventListener('languageChange', handleLanguageChange)
   }, [])

   const categoryKeys = Object.keys(skillsByCategory) as (keyof typeof skillsByCategory)[]

   useEffect(() => {
      if (!skillsRef.current) return
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())

      if (headerRef.current && titleRef.current && subtitleRef.current) {
         const tl = gsap.timeline({
            scrollTrigger: {
               trigger: headerRef.current,
               start: 'top 85%',
               toggleActions: 'play none none none',
            }
         })
         tl.fromTo(titleRef.current, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' })
         tl.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      }

      categoryGridRefs.current.forEach(grid => {
         if (!grid) return
         const cards = grid.querySelectorAll('.skill-card-container')
         gsap.fromTo(grid, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' } })
         gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' } })
      })

      if (learningRef.current) {
         gsap.fromTo(learningRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: learningRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
      }

      return () => {
         ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
   }, [locale])

   // Mouse tracking for background elements
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent): void => {
         if (skillsRef.current) {
            const rect = skillsRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height
            setMousePosition({ x: x * 10, y: y * 10 })
         }
      }

      const section = skillsRef.current
      if (section) {
         section.addEventListener('mousemove', handleMouseMove)
         return () => section.removeEventListener('mousemove', handleMouseMove)
      }
   }, [])

   const getLearnMoreText = (locale: string) => {
      switch (locale) {
         case 'th':
            return 'เรียนรู้เพิ่มเติม'
         case 'ja':
            return 'もっと学ぶ'
         default:
            return 'Learn More'
      }
   }

   return (
      <section ref={skillsRef} className="py-16 mb-16 relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
         {/* Floating background elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
               className="absolute top-20 left-10 w-20 h-20 rounded-full floating-element"
               style={{
                  transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                  animationDelay: '0s'
               }}
            />
            <div
               className="absolute bottom-32 right-20 w-16 h-16 floating-element"
               style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                  animationDelay: '1s'
               }}
            />
            <div
               className="absolute top-1/2 right-1/4 w-12 h-12 floating-element"
               style={{
                  clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                  transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                  animationDelay: '2s'
               }}
            />
         </div>
         <div className="max-w-6xl mx-auto px-8 relative z-10">
            <AnimatedSection animationType="fadeInUp" delay={0} duration={1}>
               <div ref={headerRef} className="text-center mb-16">
                  <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                     {currentTranslations?.about?.skills?.title || 'Technical Skills & Expertise'}
                  </h2>
                  <p ref={subtitleRef} className="text-lg opacity-70" style={{ color: 'var(--muted-foreground)' }}>
                     {currentTranslations?.about?.skills?.subtitle || 'Technologies and tools I work with'}
                  </p>
               </div>
            </AnimatedSection>

            {categoryKeys.map((category, categoryIndex) => (
               <AnimatedSection
                  key={category}
                  animationType="fadeInUp"
                  delay={0}
                  duration={0.8}
               >
                  <div className="mb-12">
                     <h3
                        className="text-2xl font-semibold mb-6 capitalize text-center"
                        style={{ color: 'var(--foreground)' }}
                     >
                        {category}
                     </h3>
                     <div
                        ref={el => { categoryGridRefs.current[categoryIndex] = el }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-6"
                     >
                        {skillsByCategory[category].map((skill, skillIndex) => (
                           <div
                              key={skillIndex}
                              className="skill-card-container cursor-pointer"
                           >
                                    <div className="skill-card flip-card">
                                       {/* Front of the card */}
                                       <div
                                          className="flip-card-front"
                                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                                       >
                                          <div className="w-12 h-12 lg:w-24 lg:h-24 flex items-center justify-center mb-2 lg:mb-6">
                                             <img
                                                src={skill.icon}
                                                alt={skill.name}
                                                className="w-full h-full object-contain transition-all duration-300"
                                                onError={e => {
                                                   e.currentTarget.style.display = 'none'
                                                   if (e.currentTarget.parentElement) {
                                                      e.currentTarget.parentElement.innerHTML = `
                             <div style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; color: var(--muted-foreground); font-weight: bold; font-size: 24px; background: var(--muted); border-radius: 8px;">
                               ${skill.name.charAt(0)}
                             </div>
                           `
                                                   }
                                                }}
                                             />
                                          </div>
                                          <h3
                                             className="text-[10px] md:text-xl font-semibold"
                                             style={{ color: 'var(--foreground)' }}
                                          >
                                             {skill.name}
                                          </h3>
                                       </div>

                                       {/* Back of the card */}
                                       <div
                                          className="flip-card-back"
                                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                                       >
                                          <h3
                                             className="text-[10px] md:text-xs lg:text-xl font-bold mb-1 lg:mb-4"
                                             style={{ color: 'var(--foreground)' }}
                                          >
                                             {skill.name}
                                          </h3>
                                          <p
                                             className="text-[9px] md:text-xs lg:text-sm mb-1 md:mb-2 lg:mb-6 opacity-90 leading-tight lg:leading-relaxed"
                                             style={{ color: 'var(--muted-foreground)' }}
                                          >
                                             {skill.descriptions[locale as keyof typeof skill.descriptions] || skill.descriptions.en}
                                          </p>
                                          <button
                                             onClick={e => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                const newWindow = window.open(skill.url, '_blank')
                                                if (newWindow) newWindow.opener = null
                                             }}
                                             className="px-1.5 py-0.5 md:px-2 md:py-1 lg:px-4 lg:py-2 rounded-lg text-[9px] md:text-xs lg:text-sm font-medium transition-all duration-300 hover:scale-105"
                                             style={{
                                                backgroundColor: 'var(--foreground)',
                                                color: 'var(--background)'
                                             }}
                                          >
                                             {getLearnMoreText(locale)}
                                          </button>
                                       </div>
                                    </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </AnimatedSection>
            ))}
         </div>

         {/* Enhanced Styles */}
         <style jsx>{`
            @keyframes float {
               0%, 100% { transform: translateY(0px); }
               50% { transform: translateY(-8px); }
            }

            .floating-element {
               animation: float 3s ease-in-out infinite;
               background: var(--foreground) !important;
               opacity: 0.05;
            }

            /* Simple working flip card */
            .skill-card-container {
               aspect-ratio: 1 / 1;
               perspective: 1000px;
               transition: transform 0.3s ease;
            }

            @media (min-width: 1024px) {
               .skill-card-container {
                  aspect-ratio: auto;
                  height: 280px;
               }
            }

            @media (min-width: 1024px) {
               .skill-card-container:hover {
                  transform: scale(1.1) translateY(-8px);
                  z-index: 10;
               }
            }

            .flip-card {
               position: relative;
               width: 100%;
               height: 100%;
               transition: transform 0.6s;
               transform-style: preserve-3d;
            }

            .skill-card-container:hover .flip-card {
               transform: rotateY(180deg);
            }

            .flip-card-front,
            .flip-card-back {
               position: absolute;
               width: 100%;
               height: 100%;
               -webkit-backface-visibility: hidden;
               backface-visibility: hidden;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               padding: 0.6rem;
               border-radius: 16px;
               border: 1px solid var(--border);
               text-align: center;
               box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
               overflow: hidden;
            }

            @media (min-width: 768px) {
               .flip-card-front,
               .flip-card-back {
                  padding: 1.25rem;
               }
            }

            @media (min-width: 1024px) {
               .flip-card-front,
               .flip-card-back {
                  padding: 2rem;
               }
            }

            .flip-card-front {
               background-color: var(--card);
               transform: rotateY(0deg);
            }

            .flip-card-back {
               transform: rotateY(180deg);
               background: linear-gradient(135deg, var(--card) 0%, var(--muted) 100%);
            }


            .skill-card-container:hover .flip-card-front,
            .skill-card-container:hover .flip-card-back {
               box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            }

            .flip-card-front > *,
            .flip-card-back > * {
               position: relative;
               z-index: 2;
            }

            [data-theme="dark"] .flip-card-front,
            [data-theme="dark"] .flip-card-back {
               box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            [data-theme="dark"] .skill-card-container:hover .flip-card-front,
            [data-theme="dark"] .skill-card-container:hover .flip-card-back {
               box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.15);
            }

            [data-theme="dark"] .flip-card-back {
               background: linear-gradient(135deg, var(--card) 0%, rgba(0, 0, 0, 0.2) 100%);
            }

            /* Force flip for all cards - fix for specific problematic cards */
            .skill-card-container .flip-card {
               transform: rotateY(0deg);
               transition: transform 0.6s ease-in-out;
            }
            
            .skill-card-container:hover .flip-card {
               transform: rotateY(180deg) !important;
            }

            /* Ensure all front and back cards have proper setup */
            .flip-card-front {
               transform: rotateY(0deg) !important;
               -webkit-backface-visibility: hidden !important;
               backface-visibility: hidden !important;
            }

            .flip-card-back {
               transform: rotateY(180deg) !important;
               -webkit-backface-visibility: hidden !important;
               backface-visibility: hidden !important;
            }

            /* Fix for infrastructure and specific problematic cards */
            .skill-card-container {
               perspective: 1000px !important;
               -webkit-perspective: 1000px !important;
            }

            .flip-card {
               transform-style: preserve-3d !important;
               -webkit-transform-style: preserve-3d !important;
            }
         `}</style>
      </section>
   )
}
