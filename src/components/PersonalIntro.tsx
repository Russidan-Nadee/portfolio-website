// src/components/PersonalIntro.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface PersonalIntroProps {
   translations: any
}

export default function PersonalIntro({ translations }: PersonalIntroProps) {
   const introRef = useRef<HTMLDivElement>(null)
   const textRef = useRef<HTMLDivElement>(null)
   const imageRef = useRef<HTMLDivElement>(null)
   const roleRef = useRef<HTMLHeadingElement>(null)

   const [isVisible, setIsVisible] = useState(false)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

   // Typing animation for role text
   const [displayedRole, setDisplayedRole] = useState('')
   const [isTyping, setIsTyping] = useState(false)

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
      if (!isTyping) return

      const roleText = translations.about.role
      let index = 0

      const timer = setInterval(() => {
         if (index <= roleText.length) {
            setDisplayedRole(roleText.slice(0, index))
            index++
         } else {
            clearInterval(timer)
         }
      }, 100)

      return () => clearInterval(timer)
   }, [isTyping, translations.about.role])

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
               className="flex-1 text-left lg:text-left transition-all duration-1000 ease-out"
               style={{
                  transform: 'translateX(-50px)',
                  opacity: 0,
                  color: 'var(--foreground)'
               }}
            >
               <p
                  className="text-xl md:text-2xl mb-4 opacity-70 transition-all duration-500"
                  style={{
                     color: 'var(--muted-foreground)',
                     transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
               >
                  {translations.about.intro}
               </p>

               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
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
                     {isTyping && displayedRole.length < translations.about.role.length && (
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

               <p
                  className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed opacity-80 transition-all duration-700 delay-200"
                  style={{
                     color: 'var(--muted-foreground)',
                     transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                  }}
               >
                  {translations.about.description}
               </p>

               {/* Subtle Skills Highlight */}
               <div
                  className="flex flex-wrap gap-2 opacity-60 transition-all duration-1000 delay-500"
                  style={{
                     transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                  }}
               >
                  {['Flutter', 'TypeScript', 'Node.js'].map((skill, index) => (
                     <span
                        key={skill}
                        className="px-3 py-1 text-sm rounded-full transition-all duration-300 hover:opacity-100"
                        style={{
                           backgroundColor: 'var(--muted)',
                           color: 'var(--muted-foreground)',
                           border: '1px solid var(--border)',
                           animationDelay: `${index * 200}ms`
                        }}
                     >
                        {skill}
                     </span>
                  ))}
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
                     className="w-80 h-96 md:w-96 md:h-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 relative"
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

                     <div className="w-full h-full flex items-center justify-center relative z-10">
                        <div className="text-center">
                           {/* Enhanced Profile Icon */}
                           <div
                              className="w-24 h-24 rounded-full mx-auto mb-4 relative transition-all duration-500 group-hover:scale-110"
                              style={{ backgroundColor: 'var(--muted-foreground)' }}
                           >
                              {/* Rotating Ring */}
                              <div
                                 className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-1000"
                                 style={{
                                    borderTopColor: 'var(--foreground)',
                                    borderRightColor: 'var(--foreground)',
                                    animation: isVisible ? 'spin 4s linear infinite' : 'none',
                                    opacity: 0.3
                                 }}
                              />
                           </div>
                           <p
                              className="text-sm opacity-50 transition-opacity duration-300 group-hover:opacity-70"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              Profile Photo
                           </p>
                        </div>
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

         {/* CSS Animations */}
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
         `}</style>
      </section>
   )
}