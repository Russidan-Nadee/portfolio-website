// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CreativeHero from '../components/home/CreativeHero'
import ProjectsShowcase from '../components/home/ProjectsShowcase'
import Technologies from '../components/home/Technologies'
import th from '../../locales/th.json'
import ja from '../../locales/ja.json'
import en from '../../locales/en.json'

function HomeContent() {
  const [locale, setLocale] = useState('en')

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

  // Helper function to generate localized links
  const getLocalizedLink = (path: string) => {
    // Since we're not using URL params anymore, just return the path
    return path
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <CreativeHero translations={translations} />
      <Technologies translations={translations} />
      <ProjectsShowcase translations={translations} />

      {/* Final CTA Section */}
      <section className="text-center py-20">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--foreground)' }}
        >
          {translations?.home?.cta?.title || "Let's build something great together."}
        </h2>
        <p
          className="mb-6 text-lg md:text-xl"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {translations?.home?.cta?.subtitle || "Looking for a passionate developer? I'm ready to collaborate on your next idea."}
        </p>
        <Link
          href={getLocalizedLink('/contact')}
          className="inline-block px-8 py-4 rounded-lg font-semibold transition hover:scale-105 shadow-md"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {translations?.home?.cta?.button || "Contact Me"}
        </Link>
      </section>
    </div>
  )
}

export default function Home() {
  return <HomeContent />
}