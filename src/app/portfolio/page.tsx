// src/app/portfolio/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Portfolio() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Helper function to get translations based on locale
   const getTranslations = (locale: string) => {
      switch (locale) {
         case 'th':
            return require('../../../locales/th.json')
         case 'ja':
            return require('../../../locales/ja.json')
         default:
            return require('../../../locales/en.json')
      }
   }

   // Load translations with fallback
   const translations = getTranslations(locale)

   return (
      <div className="max-w-6xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
            {translations?.portfolio?.title || 'Portfolio'}
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
                  {translations?.portfolio?.projects?.assetManagement?.title || 'Asset Management'}
               </h3>
               <p
                  className="mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.portfolio?.projects?.assetManagement?.description || 'Mobile asset management system featuring real-time tracking, dashboard analytics, and comprehensive reporting'}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                  <img
                     src="/images/asset-management.png"
                     alt={translations?.portfolio?.projects?.assetManagement?.title || 'Asset Management'}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        if (target.parentElement) {
                           target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-center" style="background-color: var(--muted); color: var(--muted-foreground)">
                                 <div>
                                    <div class="text-4xl mb-2">📱</div>
                                    <p class="text-sm">Asset Management</p>
                                 </div>
                              </div>
                           `
                        }
                     }}
                  />
               </div>
               <p
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.portfolio?.projects?.assetManagement?.tech || 'Flutter, Node.js, Express, MySQL'}
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
                  {translations?.portfolio?.projects?.calculator?.title || 'Calculator App'}
               </h3>
               <p
                  className="mb-4"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.portfolio?.projects?.calculator?.description || 'A modern calculator app featuring a clean and minimalist interface'}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                  <img
                     src="/images/calculator-project.png"
                     alt={translations?.portfolio?.projects?.calculator?.title || 'Calculator Project'}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        if (target.parentElement) {
                           target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-center" style="background-color: var(--muted); color: var(--muted-foreground)">
                                 <div>
                                    <div class="text-4xl mb-2">🧮</div>
                                    <p class="text-sm">Calculator App</p>
                                 </div>
                              </div>
                           `
                        }
                     }}
                  />
               </div>
               <p
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
               >
                  {translations?.portfolio?.projects?.calculator?.tech || 'Python, Tkinter'}
               </p>
            </div>
         </div>
      </div>
   )
}