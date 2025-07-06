// src/app/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const searchParams = useSearchParams()
  const locale = searchParams.get('lang') || 'en'

  // Load translations based on current locale
  const translations = locale === 'th' ? require('../../locales/th.json') : require('../../locales/en.json')

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 mb-4">
          {translations.home.intro}
        </p>

        <h1 className="text-6xl font-bold mb-4">
          {translations.home.title}
        </h1>

        <h2 className="text-4xl text-gray-400 mb-8">
          {translations.home.subtitle}
        </h2>

        <p className="text-gray-600 mb-12">
          {translations.home.location}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href={locale === 'th' ? '/portfolio?lang=th' : '/portfolio'}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            {translations.home.buttons.portfolio}
          </Link>
          <Link
            href={locale === 'th' ? '/contact?lang=th' : '/contact'}
            className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 transition-colors"
          >
            {translations.home.buttons.contact}
          </Link>
        </div>
      </div>
    </div>
  )
}