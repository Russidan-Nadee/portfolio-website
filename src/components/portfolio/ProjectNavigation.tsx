// src/components/portfolio/ProjectNavigation.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProjectNavigationData {
   backLink: string
   backText: string
   projectNumber: number
   totalProjects: number
   prevProjectSlug?: string
   nextProjectSlug?: string
}

interface ProjectNavigationProps {
   data: ProjectNavigationData
}

export default function ProjectNavigation({ data }: ProjectNavigationProps) {
   const router = useRouter()

   const handleNavigation = (slug: string) => {
      router.push(`/portfolio/${slug}`)
   }

   return (
      <div
         className="rounded-2xl p-4 mb-5 backdrop-blur-sm border flex justify-between items-center shadow-lg"
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            backdropFilter: 'blur(10px)'
         }}
      >
         <Link
            href={data.backLink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-70"
            style={{ color: 'var(--foreground)' }}
         >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {data.backText}
         </Link>

         <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <span
               className="px-3 py-1 rounded-full font-medium"
               style={{ backgroundColor: 'var(--muted)' }}
            >
               โปรเจคที่ {data.projectNumber} จาก {data.totalProjects}
            </span>
            <div className="flex gap-2">
               <button
                  className={`w-9 h-9 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${data.prevProjectSlug ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
                     }`}
                  style={{
                     borderColor: 'var(--border)',
                     backgroundColor: 'var(--card)',
                     color: data.prevProjectSlug ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  disabled={!data.prevProjectSlug}
                  onClick={() => {
                     if (data.prevProjectSlug) {
                        handleNavigation(data.prevProjectSlug)
                     }
                  }}
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
               </button>
               <button
                  className={`w-9 h-9 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${data.nextProjectSlug ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
                     }`}
                  style={{
                     borderColor: 'var(--border)',
                     backgroundColor: 'var(--card)',
                     color: data.nextProjectSlug ? 'var(--foreground)' : 'var(--muted-foreground)'
                  }}
                  disabled={!data.nextProjectSlug}
                  onClick={() => {
                     if (data.nextProjectSlug) {
                        handleNavigation(data.nextProjectSlug)
                     }
                  }}
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
               </button>
            </div>
         </div>
      </div>
   )
}