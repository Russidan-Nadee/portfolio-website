// src/app/portfolio/asset-management/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function AssetManagementPage() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'
   const [mounted, setMounted] = useState(false)

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         <div className="max-w-6xl mx-auto px-8 py-16">
            <h1
               className="text-4xl font-bold mb-8"
               style={{ color: 'var(--foreground)' }}
            >
               Asset Management Mobile App
            </h1>

            <div
               className="p-8 rounded-lg"
               style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
            >
               <p>Project details coming soon...</p>
            </div>
         </div>
      </div>
   )
}