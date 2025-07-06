// src/app/contact/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Contact() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../../locales/th.json') : require('../../../locales/en.json')

   return (
      <div className="max-w-4xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8">
            {translations.contact.title}
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h2 className="text-2xl font-semibold mb-4">
                  {translations.contact.info.title}
               </h2>
               <div className="space-y-4">
                  <div>
                     <h3 className="font-semibold">
                        {translations.contact.info.email}
                     </h3>
                     <p className="text-gray-600">hello@myportfolio.com</p>
                  </div>
                  <div>
                     <h3 className="font-semibold">
                        {translations.contact.info.phone}
                     </h3>
                     <p className="text-gray-600">+66 (0) 123-456-789</p>
                  </div>
                  <div>
                     <h3 className="font-semibold">
                        {translations.contact.info.location}
                     </h3>
                     <p className="text-gray-600">Bangkok, Thailand</p>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-semibold mb-4">
                  {translations.contact.form.title}
               </h2>
               <form className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium mb-1">
                        {translations.contact.form.name}
                     </label>
                     <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={translations.contact.form.namePlaceholder}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">
                        {translations.contact.form.email}
                     </label>
                     <input
                        type="email"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={translations.contact.form.emailPlaceholder}
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">
                        {translations.contact.form.message}
                     </label>
                     <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={translations.contact.form.messagePlaceholder}
                     ></textarea>
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800 transition-colors">
                     {translations.contact.form.submit}
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}