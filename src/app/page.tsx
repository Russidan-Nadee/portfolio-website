// src/app/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import CreativeHero from '../components/CreativeHero'

export default function Home() {
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <CreativeHero translations={translations} />
    </div>
  )
}