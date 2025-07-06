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
         <h1 className="text-4xl font-bold mb-8">
            {translations.portfolio.title}
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
               <h3 className="text-xl font-semibold mb-4">
                  {translations.portfolio.projects.web1.title}
               </h3>
               <p className="text-gray-600 mb-4">
                  {translations.portfolio.projects.web1.description}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">
                  {translations.portfolio.projects.web1.tech}
               </p>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
               <h3 className="text-xl font-semibold mb-4">
                  {translations.portfolio.projects.photo1.title}
               </h3>
               <p className="text-gray-600 mb-4">
                  {translations.portfolio.projects.photo1.description}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">
                  {translations.portfolio.projects.photo1.tech}
               </p>
            </div>

            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
               <h3 className="text-xl font-semibold mb-4">
                  {translations.portfolio.projects.web2.title}
               </h3>
               <p className="text-gray-600 mb-4">
                  {translations.portfolio.projects.web2.description}
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">
                  {translations.portfolio.projects.web2.tech}
               </p>
            </div>
         </div>
      </div>
   )
}