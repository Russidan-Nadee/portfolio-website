// src/app/portfolio/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Portfolio() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../../locales/th.json') : require('../../../locales/en.json')

   return (
      <div className="max-w-6xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
            {translations.portfolio.title}
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Asset Management Project Card */}
            <div
               className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
               }}
            >
               <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations.portfolio.projects.assetManagement.title}
               </h3>
               <p
                  className="mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.portfolio.projects.assetManagement.description}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                  <img
                     src="/images/asset-management.png"
                     alt="Asset Management"
                     className="w-full h-full object-cover"
                  />
               </div>
               <p
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.portfolio.projects.assetManagement.tech}
               </p>
            </div>
            {/* Calculator Project Card */}
            <div
               className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
               }}
            >
               <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: 'var(--foreground)' }}
               >
                  {translations.portfolio.projects.calculator.title}
               </h3>
               <p
                  className="mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.portfolio.projects.calculator.description}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                  <img
                     src="/images/calculator-project.png"
                     alt="Calculator Project"
                     className="w-full h-full object-cover"
                  />
               </div>
               <p
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations.portfolio.projects.calculator.tech}
               </p>
            </div>


         </div>
      </div>
   )
}