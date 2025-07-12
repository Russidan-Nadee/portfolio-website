'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CreativeHero from '../components/home/CreativeHero'
import ProjectsShowcase from '../components/home/ProjectsShowcase'
import Technologies from '../components/home/Technologies'
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
      <Technologies translations={translations} />
      <ProjectsShowcase translations={translations} />

      {/* Final CTA Section */}
      <section className="text-center py-20">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: 'var(--foreground)' }}
        >
          {translations?.home?.cta?.title || "Let’s build something great together."}
        </h2>
        <p
          className="mb-6 text-lg md:text-xl"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {translations?.home?.cta?.subtitle || "Looking for a passionate developer? I'm ready to collaborate on your next idea."}
        </p>
        <Link
          href={locale === 'en' ? '/contact' : `/contact?lang=${locale}`}
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
