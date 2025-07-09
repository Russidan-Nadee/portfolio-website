// src/app/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import CreativeHero from '../components/CreativeHero'

export default function Home() {
  const searchParams = useSearchParams()
  const locale = searchParams.get('lang') || 'en'

  // Load translations based on current locale
  const translations = locale === 'th' ? require('../../locales/th.json') : require('../../locales/en.json')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <CreativeHero />
    </div>
  )
}