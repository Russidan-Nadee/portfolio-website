// src/app/portfolio/portfolio-website/page.tsx
'use client'

export default function PortfolioWebsitePage() {
   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         <div className="max-w-6xl mx-auto px-8 py-16">
            <h1
               className="text-4xl font-bold mb-8"
               style={{ color: 'var(--foreground)' }}
            >
               Portfolio Website
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