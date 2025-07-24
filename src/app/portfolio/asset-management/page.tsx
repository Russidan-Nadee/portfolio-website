// src/app/portfolio/asset-management/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getProjectData } from '@/data/projects'
import ProjectNavigation from '@/components/portfolio/ProjectNavigation'
import ProjectHeader from '@/components/portfolio/ProjectHeader'
import ProjectInfoBar from '@/components/portfolio/ProjectInfoBar'
import ProjectTabsContent from '@/components/portfolio/ProjectTabsContent'

export default function AssetManagementPage() {
   const [scrollProgress, setScrollProgress] = useState(0)
   const [locale, setLocale] = useState('th')
   const [projectData, setProjectData] = useState<any>(null)
   const [loading, setLoading] = useState(true)

   // Image path for this project
   const projectImagePath = '/images/projects/asset-management/asset-management-overview.jpg'

   // Load project data based on language
   useEffect(() => {
      const loadData = async () => {
         setLoading(true)
         const data = await getProjectData('asset-management', locale)
         setProjectData(data)
         setLoading(false)
      }
      loadData()
   }, [locale])

   // Language change handler
   useEffect(() => {
      // Get initial language from localStorage
      setLocale(localStorage.getItem('lang') || 'th')

      // Listen for language changes
      const handleLanguageChange = (e: any) => {
         setLocale(e.detail.language)
      }

      window.addEventListener('languageChange', handleLanguageChange)
      return () => window.removeEventListener('languageChange', handleLanguageChange)
   }, [])

   // Progress bar update
   useEffect(() => {
      const updateProgressBar = () => {
         const winScroll = document.body.scrollTop || document.documentElement.scrollTop
         const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
         const scrolled = (winScroll / height) * 100
         setScrollProgress(scrolled)
      }

      window.addEventListener('scroll', updateProgressBar)
      return () => window.removeEventListener('scroll', updateProgressBar)
   }, [])

   // Scroll to top function
   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      })
   }

   // Handle share function
   const handleShare = () => {
      if (navigator.share) {
         navigator.share({
            title: 'Asset Management Mobile App',
            text: 'แอปจัดการทรัพย์สินมือถือ',
            url: window.location.href
         })
      } else {
         navigator.clipboard.writeText(window.location.href)
         alert('คัดลอกลิงก์แล้ว!')
      }
   }

   // Loading state
   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center">
               <div className="animate-spin rounded-full h-32 w-32 border-b-2 mb-4" style={{ borderColor: 'var(--foreground)' }}></div>
               <p style={{ color: 'var(--muted-foreground)' }}>Loading project data...</p>
            </div>
         </div>
      )
   }

   // If no project data found
   if (!projectData) {
      return (
         <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
            <div className="text-center">
               <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                  Project not found
               </h1>
               <p style={{ color: 'var(--muted-foreground)' }}>
                  Asset management project data is not available.
               </p>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         {/* Progress Bar */}
         <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50" style={{ backgroundColor: 'var(--muted)' }}>
            <div
               className="h-full transition-all duration-300"
               style={{
                  width: `${scrollProgress}%`,
                  backgroundColor: 'var(--foreground)'
               }}
            />
         </div>

         <div className="max-w-6xl mx-auto p-5">
            {/* Navigation Header */}
            <ProjectNavigation data={projectData.navigation} />

            {/* Project Header */}
            <ProjectHeader data={projectData.header} />

            {/* Key Info Bar */}
            <ProjectInfoBar data={projectData.infoBar} />

            {/* Main Content with Tabs */}
            <ProjectTabsContent data={projectData.tabsContent} imagePath={projectImagePath} />
         </div>

         {/* Floating Action Buttons */}
         <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
            <button
               className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
               style={{ backgroundColor: 'var(--muted-foreground)', color: 'var(--background)' }}
               title="แชร์โปรเจค"
               onClick={handleShare}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
               </svg>
            </button>
            <button
               className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
               style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
               title="กลับขึ้นด้านบน"
               onClick={scrollToTop}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
               </svg>
            </button>
         </div>

         {/* Animation Styles */}
         <style jsx>{`
            @keyframes fadeInUp {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            .container > div {
               animation: fadeInUp 0.6s ease-out;
            }

            .container > div:nth-child(1) { animation-delay: 0.1s; }
            .container > div:nth-child(2) { animation-delay: 0.2s; }
            .container > div:nth-child(3) { animation-delay: 0.3s; }
            .container > div:nth-child(4) { animation-delay: 0.4s; }
         `}</style>
      </div>
   )
}