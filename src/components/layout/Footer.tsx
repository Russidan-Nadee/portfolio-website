// src/components/Footer.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

export default function Footer() {
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

   // Load translations with fallback
   const translations = getTranslations(locale)

   // Helper function to generate localized links
   const getLocalizedLink = (path: string) => {
      if (locale === 'en') {
         return path
      }
      return `${path}?lang=${locale}`
   }

   const socialLinks = [
      {
         name: 'GitHub',
         icon: FaGithub,
         url: 'https://github.com/Russidan-Nadee',
         color: '#6b7280'
      },
      {
         name: 'LinkedIn',
         icon: FaLinkedin,
         url: 'https://www.linkedin.com/in/russidan-nadee-1734a2352/',
         color: '#0ea5e9'
      },
      {
         name: 'Facebook',
         icon: FaFacebook,
         url: 'https://www.facebook.com/russidan.nadee.2025',
         color: '#1877f2'
      },
      {
         name: 'Instagram',
         icon: FaInstagram,
         url: 'https://www.instagram.com/firstl._/',
         color: '#e91e63'
      }
   ]

   return (
      <footer
         className="border-t mt-auto"
         style={{
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)'
         }}
      >
         <div className="max-w-6xl mx-auto px-8 py-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-8">

               {/* Quick Navigation */}
               <div>
                  <h3
                     className="font-semibold text-lg mb-4"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.footer?.sections?.quickLinks || 'Quick Links'}
                  </h3>
                  <nav className="space-y-3">
                     <Link
                        href={getLocalizedLink('/')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.header?.nav?.home || 'Home'}
                     </Link>
                     <Link
                        href={getLocalizedLink('/about')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.header?.nav?.about || 'About'}
                     </Link>
                     <Link
                        href={getLocalizedLink('/portfolio')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.header?.nav?.portfolio || 'Portfolio'}
                     </Link>
                     <Link
                        href={getLocalizedLink('/contact')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.header?.nav?.contact || 'Contact'}
                     </Link>
                  </nav>
               </div>

               {/* Contact Information */}
               <div>
                  <h3
                     className="font-semibold text-lg mb-4"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.footer?.sections?.contact || 'Contact'}
                  </h3>
                  <div className="space-y-3">
                     <div
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        russidan.nadee@gmail.com
                     </div>
                     <div
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        +66 93-108-9420
                     </div>
                     <div
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.footer?.location || 'Bangkok, Thailand'}
                     </div>
                  </div>
               </div>

               {/* Social Media */}
               <div>
                  <h3
                     className="font-semibold text-lg mb-4"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.footer?.sections?.followMe || 'Follow Me'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 w-[132px]">
                     {socialLinks.map((social) => {
                        const IconComponent = social.icon
                        return (
                           <a
                              key={social.name}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-14 h-14 rounded-lg hover:scale-110 transition-all duration-300 flex items-center justify-center"
                              style={{
                                 backgroundColor: 'var(--card)',
                                 border: '1px solid var(--border)'
                              }}
                              aria-label={social.name}
                           >
                              <IconComponent
                                 size={18}
                                 style={{ color: social.color }}
                              />
                           </a>
                        )
                     })}
                  </div>
               </div>

               {/* Legal & Copyright */}
               <div>
                  <h3
                     className="font-semibold text-lg mb-4"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.footer?.sections?.legal || 'Legal'}
                  </h3>
                  <nav className="space-y-3">
                     <Link
                        href={getLocalizedLink('/privacy-policy')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.footer?.legal?.privacyPolicy || 'Privacy Policy'}
                     </Link>
                     <Link
                        href={getLocalizedLink('/terms-of-service')}
                        className="block hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--muted-foreground)' }}
                     >
                        {translations?.footer?.legal?.termsOfService || 'Terms of Service'}
                     </Link>
                  </nav>
               </div>

               {/* Language Switcher */}
               <div>
                  <h3
                     className="font-semibold text-lg mb-4"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.footer?.sections?.language || 'Language'}
                  </h3>
                  <div className="space-y-2">
                     <button
                        onClick={() => {
                           const url = new URL(window.location.href)
                           url.searchParams.delete('lang')
                           window.location.href = url.pathname + url.search
                        }}
                        className={`block text-sm hover:opacity-70 transition-opacity text-left ${locale === 'en' ? 'font-semibold' : ''}`}
                        style={{ color: locale === 'en' ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                     >
                        🇺🇸 English
                     </button>
                     <button
                        onClick={() => {
                           const url = new URL(window.location.href)
                           url.searchParams.set('lang', 'th')
                           window.location.href = url.pathname + url.search
                        }}
                        className={`block text-sm hover:opacity-70 transition-opacity text-left ${locale === 'th' ? 'font-semibold' : ''}`}
                        style={{ color: locale === 'th' ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                     >
                        🇹🇭 ไทย
                     </button>
                     <button
                        onClick={() => {
                           const url = new URL(window.location.href)
                           url.searchParams.set('lang', 'ja')
                           window.location.href = url.pathname + url.search
                        }}
                        className={`block text-sm hover:opacity-70 transition-opacity text-left ${locale === 'ja' ? 'font-semibold' : ''}`}
                        style={{ color: locale === 'ja' ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                     >
                        🇯🇵 日本語
                     </button>
                  </div>
               </div>
            </div>

            {/* Bottom Section */}
            <div
               className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
               style={{ borderColor: 'var(--border)' }}
            >
               <p
                  className="text-sm text-center md:text-left"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.footer?.copyright || '© 2024 Russidan Nadee. All rights reserved.'}
               </p>

               <p
                  className="text-sm text-center md:text-right"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.footer?.builtWith || 'Built with Next.js & TypeScript'}
               </p>
            </div>
         </div>
      </footer>
   )
}