// src/components/ProjectCard.tsx
'use client'

import { useState, useRef } from 'react'

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

export default function ProjectCard({
   project,
   translations,
   isVisible,
   index,
   mousePosition
}: ProjectCardProps) {
   const [imageLoaded, setImageLoaded] = useState(false)
   const cardRef = useRef<HTMLDivElement>(null)

   const projectData = translations?.portfolio?.projects?.[project.id]

   if (!projectData) return null

   return (
      <div
         ref={cardRef}
         className={`project-card group relative overflow-hidden rounded-xl border transition-all duration-700 cursor-pointer hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            animationDelay: `${index * 200}ms`,
            transform: `translate(${mousePosition.x * (0.05 + index * 0.01)}px, ${mousePosition.y * (0.05 + index * 0.01)}px)`
         }}
         onClick={() => {
            // Handle project click - could navigate to project detail
            console.log('Navigate to project:', project.id)
         }}
      >
         {/* Project Image */}
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

            {/* Loading placeholder */}
            {!imageLoaded && (
               <div className="absolute inset-0 flex items-center justify-center animate-pulse" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="text-4xl opacity-50">⏳</div>
               </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
         </div>

         {/* Content */}
         <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <div className="space-y-3">
               {/* Title */}
               <h3 className="text-2xl font-bold leading-tight group-hover:transform group-hover:translate-y-[-2px] transition-transform duration-300">
                  {projectData.title}
               </h3>

               {/* Tech Stack */}
               <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {projectData.tech}
               </p>

               {/* Description */}
               <p className="text-sm opacity-80 leading-relaxed line-clamp-2 group-hover:opacity-100 transition-opacity duration-300">
                  {projectData.description}
               </p>

               {/* Year & Category */}
               <div className="flex items-center justify-between text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                     {projectData.year}
                  </span>
                  <span>{projectData.category}</span>
               </div>
            </div>
         </div>

         {/* Featured Badge */}
         {project.featured && (
            <div className="absolute top-4 right-4 z-20">
               <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black backdrop-blur-sm">
                  ⭐ Featured
               </div>
            </div>
         )}

         <style jsx>{`
            @keyframes slide-up {
               from {
                  opacity: 0;
                  transform: translateY(32px) scale(0.95);
               }
               to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
               }
            }

            .animate-slide-up {
               animation: slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            .line-clamp-2 {
               display: -webkit-box;
               -webkit-line-clamp: 2;
               -webkit-box-orient: vertical;
               overflow: hidden;
            }

            .project-card:hover {
               transform: translateY(-8px) scale(1.02);
            }
         `}</style>
      </div>
   )
}