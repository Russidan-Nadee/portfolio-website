// src/components/portfolio/ProjectInfoBar.tsx
'use client'

interface ProjectInfoBarData {
   duration: string
   status: string
   company: string
   technologies: string[]
   labels?: {
      duration: string
      status: string
      company: string
      technology: string
   }
}

interface ProjectInfoBarProps {
   data: ProjectInfoBarData
}

export default function ProjectInfoBar({ data }: ProjectInfoBarProps) {
   const labels = data.labels || {
      duration: 'ระยะเวลาพัฒนา',
      status: 'สถานะ',
      company: 'บริษัท',
      technology: 'เทคโนโลยีหลัก'
   }

   return (
      <div
         className="rounded-2xl p-5 mb-5 border shadow-lg backdrop-blur-sm"
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
         }}
      >
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="text-center">
               <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {labels.duration}
               </div>
               <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  {data.duration}
               </div>
            </div>

            <div className="text-center">
               <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {labels.status}
               </div>
               <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  {data.status}
               </div>
            </div>

            <div className="text-center">
               <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {labels.company}
               </div>
               <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  {data.company}
               </div>
            </div>

            <div className="text-center">
               <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  {labels.technology}
               </div>
               <div className="flex flex-wrap justify-center gap-2">
                  {data.technologies.map((tech, index) => (
                     <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                     >
                        {tech}
                     </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}