// src/app/about/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import PersonalIntro from '../../components/PersonalIntro'
import SkillsGrid from '../../components/SkillsGrid'
import Timeline from '../../components/Timeline'

export default function About() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../../locales/th.json') : require('../../../locales/en.json')

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         {/* Personal Introduction */}
         <div className="max-w-6xl mx-auto px-8 py-16">
            <PersonalIntro translations={translations} />
         </div>

         {/* Skills Section */}
         <div className="max-w-6xl mx-auto px-8">
            <SkillsGrid translations={translations} />
         </div>

         {/* Experience Timeline */}
         <div className="max-w-6xl mx-auto px-8">
            <Timeline translations={translations} />
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
                  className="text-3xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations.about.cta.title}
               </h2>
               <p
                  className="text-xl mb-8 opacity-80"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.about.cta.description}
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                     href={locale === 'th' ? '/contact?lang=th' : '/contact'}
                     className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)'
                     }}
                  >
                     {translations.about.cta.contact}
                  </a>
                  <a
                     href={locale === 'th' ? '/portfolio?lang=th' : '/portfolio'}
                     className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 hover:shadow-lg"
                     style={{
                        backgroundColor: 'var(--card)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)'
                     }}
                  >
                     {translations.about.cta.projects}
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
}