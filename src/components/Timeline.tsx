// src/components/Timeline.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface TimelineProps {
   translations: any
}

const workExperienceData = [
   {
      id: 1,
      period: 'Apr 2025 - Oct 2025',
      title: 'Developer Intern',
      company: 'Thai Parkerizing',
      description: 'Developed Cross-platform Asset Management System with RFID integration using Flutter, Node.js, Express, and MySQL. Created full-stack solution including mobile app, web application, and Windows desktop app.',
      skills: ['Flutter', 'Node.js', 'Express', 'MySQL', 'RFID', 'Cross-platform'],
      icon: '💼',
      isCurrent: true
   },
   {
      id: 2,
      period: 'Jul 2024 - Mar 2025',
      title: 'Beverage Staff',
      company: 'Fly Club',
      description: 'Delivered food and beverages, ensuring exceptional customer satisfaction. Managed daily operations and maintained a clean, efficient service area.',
      skills: ['Customer Service', 'Operations Management', 'Team Work'],
      icon: '🍹',
      isCurrent: false
   },
   {
      id: 3,
      period: 'Apr 2024 - Jun 2024',
      title: 'Food and Beverage Staff',
      company: 'Tonson Ar-Ee Restaurant',
      description: 'Provided friendly service and assisted in food preparation. Ensured cleanliness in the kitchen and dining areas, meeting health standards.',
      skills: ['Food Service', 'Kitchen Operations', 'Health Standards'],
      icon: '🍽️',
      isCurrent: false
   },
   {
      id: 4,
      period: 'Apr 2022 - Jun 2022',
      title: 'Cook',
      company: 'KFC',
      description: 'Prepared food according to company standards. Monitored inventory to ensure sufficient stock levels.',
      skills: ['Food Preparation', 'Inventory Management', 'Quality Control'],
      icon: '🍗',
      isCurrent: false
   }
]

const educationData = [
   {
      id: 1,
      period: '2020 - 2026',
      title: 'Bachelor Degree',
      company: 'Silpakorn University',
      description: 'Electronic and Computer System - Comprehensive study of computer systems, electronics, software development, and system architecture. Expected graduation: March 2026.',
      skills: ['Electronics', 'Computer Systems', 'Software Development', 'System Architecture'],
      icon: '🎓',
      isCurrent: true
   }
]

export default function Timeline({ translations }: TimelineProps) {
   const timelineRef = useRef<HTMLDivElement>(null)
   const lineRef = useRef<HTMLDivElement>(null)
   const itemRefs = useRef<(HTMLDivElement | null)[]>([])
   const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')
   const [lineHeight, setLineHeight] = useState(0)

   const currentData = activeTab === 'work' ? workExperienceData : educationData

   useEffect(() => {
      setLineHeight(0)
      itemRefs.current = []

      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  setTimeout(() => {
                     if (lineRef.current) {
                        const targetHeight = entry.target.scrollHeight * 0.8
                        let currentHeight = 0
                        const animationDuration = 1500
                        const startTime = Date.now()

                        const animateLine = () => {
                           const elapsed = Date.now() - startTime
                           const progress = Math.min(elapsed / animationDuration, 1)

                           const easeOutCubic = 1 - Math.pow(1 - progress, 3)
                           currentHeight = targetHeight * easeOutCubic

                           setLineHeight(currentHeight)

                           if (progress < 1) {
                              requestAnimationFrame(animateLine)
                           } else {
                              animateTimelineItems()
                           }
                        }

                        animateLine()
                     }
                  }, 200)
               }
            })
         },
         { threshold: 0.1 }
      )

      if (timelineRef.current) {
         observer.observe(timelineRef.current)
      }

      return () => observer.disconnect()
   }, [activeTab])

   const animateTimelineItems = () => {
      itemRefs.current.forEach((ref, index) => {
         if (ref) {
            setTimeout(() => {
               ref.style.transform = 'translateY(0) scale(1)'
               ref.style.opacity = '1'

               const icon = ref.querySelector('.timeline-icon')
               if (icon) {
                  setTimeout(() => {
                     ; (icon as HTMLElement).style.transform = 'scale(1.2)'
                     setTimeout(() => {
                        ; (icon as HTMLElement).style.transform = 'scale(1)'
                     }, 150)
                  }, 300)
               }
            }, index * 400)
         }
      })
   }

   return (
      <section ref={timelineRef} className="py-16 mb-16">
         <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
               <h2
                  className="text-4xl md:text-5xl font-bold mb-8"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations.about.timeline.title}
               </h2>

               <div
                  className="inline-flex rounded-xl p-1 mb-8"
                  style={{ backgroundColor: 'var(--muted)' }}
               >
                  <button
                     onClick={() => setActiveTab('work')}
                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'work' ? 'shadow-md' : 'hover:opacity-70'
                        }`}
                     style={{
                        backgroundColor: activeTab === 'work' ? 'var(--card)' : 'transparent',
                        color: activeTab === 'work' ? 'var(--foreground)' : 'var(--muted-foreground)',
                     }}
                  >
                     💼 {translations.about.timeline.tabs.work}
                  </button>
                  <button
                     onClick={() => setActiveTab('education')}
                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'education' ? 'shadow-md' : 'hover:opacity-70'
                        }`}
                     style={{
                        backgroundColor: activeTab === 'education' ? 'var(--card)' : 'transparent',
                        color: activeTab === 'education' ? 'var(--foreground)' : 'var(--muted-foreground)',
                     }}
                  >
                     🎓 {translations.about.timeline.tabs.education}
                  </button>
               </div>
            </div>

            <div className="relative max-w-4xl mx-auto">
               <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-1"
                  style={{ backgroundColor: 'var(--border)' }}
               >
                  <div
                     ref={lineRef}
                     className="w-full transition-all duration-1000 ease-out"
                     style={{
                        height: `${lineHeight}px`,
                        background: 'linear-gradient(to bottom, var(--foreground), var(--muted-foreground))'
                     }}
                  />
               </div>

               <div className="space-y-12">
                  {currentData.map((item, index) => (
                     <div
                        key={`${activeTab}-${item.id}`}
                        ref={(el) => { itemRefs.current[index] = el }}
                        className={`relative flex items-center transition-all duration-800 ease-out ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                           }`}
                        style={{
                           transform: 'translateY(50px) scale(0.9)',
                           opacity: 0
                        }}
                     >
                        <div
                           className="timeline-icon absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ease-out z-10"
                           style={{
                              backgroundColor: 'var(--card)',
                              border: item.isCurrent ? '6px solid var(--foreground)' : '4px solid var(--foreground)',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                           }}
                        >
                           {item.icon}
                        </div>

                        <div
                           className={`w-5/12 ${index % 2 === 0 ? 'mr-8 text-right' : 'ml-8 text-left'
                              }`}
                        >
                           <div
                              className="rounded-xl p-6 border transition-all duration-300 hover:shadow-lg"
                              style={{
                                 backgroundColor: 'var(--card)',
                                 borderColor: 'var(--border)'
                              }}
                           >
                              <div className="mb-2">
                                 <span
                                    className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                                    style={{
                                       backgroundColor: item.isCurrent ? 'var(--foreground)' : 'var(--muted)',
                                       color: item.isCurrent ? 'var(--background)' : 'var(--muted-foreground)'
                                    }}
                                 >
                                    {item.isCurrent ? '🔥 Current' : item.period}
                                 </span>
                              </div>

                              <h3
                                 className="text-xl font-bold mb-2 transition-colors"
                                 style={{
                                    color: 'var(--foreground)',
                                 }}
                              >
                                 {item.title}
                              </h3>

                              <h4
                                 className="text-md font-semibold mb-1"
                                 style={{ color: 'var(--muted-foreground)' }}
                              >
                                 {item.company}
                              </h4>

                              {item.isCurrent && (
                                 <p
                                    className="text-sm font-medium mb-3"
                                    style={{ color: 'var(--muted-foreground)' }}
                                 >
                                    {item.period}
                                 </p>
                              )}

                              <p
                                 className="leading-relaxed mb-4"
                                 style={{ color: 'var(--muted-foreground)' }}
                              >
                                 {item.description}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                 {item.skills.map((skill, skillIndex) => (
                                    <span
                                       key={skillIndex}
                                       className="text-xs px-2 py-1 rounded-md"
                                       style={{
                                          backgroundColor: 'var(--muted)',
                                          color: 'var(--muted-foreground)'
                                       }}
                                    >
                                       {skill}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   )
}