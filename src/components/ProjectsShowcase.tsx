// src/components/ProjectsShowcase.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectsShowcaseProps {
   translations?: any
}

interface Project {
   id: string
   title: string
   description: string
   tech: string
   filter: string
   isCenter: boolean
   image: string
}

export default function ProjectsShowcase({ translations }: ProjectsShowcaseProps) {
   const showcaseRef = useRef<HTMLDivElement>(null)
   const titleRef = useRef<HTMLHeadingElement>(null)
   const cardsRef = useRef<HTMLDivElement>(null)

   const [mounted, setMounted] = useState(false)
   const [isVisible, setIsVisible] = useState(false)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [currentIndex, setCurrentIndex] = useState(0)
   const [isTransitioning, setIsTransitioning] = useState(false)
   const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

   // Project data - 3 projects with loop functionality
   const projects: Project[] = [
      {
         id: 'asset-management',
         title: 'Asset Management',
         description: 'Mobile asset management system featuring real-time tracking, dashboard analytics, and comprehensive reporting',
         tech: 'Flutter, Node.js, Express, MySQL',
         filter: 'grayscale(100%) contrast(1.2)',
         isCenter: false,
         image: '/images/asset-management-hero.jpg'
      },
      {
         id: 'calculator-app',
         title: 'Calculator App',
         description: 'A modern calculator app featuring a clean and minimalist interface',
         tech: 'Python, Tkinter',
         filter: 'none',
         isCenter: true,
         image: '/images/calculator-hero.jpg'
      },
      {
         id: 'portfolio-website',
         title: 'Portfolio Website',
         description: 'Modern responsive portfolio website with dark theme, multi-language support, and smooth animations',
         tech: 'Next.js, TypeScript, Tailwind CSS',
         filter: 'grayscale(100%) contrast(1.2)',
         isCenter: false,
         image: '/images/portfolio-hero.jpg'
      }
   ]

   const totalProjects = projects.length
   const visibleCards = 3 // Show all 3 cards

   // Create true infinite array (more cards for seamless loop)
   const createInfiniteArray = () => {
      const repeats = 4 // repeat 4 times for smoother infinite effect
      const result = []
      for (let r = 0; r < repeats; r++) {
         for (let i = 0; i < totalProjects; i++) {
            result.push({
               ...projects[i],
               originalIndex: i,
               arrayIndex: r * totalProjects + i
            })
         }
      }
      return result
   }

   const infiniteProjects = createInfiniteArray() // [0,1,2,0,1,2,0,1,2,0,1,2]
   const [realIndex, setRealIndex] = useState(totalProjects) // Start from middle (index 3)

   // Calculate transform position for true infinite scroll
   const getTransformX = (): number => {
      const cardWidth = 350 + 32 // card width + gap
      const containerWidth = 1200
      const centerOffset = (containerWidth - (3 * 350 + 2 * 32)) / 2
      return centerOffset - (realIndex * cardWidth)
   }

   // Navigation functions for true infinite scroll (swapped directions)
   const goLeft = (): void => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setSlideDirection('left')

      setRealIndex(prev => {
         const next = prev - 1 // Changed: move left in array (was prev + 1)
         // Reset position when approaching beginning
         if (next <= 2) {
            setTimeout(() => {
               setRealIndex(totalProjects * 2) // Jump to second cycle without animation
            }, 600)
         }
         return next
      })

      // Update currentIndex for dots indicator
      setCurrentIndex(prev => (prev - 1 + totalProjects) % totalProjects) // Changed direction

      setTimeout(() => {
         setIsTransitioning(false)
      }, 600)
   }

   const goRight = (): void => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setSlideDirection('right')

      setRealIndex(prev => {
         const next = prev + 1 // Changed: move right in array (was prev - 1)
         // Reset position when approaching end
         if (next >= infiniteProjects.length - 3) {
            setTimeout(() => {
               setRealIndex(totalProjects) // Jump back to middle without animation
            }, 600)
         }
         return next
      })

      // Update currentIndex for dots indicator  
      setCurrentIndex(prev => (prev + 1) % totalProjects) // Changed direction

      setTimeout(() => {
         setIsTransitioning(false)
      }, 600)
   }

   // No need for displayProjects anymore - using infiniteProjects directly

   useEffect(() => {
      setMounted(true)

      // Intersection Observer for animations
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

      if (showcaseRef.current) {
         observer.observe(showcaseRef.current)
      }

      return () => observer.disconnect()
   }, [isVisible])

   // Mouse tracking for parallax effect
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent): void => {
         if (showcaseRef.current) {
            const rect = showcaseRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height
            setMousePosition({ x: x * 10, y: y * 10 })
         }
      }

      const section = showcaseRef.current
      if (section) {
         section.addEventListener('mousemove', handleMouseMove)
         return () => section.removeEventListener('mousemove', handleMouseMove)
      }
   }, [])

   // Auto-play functionality (optional)
   useEffect(() => {
      const interval = setInterval(() => {
         if (!isTransitioning) {
            goLeft()
         }
      }, 5000) // Auto-slide every 5 seconds

      return () => clearInterval(interval)
   }, [isTransitioning])

   if (!mounted) return null

   return (
      <>
         <style jsx>{`
            @keyframes fadeInUp {
               from {
                  opacity: 0;
                  transform: translateY(60px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            @keyframes slideInScale {
               from {
                  opacity: 0;
                  transform: scale(0.8) translateY(40px);
               }
               to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
               }
            }

            @keyframes float {
               0%, 100% { transform: translateY(0px); }
               50% { transform: translateY(-8px); }
            }

            .showcase-title {
               animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'};
            }

            .showcase-cards {
               animation: ${isVisible ? 'slideInScale 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' : 'none'};
               position: relative;
               overflow: hidden;
               width: 100%;
               max-width: 1200px;
               margin: 0 auto;
               height: 500px; /* Fixed height to prevent layout shift */
            }

            .cards-container {
               display: flex;
               gap: 2rem;
               transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
               height: 100%;
               align-items: center;
            }

            .project-card {
               position: relative;
               overflow: hidden;
               transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
               cursor: pointer;
               border-radius: 16px;
               aspect-ratio: 4/5;
               background: #2a2a2a;
               width: 350px;
               height: 437px; /* Fixed height based on aspect ratio */
               flex-shrink: 0;
            }

            .project-card:hover {
               transform: translateY(-8px);
            }

            @media (max-width: 768px) {
               .showcase-cards {
                  grid-template-columns: 1fr;
                  gap: 1rem;
                  max-width: 400px;
               }
               
               .project-card {
                  aspect-ratio: 4/5;
               }

               .project-card.center-card {
                  transform: scale(1);
               }

               .project-card.side-card {
                  transform: scale(1);
                  opacity: 1;
               }
            }

            .project-card::before {
               content: '';
               position: absolute;
               top: 0;
               left: -100%;
               width: 100%;
               height: 100%;
               background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.1),
                  transparent
               );
               transition: left 0.6s ease;
               z-index: 2;
            }

            .project-card:hover::before {
               left: 100%;
            }

            .project-card img {
               width: 100%;
               height: 100%;
               object-fit: cover;
               display: block;
               transition: all 0.4s ease;
               filter: inherit;
            }

            .card-overlay {
               position: absolute;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background: linear-gradient(
                  135deg,
                  rgba(0, 0, 0, 0.7) 0%,
                  rgba(0, 0, 0, 0.4) 50%,
                  rgba(0, 0, 0, 0.8) 100%
               );
               z-index: 1;
            }

            .card-content {
               position: absolute;
               bottom: 0;
               left: 0;
               right: 0;
               z-index: 3;
               padding: 2rem;
            }

            .floating-element {
               animation: float 3s ease-in-out infinite;
            }

            .indicator-dots {
               display: flex;
               justify-content: center;
               gap: 0.5rem;
               margin-top: 2rem;
            }

            .dot {
               width: 8px;
               height: 8px;
               border-radius: 50%;
               background: rgba(255, 255, 255, 0.3);
               cursor: pointer;
               transition: all 0.3s ease;
            }

            .dot.active {
               background: rgba(255, 255, 255, 0.8);
               transform: scale(1.2);
            }

            .dot:hover {
               background: rgba(255, 255, 255, 0.6);
            }
         `}</style>

         <section
            ref={showcaseRef}
            className="py-20 relative overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
         >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div
                  className="absolute top-20 left-10 w-20 h-20 opacity-5 rounded-full floating-element"
                  style={{
                     backgroundColor: '#ffffff',
                     transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                     animationDelay: '0s'
                  }}
               />
               <div
                  className="absolute bottom-32 right-20 w-16 h-16 opacity-5 floating-element"
                  style={{
                     backgroundColor: '#ffffff',
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                     transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                     animationDelay: '1s'
                  }}
               />
               <div
                  className="absolute top-1/2 right-1/4 w-12 h-12 opacity-5 floating-element"
                  style={{
                     backgroundColor: '#ffffff',
                     clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                     transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                     animationDelay: '2s'
                  }}
               />
            </div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
               {/* Section Title */}
               <div className="flex items-center justify-between mb-16">
                  <h2
                     ref={titleRef}
                     className="showcase-title text-5xl md:text-6xl lg:text-7xl font-black leading-none"
                     style={{
                        color: '#ffffff',
                        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif'
                     }}
                  >
                     Latest Projects
                  </h2>

                  {/* Navigation Arrows - Top Right (Mobile Only) */}
                  <div className="flex gap-4 md:hidden">
                     <button
                        onClick={goLeft}
                        className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-white/40 transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        type="button"
                        aria-label="Previous project"
                     >
                        <svg
                           className="w-6 h-6 text-white"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>
                     <button
                        onClick={goRight}
                        className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-white/40 transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        type="button"
                        aria-label="Next project"
                     >
                        <svg
                           className="w-6 h-6 text-white"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>
               </div>

               {/* Projects Grid with Side Navigation */}
               <div className="relative">
                  {/* Left Arrow - Side of Cards (Desktop Only) */}
                  <button
                     onClick={goLeft}
                     className="hidden md:flex absolute left-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/20 items-center justify-center hover:border-white/40 transition-all duration-300 hover:scale-110 z-10"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                     type="button"
                     aria-label="Previous project"
                  >
                     <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                  </button>

                  {/* Right Arrow - Side of Cards (Desktop Only) */}
                  <button
                     onClick={goRight}
                     className="hidden md:flex absolute right-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/20 items-center justify-center hover:border-white/40 transition-all duration-300 hover:scale-110 z-10"
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                     type="button"
                     aria-label="Next project"
                  >
                     <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                  </button>

                  {/* True Infinite Scroll Cards Container */}
                  <div className="showcase-cards">
                     <div
                        ref={cardsRef}
                        className="cards-container"
                        style={{
                           transform: `translateX(${getTransformX()}px)`,
                           transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                        }}
                     >
                        {infiniteProjects.map((project, index) => {
                           const centerIndex = realIndex + 1 // middle card of visible 3
                           const isCenter = index === centerIndex

                           return (
                              <div
                                 key={`${project.originalIndex}-${index}`}
                                 className="project-card"
                                 style={{
                                    filter: isCenter ? 'none' : 'grayscale(100%) contrast(1.2)'
                                 }}
                                 onClick={() => {
                                    window.location.href = '/portfolio'
                                 }}
                              >
                                 {/* Background Image */}
                                 <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                       filter: 'inherit'
                                    }}
                                 />

                                 {/* Overlay */}
                                 <div className="card-overlay" />

                                 {/* Content */}
                                 <div className="card-content">
                                    <h3
                                       className="text-2xl md:text-3xl font-bold mb-3"
                                       style={{ color: '#ffffff' }}
                                    >
                                       {project.title}
                                    </h3>

                                    <p
                                       className="text-sm md:text-base leading-relaxed mb-4 opacity-90"
                                       style={{ color: '#e8e8e8' }}
                                    >
                                       {project.description}
                                    </p>

                                    <p
                                       className="text-xs md:text-sm font-medium opacity-70"
                                       style={{ color: '#a0a0a0' }}
                                    >
                                       {project.tech}
                                    </p>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  {/* Indicator Dots */}
                  <div className="indicator-dots">
                     {projects.map((_, index) => (
                        <div
                           key={index}
                           className={`dot ${index === currentIndex ? 'active' : ''}`}
                           onClick={() => {
                              if (!isTransitioning) {
                                 setCurrentIndex(index)
                              }
                           }}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </section>
      </>
   )
}