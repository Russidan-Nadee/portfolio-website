// src/components/PersonalIntro.tsx
'use client'

import { useEffect, useRef } from 'react'

interface PersonalIntroProps {
   translations: any
}

export default function PersonalIntro({ translations }: PersonalIntroProps) {
   const introRef = useRef<HTMLDivElement>(null)
   const textRef = useRef<HTMLDivElement>(null)
   const imageRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  // Animate text side
                  if (textRef.current) {
                     textRef.current.style.transform = 'translateX(0)'
                     textRef.current.style.opacity = '1'
                  }

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
   }, [])

   return (
      <section
         ref={introRef}
         className="min-h-[80vh] flex items-center justify-center mb-16"
         style={{ backgroundColor: 'var(--background)' }}
      >
         <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-12 px-8">

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
                  className="text-xl md:text-2xl mb-4 opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.about.intro}
               </p>

               <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                  <span
                     className="block"
                     style={{
                        background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                     }}
                  >
                     {translations.about.role}
                  </span>
               </h1>

               <p
                  className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed opacity-80"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.about.description}
               </p>
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
               <div className="relative">
                  {/* Placeholder Image */}
                  <div
                     className="w-80 h-96 md:w-96 md:h-[450px] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105"
                     style={{
                        backgroundColor: 'var(--muted)',
                        border: '2px solid var(--border)'
                     }}
                  >
                     <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                           <div
                              className="w-20 h-20 rounded-full mx-auto mb-4"
                              style={{ backgroundColor: 'var(--muted-foreground)' }}
                           />
                           <p
                              className="text-sm opacity-50"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              Profile Photo
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Decorative Elements */}
                  <div
                     className="absolute -top-6 -right-6 w-12 h-12 rounded-full opacity-20"
                     style={{ backgroundColor: 'var(--foreground)' }}
                  />
                  <div
                     className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full opacity-30"
                     style={{ backgroundColor: 'var(--foreground)' }}
                  />
               </div>
            </div>
         </div>
      </section>
   )
}