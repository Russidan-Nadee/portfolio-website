// src/components/portfolio/ProjectTabsContent.tsx
'use client'

import { useState } from 'react'

interface Feature {
   title: string
   description: string
}

interface Challenge {
   title: string
   description: string
}

interface Result {
   title: string
   description: string
}

interface FutureGoal {
   description: string
}

interface ThirdPartyItem {
   name: string
   description: string
}

interface ProjectTabsContentData {
   tabs: {
      overview: string
      features: string
      gallery: string
      technical: string
      results: string
   }
   overview: {
      title: string
      imageAlt: string
      about: {
         title: string
         paragraphs: string[]
      }
      objectives: {
         title: string
         content: string
      }
   }
   features: {
      title: string
      items: Feature[]
   }
   gallery: {
      title: string
      items: string[]
   }
   technical: {
      title: string
      details: Record<string, string>
      challenges: {
         title: string
         items: Challenge[]
      }
   }
   results: {
      title: string
      items: Result[]
      futureGoals: {
         title: string
         items: FutureGoal[]
      }
   }
}

interface ProjectTabsContentProps {
   data: ProjectTabsContentData
}

export default function ProjectTabsContent({ data }: ProjectTabsContentProps) {
   const [activeTab, setActiveTab] = useState('overview')

   const tabs = [
      { id: 'overview', label: data.tabs.overview },
      { id: 'features', label: data.tabs.features },
      { id: 'gallery', label: data.tabs.gallery },
      { id: 'technical', label: data.tabs.technical },
      { id: 'results', label: data.tabs.results }
   ]

   return (
      <div
         className="rounded-2xl p-8 mb-5 border shadow-lg backdrop-blur-sm"
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
         }}
      >
         {/* Tabs */}
         <div className="flex gap-0 mb-6 border-b-2" style={{ borderColor: 'var(--border)' }}>
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 border-b-2 transition-all duration-300 ${activeTab === tab.id ? 'font-semibold' : 'hover:opacity-70'
                     }`}
                  style={{
                     color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                     borderBottomColor: activeTab === tab.id ? 'var(--foreground)' : 'transparent'
                  }}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Overview Tab */}
         {activeTab === 'overview' && (
            <div>
               <div className="mb-8">
                  <div
                     className="w-full h-70 rounded-2xl flex items-center justify-center text-lg font-semibold border-2 border-dashed mb-5"
                     style={{
                        backgroundColor: 'var(--muted)',
                        borderColor: 'var(--border)',
                        color: 'var(--muted-foreground)',
                        height: '280px'
                     }}
                  >
                     {data.overview.imageAlt}
                  </div>
                  <div className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                     {data.overview.title}
                  </div>
               </div>

               <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     {data.overview.about.title}
                  </h3>
                  {data.overview.about.paragraphs.map((paragraph, index) => (
                     <p key={index} className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                        {paragraph}
                     </p>
                  ))}
               </div>

               <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     {data.overview.objectives.title}
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                     {data.overview.objectives.content}
                  </p>
               </div>
            </div>
         )}

         {/* Features Tab */}
         {activeTab === 'features' && (
            <div>
               <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {data.features.title}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.features.items.map((feature, index) => (
                     <div
                        key={index}
                        className="p-4 rounded-xl border-l-4 flex items-start gap-3"
                        style={{
                           backgroundColor: 'var(--muted)',
                           borderLeftColor: 'var(--foreground)'
                        }}
                     >
                        <div>
                           <strong style={{ color: 'var(--foreground)' }}>{feature.title}</strong><br />
                           <span style={{ color: 'var(--muted-foreground)' }}>{feature.description}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Gallery Tab */}
         {activeTab === 'gallery' && (
            <div>
               <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {data.gallery.title}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.gallery.items.map((item, index) => (
                     <div
                        key={index}
                        className="h-45 rounded-xl border-2 border-dashed flex items-center justify-center font-semibold cursor-pointer transition-transform duration-300 hover:scale-105"
                        style={{
                           backgroundColor: 'var(--muted)',
                           borderColor: 'var(--border)',
                           color: 'var(--muted-foreground)',
                           height: '180px'
                        }}
                     >
                        {item}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Technical Tab */}
         {activeTab === 'technical' && (
            <div>
               <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                     </svg>
                     {data.technical.title}
                  </h3>
                  <div className="space-y-3" style={{ color: 'var(--muted-foreground)' }}>
                     {Object.entries(data.technical.details).map(([key, value], index) => (
                        <p key={index}>
                           <strong style={{ color: 'var(--foreground)' }}>{key}:</strong> {value}
                        </p>
                     ))}
                  </div>
               </div>

               <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                     </svg>
                     {data.technical.challenges.title}
                  </h3>
                  <div className="space-y-3">
                     {data.technical.challenges.items.map((challenge, index) => (
                        <div
                           key={index}
                           className="p-4 rounded-lg border-l-4"
                           style={{
                              backgroundColor: 'var(--muted)',
                              borderLeftColor: 'var(--muted-foreground)'
                           }}
                        >
                           <strong style={{ color: 'var(--foreground)' }}>{challenge.title}:</strong>
                           <span style={{ color: 'var(--muted-foreground)' }} className="ml-2">{challenge.description}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Results Tab */}
         {activeTab === 'results' && (
            <div>
               <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {data.results.title}
               </h3>
               <div className="space-y-3">
                  {data.results.items.map((result, index) => (
                     <div
                        key={index}
                        className="p-4 rounded-lg border-l-4"
                        style={{
                           backgroundColor: 'var(--muted)',
                           borderLeftColor: 'var(--foreground)'
                        }}
                     >
                        <strong style={{ color: 'var(--foreground)' }}>{result.title}:</strong>
                        <span style={{ color: 'var(--muted-foreground)' }} className="ml-2">{result.description}</span>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-6 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                     {data.results.futureGoals.title}
                  </h4>
                  <ul className="space-y-2" style={{ color: 'var(--muted-foreground)' }}>
                     {data.results.futureGoals.items.map((goal, index) => (
                        <li key={index}>• {goal.description}</li>
                     ))}
                  </ul>
               </div>
            </div>
         )}
      </div>
   )
}