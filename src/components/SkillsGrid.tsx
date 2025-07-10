// src/components/SkillsGrid.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import th from '../../locales/th.json'
import ja from '../../locales/ja.json'
import en from '../../locales/en.json'

gsap.registerPlugin(ScrollTrigger)

interface SkillsGridProps {
   translations: any
}

const skills = [
   { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', url: 'https://flutter.dev' },
   { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org' },
   { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org' },
   { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org' },
   { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', url: 'https://expressjs.com' },
   { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', url: 'https://reactjs.org' },
   { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://www.mysql.com' },
   { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', url: 'https://git-scm.com' },
   { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com' },
   { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
   { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
   { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }
]

export default function SkillsGrid({ translations }: SkillsGridProps) {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

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

   // Load translations with fallback
   const currentTranslations = translations || getTranslations(locale)

   const skillRows = []
   for (let i = 0; i < skills.length; i += 3) {
      skillRows.push(skills.slice(i, i + 3))
   }

   useEffect(() => {
      if (!skillsRef.current) return

      // Clear previous animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())

      // Header Animation
      if (headerRef.current && titleRef.current && subtitleRef.current) {
         const tl = gsap.timeline({
            scrollTrigger: {
               trigger: headerRef.current,
               start: 'top 85%',
               toggleActions: 'play none none none',
            }
         })

         // Title animation - slide up with scale
         tl.fromTo(
            titleRef.current,
            {
               opacity: 0,
               y: 50,
               scale: 0.8
            },
            {
               opacity: 1,
               y: 0,
               scale: 1,
               duration: 0.8,
               ease: 'power3.out'
            }
         )

         // Subtitle animation - fade in with slight delay
         tl.fromTo(
            subtitleRef.current,
            {
               opacity: 0,
               y: 30
            },
            {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: 'power2.out'
            },
            '-=0.3'
         )
      }

      // Skills Grid Animation
      rowRefs.current.forEach((row, rowIndex) => {
         if (!row) return
         const cards = row.querySelectorAll('.skill-card')

         gsap.fromTo(
            row,
            { opacity: 0, y: 30 },
            {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: 'power2.out',
               scrollTrigger: {
                  trigger: row,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
               },
            }
         )

         gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
               opacity: 1,
               y: 0,
               duration: 0.5,
               stagger: 0.1,
               ease: 'power2.out',
               scrollTrigger: {
                  trigger: row,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
               },
            }
         )
      })

      // Learning text animation
      if (learningRef.current) {
         gsap.fromTo(
            learningRef.current,
            {
               opacity: 0,
               y: 20
            },
            {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: 'power2.out',
               scrollTrigger: {
                  trigger: learningRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
               },
            }
         )
      }

      return () => {
         ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
   }, [locale]) // Re-run when locale changes

   // Get localized button text
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
      <section
         ref={skillsRef}
         className="py-16 mb-16"
         style={{ backgroundColor: 'var(--background)' }}
      >
         <div className="max-w-6xl mx-auto px-8">
            <div ref={headerRef} className="text-center mb-16">
               <h2
                  ref={titleRef}
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {currentTranslations?.about?.skills?.title || 'Technical Skills & Expertise'}
               </h2>
               <p
                  ref={subtitleRef}
                  className="text-lg opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {currentTranslations?.about?.skills?.subtitle || 'Technologies and tools I work with'}
               </p>
            </div>

            <div className="space-y-8">
               {skillRows.map((row, rowIndex) => (
                  <div
                     key={rowIndex}
                     ref={(el) => { rowRefs.current[rowIndex] = el }}
                     className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                     {row.map((skill, skillIndex) => (
                        <div
                           key={skillIndex}
                           className="skill-card group cursor-pointer transition-all duration-300 ease-out hover:scale-105"
                           onClick={(e) => {
                              e.preventDefault()
                              const newWindow = window.open(skill.url, '_blank')
                              if (newWindow) newWindow.opener = null
                           }}
                        >
                           <div
                              className="p-8 rounded-xl border transition-all duration-300 hover:shadow-lg text-center"
                              style={{
                                 backgroundColor: 'var(--card)',
                                 borderColor: 'var(--border)',
                              }}
                           >
                              <div className="flex justify-center mb-6">
                                 <div className="w-16 h-16 flex items-center justify-center">
                                    <img
                                       src={skill.icon}
                                       alt={skill.name}
                                       className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                                       onError={(e) => {
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
                              </div>

                              <h3
                                 className="text-xl font-semibold mb-2"
                                 style={{ color: 'var(--foreground)' }}
                              >
                                 {skill.name}
                              </h3>

                              <div className="mt-4">
                                 <div
                                    className="inline-block px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 group-hover:opacity-80"
                                    style={{
                                       backgroundColor: 'var(--muted)',
                                       color: 'var(--muted-foreground)'
                                    }}
                                 >
                                    {getLearnMoreText(locale)}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ))}
            </div>

            <div className="mt-16 text-center">
               <p
                  ref={learningRef}
                  className="text-lg opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {currentTranslations?.about?.skills?.learning || 'Currently expanding my knowledge in Docker and C# .NET for advanced system development'}
               </p>
            </div>
         </div>
      </section>
   )
}