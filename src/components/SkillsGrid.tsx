// src/components/SkillsGrid.tsx
'use client'

import { useEffect, useRef } from 'react'

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
   const skillsRef = useRef<HTMLDivElement>(null)
   const rowRefs = useRef<(HTMLDivElement | null)[]>([])

   // Split skills into rows of 3
   const skillRows = []
   for (let i = 0; i < skills.length; i += 3) {
      skillRows.push(skills.slice(i, i + 3))
   }

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  // Animate each row with stagger
                  rowRefs.current.forEach((rowRef, index) => {
                     if (rowRef) {
                        setTimeout(() => {
                           rowRef.style.transform = 'translateY(0)'
                           rowRef.style.opacity = '1'

                           // Animate cards within the row
                           const cards = rowRef.querySelectorAll('.skill-card')
                           cards.forEach((card, cardIndex) => {
                              setTimeout(() => {
                                 ; (card as HTMLElement).style.transform = 'translateY(0)'
                                    ; (card as HTMLElement).style.opacity = '1'
                              }, cardIndex * 100)
                           })
                        }, index * 150)
                     }
                  })
               }
            })
         },
         { threshold: 0.2 }
      )

      if (skillsRef.current) {
         observer.observe(skillsRef.current)
      }

      return () => observer.disconnect()
   }, [])

   return (
      <section
         ref={skillsRef}
         className="py-16 mb-16"
         style={{ backgroundColor: 'var(--background)' }}
      >
         <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
               <h2
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations.about.skills.title}
               </h2>
               <p
                  className="text-lg opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.about.skills.subtitle}
               </p>
            </div>

            <div className="space-y-8">
               {skillRows.map((row, rowIndex) => (
                  <div
                     key={rowIndex}
                     ref={(el) => { rowRefs.current[rowIndex] = el }}
                     className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out"
                     style={{
                        transform: 'translateY(30px)',
                        opacity: 0
                     }}
                  >
                     {row.map((skill, skillIndex) => (
                        <div
                           key={skillIndex}
                           className="skill-card group cursor-pointer transition-all duration-300 ease-out hover:scale-105"
                           style={{
                              transform: 'translateY(20px)',
                              opacity: 0
                           }}
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
                                          // Fallback if CDN fails
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
                                    Learn More
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
                  className="text-lg opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.about.skills.learning}
               </p>
            </div>
         </div>
      </section>
   )
}