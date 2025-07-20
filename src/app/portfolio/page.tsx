// src/app/portfolio/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

function PortfolioContent() {
   const [locale, setLocale] = useState('en')
   const [mounted, setMounted] = useState(false)
   const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

   const getTranslations = (locale: string) => {
      switch (locale) {
         case 'th': return th
         case 'ja': return ja
         default: return en
      }
   }

   const translations = getTranslations(locale)

   const [activeFilter, setActiveFilter] = useState('all')

   // Language change handler
   useEffect(() => {
      // Get initial language from localStorage
      setLocale(localStorage.getItem('lang') || 'en')

      // Listen for language changes
      const handleLanguageChange = (e: any) => {
         setLocale(e.detail.language)
      }

      window.addEventListener('languageChange', handleLanguageChange)
      return () => window.removeEventListener('languageChange', handleLanguageChange)
   }, [])

   // Helper function to generate localized links
   const getLocalizedLink = (path: string) => {
      // Since we're not using URL params anymore, just return the path
      return path
   }

   const projects = [
      {
         id: 'assetDashboard',
         title: translations?.portfolio?.projects?.assetDashboard?.title || 'RFID Asset Dashboard',
         image: '/images/projects/asset-dashboard.jpg',
         tech: translations?.portfolio?.projects?.assetDashboard?.tech || 'Flutter, Node.js, Express, MySQL',
         category: 'crossplatform',
         tags: ['crossplatform', 'web', 'desktop', 'mobile'],
         slug: 'asset-dashboard'
      },
      {
         id: 'portfolio',
         title: translations?.portfolio?.projects?.portfolio?.title || 'Portfolio Website',
         image: '/images/projects/portfolio-website.jpg',
         tech: translations?.portfolio?.projects?.portfolio?.tech || 'Next.js, TypeScript, Tailwind CSS',
         category: 'web',
         tags: ['web'],
         slug: 'portfolio-website'
      },
      {
         id: 'assetManagement',
         title: translations?.portfolio?.projects?.assetManagement?.title || 'Asset Management',
         image: '/images/projects/asset-management-mobile.jpg',
         tech: translations?.portfolio?.projects?.assetManagement?.tech || 'Flutter, Node.js, Express, MySQL',
         category: 'mobile',
         tags: ['mobile'],
         slug: 'asset-management'
      },
      {
         id: 'calculator',
         title: translations?.portfolio?.projects?.calculator?.title || 'Calculator App',
         image: '/images/projects/calculator-app.jpg',
         tech: translations?.portfolio?.projects?.calculator?.tech || 'Python, Tkinter',
         category: 'desktop',
         tags: ['desktop'],
         slug: 'calculator'
      },
   ]

   const filters = [
      { key: 'all', label: 'All Projects' },
      { key: 'crossplatform', label: 'Cross-Platform' },
      { key: 'web', label: 'Web' },
      { key: 'desktop', label: 'Desktop' },
      { key: 'mobile', label: 'Mobile' }
   ]

   const filteredProjects = projects.filter(project =>
      activeFilter === 'all' ? true : project.tags.includes(activeFilter)
   )

   // Stagger animation for projects
   useEffect(() => {
      setMounted(true)

      const timer = setTimeout(() => {
         filteredProjects.forEach((_, index) => {
            setTimeout(() => {
               setVisibleItems(prev => new Set([...prev, index]))
            }, index * 100)
         })
      }, 100)

      return () => clearTimeout(timer)
   }, [locale, activeFilter, filteredProjects])

   if (!mounted) return null

   return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
         <div className="w-full max-w-6xl mx-auto">

            {/* Headline + Subtitle with fade-in-up animation */}
            <div
               className="mb-12 animate-fade-in-up"
               style={{
                  minHeight: '40vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'var(--foreground)',
                  animationDelay: '0.1s',
                  animationFillMode: 'both'
               }}
            >
               <h1 className="text-5xl md:text-7xl font-extrabold mb-2">
                  {translations?.portfolio?.title || 'Portfolio'}
               </h1>
               <p className="text-sm md:text-base text-muted-foreground">
                  {translations?.portfolio?.subtitle || 'Explore my latest projects and technical achievements'}
               </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
               {filters.map(filter => (
                  <button
                     key={filter.key}
                     onClick={() => setActiveFilter(filter.key)}
                     className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 border ${activeFilter === filter.key
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                        }`}
                     style={{
                        backgroundColor: activeFilter === filter.key ? 'var(--foreground)' : 'var(--card)',
                        color: activeFilter === filter.key ? 'var(--background)' : 'var(--foreground)',
                        borderColor: 'var(--border)'
                     }}
                  >
                     {filter.label}
                  </button>
               ))}
            </div>

            {/* Project grid with staggered animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
               {filteredProjects.map((project, index) => (
                  <div
                     key={project.id}
                     className={`flex flex-col ${visibleItems.has(index) ? 'animate-fade-in-up' : 'opacity-0'}`}
                     style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                     <Link href={getLocalizedLink(`/portfolio/${project.slug}`)}>
                        <div
                           className="border rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-500 ease-in-out relative cursor-pointer"
                           style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)'
                           }}
                        >
                           <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-auto block"
                              onError={(e) => {
                                 const target = e.target as HTMLImageElement
                                 target.style.display = 'none'
                                 if (target.parentElement) {
                                    target.parentElement.innerHTML = `
                                       <div class="w-full h-60 flex items-center justify-center" style="background-color: var(--muted); color: var(--muted-foreground)">
                                          <div class="text-center">
                                             <div class="text-4xl mb-2">📱</div>
                                             <p>${project.title}</p>
                                          </div>
                                       </div>
                                    `
                                 }
                              }}
                           />
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                              <h3 className="text-white text-2xl font-bold mb-2">
                                 {project.title}
                              </h3>
                              <p className="text-white/90 text-sm">
                                 {project.tech}
                              </p>
                           </div>
                        </div>
                     </Link>

                     {/* Tags */}
                     <div className="flex gap-2 mt-4">
                        {project.tags.map(tag => {
                           const tagInfo = filters.find(f => f.key === tag)
                           return tagInfo ? (
                              <div
                                 key={tag}
                                 className="px-3 py-1 rounded text-xs font-medium transition-all duration-300 hover:opacity-80"
                                 style={{
                                    backgroundColor: 'var(--foreground)',
                                    color: 'var(--background)'
                                 }}
                              >
                                 {tagInfo.label}
                              </div>
                           ) : null
                        })}
                     </div>
                  </div>
               ))}
            </div>

            {/* Global Styles */}
            <style jsx global>{`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .animate-fade-in-up {
                animation: fade-in-up 0.6s ease-out;
                animation-fill-mode: both;
              }

              /* Smooth transitions for all interactive elements */
              * {
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              }

              /* Custom scrollbar for better UX */
              ::-webkit-scrollbar {
                width: 8px;
              }

              ::-webkit-scrollbar-track {
                background: var(--muted);
                border-radius: 4px;
              }

              ::-webkit-scrollbar-thumb {
                background: var(--muted-foreground);
                border-radius: 4px;
                opacity: 0.5;
              }

              ::-webkit-scrollbar-thumb:hover {
                opacity: 0.8;
              }
            `}</style>
         </div>
      </div>
   )
}

export default function Portfolio() {
   return <PortfolioContent />
}