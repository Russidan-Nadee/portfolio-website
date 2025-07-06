// src/app/about/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function About() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../../locales/th.json') : require('../../../locales/en.json')

   return (
      <div className="max-w-4xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8">
            {translations.about.title}
         </h1>

         <div className="space-y-6">
            <p className="text-lg text-gray-700">
               {translations.about.paragraph1}
            </p>

            <p className="text-gray-700">
               {translations.about.paragraph2}
            </p>

            <p className="text-gray-700">
               {translations.about.paragraph3}
            </p>
         </div>
      </div>
   )
}