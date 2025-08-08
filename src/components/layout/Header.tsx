// src/components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeProvider'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

export default function Header() {
   const pathname = usePathname()
   const { theme } = useTheme()
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [mounted, setMounted] = useState(false)
   const [locale, setLocale] = useState('en')

   // Language change handler
   useEffect(() => {
      // Get initial language from localStorage
      setLocale(localStorage.getItem('lang') || 'en')

      // Listen for language changes
      const handleLanguageChange = (e: any) => {
         setLocale(e.detail.language)
      }

      window.addEventListener('languageChange', handleLanguageChange)
      return () => window.removeEventListener('languageChange', handleLanguageChange)
   }, [])

   useEffect(() => {
      setMounted(true)
   }, [])

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
      // Since we're not using URL params anymore, just return the path
      return path
   }

   // Close menu when clicking outside or on link
   const closeMenu = () => {
      setIsMenuOpen(false)
   }

   // Prevent body scroll when menu is open
   useEffect(() => {
      if (isMenuOpen) {
         document.body.style.overflow = 'hidden'
      } else {
         document.body.style.overflow = 'unset'
      }

      return () => {
         document.body.style.overflow = 'unset'
      }
   }, [isMenuOpen])

   if (!mounted) return null

   return (
      <>
         <header className="h-16 flex items-center px-4 border-b-2 transition-colors relative z-50" style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)'
         }}>
            <nav className="flex justify-between items-center max-w-6xl mx-auto w-full">
               {/* Logo */}
               <div className="flex items-center">
                  <Link href={getLocalizedLink('/')} className="flex items-center" onClick={closeMenu}>
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

               {/* Desktop Navigation Menu */}
               <div className="hidden md:flex items-center space-x-6">
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
                     className={`hover:opacity-70 pb-1 transition-all ${pathname.startsWith('/about') ? 'border-b-2' : ''
                        }`}
                     style={{
                        color: 'var(--foreground)',
                        borderColor: pathname.startsWith('/about') ? 'var(--foreground)' : 'transparent'
                     }}
                  >
                     {translations?.header?.nav?.about || 'About'}
                  </Link>
                  <Link
                     href={getLocalizedLink('/portfolio')}
                     className={`hover:opacity-70 pb-1 transition-all ${pathname.startsWith('/portfolio') ? 'border-b-2' : ''
                        }`}
                     style={{
                        color: 'var(--foreground)',
                        borderColor: pathname.startsWith('/portfolio') ? 'var(--foreground)' : 'transparent'
                     }}
                  >
                     {translations?.header?.nav?.portfolio || 'Portfolio'}
                  </Link>
                  <Link
                     href={getLocalizedLink('/contact')}
                     className={`hover:opacity-70 pb-1 transition-all ${pathname.startsWith('/contact') ? 'border-b-2' : ''
                        }`}
                     style={{
                        color: 'var(--foreground)',
                        borderColor: pathname.startsWith('/contact') ? 'var(--foreground)' : 'transparent'
                     }}
                  >
                     {translations?.header?.nav?.contact || 'Contact'}
                  </Link>
                  <ThemeToggle />
                  <LanguageSwitcher />
               </div>

               {/* Mobile Menu Button */}
               <div className="md:hidden flex items-center space-x-3">
                  <ThemeToggle />
                  <button
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
                     style={{ backgroundColor: 'var(--muted)' }}
                     aria-label="Toggle menu"
                  >
                     <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                        <span
                           className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                           style={{ backgroundColor: 'var(--foreground)' }}
                        />
                        <span
                           className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
                           style={{ backgroundColor: 'var(--foreground)' }}
                        />
                        <span
                           className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                           style={{ backgroundColor: 'var(--foreground)' }}
                        />
                     </div>
                  </button>
               </div>
            </nav>
         </header>

         {/* Mobile Menu Overlay */}
         {isMenuOpen && (
            <div
               className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
               onClick={closeMenu}
            />
         )}

         {/* Mobile Menu Slide Panel */}
         <div className={`
            fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 md:hidden
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
         `}
            style={{
               backgroundColor: 'var(--background)',
               borderLeft: '1px solid var(--border)'
            }}>
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--border)' }}>
               <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Menu
               </h3>
               <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
                  style={{ backgroundColor: 'var(--muted)' }}
                  aria-label="Close menu"
               >
                  <svg
                     className="w-5 h-5"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     style={{ color: 'var(--foreground)' }}
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col p-6 space-y-4">
               {/* Navigation Links */}
               <Link
                  href={getLocalizedLink('/')}
                  onClick={closeMenu}
                  className={`text-lg py-3 px-4 rounded-lg transition-all hover:bg-opacity-80 ${pathname === '/' ? 'border-l-4' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     backgroundColor: pathname === '/' ? 'var(--muted)' : 'transparent',
                     borderColor: pathname === '/' ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.home || 'Home'}
               </Link>
               <Link
                  href={getLocalizedLink('/about')}
                  onClick={closeMenu}
                  className={`text-lg py-3 px-4 rounded-lg transition-all hover:bg-opacity-80 ${pathname.startsWith('/about') ? 'border-l-4' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     backgroundColor: pathname.startsWith('/about') ? 'var(--muted)' : 'transparent',
                     borderColor: pathname.startsWith('/about') ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.about || 'About'}
               </Link>
               <Link
                  href={getLocalizedLink('/portfolio')}
                  onClick={closeMenu}
                  className={`text-lg py-3 px-4 rounded-lg transition-all hover:bg-opacity-80 ${pathname.startsWith('/portfolio') ? 'border-l-4' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     backgroundColor: pathname.startsWith('/portfolio') ? 'var(--muted)' : 'transparent',
                     borderColor: pathname.startsWith('/portfolio') ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.portfolio || 'Portfolio'}
               </Link>
               <Link
                  href={getLocalizedLink('/contact')}
                  onClick={closeMenu}
                  className={`text-lg py-3 px-4 rounded-lg transition-all hover:bg-opacity-80 ${pathname.startsWith('/contact') ? 'border-l-4' : ''
                     }`}
                  style={{
                     color: 'var(--foreground)',
                     backgroundColor: pathname.startsWith('/contact') ? 'var(--muted)' : 'transparent',
                     borderColor: pathname.startsWith('/contact') ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {translations?.header?.nav?.contact || 'Contact'}
               </Link>

               {/* Language Switcher */}
               <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm font-medium mb-3 opacity-70" style={{ color: 'var(--foreground)' }}>
                     Language
                  </p>
                  <LanguageSwitcher />
               </div>
            </div>
         </div>
      </>
   )
}