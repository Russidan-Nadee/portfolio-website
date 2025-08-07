'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

gsap.registerPlugin(ScrollTrigger)

interface SkillsGridProps {
   translations: any
}

// แยกหมวดหมู่ skills
const skillsByCategory = {
   frontend: [
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org' },
      { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', url: 'https://dart.dev' },
      { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
      { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org' },
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', url: 'https://flutter.dev' },
      { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', url: 'https://tailwindcss.com' }
   ],
   backend: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://python.org' },
      { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
      { name: 'Nest.js', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/NestJS.svg', url: 'https://nestjs.com' },
      { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', url: 'https://expressjs.com' },
      { name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', url: 'https://www.prisma.io' }
   ],
   database: [
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', url: 'https://www.postgresql.org' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com' }
   ],
   devtools: [
      { name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg', url: 'https://postman.com' },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com' },
      { name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg', url: 'https://visualstudio.microsoft.com' },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', url: 'https://code.visualstudio.com' }
   ],
   infrastructure: [
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', url: 'https://supabase.com' },
      { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', url: 'https://vercel.com' },
      { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', url: 'https://netlify.com' }
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
      <section ref={skillsRef} className="py-16 mb-16" style={{ backgroundColor: 'var(--background)' }}>
         <div className="max-w-6xl mx-auto px-8">
            <div ref={headerRef} className="text-center mb-16">
               <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                  {currentTranslations?.about?.skills?.title || 'Technical Skills & Expertise'}
               </h2>
               <p ref={subtitleRef} className="text-lg opacity-70" style={{ color: 'var(--muted-foreground)' }}>
                  {currentTranslations?.about?.skills?.subtitle || 'Technologies and tools I work with'}
               </p>
            </div>

            {/* ...ใน return */}
            {categorizedSkillRows.map(({ category, rows }) => (
               <div key={category} className="mb-12">
                  <h3
                     className="text-2xl font-semibold mb-6 capitalize text-center"  // <-- กึ่งกลาง
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
                                 className="skill-card group cursor-pointer transition-all duration-300 ease-out hover:scale-105"
                                 onClick={e => {
                                    e.preventDefault()
                                    const newWindow = window.open(skill.url, '_blank')
                                    if (newWindow) newWindow.opener = null
                                 }}
                              >
                                 <div
                                    className="p-8 rounded-xl border transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center text-center"
                                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                                 >
                                    <div className="w-16 h-16 flex items-center justify-center mb-6">
                                       <img
                                          src={skill.icon}
                                          alt={skill.name}
                                          className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
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

                                    {/* ชื่อ skill กึ่งกลาง */}
                                    <h3
                                       className="text-xl font-semibold"
                                       style={{ color: 'var(--foreground)' }}
                                    >
                                       {skill.name}
                                    </h3>

                                    {/* เอา Learn More ออก (เอาทั้งบล็อกนี้ออก) */}
                                 </div>
                              </div>
                           ))}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>
   )
}
