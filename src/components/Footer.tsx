// src/components/Footer.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Footer() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../locales/th.json') : require('../../locales/en.json')

   return (
      <footer className="p-4 border-t mt-8">
         <div className="max-w-6xl mx-auto text-center text-gray-600">
            <p>{translations.footer.copyright}</p>
         </div>
      </footer>
   )
}