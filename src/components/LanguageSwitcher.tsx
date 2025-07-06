// src/components/LanguageSwitcher.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
   const router = useRouter()
   const [isOpen, setIsOpen] = useState(false)
   const [currentLocale, setCurrentLocale] = useState('en')

   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search)
      setCurrentLocale(searchParams.get('lang') || 'en')
   }, [])

   const switchLanguage = (newLocale: string) => {
      const url = new URL(window.location.href)
      if (newLocale === 'en') {
         url.searchParams.delete('lang')
      } else {
         url.searchParams.set('lang', newLocale)
      }
      router.push(url.pathname + url.search)
      setCurrentLocale(newLocale)
      setIsOpen(false)
   }

   const currentLanguage = currentLocale === 'th' ? 'ไทย' : 'English'
   const flagEmoji = currentLocale === 'th' ? '🇹🇭' : '🇺🇸'

   const locales = ['en', 'th']

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 hover:opacity-70 transition-all"
            style={{ color: 'var(--foreground)' }}
         >
            <span className="text-sm">{currentLanguage}</span>
            <svg
               className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
         </button>

         {isOpen && (
            <div
               className="absolute right-0 mt-2 w-32 border rounded-md shadow-lg z-10"
               style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)'
               }}
            >
               <div className="py-1">
                  {locales.map((availableLocale) => (
                     <button
                        key={availableLocale}
                        onClick={() => switchLanguage(availableLocale)}
                        className={`w-full px-4 py-2 text-left hover:opacity-70 flex items-center gap-2 transition-all text-sm ${currentLocale === availableLocale ? 'opacity-100' : 'opacity-75'
                           }`}
                        style={{
                           color: 'var(--foreground)',
                           backgroundColor: currentLocale === availableLocale ? 'var(--muted)' : 'transparent'
                        }}
                     >
                        <span>{availableLocale === 'th' ? '🇹🇭' : '🇺🇸'}</span>
                        <span>
                           {availableLocale === 'th' ? 'ไทย' : 'English'}
                        </span>
                     </button>
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}