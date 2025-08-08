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
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org', 
        descriptions: {
          en: 'Strongly typed JavaScript for scalable applications',
          th: 'JavaScript ที่มีการกำหนดประเภทข้อมูลสำหรับแอปพลิเคชันขนาดใหญ่',
          ja: 'スケーラブルなアプリケーション用の強く型付けされたJavaScript'
        }
      },
      { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', url: 'https://dart.dev',
        descriptions: {
          en: 'Client-optimized language for mobile and web apps',
          th: 'ภาษาที่ปรับแต่งสำหรับแอปมือถือและเว็บ',
          ja: 'モバイルとWebアプリ用にクライアント最適化された言語'
        }
      },
      { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        descriptions: {
          en: 'Styling language for creating beautiful web interfaces',
          th: 'ภาษาสำหรับจัดรูปแบบเว็บไซต์ให้สวยงาม',
          ja: '美しいWebインターフェースを作成するためのスタイリング言語'
        }
      },
      { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        descriptions: {
          en: 'Markup language for structuring web content',
          th: 'ภาษามาร์กอัปสำหรับจัดโครงสร้างเนื้อหาเว็บ',
          ja: 'Webコンテンツの構造化のためのマークアップ言語'
        }
      },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org',
        descriptions: {
          en: 'React framework for production-ready applications',
          th: 'เฟรมเวิร์ก React สำหรับแอปพลิเคชันที่พร้อมใช้งานจริง',
          ja: 'プロダクションレディなアプリケーション用のReactフレームワーク'
        }
      },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', url: 'https://flutter.dev',
        descriptions: {
          en: 'UI toolkit for cross-platform mobile applications',
          th: 'ชุดเครื่องมือ UI สำหรับแอปมือถือข้ามแพลตฟอร์ม',
          ja: 'クロスプラットフォームモバイルアプリケーション用のUIツールキット'
        }
      },
      { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', url: 'https://tailwindcss.com',
        descriptions: {
          en: 'Utility-first CSS framework for rapid UI development',
          th: 'เฟรมเวิร์ก CSS แบบ utility-first สำหรับพัฒนา UI อย่างรวดเร็ว',
          ja: '高速UI開発のためのユーティリティファーストCSSフレームワーク'
        }
      }
   ],
   backend: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org',
        descriptions: {
          en: 'JavaScript runtime for server-side development',
          th: 'รันไทม์ JavaScript สำหรับพัฒนาฝั่งเซิร์ฟเวอร์',
          ja: 'サーバーサイド開発用のJavaScriptランタイム'
        }
      },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://python.org',
        descriptions: {
          en: 'Versatile programming language for web and data science',
          th: 'ภาษาโปรแกรมมิ่งที่หลากหลายสำหรับเว็บและวิทยาศาสตร์ข้อมูล',
          ja: 'Webとデータサイエンスのための多用途プログラミング言語'
        }
      },
      { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
        descriptions: {
          en: 'Object-oriented language for .NET applications',
          th: 'ภาษาเชิงวัตถุสำหรับแอปพลิเคชัน .NET',
          ja: '.NETアプリケーション用のオブジェクト指向言語'
        }
      },
      { name: 'Nest.js', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/NestJS.svg', url: 'https://nestjs.com',
        descriptions: {
          en: 'Scalable Node.js framework for enterprise applications',
          th: 'เฟรมเวิร์ก Node.js ที่ขยายได้สำหรับแอปพลิเคชันองค์กร',
          ja: 'エンタープライズアプリケーション用のスケーラブルNode.jsフレームワーク'
        }
      },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', url: 'https://expressjs.com',
        descriptions: {
          en: 'Minimal and flexible Node.js web framework',
          th: 'เฟรมเวิร์กเว็บ Node.js ที่เรียบง่ายและยืดหยุ่น',
          ja: 'ミニマルで柔軟なNode.js Webフレームワーク'
        }
      },
      { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', url: 'https://www.prisma.io',
        descriptions: {
          en: 'Next-generation ORM for type-safe database access',
          th: 'ORM รุ่นใหม่สำหรับการเข้าถึงฐานข้อมูลแบบ type-safe',
          ja: 'タイプセーフなデータベースアクセスのための次世代ORM'
        }
      }
   ],
   database: [
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', url: 'https://www.postgresql.org',
        descriptions: {
          en: 'Advanced open-source relational database system',
          th: 'ระบบฐานข้อมูลเชิงสัมพันธ์แบบโอเพนซอร์สขั้นสูง',
          ja: '高度なオープンソースリレーショナルデータベースシステム'
        }
      },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com',
        descriptions: {
          en: 'Popular relational database management system',
          th: 'ระบบจัดการฐานข้อมูลเชิงสัมพันธ์ที่ได้รับความนิยม',
          ja: '人気のリレーショナルデータベース管理システム'
        }
      }
   ],
   devtools: [
      { name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg', url: 'https://postman.com',
        descriptions: {
          en: 'API development and testing platform',
          th: 'แพลตฟอร์มสำหรับพัฒนาและทดสอบ API',
          ja: 'API開発・テストプラットフォーム'
        }
      },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com',
        descriptions: {
          en: 'Version control and collaboration platform',
          th: 'แพลตฟอร์มสำหรับควบคุมเวอร์ชันและร่วมงาน',
          ja: 'バージョン管理・コラボレーションプラットフォーム'
        }
      },
      { name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg', url: 'https://visualstudio.microsoft.com',
        descriptions: {
          en: 'Comprehensive IDE for .NET development',
          th: 'IDE ที่ครบครันสำหรับพัฒนา .NET',
          ja: '.NET開発用の包括的なIDE'
        }
      },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', url: 'https://code.visualstudio.com',
        descriptions: {
          en: 'Lightweight yet powerful source code editor',
          th: 'โปรแกรมแก้ไขโค้ดที่เบาแต่ทรงพลัง',
          ja: '軽量でありながら強力なソースコードエディタ'
        }
      }
   ],
   infrastructure: [
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', url: 'https://supabase.com',
        descriptions: {
          en: 'Open-source Firebase alternative with PostgreSQL',
          th: 'ทางเลือก Firebase แบบโอเพนซอร์สที่ใช้ PostgreSQL',
          ja: 'PostgreSQLを使用したオープンソースのFirebase代替'
        }
      },
      { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', url: 'https://vercel.com',
        descriptions: {
          en: 'Platform for frontend frameworks and static sites',
          th: 'แพลตฟอร์มสำหรับเฟรมเวิร์กหน้าบ้านและเว็บไซต์แบบสแตติก',
          ja: 'フロントエンドフレームワークと静的サイトのプラットフォーム'
        }
      },
      { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', url: 'https://netlify.com',
        descriptions: {
          en: 'All-in-one platform for modern web projects',
          th: 'แพลตฟอร์มครบเครื่องสำหรับโปรเจกต์เว็บสมัยใหม่',
          ja: '現代的なWebプロジェクトのためのオールインワンプラットフォーム'
        }
      }
   ]
}

export default function SkillsGrid({ translations }: SkillsGridProps) {
   const [locale, setLocale] = useState('en')

   const skillsRef = useRef<HTMLDivElement>(null)
   const rowRefs = useRef<(HTMLDivElement | null)[]>([])
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

   // แปลง object เป็น array สำหรับ render พร้อมแบ่ง row ละ 3 ตัวเหมือนเดิม
   const categoryKeys = Object.keys(skillsByCategory) as (keyof typeof skillsByCategory)[]

   const categorizedSkillRows = categoryKeys.map(category => {
      const skills = skillsByCategory[category]
      const rows = []
      for (let i = 0; i < skills.length; i += 3) {
         rows.push(skills.slice(i, i + 3))
      }
      return { category, rows }
   })

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

      rowRefs.current.forEach(row => {
         if (!row) return
         const cards = row.querySelectorAll('.skill-card')
         gsap.fromTo(row, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' } })
         gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' } })
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
            <AnimatedSection animationType="fadeInUp" delay={0.2} duration={1}>
               <div ref={headerRef} className="text-center mb-16">
                  <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                     {currentTranslations?.about?.skills?.title || 'Technical Skills & Expertise'}
                  </h2>
                  <p ref={subtitleRef} className="text-lg opacity-70" style={{ color: 'var(--muted-foreground)' }}>
                     {currentTranslations?.about?.skills?.subtitle || 'Technologies and tools I work with'}
                  </p>
               </div>
            </AnimatedSection>

            {/* ...ใน return */}
            {categorizedSkillRows.map(({ category, rows }, categoryIndex) => (
               <AnimatedSection 
                  key={category} 
                  animationType="fadeInUp" 
                  delay={0.5 + (categoryIndex * 0.2)} 
                  duration={0.8}
               >
                  <div className="mb-12">
                     <h3
                        className="text-2xl font-semibold mb-6 capitalize text-center"
                        style={{ color: 'var(--foreground)' }}
                     >
                        {category}
                     </h3>
                  <div className="space-y-8">
                     {rows.map((row, rowIndex) => (
                        <div
                           key={rowIndex}
                           ref={el => { rowRefs.current[rowIndex] = el }}
                           className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                           {row.map((skill, skillIndex) => (
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
                                       <div className="w-16 h-16 flex items-center justify-center mb-6">
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
                                          className="text-xl font-semibold"
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
                                          className="text-xl font-bold mb-4"
                                          style={{ color: 'var(--foreground)' }}
                                       >
                                          {skill.name}
                                       </h3>
                                       <p
                                          className="text-sm mb-6 opacity-90 leading-relaxed px-2"
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
                                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
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
               height: 280px;
               perspective: 1000px;
               transition: transform 0.3s ease;
            }

            .skill-card-container:hover {
               transform: scale(1.1) translateY(-8px);
               z-index: 10;
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
               padding: 2rem;
               border-radius: 16px;
               border: 1px solid var(--border);
               text-align: center;
               box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
