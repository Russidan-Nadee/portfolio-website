// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

export default function Header() {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../locales/th.json') : require('../../locales/en.json')

   return (
      <header className="p-4 border-b transition-colors" style={{
         backgroundColor: 'var(--background)',
         borderColor: 'var(--border)',
         color: 'var(--foreground)'
      }}>
         <nav className="flex justify-between items-center max-w-6xl mx-auto">
            {/* Logo */}
            <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
               <Link href={locale === 'th' ? '/?lang=th' : '/'}>{translations.header.logo}</Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center space-x-6">
               <Link
                  href={locale === 'th' ? '/?lang=th' : '/'}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations.header.nav.home}
               </Link>
               <Link
                  href={locale === 'th' ? '/about?lang=th' : '/about'}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/about' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/about' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations.header.nav.about}
               </Link>
               <Link
                  href={locale === 'th' ? '/portfolio?lang=th' : '/portfolio'}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/portfolio' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/portfolio' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations.header.nav.portfolio}
               </Link>
               <Link
                  href={locale === 'th' ? '/contact?lang=th' : '/contact'}
                  className={`hover:opacity-70 pb-1 transition-all ${pathname === '/contact' ? 'border-b-2' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     borderColor: pathname === '/contact' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations.header.nav.contact}
               </Link>
               <ThemeToggle />
               <LanguageSwitcher />
            </div>
         </nav>
      </header>
   )
}