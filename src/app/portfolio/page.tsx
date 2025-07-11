// src/app/portfolio/page.tsx
'use client'

import { useState } from 'react'

export default function Portfolio() {
   const [activeFilter, setActiveFilter] = useState('all')

   const projects = [
      {
         id: 'assetDashboard',
         title: 'RFID Asset Management Dashboard',
         image: '/images/projects/asset-dashboard.jpg',
         tech: 'Flutter, Express, Node.js, Prisma, MySQL',
         category: 'crossplatform',
         tags: ['crossplatform', 'web', 'desktop', 'mobile'] // Cross-platform ติดทุกแท็ก
      },
      {
         id: 'portfolio',
         title: 'Portfolio Website',
         image: '/images/projects/portfolio-website.jpg',
         tech: 'Next.js, TypeScript, Tailwind CSS',
         category: 'web',
         tags: ['web']
      },
      {
         id: 'assetManagement',
         title: 'Asset Management Mobile App ',
         image: '/images/projects/asset-management-mobile.jpg',
         tech: 'Flutter, Node.js, Express, MySQL',
         category: 'mobile',
         tags: ['mobile']
      },
      {
         id: 'calculator',
         title: 'Calculator App',
         image: '/images/projects/calculator-app.jpg',
         tech: 'Python, Tkinter',
         category: 'desktop',
         tags: ['desktop']
      },


   ]

   const filters = [
      { key: 'all', label: 'All Projects', },
      { key: 'crossplatform', label: 'Cross-Platform', },
      { key: 'web', label: 'Web', },
      { key: 'desktop', label: 'Desktop', },
      { key: 'mobile', label: 'Mobile', }
   ]

   const filteredProjects = projects.filter(project => {
      if (activeFilter === 'all') return true
      return project.tags.includes(activeFilter)
   })

   return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
         <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
               Portfolio
            </h1>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
               {filters.map((filter) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
               {filteredProjects.map((project) => (
                  <div key={project.id} className="flex flex-col">
                     <div
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
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

                     {/* Tags - Updated to use CSS variables */}
                     <div className="flex gap-2 mt-4">
                        {project.tags.map((tag) => {
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
         </div>
      </div>
   )
}