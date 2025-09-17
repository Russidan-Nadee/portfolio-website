// src/components/portfolio/ProjectHeader.tsx
'use client'

interface ProjectHeaderData {
   title: string
   description: string
   tags: string[]
   githubUrl?: string
   demoUrl?: string
   liveUrl?: string
}

interface ProjectHeaderProps {
   data: ProjectHeaderData
}

export default function ProjectHeader({ data }: ProjectHeaderProps) {
   return (
      <div
         className="rounded-2xl p-6 mb-5 border shadow-lg backdrop-blur-sm"
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
         }}
      >
         <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {data.title}
         </h1>
         <p className="text-lg mb-4" style={{ color: 'var(--muted-foreground)' }}>
            {data.description}
         </p>

         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-2">
               {data.tags.map((tag, index) => (
                  <span
                     key={index}
                     className="px-3 py-1 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                     style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)'
                     }}
                  >
                     {tag}
                  </span>
               ))}
            </div>

            {(data.githubUrl || data.demoUrl || data.liveUrl) && (
               <div className="flex flex-wrap gap-3">
                  {data.demoUrl && (
                     <a
                        href={data.demoUrl}
                        download="Python-Calculator.exe"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 16l-6-6h4V4h4v6h4l-6 6z" />
                           <path d="M20 18H4v2h16v-2z" />
                        </svg>
                        Demo
                     </a>
                  )}

                  {data.liveUrl && (
                     <a
                        href={data.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z"/>
                        </svg>
                        View
                     </a>
                  )}

                  {data.githubUrl && (
                     <a
                        href={data.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-white bg-gray-600 hover:bg-gray-700"
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                     </a>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}