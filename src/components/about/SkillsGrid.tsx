'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'
import AnimatedSection from '../ui/AnimatedSection'

gsap.registerPlugin(ScrollTrigger)

type LocalizedText = { th: string; en: string; ja: string }

export interface SkillItem {
   id: string
   name: string
   icon: string
   url: string | null
   description: LocalizedText
}

export interface CategoryItem {
   id: string
   name: LocalizedText
   skills: SkillItem[]
}

interface SkillsGridProps {
   translations: any
   categories: CategoryItem[]
}

export default function SkillsGrid({ translations, categories }: SkillsGridProps) {
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

            {categories.map((category, categoryIndex) => (
               <AnimatedSection
                  key={category.id}
                  animationType="fadeInUp"
                  delay={0}
                  duration={0.8}
               >
                  <div className="mb-12">
                     <h3
                        className="text-2xl font-semibold mb-6 capitalize text-center"
                        style={{ color: 'var(--foreground)' }}
                     >
                        {category.name.en}
                     </h3>
                     <div
                        ref={el => { categoryGridRefs.current[categoryIndex] = el }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-6"
                     >
                        {category.skills.map((skill) => (
                           <div
                              key={skill.id}
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
                                             {skill.description[locale as keyof typeof skill.description] || skill.description.en}
                                          </p>
                                          <button
                                             onClick={e => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if (!skill.url) return
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
