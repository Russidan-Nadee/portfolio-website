// src/components/about/Timeline.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { MdWork, MdSchool, MdCode, MdBusiness, MdTrendingUp, MdRestaurant, MdFastfood, MdLocalBar } from 'react-icons/md'
import { HiLightningBolt } from 'react-icons/hi'
import { FaGraduationCap, FaBriefcase, FaLaptopCode, FaBuilding, FaRocket, FaStar } from 'react-icons/fa'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

interface TimelineProps {
   translations: any
}

export default function Timeline({ translations }: TimelineProps) {
   const [locale, setLocale] = useState('en')

   const timelineRef = useRef<HTMLDivElement>(null)
   const headerRef = useRef<HTMLDivElement>(null)
   const titleRef = useRef<HTMLHeadingElement>(null)
   const tabsRef = useRef<HTMLDivElement>(null)

   const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')
   const [scrollProgress, setScrollProgress] = useState(0)
   const [visibleItems, setVisibleItems] = useState<number[]>([])
   const [animationComplete, setAnimationComplete] = useState(false)
   const [headerAnimated, setHeaderAnimated] = useState(false)
   const [selectedCard, setSelectedCard] = useState<any>(null)

   // Helper function to get translations based on locale
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

   // Load translations with fallback
   const currentTranslations = translations || getTranslations(locale)

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

   // Get data from translations with fallback
   const workExperienceData = currentTranslations?.about?.timeline?.work || []
   const educationData = currentTranslations?.about?.timeline?.education || []

   const currentData = activeTab === 'work' ? workExperienceData : educationData

   // Get localized current text
   const getCurrentText = (locale: string) => {
      switch (locale) {
         case 'th':
            return 'ปัจจุบัน'
         case 'ja':
            return '現在'
         default:
            return 'Current'
      }
   }

   // Get professional icon based on data from locale files
   const getTimelineIcon = (item: any, index: number) => {
      // Use icon from locale data if available first
      const iconName = item.icon

      // Map icon names to actual React components
      const iconMap: { [key: string]: JSX.Element } = {
         'FaBriefcase': <FaBriefcase className="text-blue-600" />,           // Professional work
         'FaLaptopCode': <FaLaptopCode className="text-green-600" />,        // Developer/Programming
         'FaGraduationCap': <FaGraduationCap className="text-purple-600" />, // University/College
         'MdWork': <MdLocalBar className="text-purple-600" />,               // Beverage Staff/Bartender
         'MdRestaurant': <MdRestaurant className="text-orange-600" />,       // Restaurant/service work
         'MdFastfood': <MdFastfood className="text-red-600" />,             // Fast food/kitchen work
         'MdSchool': <MdSchool className="text-green-600" />                 // High school
      }

      // Return the mapped icon or fallback
      if (iconName && iconMap[iconName]) {
         return iconMap[iconName]
      }

      // Fallback logic based on title
      const title = item.title?.toLowerCase() || ''

      if (activeTab === 'education') {
         return <MdSchool className="text-blue-600" />
      }

      if (activeTab === 'work') {
         if (title.includes('developer') || title.includes('engineer') || title.includes('programmer')) {
            return <FaLaptopCode className="text-green-600" />
         }
         return <FaBriefcase className="text-gray-600" />
      }

      // Default fallback
      return <FaBriefcase className="text-gray-600" />
   }

   useEffect(() => {
      const handleScroll = () => {
         // Header animation
         if (headerRef.current && !headerAnimated) {
            const headerRect = headerRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            if (headerRect.top <= windowHeight * 0.8) {
               setHeaderAnimated(true)
            }
         }

         if (!timelineRef.current || animationComplete) return

         const rect = timelineRef.current.getBoundingClientRect()
         const windowHeight = window.innerHeight

         // Calculate how much of timeline is visible
         const elementTop = rect.top
         const elementHeight = rect.height

         // Start animation when timeline enters viewport
         const startOffset = windowHeight * 0.8
         const endOffset = windowHeight * 0.2

         if (elementTop <= startOffset && elementTop + elementHeight >= endOffset) {
            // Calculate progress (0 to 1)
            const totalScrollableHeight = elementHeight + startOffset - endOffset
            const currentScroll = startOffset - elementTop
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableHeight))

            setScrollProgress(progress)

            // Show items based on progress - Faster for education with 2 items
            const totalItems = currentData.length
            const itemsToShow: number[] = []

            for (let i = 0; i < totalItems; i++) {
               const itemThreshold = (i + 1) / totalItems
               // Use different threshold based on tab and number of items
               const threshold = activeTab === 'education' && totalItems === 2 ? 0.6 : 0.7
               if (progress >= itemThreshold * threshold) {
                  itemsToShow.push(i)
               }
            }

            setVisibleItems(itemsToShow)

            // Force 100% when last card shows OR when progress is high enough
            if ((itemsToShow.length === totalItems && totalItems > 0) || progress >= 0.85) {
               setAnimationComplete(true)
               setScrollProgress(1) // Force 100%
               setVisibleItems([...Array(totalItems).keys()]) // Show all items
            }
         } else if (elementTop > startOffset && !animationComplete) {
            // Reset when scrolled back up (only if animation not complete)
            setScrollProgress(0)
            setVisibleItems([])
         }

         // Additional check: Force complete when very close to bottom
         const documentHeight = document.documentElement.scrollHeight
         const currentScroll = window.pageYOffset + window.innerHeight
         const scrollPercentage = currentScroll / documentHeight

         if (scrollPercentage >= 0.87 && !animationComplete && currentData.length > 0) {
            setAnimationComplete(true)
            setScrollProgress(1)
            setVisibleItems([...Array(currentData.length).keys()])
         }
      }

      // Add scroll listener
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initial check

      return () => window.removeEventListener('scroll', handleScroll)
   }, [currentData.length, animationComplete, headerAnimated, activeTab])

   // Reset when tab changes
   useEffect(() => {
      setScrollProgress(0)
      setVisibleItems([])
      setAnimationComplete(false)
   }, [activeTab])

   // Reset header animation when tab changes or locale changes
   useEffect(() => {
      setHeaderAnimated(false)
   }, [activeTab, locale])

   // Handle empty data
   if (!currentTranslations?.about?.timeline) {
      return (
         <section className="py-16 mb-16">
            <div className="max-w-6xl mx-auto px-8 text-center">
               <p style={{ color: 'var(--muted-foreground)' }}>
                  Timeline data not available
               </p>
            </div>
         </section>
      )
   }

   return (
      <>
         {/* CSS Animations */}
         <style jsx>{`
            @keyframes iconPop {
               0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); }
               60% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); }
               100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
            }
            
            @keyframes cardSlideRight {
               0% { 
                  transform: scale(0.8) translateX(-100px);
                  opacity: 0;
               }
               100% { 
                  transform: scale(1) translateX(0);
                  opacity: 1;
               }
            }
            
            @keyframes cardSlideLeft {
               0% { 
                  transform: scale(0.8) translateX(100px);
                  opacity: 0;
               }
               100% { 
                  transform: scale(1) translateX(0);
                  opacity: 1;
               }
            }

            @keyframes titleSlideUp {
               0% { 
                  transform: translateY(60px) scale(0.8);
                  opacity: 0;
               }
               100% { 
                  transform: translateY(0) scale(1);
                  opacity: 1;
               }
            }

            @keyframes tabsFadeIn {
               0% { 
                  transform: translateY(30px);
                  opacity: 0;
               }
               100% { 
                  transform: translateY(0);
                  opacity: 1;
               }
            }

            @keyframes gradientShift {
               0% { background-position: 0% 50%; }
               50% { background-position: 100% 50%; }
               100% { background-position: 0% 50%; }
            }
            
            .timeline-line {
               transform: scaleY(${scrollProgress});
               transform-origin: top center;
               transition: transform 0.1s ease-out;
            }
            
            .timeline-icon {
               transform: translate(-50%, -50%) scale(0);
               transition: all 0.3s ease-out;
            }
            
            .timeline-icon.visible {
               animation: iconPop 0.6s ease-out forwards;
            }
            
            .timeline-item {
               opacity: 0;
               transition: all 0.3s ease-out;
            }
            
            .timeline-item.visible.right {
               animation: cardSlideRight 0.8s ease-out forwards;
            }

            .timeline-item.visible.left {
               animation: cardSlideLeft 0.8s ease-out forwards;
            }
            
            .current-item {
               animation: pulse 2s ease-in-out infinite;
            }
            
            @keyframes pulse {
               0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important; }
               50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8) !important; }
            }

            /* Mobile: Smaller cards */
            @media (max-width: 768px) {
               .timeline-item {
                  width: 200px !important;
               }

               .timeline-item .rounded-xl {
                  padding: 0.5rem !important;
               }

               .timeline-icon {
                  width: 3rem !important;
                  height: 3rem !important;
                  font-size: 1rem !important;
               }

               .timeline-item h3 {
                  font-size: 0.875rem !important;
                  margin-bottom: 0.125rem !important;
               }

               .timeline-item h4 {
                  font-size: 0.75rem !important;
                  margin-bottom: 0.125rem !important;
               }

               .timeline-item p {
                  font-size: 0.625rem !important;
                  margin-bottom: 0.5rem !important;
               }
            }

            /* Modal animations */
            @keyframes modalFadeIn {
               0% { opacity: 0; }
               100% { opacity: 1; }
            }

            @keyframes modalSlideIn {
               0% {
                  transform: scale(0.8) translateY(30px);
                  opacity: 0;
               }
               100% {
                  transform: scale(1) translateY(0);
                  opacity: 1;
               }
            }

            .modal-overlay {
               animation: modalFadeIn 0.3s ease-out forwards;
            }

            .modal-content {
               animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            .header-title {
               transform: translateY(60px) scale(0.8);
               opacity: 0;
               transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .header-title.animated {
               animation: titleSlideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            .header-tabs {
               transform: translateY(30px);
               opacity: 0;
               transition: all 0.6s ease-out;
            }

            .header-tabs.animated {
               animation: tabsFadeIn 0.8s ease-out 0.3s forwards;
            }

            .animated-gradient {
               background: linear-gradient(-45deg, var(--foreground), var(--muted-foreground), var(--foreground));
               background-size: 400% 400%;
               animation: gradientShift 3s ease infinite;
               background-clip: text;
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent !important;
               text-fill-color: transparent !important;
               color: transparent !important;
            }
         `}</style>

         <section ref={timelineRef} className="py-16 mb-16">
            <div className="max-w-6xl mx-auto px-8">
               <div ref={headerRef} className="text-center mb-16">
                  <h2
                     ref={titleRef}
                     className={`header-title text-4xl md:text-5xl font-bold mb-8 ${headerAnimated ? 'animated animated-gradient' : ''}`}
                     style={{
                        color: headerAnimated ? 'transparent' : 'var(--foreground)'
                     }}
                  >
                     {currentTranslations?.about?.timeline?.title || 'Experience & Background'}
                  </h2>

                  <div
                     ref={tabsRef}
                     className={`header-tabs inline-flex rounded-xl p-1 mb-8 ${headerAnimated ? 'animated' : ''}`}
                     style={{ backgroundColor: 'var(--muted)' }}
                  >
                     <button
                        onClick={() => setActiveTab('work')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'work' ? 'shadow-md' : 'hover:opacity-70'
                           }`}
                        style={{
                           backgroundColor: activeTab === 'work' ? 'var(--card)' : 'transparent',
                           color: activeTab === 'work' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                     >
                        <FaBriefcase className="text-blue-600" />
                        {currentTranslations?.about?.timeline?.tabs?.work || 'Work Experience'}
                     </button>
                     <button
                        onClick={() => setActiveTab('education')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'education' ? 'shadow-md' : 'hover:opacity-70'
                           }`}
                        style={{
                           backgroundColor: activeTab === 'education' ? 'var(--card)' : 'transparent',
                           color: activeTab === 'education' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                     >
                        <FaGraduationCap className="text-purple-600" />
                        {currentTranslations?.about?.timeline?.tabs?.education || 'Education'}
                     </button>
                  </div>
               </div>

               {currentData.length === 0 ? (
                  <div className="text-center py-16">
                     <p style={{ color: 'var(--muted-foreground)' }}>
                        No {activeTab} data available
                     </p>
                  </div>
               ) : (
                  <div className="relative max-w-4xl mx-auto" style={{ minHeight: currentData.length === 2 ? '800px' : '600px' }}>
                     {/* Timeline Line */}
                     <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 flex justify-center">
                        <div
                           className="timeline-line w-2 h-full"
                           style={{
                              background: 'linear-gradient(to bottom, var(--foreground), var(--muted-foreground))',
                              borderRadius: '2px'
                           }}
                        />
                     </div>

                     {/* Timeline Items */}
                     <div className="relative z-10 pt-8" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: currentData.length === 2 ? '12rem' : '8rem'
                     }}>
                        {currentData.map((item: any, index: number) => {
                           const isRight = index % 2 === 0
                           const isVisible = visibleItems.includes(index)

                           return (
                              <div
                                 key={`${activeTab}-${item.id}-${locale}`}
                                 className="relative flex items-center justify-center min-h-[200px]"
                              >
                                 {/* Timeline Item */}
                                 <div
                                    className={`timeline-item absolute w-80 ${isRight ? 'left-1/2 ml-8 md:ml-16' : 'right-1/2 mr-8 md:mr-16'} ${isVisible ? 'visible' : ''} ${isRight ? 'right' : 'left'}`}
                                 >
                                    <div
                                       className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 cursor-pointer`}
                                       onClick={() => setSelectedCard(item)}
                                       style={{
                                          backgroundColor: 'var(--card)',
                                          borderColor: item.isCurrent ? 'var(--foreground)' : 'var(--border)',
                                          borderWidth: item.isCurrent ? '2px' : '1px',
                                          boxShadow: item.isCurrent && isVisible ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
                                       }}
                                    >
                                       <div className="mb-2">
                                          <span
                                             className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full"
                                             style={{
                                                backgroundColor: item.isCurrent ? 'var(--foreground)' : 'var(--muted)',
                                                color: item.isCurrent ? 'var(--background)' : 'var(--muted-foreground)'
                                             }}
                                          >
                                             {item.isCurrent && <HiLightningBolt className="text-yellow-400" />}
                                             {item.isCurrent ? getCurrentText(locale) : item.period}
                                          </span>
                                          {item.isCurrent && isVisible && (
                                             <div
                                                className="current-item absolute inset-0 rounded-xl pointer-events-none"
                                                style={{
                                                   background: 'transparent'
                                                }}
                                             />
                                          )}
                                       </div>

                                       <h3
                                          className="text-xl font-bold mb-2"
                                          style={{ color: 'var(--foreground)' }}
                                       >
                                          {item.title}
                                       </h3>

                                       <h4
                                          className="text-md font-semibold mb-1"
                                          style={{ color: 'var(--muted-foreground)' }}
                                       >
                                          {item.company}
                                       </h4>

                                       {item.isCurrent && (
                                          <p
                                             className="text-sm font-medium mb-3"
                                             style={{ color: 'var(--muted-foreground)' }}
                                          >
                                             {item.period}
                                          </p>
                                       )}

                                       <p
                                          className="leading-relaxed mb-4 text-sm"
                                          style={{ color: 'var(--muted-foreground)' }}
                                       >
                                          {item.description}
                                       </p>

                                       <div className="flex flex-wrap gap-2">
                                          {item.skills?.map((skill: string, skillIndex: number) => (
                                             <span
                                                key={skillIndex}
                                                className="text-xs px-2 py-1 rounded-md transition-colors hover:opacity-80"
                                                style={{
                                                   backgroundColor: 'var(--muted)',
                                                   color: 'var(--muted-foreground)'
                                                }}
                                             >
                                                {skill}
                                             </span>
                                          )) || []}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Icon */}
                                 <div
                                    className={`timeline-icon absolute left-1/2 w-16 h-16 rounded-full flex items-center justify-center text-xl z-20 ${isVisible ? 'visible' : ''}`}
                                    style={{
                                       backgroundColor: 'var(--card)',
                                       border: item.isCurrent ? '4px solid var(--foreground)' : '3px solid var(--foreground)',
                                       boxShadow: item.isCurrent ? '0 0 20px rgba(59, 130, 246, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                 >
                                    {getTimelineIcon(item, index)}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               )}
            </div>

            {/* Modal for enlarged card */}
            {selectedCard && (
               <div
                  className="modal-overlay fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedCard(null)}
               >
                  <div
                     className="modal-content relative max-w-sm md:max-w-md w-full"
                     onClick={(e) => e.stopPropagation()}
                  >
                     {/* Close button */}
                     <button
                        onClick={() => setSelectedCard(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-10 hover:scale-110 transition-transform"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        ×
                     </button>

                     {/* Enlarged card */}
                     <div
                        className="rounded-xl p-8 xl:p-12 border shadow-2xl"
                        style={{
                           backgroundColor: 'var(--card)',
                           borderColor: selectedCard.isCurrent ? 'var(--foreground)' : 'var(--border)',
                           borderWidth: selectedCard.isCurrent ? '2px' : '1px',
                           boxShadow: selectedCard.isCurrent ? '0 0 30px rgba(59, 130, 246, 0.4)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}
                     >
                        <div className="mb-4">
                           <span
                              className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full"
                              style={{
                                 backgroundColor: selectedCard.isCurrent ? 'var(--foreground)' : 'var(--muted)',
                                 color: selectedCard.isCurrent ? 'var(--background)' : 'var(--muted-foreground)'
                              }}
                           >
                              {selectedCard.isCurrent && <HiLightningBolt className="text-yellow-400" />}
                              {selectedCard.isCurrent ? getCurrentText(locale) : selectedCard.period}
                           </span>
                        </div>

                        <h3
                           className="text-3xl xl:text-4xl font-bold mb-4"
                           style={{ color: 'var(--foreground)' }}
                        >
                           {selectedCard.title}
                        </h3>

                        <h4
                           className="text-xl xl:text-2xl font-semibold mb-3"
                           style={{ color: 'var(--muted-foreground)' }}
                        >
                           {selectedCard.company}
                        </h4>

                        {selectedCard.isCurrent && (
                           <p
                              className="text-base xl:text-lg font-medium mb-6"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              {selectedCard.period}
                           </p>
                        )}

                        <p
                           className="leading-relaxed mb-8 text-lg xl:text-xl"
                           style={{ color: 'var(--muted-foreground)' }}
                        >
                           {selectedCard.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                           {selectedCard.skills?.map((skill: string, skillIndex: number) => (
                              <span
                                 key={skillIndex}
                                 className="text-base px-3 py-2 rounded-md transition-colors hover:opacity-80"
                                 style={{
                                    backgroundColor: 'var(--muted)',
                                    color: 'var(--muted-foreground)'
                                 }}
                              >
                                 {skill}
                              </span>
                           )) || []}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </section>
      </>
   )
}