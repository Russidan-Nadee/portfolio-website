// src/app/about/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import PersonalIntro from '../../components/about/PersonalIntro'
import SkillsGrid from '../../components/about/SkillsGrid'
import Timeline from '../../components/about/Timeline'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

gsap.registerPlugin(ScrollTrigger)

function AboutContent() {
   const [locale, setLocale] = useState('en')

   const titleRef = useRef<HTMLHeadingElement>(null)
   const descriptionRef = useRef<HTMLParagraphElement>(null)

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
   const translations = getTranslations(locale)

   // Helper function to generate localized links
   const getLocalizedLink = (path: string) => {
      // Since we're not using URL params anymore, just return the path
      return path
   }

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
      // Title animation
      if (titleRef.current) {
         gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 30 },
            {
               opacity: 1,
               y: 0,
               duration: 0.8,
               ease: 'power2.out',
               scrollTrigger: {
                  trigger: titleRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
               },
            }
         )
      }

      // Description animation
      if (descriptionRef.current) {
         gsap.fromTo(
            descriptionRef.current,
            { opacity: 0, y: 20 },
            {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: 'power2.out',
               scrollTrigger: {
                  trigger: descriptionRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
               },
            }
         )
      }

      return () => {
         ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
   }, [locale]) // Re-run when locale changes

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         {/* Personal Introduction */}
         <div className="max-w-6xl mx-auto px-8 py-16">
            <PersonalIntro translations={translations} />
         </div>

         {/* Experience Timeline */}
         <div className="max-w-6xl mx-auto px-8">
            <Timeline translations={translations} />
         </div>

         {/* Skills Section */}
         <div className="max-w-6xl mx-auto px-8">
            <SkillsGrid translations={translations} />
         </div>

         {/* Contact CTA */}
         <div
            className="py-16"
            style={{
               backgroundColor: 'var(--muted)'
            }}
         >
            <div className="max-w-6xl mx-auto px-8 text-center">
               <h2
                  ref={titleRef}
                  className="text-3xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations?.about?.cta?.title || 'Let\'s Connect & Collaborate'}
               </h2>
               <p
                  ref={descriptionRef}
                  className="text-xl mb-8 opacity-80"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.about?.cta?.description || 'Interested in working together or learning more about my projects? I\'d love to hear from you!'}
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                     href={getLocalizedLink('/contact')}
                     className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)'
                     }}
                  >
                     {translations?.about?.cta?.contact || 'Get In Touch'}
                  </a>
                  <a
                     href={getLocalizedLink('/portfolio')}
                     className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 hover:shadow-lg"
                     style={{
                        backgroundColor: 'var(--card)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)'
                     }}
                  >
                     {translations?.about?.cta?.projects || 'View Projects'}
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
}

export default function About() {
   return <AboutContent />
}