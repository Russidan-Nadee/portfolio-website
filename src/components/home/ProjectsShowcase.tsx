// src/components/ProjectsShowcase.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectsShowcaseProps {
   translations?: any
}

interface Project {
   id: string
   title: string
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

   const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const projects: Project[] = [
      {
         id: 'asset-management',
         title: translations?.home?.projectsShowcase?.projects?.assetManagement?.title || 'Asset Management',
         tech: translations?.home?.projectsShowcase?.projects?.assetManagement?.tech || 'Flutter, Node.js, Express, MySQL',
         filter: 'grayscale(100%) contrast(1.2)',
         isCenter: false,
         image: '/images/asset-management-hero.jpg'
      },
      {
         id: 'calculator-app',
         title: translations?.home?.projectsShowcase?.projects?.calculator?.title || 'Calculator App',
         tech: translations?.home?.projectsShowcase?.projects?.calculator?.tech || 'Python, Tkinter',
         filter: 'none',
         isCenter: true,
         image: '/images/calculator-hero.jpg'
      },
      {
         id: 'portfolio-website',
         title: translations?.home?.projectsShowcase?.projects?.portfolio?.title || 'Portfolio Website',
         tech: translations?.home?.projectsShowcase?.projects?.portfolio?.tech || 'Next.js, TypeScript, Tailwind CSS',
         filter: 'grayscale(100%) contrast(1.2)',
         isCenter: false,
         image: '/images/portfolio-hero.jpg'
      }
   ]

   const totalProjects = projects.length
   const visibleCards = 3

   const createInfiniteArray = useCallback(() => {
      const repeats = 4
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
   }, [projects, totalProjects]);

   const infiniteProjects = createInfiniteArray()
   const [realIndex, setRealIndex] = useState(totalProjects)

   const getTransformX = useCallback((): number => {
      const cardWidth = 350 + 32
      const containerWidth = 1200
      const offsetForCenteredView = (containerWidth - (visibleCards * 350 + (visibleCards - 1) * 32)) / 2;
      return offsetForCenteredView - (realIndex * cardWidth);
   }, [realIndex, visibleCards]);

   const goLeft = useCallback((): void => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setSlideDirection('left')

      setRealIndex(prev => {
         const next = prev - 1
         if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
         }

         if (next < totalProjects) {
            resetTimeoutRef.current = setTimeout(() => {
               setRealIndex(next + totalProjects * 2);
               resetTimeoutRef.current = null;
            }, 600);
         }
         return next
      })

      setCurrentIndex(prev => (prev - 1 + totalProjects) % totalProjects)

      if (transitionTimeoutRef.current) {
         clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
         setIsTransitioning(false);
         transitionTimeoutRef.current = null;
      }, 600);
   }, [isTransitioning, totalProjects]);

   const goRight = useCallback((): void => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setSlideDirection('right')

      setRealIndex(prev => {
         const next = prev + 1
         if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
         }

         if (next >= infiniteProjects.length - totalProjects) {
            resetTimeoutRef.current = setTimeout(() => {
               setRealIndex(totalProjects);
               resetTimeoutRef.current = null;
            }, 600);
         }
         return next
      })

      setCurrentIndex(prev => (prev + 1) % totalProjects)

      if (transitionTimeoutRef.current) {
         clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
         setIsTransitioning(false);
         transitionTimeoutRef.current = null;
      }, 600);
   }, [isTransitioning, infiniteProjects.length, totalProjects]);

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

      if (showcaseRef.current) {
         observer.observe(showcaseRef.current)
      }

      return () => observer.disconnect()
   }, [isVisible])

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

   useEffect(() => {
      return () => {
         if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
         }
         if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
         }
      };
   }, []);

   // ------- เพิ่ม useEffect นี้ เพื่อ auto-slide ทุก 3 วินาที ----------
   useEffect(() => {
      const autoSlide = setInterval(() => {
         if (!isTransitioning) {
            goRight();
         }
      }, 3000);
      return () => clearInterval(autoSlide);
   }, [goRight, isTransitioning]);
   // ------------------------------------------------------------------

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
                    height: 500px;
                    clip-path: inset(0 30px);
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
                    background: var(--card);
                    width: 350px;
                    height: 437px;
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
                        clip-path: inset(0 20px);
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
                        rgba(0, 0, 0, 0.6) 0%,
                        rgba(0, 0, 0, 0.3) 50%,
                        rgba(0, 0, 0, 0.7) 100%
                    );
                    z-index: 1;
                }

                [data-theme="dark"] .card-overlay {
                    background: linear-gradient(
                        135deg,
                        rgba(0, 0, 0, 0.7) 0%,
                        rgba(0, 0, 0, 0.4) 50%,
                        rgba(0, 0, 0, 0.8) 100%
                    );
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
                    background: var(--foreground) !important;
                    opacity: 0.05;
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
                    background: var(--muted-foreground);
                    opacity: 0.3;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .dot.active {
                    background: var(--foreground);
                    opacity: 0.8;
                    transform: scale(1.2);
                }

                .dot:hover {
                    background: var(--foreground);
                    opacity: 0.6;
                }
            `}</style>

         <section
            ref={showcaseRef}
            className="py-20 relative overflow-hidden"
            style={{ backgroundColor: 'var(--muted)' }}
         >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div
                  className="absolute top-20 left-10 w-20 h-20 rounded-full floating-element"
                  style={{
                     transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                     animationDelay: '0s'
                  }}
               />
               <div
                  className="absolute bottom-32 right-20 w-16 h-16 floating-element"
                  style={{
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                     transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                     animationDelay: '1s'
                  }}
               />
               <div
                  className="absolute top-1/2 right-1/4 w-12 h-12 floating-element"
                  style={{
                     clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                     transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                     animationDelay: '2s'
                  }}
               />
            </div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
               <div className="flex items-center justify-between mb-16">
                  <h2
                     ref={titleRef}
                     className="showcase-title text-5xl md:text-6xl lg:text-7xl font-black leading-none"
                     style={{
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif'
                     }}
                  >
                     {translations?.home?.projectsShowcase?.title || 'Recommended Projects'}
                  </h2>

                  <div className="flex gap-4 md:hidden">
                     <button
                        onClick={goLeft}
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                           backgroundColor: 'var(--card)',
                           borderColor: 'var(--border)',
                           color: 'var(--foreground)'
                        }}
                        type="button"
                        aria-label="Previous project"
                     >
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>
                     <button
                        onClick={goRight}
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                           backgroundColor: 'var(--card)',
                           borderColor: 'var(--border)',
                           color: 'var(--foreground)'
                        }}
                        type="button"
                        aria-label="Next project"
                     >
                        <svg
                           className="w-6 h-6"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>
               </div>

               <div className="relative">
                  <button
                     onClick={goLeft}
                     className="hidden md:flex absolute left-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                     style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                     }}
                     type="button"
                     aria-label="Previous project"
                  >
                     <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                  </button>

                  <button
                     onClick={goRight}
                     className="hidden md:flex absolute right-[-80px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                     style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                     }}
                     type="button"
                     aria-label="Next project"
                  >
                     <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                  </button>

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
                           const centerIndex = realIndex + 1

                           return (
                              <div
                                 key={`${project.originalIndex}-${index}`}
                                 className="project-card"
                                 style={{
                                    filter: index === centerIndex ? 'none' : 'grayscale(100%) contrast(1.2)'
                                 }}
                                 onClick={() => {
                                    window.location.href = '/portfolio'
                                 }}
                              >
                                 <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                       filter: 'inherit'
                                    }}
                                 />

                                 <div className="card-overlay" />

                                 <div className="card-content">
                                    <h3
                                       className="text-2xl md:text-3xl font-bold mb-4"
                                       style={{ color: '#ffffff' }}
                                    >
                                       {project.title}
                                    </h3>

                                    <p
                                       className="text-xs md:text-sm font-medium opacity-70"
                                       style={{ color: '#ffffff' }}
                                    >
                                       {project.tech}
                                    </p>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>

                  <div className="indicator-dots">
                     {projects.map((_, index) => (
                        <div
                           key={index}
                           className={`dot ${index === currentIndex ? 'active' : ''}`}
                           onClick={() => {
                              if (!isTransitioning) {
                                 const currentProjectActualIndex = realIndex % totalProjects;
                                 const targetOffset = index - currentProjectActualIndex;

                                 if (targetOffset > 0) {
                                    for (let i = 0; i < targetOffset; i++) {
                                       goRight();
                                    }
                                 } else if (targetOffset < 0) {
                                    for (let i = 0; i < Math.abs(targetOffset); i++) {
                                       goLeft();
                                    }
                                 }
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