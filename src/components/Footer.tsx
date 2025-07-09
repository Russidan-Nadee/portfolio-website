// src/components/Footer.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Footer() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Helper function to get translations based on locale
   const getTranslations = (locale: string) => {
      switch (locale) {
         case 'th':
            return require('../../locales/th.json')
         case 'ja':
            return require('../../locales/ja.json')
         default:
            return require('../../locales/en.json')
      }
   }

   // Load translations with fallback
   const translations = getTranslations(locale)

   return (
      <footer className="p-4 border-t mt-8" style={{
         backgroundColor: 'var(--background)',
         borderColor: 'var(--border)'
      }}>
         <div className="max-w-6xl mx-auto text-center" style={{ color: 'var(--muted-foreground)' }}>
            <p>{translations?.footer?.copyright || '© 2024 Russidan Nadee. All rights reserved.'}</p>
         </div>
      </footer>
   )
}