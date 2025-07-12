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

   // Language configuration with names and flags
   const locales = [
      { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
      { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' }
   ]

   // Get current language info
   const getCurrentLanguage = () => {
      const current = locales.find(locale => locale.code === currentLocale)
      return current || locales[0] // fallback to English
   }

   const currentLanguage = getCurrentLanguage()

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-70 transition-all duration-200"
            style={{
               color: 'var(--foreground)',
               backgroundColor: isOpen ? 'var(--muted)' : 'transparent'
            }}
            aria-label={`Current language: ${currentLanguage.nativeName}. Click to change language.`}
         >
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
            <svg
               className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
               />
            </svg>
         </button>

         {isOpen && (
            <>
               {/* Backdrop to close dropdown */}
               <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
               />

               {/* Dropdown menu */}
               <div
                  className="absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-20"
                  style={{
                     backgroundColor: 'var(--card)',
                     borderColor: 'var(--border)'
                  }}
               >
                  <div className="py-1">
                     {locales.map((locale) => (
                        <button
                           key={locale.code}
                           onClick={() => switchLanguage(locale.code)}
                           className={`w-full px-4 py-3 text-left hover:opacity-80 flex items-center gap-3 transition-all duration-200 ${currentLocale === locale.code ? 'font-medium' : 'font-normal'
                              }`}
                           style={{
                              color: 'var(--foreground)',
                              backgroundColor: currentLocale === locale.code ? 'var(--muted)' : 'transparent'
                           }}
                           aria-label={`Switch to ${locale.nativeName}`}
                        >
                           <span className="text-lg">{locale.flag}</span>
                           <div className="flex flex-col">
                              <span className="text-sm">{locale.nativeName}</span>
                              <span className="text-xs opacity-60">{locale.name}</span>
                           </div>
                           {currentLocale === locale.code && (
                              <span className="ml-auto text-xs opacity-60">✓</span>
                           )}
                        </button>
                     ))}
                  </div>
               </div>
            </>
         )}
      </div>
   )
}