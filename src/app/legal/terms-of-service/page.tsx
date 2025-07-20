// src/app/legal/terms-of-service/page.tsx
'use client'

import { useState, useEffect } from 'react'
import th from '../../../../locales/th.json'
import ja from '../../../../locales/ja.json'
import en from '../../../../locales/en.json'

function TermsOfServiceContent() {
   const [locale, setLocale] = useState('en')

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

   const translations = getTranslations(locale)
   const legal = translations?.legal?.termsOfService

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

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
               <h1
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {legal?.title || 'Terms of Service'}
               </h1>
               <p
                  className="text-lg"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {legal?.lastUpdated || 'Last updated: July 2025'}
               </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
               {/* Agreement Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.agreement?.title || 'Agreement to Terms'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.agreement?.content || 'By accessing this website, you agree to be bound by these Terms of Service. This website is a personal portfolio for showcasing work and contact information only.'}
                     </p>
                  </div>
               </section>

               {/* Permitted Use Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.permittedUse?.title || 'Permitted Use'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p className="mb-4" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.permittedUse?.content || 'You may:'}
                     </p>
                     <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.permittedUse?.items?.map((item: string, index: number) => (
                           <li key={index}>{item}</li>
                        )) || [
                           'View and browse the website content',
                           'Contact through provided channels',
                           'Share the website link'
                        ].map((item, index) => (
                           <li key={index}>{item}</li>
                        ))}
                     </ul>
                  </div>
               </section>

               {/* Prohibited Use Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.prohibitedUse?.title || 'Prohibited Use'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p className="mb-4" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.prohibitedUse?.content || 'You may not:'}
                     </p>
                     <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.prohibitedUse?.items?.map((item: string, index: number) => (
                           <li key={index}>{item}</li>
                        )) || [
                           'Copy content, images, or code without permission',
                           'Use the website for illegal purposes',
                           'Attempt to hack or damage the website',
                           'Send spam or inappropriate content'
                        ].map((item, index) => (
                           <li key={index}>{item}</li>
                        ))}
                     </ul>
                  </div>
               </section>

               {/* Intellectual Property Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.intellectualProperty?.title || 'Intellectual Property'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.intellectualProperty?.content || 'All content, images, design, and code on this website are copyrighted by Russidan Nadee. Please request permission before using any materials.'}
                     </p>
                  </div>
               </section>

               {/* Liability Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.liability?.title || 'Limitation of Liability'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.liability?.content || 'This website is provided "as is". The website owner is not responsible for any damages that may arise from using this website. Information may change without notice.'}
                     </p>
                  </div>
               </section>

               {/* Changes Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.changes?.title || 'Changes to Terms'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.changes?.content || 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.'}
                     </p>
                  </div>
               </section>

               {/* Governing Law Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.governingLaw?.title || 'Governing Law'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p className="mb-4" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.governingLaw?.content || 'These terms are governed by Thai law. Any disputes will be resolved under Thai jurisdiction.'}
                     </p>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        <strong>{legal?.sections?.governingLaw?.contact || 'Contact: russidan.nadee@gmail.com'}</strong>
                     </p>
                  </div>
               </section>
            </div>
         </div>
      </div>
   )
}

export default function TermsOfService() {
   return <TermsOfServiceContent />
}