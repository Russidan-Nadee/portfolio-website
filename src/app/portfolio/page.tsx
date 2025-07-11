// src/app/portfolio/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

// ProjectCard Component
interface ProjectCardProps {
   project: {
      id: string
      image: string
      platforms: string[]
      featured: boolean
   }
   translations: any
   isVisible: boolean
   index: number
   mousePosition: { x: number; y: number }
}

function ProjectCard({ project, translations, isVisible, index, mousePosition }: ProjectCardProps) {
   const [imageLoaded, setImageLoaded] = useState(false)
   const projectData = translations?.portfolio?.projects?.[project.id]

   if (!projectData) return null

   return (
      <div
         className={`project-card group relative overflow-hidden rounded-xl border transition-all duration-700 cursor-pointer hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            animationDelay: `${index * 200}ms`,
            transform: `translate(${mousePosition.x * (0.05 + index * 0.01)}px, ${mousePosition.y * (0.05 + index * 0.01)}px)`
         }}
         onClick={() => console.log('Navigate to project:', project.id)}
      >
         <div className="relative w-full h-72 overflow-hidden">
            <img
               src={project.image}
               alt={projectData.title}
               className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
               onLoad={() => setImageLoaded(true)}
               onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                     target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-center" style="background: linear-gradient(135deg, var(--muted) 0%, var(--card) 100%); color: var(--muted-foreground)">
                           <div>
                              <div class="text-6xl mb-4 opacity-50">📱</div>
                              <p class="text-lg font-medium">${projectData.title}</p>
                           </div>
                        </div>
                     `
                  }
               }}
            />

            {!imageLoaded && (
               <div className="absolute inset-0 flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="text-4xl opacity-50">⏳</div>
               </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
         </div>

         <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <div className="space-y-3">
               <h3 className="text-2xl font-bold leading-tight group-hover:transform group-hover:translate-y-[-2px] transition-transform duration-300">
                  {projectData.title}
               </h3>
               <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {projectData.tech}
               </p>
               <p className="text-sm opacity-80 leading-relaxed line-clamp-2 group-hover:opacity-100 transition-opacity duration-300">
                  {projectData.description}
               </p>
               <div className="flex items-center justify-between text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                     {projectData.year}
                  </span>
                  <span>{projectData.category}</span>
               </div>
            </div>
         </div>

         {project.featured && (
            <div className="absolute top-4 right-4 z-20">
               <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black backdrop-blur-sm">
                  ⭐ Featured
               </div>
            </div>
         )}
      </div>
   )
}

// PortfolioFilter Component
interface PortfolioFilterProps {
   activeFilter: string
   onFilterChange: (filter: string) => void
   translations: any
   isVisible: boolean
}

function PortfolioFilter({ activeFilter, onFilterChange, translations, isVisible }: PortfolioFilterProps) {
   const filterButtons = [
      { key: 'all', icon: '📁' },
      { key: 'mobile', icon: '📱' },
      { key: 'web', icon: '🌐' },
      { key: 'desktop', icon: '💻' },
      { key: 'crossPlatform', icon: '🔄' },
      { key: 'frontend', icon: '🎨' },
      { key: 'backend', icon: '⚙️' },
      { key: 'fullstack', icon: '🚀' }
   ]

   return (
      <div className={`filter-container transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}>
         <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterButtons.map((filter, index) => (
               <button
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={`filter-button group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 border-2 ${activeFilter === filter.key ? 'filter-active' : 'filter-inactive'
                     }`}
                  style={{
                     backgroundColor: activeFilter === filter.key ? 'var(--foreground)' : 'var(--card)',
                     color: activeFilter === filter.key ? 'var(--background)' : 'var(--foreground)',
                     borderColor: 'var(--border)',
                     animationDelay: `${index * 100}ms`,
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)'
                  }}
               >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>

                  <span className="relative z-10 flex items-center gap-2">
                     <span className="text-lg">{filter.icon}</span>
                     <span className="text-sm font-semibold hidden sm:inline">
                        {translations?.portfolio?.filters?.[filter.key] || filter.key}
                     </span>
                  </span>

                  {activeFilter === filter.key && (
                     <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
               </button>
            ))}
         </div>
      </div>
   )
}

// Main Portfolio Component
export default function Portfolio() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'
   const [activeFilter, setActiveFilter] = useState('all')
   const [mounted, setMounted] = useState(false)
   const [isVisible, setIsVisible] = useState(false)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [visibleProjects, setVisibleProjects] = useState<number[]>([])

   const portfolioRef = useRef<HTMLDivElement>(null)

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

   const translations = getTranslations(locale)

   const projects = [
      {
         id: 'assetManagement',
         image: '/images/projects/asset-management-mobile.jpg',
         platforms: ['mobile', 'crossPlatform', 'fullstack'],
         featured: true
      },
      {
         id: 'calculator',
         image: '/images/projects/calculator-app.jpg',
         platforms: ['desktop', 'frontend'],
         featured: false
      },
      {
         id: 'portfolio',
         image: '/images/projects/portfolio-website.jpg',
         platforms: ['web', 'frontend'],
         featured: false
      },
      {
         id: 'assetDashboard',
         image: '/images/projects/asset-dashboard.jpg',
         platforms: ['web', 'fullstack'],
         featured: true
      }
   ]

   const filteredProjects = projects.filter(project => {
      if (activeFilter === 'all') return true
      return project.platforms.includes(activeFilter)
   })

   useEffect(() => {
      setMounted(true)

      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting && !isVisible) {
                  setIsVisible(true)
               }
            })
         },
         { threshold: 0.1 }
      )

      if (portfolioRef.current) {
         observer.observe(portfolioRef.current)
      }

      return () => observer.disconnect()
   }, [isVisible])

   useEffect(() => {
      if (isVisible) {
         setVisibleProjects([])
         filteredProjects.forEach((_, index) => {
            setTimeout(() => {
               setVisibleProjects(prev => {
                  if (!prev.includes(index)) {
                     return [...prev, index]
                  }
                  return prev
               })
            }, index * 200)
         })
      }
   }, [isVisible, activeFilter])

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         if (portfolioRef.current) {
            const rect = portfolioRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height
            setMousePosition({ x: x * 10, y: y * 10 })
         }
      }

      const section = portfolioRef.current
      if (section && mounted) {
         section.addEventListener('mousemove', handleMouseMove)
         return () => section.removeEventListener('mousemove', handleMouseMove)
      }
   }, [mounted])

   if (!mounted) return null

   return (
      <>
         <style jsx>{`
            @keyframes fadeInUp {
               from { opacity: 0; transform: translateY(40px) scale(0.95); }
               to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes gradientFlow {
               0%, 100% { background-position: 0% 50%; }
               50% { background-position: 100% 50%; }
            }
            @keyframes float {
               0%, 100% { transform: translateY(0px); }
               50% { transform: translateY(-8px); }
            }
            @keyframes slide-up {
               from { opacity: 0; transform: translateY(32px) scale(0.95); }
               to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes fade-in-up {
               from { opacity: 0; transform: translateY(20px); }
               to { opacity: 1; transform: translateY(0); }
            }
            .header-title { animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'}; }
            .header-subtitle { animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both' : 'none'}; }
            .gradient-text {
               background: linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 50%, var(--foreground) 100%);
               background-size: 200% 200%;
               background-clip: text;
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               animation: gradientFlow 3s ease infinite;
            }
            .floating-element { animation: float 3s ease-in-out infinite; }
            .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .project-card:hover { transform: translateY(-8px) scale(1.02) !important; }
            .filter-active { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); transform: translateY(-2px); }
            .filter-inactive:hover {
               background-color: var(--muted) !important;
               transform: translateY(-2px) scale(1.05);
               box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            }
            .filter-button:active { transform: translateY(0) scale(0.95); }
            .project-grid {
               display: grid;
               grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
               gap: 2rem;
               max-width: 1400px;
               margin: 0 auto;
            }
            @media (max-width: 768px) {
               .project-grid { grid-template-columns: 1fr; gap: 1.5rem; max-width: 500px; }
               .filter-button { padding: 0.75rem 1rem; font-size: 0.875rem; }
               .filter-button span:first-child { font-size: 1rem; }
            }
            @media (max-width: 640px) {
               .project-grid { gap: 1rem; max-width: 400px; }
               .filter-container > div { gap: 0.5rem; }
               .filter-button { padding: 0.625rem 0.875rem; font-size: 0.8rem; }
               .filter-button span:last-child { display: none; }
            }
         `}</style>

         <div
            ref={portfolioRef}
            className="min-h-screen relative overflow-hidden"
            style={{ backgroundColor: 'var(--background)' }}
         >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div
                  className="absolute top-20 left-10 w-20 h-20 opacity-5 rounded-full floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                     animationDelay: '0s'
                  }}
               />
               <div
                  className="absolute bottom-32 right-20 w-16 h-16 opacity-5 floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                     transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                     animationDelay: '1s'
                  }}
               />
               <div
                  className="absolute top-1/2 right-1/4 w-12 h-12 opacity-5 floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                     transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                     animationDelay: '2s'
                  }}
               />
            </div>

            <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
               <div className="text-center mb-16">
                  <h1
                     className="header-title text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6 gradient-text"
                     style={{ fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif' }}
                  >
                     {translations?.portfolio?.title || 'Portfolio'}
                  </h1>

                  <p
                     className="header-subtitle text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-80"
                     style={{ color: 'var(--muted-foreground)' }}
                  >
                     {translations?.portfolio?.subtitle || 'Explore my latest projects and technical achievements'}
                  </p>
               </div>

               <PortfolioFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  translations={translations}
                  isVisible={isVisible}
               />

               <div className="project-grid">
                  {filteredProjects.map((project, index) => (
                     <ProjectCard
                        key={`${project.id}-${activeFilter}`}
                        project={project}
                        translations={translations}
                        isVisible={visibleProjects.includes(index)}
                        index={index}
                        mousePosition={mousePosition}
                     />
                  ))}
               </div>

               {filteredProjects.length === 0 && (
                  <div className="text-center py-20">
                     <div className="text-6xl mb-4 opacity-30">🔍</div>
                     <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                        No projects found
                     </h3>
                     <p className="text-lg opacity-70" style={{ color: 'var(--muted-foreground)' }}>
                        Try selecting a different filter
                     </p>
                  </div>
               )}

               {filteredProjects.length > 0 && (
                  <div className="text-center mt-16">
                     <p className="text-sm opacity-60" style={{ color: 'var(--muted-foreground)' }}>
                        Showing {filteredProjects.length} of {projects.length} projects
                     </p>
                  </div>
               )}
            </div>
         </div>
      </>
   )
}