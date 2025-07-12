// src/app/legal/privacy-policy/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import th from '../../../../locales/th.json'
import ja from '../../../../locales/ja.json'
import en from '../../../../locales/en.json'

// Fix: Add proper type for third party items
interface ThirdPartyItem {
   name: string;
   description: string;
}

export default function PrivacyPolicy() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

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
   const legal = translations?.legal?.privacyPolicy

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         <div className="max-w-4xl mx-auto px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
               <h1
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {legal?.title || 'Privacy Policy'}
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
               {/* Data Collection Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.dataCollection?.title || 'Information We Collect'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p className="mb-4" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.dataCollection?.content || 'This website does not collect any personal information from visitors:'}
                     </p>
                     <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.dataCollection?.items?.map((item: string, index: number) => (
                           <li key={index}>{item}</li>
                        )) || [
                           'No cookies or local storage used',
                           'No tracking or analytics',
                           'No forms or data submission',
                           'No usage data collection'
                        ].map((item, index) => (
                           <li key={index}>{item}</li>
                        ))}
                     </ul>
                  </div>
               </section>

               {/* Third Party Services Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.thirdPartyServices?.title || 'Third-Party Services'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p className="mb-4" style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.thirdPartyServices?.content || 'This website uses the following external services:'}
                     </p>
                     <ul className="list-disc pl-6 space-y-2" style={{ color: 'var(--card-foreground)' }}>
                        {/* Fix: Change any to ThirdPartyItem */}
                        {legal?.sections?.thirdPartyServices?.items?.map((item: ThirdPartyItem, index: number) => (
                           <li key={index}>
                              <strong>{item.name}:</strong> {item.description}
                           </li>
                        )) || [
                           { name: 'Google Fonts', description: 'For web fonts (no personal data collected)' },
                           { name: 'DevIcons CDN', description: 'For technology icons' },
                           { name: 'Cloudflare CDN', description: 'For loading JavaScript libraries' }
                        ].map((item, index) => (
                           <li key={index}>
                              <strong>{item.name}:</strong> {item.description}
                           </li>
                        ))}
                     </ul>
                     <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {legal?.sections?.thirdPartyServices?.note || 'These services may have their own privacy policies'}
                     </p>
                  </div>
               </section>

               {/* User Rights Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.userRights?.title || 'Your Rights'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.userRights?.content || 'Since we don\'t collect any personal data, there is no information for you to access, modify, or delete.'}
                     </p>
                  </div>
               </section>

               {/* Contact Section */}
               <section>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                     {legal?.sections?.contact?.title || 'Contact'}
                  </h2>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                     <p style={{ color: 'var(--card-foreground)' }}>
                        {legal?.sections?.contact?.content || 'If you have any questions about this policy, please contact:'} <br />
                        <strong>{legal?.sections?.contact?.email || 'russidan.nadee@gmail.com'}</strong>
                     </p>
                  </div>
               </section>
            </div>
         </div>
      </div>
   )
}