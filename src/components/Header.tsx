// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../locales/th.json') : require('../../locales/en.json')

   return (
      <header className="p-4 border-b">
         <nav className="flex justify-between items-center max-w-6xl mx-auto">
            {/* Logo */}
            <div className="text-xl font-bold">
               <Link href={locale === 'th' ? '/?lang=th' : '/'}>{translations.header.logo}</Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center space-x-6">
               <Link
                  href={locale === 'th' ? '/?lang=th' : '/'}
                  className={`hover:text-gray-600 pb-1 ${pathname === '/' ? 'border-b-2 border-white' : ''
                     }`}
               >
                  {translations.header.nav.home}
               </Link>
               <Link
                  href={locale === 'th' ? '/about?lang=th' : '/about'}
                  className={`hover:text-gray-600 pb-1 ${pathname === '/about' ? 'border-b-2 border-white' : ''
                     }`}
               >
                  {translations.header.nav.about}
               </Link>
               <Link
                  href={locale === 'th' ? '/portfolio?lang=th' : '/portfolio'}
                  className={`hover:text-gray-600 pb-1 ${pathname === '/portfolio' ? 'border-b-2 border-white' : ''
                     }`}
               >
                  {translations.header.nav.portfolio}
               </Link>
               <Link
                  href={locale === 'th' ? '/contact?lang=th' : '/contact'}
                  className={`hover:text-gray-600 pb-1 ${pathname === '/contact' ? 'border-b-2 border-white' : ''
                     }`}
               >
                  {translations.header.nav.contact}
               </Link>
               <LanguageSwitcher />
            </div>
         </nav>
      </header>
   )
}