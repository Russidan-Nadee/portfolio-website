// src/components/about/PersonalIntro.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

interface PersonalIntroProps {
   translations: any
}

export default function PersonalIntro({ translations }: PersonalIntroProps) {
   const [locale, setLocale] = useState('en')

   const introRef = useRef<HTMLDivElement>(null)
   const textRef = useRef<HTMLDivElement>(null)
   const imageRef = useRef<HTMLDivElement>(null)
   const roleRef = useRef<HTMLHeadingElement>(null)
   const postTitleRef = useRef<HTMLDivElement>(null)

   const [isVisible, setIsVisible] = useState(false)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

   // Typing animation for role text
   const [displayedRole, setDisplayedRole] = useState('')
   const [isTyping, setIsTyping] = useState(false)
   const [showContentReveal, setShowContentReveal] = useState(false)

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

   // Language change handler
   useEffect(() => {
      // Get initial language from localStorage
      setLocale(localStorage.getItem('lang') || 'en')

      // Listen for language changes
      const handleLanguageChange = (e: any) => {
         setLocale(e.detail.language)
      }

      window.addEventListener('languageChange', handleLanguageChange)
      return () => window.removeEventListener('languageChange', handleLanguageChange)
   }, [])

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting && !isVisible) {
                  setIsVisible(true)

                  // Animate text side
                  if (textRef.current) {
                     textRef.current.style.transform = 'translateX(0)'
                     textRef.current.style.opacity = '1'
                  }

                  // Start typing animation
                  setTimeout(() => {
                     setIsTyping(true)
                  }, 800)

                  // Animate image side with delay
                  setTimeout(() => {
                     if (imageRef.current) {
                        imageRef.current.style.transform = 'translateX(0) scale(1)'
                        imageRef.current.style.opacity = '1'
                     }
                  }, 300)
               }
            })
         },
         { threshold: 0.1 }
      )

      if (introRef.current) {
         observer.observe(introRef.current)
      }

      return () => observer.disconnect()
   }, [isVisible])

   // Typing animation effect
   useEffect(() => {
      if (!isTyping || !currentTranslations?.about?.role) return

      const roleText = currentTranslations.about.role
      let index = 0

      const timer = setInterval(() => {
         if (index <= roleText.length) {
            setDisplayedRole(roleText.slice(0, index))
            index++
         } else {
            clearInterval(timer)
            // Wait 0.5s before starting content reveal animation
            setTimeout(() => {
               setShowContentReveal(true)
            }, 500)
         }
      }, 100)

      return () => clearInterval(timer)
   }, [isTyping, currentTranslations?.about?.role])

   // Mouse tracking for parallax effect
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         if (introRef.current) {
            const rect = introRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height
            setMousePosition({ x: x * 20, y: y * 20 })
         }
      }

      const section = introRef.current
      if (section) {
         section.addEventListener('mousemove', handleMouseMove)
         return () => section.removeEventListener('mousemove', handleMouseMove)
      }
   }, [])

   // Reset animations when locale changes
   useEffect(() => {
      setIsVisible(false)
      setDisplayedRole('')
      setIsTyping(false)
      setShowContentReveal(false)
   }, [locale])

   return (
      <section
         ref={introRef}
         className="min-h-[80vh] flex items-center justify-center mb-16 relative overflow-hidden"
         style={{ backgroundColor: 'var(--background)' }}
      >
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Geometric Shapes */}
            <div
               className="absolute top-20 left-10 w-20 h-20 opacity-5 rounded-full transition-transform duration-1000 ease-out"
               style={{
                  backgroundColor: 'var(--foreground)',
                  transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) ${isVisible ? 'scale(1)' : 'scale(0)'}`
               }}
            />
            <div
               className="absolute bottom-32 right-20 w-16 h-16 opacity-5 transition-transform duration-1000 ease-out"
               style={{
                  backgroundColor: 'var(--foreground)',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px) ${isVisible ? 'scale(1)' : 'scale(0)'}`
               }}
            />
            <div
               className="absolute top-1/2 right-1/4 w-12 h-12 opacity-5 transition-transform duration-1000 ease-out"
               style={{
                  backgroundColor: 'var(--foreground)',
                  clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                  transform: `translate(${mousePosition.x * 0.8}px, ${mousePosition.y * 0.8}px) ${isVisible ? 'scale(1)' : 'scale(0)'}`
               }}
            />
         </div>

         <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 px-8 relative z-10">

            {/* Text Content - Left Side */}
            <div
               ref={textRef}
               className="flex-1 text-left lg:text-left transition-all duration-1000 ease-out relative"
               style={{
                  transform: 'translateX(-50px)',
                  opacity: 0,
                  color: 'var(--foreground)',
                  minHeight: '400px' // Fixed height to prevent layout shifts
               }}
            >
               <p
                  className="text-xl md:text-2xl mb-4 opacity-70 transition-all duration-500"
                  style={{
                     color: 'var(--muted-foreground)',
                     transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
               >
                  {currentTranslations?.about?.intro || 'I\'m a'}
               </p>

               {/* Fixed container for Developer text */}
               <div className="relative" style={{ height: '200px', transform: 'translateZ(0)' }}>
                  <h1
                     className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                     style={{
                        position: 'absolute',
                        top: '50px',
                        left: '0',
                        width: '100%',
                        transform: showContentReveal ? 'translate3d(0, -10px, 0)' : 'translate3d(0, 0, 0)',
                        transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden'
                     }}
                  >
                     <span
                        ref={roleRef}
                        className="block relative"
                        style={{
                           background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)',
                           WebkitBackgroundClip: 'text',
                           WebkitTextFillColor: 'transparent',
                           backgroundClip: 'text'
                        }}
                     >
                        {displayedRole}
                        {/* Typing Cursor */}
                        {isTyping && displayedRole.length < (currentTranslations?.about?.role?.length || 0) && (
                           <span
                              className="inline-block w-1 ml-1 animate-pulse"
                              style={{
                                 backgroundColor: 'var(--foreground)',
                                 height: '0.8em'
                              }}
                           />
                        )}
                     </span>
                  </h1>
               </div>

               {/* Description with line-by-line reveal */}
               <div
                  className="overflow-hidden"
                  style={{
                     height: showContentReveal ? 'auto' : '0',
                     transition: 'height 0.6s ease-out 0.2s',
                     marginTop: '20px' // Add some space after Developer text
                  }}
               >
                  <p
                     className="text-lg md:text-xl max-w-lg leading-relaxed opacity-80"
                     style={{
                        color: 'var(--muted-foreground)',
                        transform: showContentReveal ? 'translateY(0)' : 'translateY(-100%)',
                        transition: 'transform 0.6s ease-out 0.3s'
                     }}
                  >
                     {currentTranslations?.about?.description || 'A passionate developer with expertise in cross-platform development.'}
                  </p>
               </div>

               {/* Subtle Skills Highlight with line-by-line reveal */}
               <div
                  className="overflow-hidden"
                  style={{
                     height: showContentReveal ? 'auto' : '0',
                     transition: 'height 0.6s ease-out 0.4s',
                     marginTop: '20px'
                  }}
               >
                  <div
                     className="flex gap-2 opacity-60"
                     style={{
                        transform: showContentReveal ? 'translateY(0)' : 'translateY(-100%)',
                        transition: 'transform 0.6s ease-out 0.5s'
                     }}
                  >
                     {[''].map((skill, index) => (
                        <span
                           key={skill}
                           className="px-3 py-1 text-sm rounded-full transition-all duration-300 hover:opacity-100 whitespace-nowrap"
                           style={{
                              backgroundColor: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              border: '1px solid var(--border)',
                              opacity: showContentReveal ? 1 : 0,
                              transform: showContentReveal ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                              transition: `all 0.4s ease-out ${0.6 + index * 0.1}s`
                           }}
                        >
                           {skill}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Profile Image - Right Side */}
            <div
               ref={imageRef}
               className="flex-1 flex justify-center lg:justify-end transition-all duration-1000 ease-out"
               style={{
                  transform: 'translateX(50px) scale(0.9)',
                  opacity: 0
               }}
            >
               <div className="relative group">
                  {/* Main Profile Container */}
                  <div
                     className="w-80 h-96 md:w-96 md:h-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 relative profile-shine"
                     style={{
                        backgroundColor: 'var(--muted)',
                        border: '2px solid var(--border)'
                     }}
                  >
                     {/* Animated Gradient Overlay */}
                     <div
                        className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                        style={{
                           background: 'linear-gradient(45deg, var(--foreground), transparent, var(--foreground))',
                           animation: isVisible ? 'gradientShift 3s ease-in-out infinite' : 'none'
                        }}
                     />

                     {/* Profile Image */}
                     <div className="w-full h-full relative z-10">
                        <img
                           src="/images/about/profile-main.jpg"
                           alt={`${currentTranslations?.about?.name || 'Russidan Nadee'} Profile`}
                           className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                           onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              if (target.parentElement) {
                                 target.parentElement.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center">
                                       <div class="text-center">
                                          <div class="w-24 h-24 rounded-full mx-auto mb-4 relative transition-all duration-500 group-hover:scale-110" style="background-color: var(--muted-foreground)">
                                             <div class="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-1000" style="border-top-color: var(--foreground); border-right-color: var(--foreground); animation: ${isVisible ? 'spin 4s linear infinite' : 'none'}; opacity: 0.3"></div>
                                          </div>
                                          <p class="text-sm opacity-50 transition-opacity duration-300 group-hover:opacity-70" style="color: var(--muted-foreground)">Profile Photo</p>
                                       </div>
                                    </div>
                                 `
                              }
                           }}
                        />

                        {/* Hover Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                  </div>

                  {/* Enhanced Decorative Elements */}
                  <div
                     className="absolute -top-6 -right-6 w-12 h-12 rounded-full opacity-20 transition-all duration-500"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                        animation: isVisible ? 'float 3s ease-in-out infinite' : 'none'
                     }}
                  />
                  <div
                     className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full opacity-30 transition-all duration-500"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        transform: `translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.1}px)`,
                        animation: isVisible ? 'float 3s ease-in-out infinite reverse' : 'none'
                     }}
                  />

                  {/* Pulse Effect */}
                  <div
                     className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full opacity-40 transition-all duration-300"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        transform: 'translate(-50%, -50%)',
                        animation: isVisible ? 'pulse 2s ease-in-out infinite' : 'none'
                     }}
                  />
               </div>
            </div>
         </div>

         {/* Enhanced CSS Animations */}
         <style jsx>{`
            @keyframes gradientShift {
               0%, 100% { transform: translateX(-100%); }
               50% { transform: translateX(100%); }
            }
            
            @keyframes float {
               0%, 100% { transform: translateY(0px); }
               50% { transform: translateY(-10px); }
            }
            
            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
               0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
               50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.5); }
            }

            @keyframes autoShine {
               0% { left: -100%; }
               50% { left: 100%; }
               100% { left: 100%; }
            }

            .profile-shine {
               position: relative;
               overflow: hidden;
            }

            .profile-shine::before {
               content: '';
               position: absolute;
               top: 0;
               left: -100%;
               width: 100%;
               height: 100%;
               background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.3),
                  transparent
               );
               animation: autoShine 4s ease-in-out infinite;
               z-index: 20;
            }
         `}</style>
      </section>
   )
}