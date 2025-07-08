'use client'

import { useEffect, useRef, useState } from 'react'

interface TimelineProps {
   translations: any
}

export default function Timeline({ translations }: TimelineProps) {
   const timelineRef = useRef<HTMLDivElement>(null)
   const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')
   const [scrollProgress, setScrollProgress] = useState(0)
   const [visibleItems, setVisibleItems] = useState<number[]>([])
   const [animationComplete, setAnimationComplete] = useState(false)

   // Get data from translations with fallback
   const workExperienceData = translations?.about?.timeline?.work || []
   const educationData = translations?.about?.timeline?.education || []

   const currentData = activeTab === 'work' ? workExperienceData : educationData

   useEffect(() => {
      const handleScroll = () => {
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

            // Show items based on progress
            const totalItems = currentData.length
            const itemsToShow: number[] = []

            for (let i = 0; i < totalItems; i++) {
               const itemThreshold = (i + 1) / totalItems
               if (progress >= itemThreshold * 0.7) { // Show items when line reaches 70% to that point
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
   }, [currentData.length, animationComplete])

   // Reset when tab changes
   useEffect(() => {
      setScrollProgress(0)
      setVisibleItems([])
      setAnimationComplete(false)
   }, [activeTab])

   // Handle empty data
   if (!translations?.about?.timeline) {
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
         `}</style>

         <section ref={timelineRef} className="py-16 mb-16">
            <div className="max-w-6xl mx-auto px-8">
               <div className="text-center mb-16">
                  <h2
                     className="text-4xl md:text-5xl font-bold mb-8"
                     style={{ color: 'var(--foreground)' }}
                  >
                     {translations?.about?.timeline?.title || 'Experience & Background'}
                  </h2>

                  <div
                     className="inline-flex rounded-xl p-1 mb-8"
                     style={{ backgroundColor: 'var(--muted)' }}
                  >
                     <button
                        onClick={() => setActiveTab('work')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'work' ? 'shadow-md' : 'hover:opacity-70'
                           }`}
                        style={{
                           backgroundColor: activeTab === 'work' ? 'var(--card)' : 'transparent',
                           color: activeTab === 'work' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                     >
                        💼 {translations?.about?.timeline?.tabs?.work || 'Work Experience'}
                     </button>
                     <button
                        onClick={() => setActiveTab('education')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'education' ? 'shadow-md' : 'hover:opacity-70'
                           }`}
                        style={{
                           backgroundColor: activeTab === 'education' ? 'var(--card)' : 'transparent',
                           color: activeTab === 'education' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                     >
                        🎓 {translations?.about?.timeline?.tabs?.education || 'Education'}
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
                  <div className="relative max-w-4xl mx-auto min-h-[600px]">
                     {/* Inverted Tree Trunk (Main Line) */}
                     <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 flex justify-center">
                        <div
                           className="timeline-line w-2 h-full"
                           style={{
                              background: 'linear-gradient(to bottom, var(--foreground), var(--muted-foreground))',
                              borderRadius: '2px'
                           }}
                        />
                     </div>

                     {/* Timeline Items (Branches) */}
                     <div className="relative z-10 space-y-32 pt-8">
                        {currentData.map((item: any, index: number) => {
                           const isRight = index % 2 === 0
                           const isVisible = visibleItems.includes(index)

                           return (
                              <div
                                 key={`${activeTab}-${item.id}`}
                                 className="relative flex items-center justify-center min-h-[200px]"
                              >
                                 {/* Timeline Item - Show when visible */}
                                 <div
                                    className={`timeline-item absolute w-80 ${isRight ? 'left-1/2 ml-16' : 'right-1/2 mr-16'} ${isVisible ? 'visible' : ''} ${isRight ? 'right' : 'left'}`}
                                 >
                                    <div
                                       className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105`}
                                       style={{
                                          backgroundColor: 'var(--card)',
                                          borderColor: item.isCurrent ? 'var(--foreground)' : 'var(--border)',
                                          borderWidth: item.isCurrent ? '2px' : '1px',
                                          boxShadow: item.isCurrent && isVisible ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
                                       }}
                                    >
                                       <div className="mb-2">
                                          <span
                                             className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                                             style={{
                                                backgroundColor: item.isCurrent ? 'var(--foreground)' : 'var(--muted)',
                                                color: item.isCurrent ? 'var(--background)' : 'var(--muted-foreground)'
                                             }}
                                          >
                                             {item.isCurrent ? '🔥 Current' : item.period}
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

                                 {/* Icon - Show when line reaches this point */}
                                 <div
                                    className={`timeline-icon absolute left-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl z-20 ${isVisible ? 'visible' : ''}`}
                                    style={{
                                       backgroundColor: 'var(--card)',
                                       border: item.isCurrent ? '4px solid var(--foreground)' : '3px solid var(--foreground)',
                                       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                 >
                                    {item.icon || '📝'}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               )}
            </div>
         </section>
      </>
   )
}