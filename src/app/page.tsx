// src/app/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import CreativeHero from '../components/CreativeHero'
import th from '../../locales/th.json'
import ja from '../../locales/ja.json'
import en from '../../locales/en.json'

export default function Home() {
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <CreativeHero translations={translations} />
    </div>
  )
}