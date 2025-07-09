// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeProvider'

export default function Header() {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const locale = searchParams.get('lang') || 'en'
   const { theme } = useTheme()

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

   // Helper function to generate localized links
   const getLocalizedLink = (path: string) => {
      if (locale === 'en') {
         return path
      }
      return `${path}?lang=${locale}`
   }

   return (
      <header className="h-16 flex items-center px-4 border-b-2 transition-colors relative z-10" style={{
         backgroundColor: 'var(--background)',
         borderColor: 'var(--border)',
         color: 'var(--foreground)'
      }}>
         <nav className="flex justify-between items-center max-w-6xl mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center">
               <Link href={getLocalizedLink('/')} className="flex items-center">
                  <img
                     src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                     alt="Russidan Nadee"
                     className="w-auto transition-all duration-300 hover:scale-105"
                     style={{
                        height: '120px',
                        clipPath: 'inset(28px 0)'
                     }}
                  />
               </Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center space-x-6">
               <Link
                  href={getLocalizedLink('/')}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.home || 'Home'}
               </Link>
               <Link
                  href={getLocalizedLink('/about')}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/about' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/about' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.about || 'About'}
               </Link>
               <Link
                  href={getLocalizedLink('/portfolio')}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/portfolio' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/portfolio' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.portfolio || 'Portfolio'}
               </Link>
               <Link
                  href={getLocalizedLink('/contact')}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/contact' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/contact' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.contact || 'Contact'}
               </Link>
               <ThemeToggle />
               <LanguageSwitcher />
            </div>
         </nav>
      </header>
   )
}