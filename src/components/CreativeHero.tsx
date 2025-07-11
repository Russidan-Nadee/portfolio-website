// src/components/CreativeHero.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import th from '../../locales/th.json'
import ja from '../../locales/ja.json'
import en from '../../locales/en.json'

interface CreativeHeroProps {
   translations?: any
}

export default function CreativeHero({ translations: propTranslations }: CreativeHeroProps) {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

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

   const translations = propTranslations || getTranslations(locale)

   const getLocalizedLink = (path: string) => {
      if (locale === 'en') {
         return path
      }
      return `${path}?lang=${locale}`
   }

   const heroRef = useRef<HTMLDivElement>(null)
   const textRef = useRef<HTMLDivElement>(null)
   const imageRef = useRef<HTMLDivElement>(null)
   const titleRef = useRef<HTMLHeadingElement>(null)
   const subtitleRef = useRef<HTMLHeadingElement>(null)
   const buttonsRef = useRef<HTMLDivElement>(null)

   const [mounted, setMounted] = useState(false)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const [isVisible, setIsVisible] = useState(false)

   useEffect(() => {
      setMounted(true)

      const timer = setTimeout(() => {
         setIsVisible(true)
      }, 300)

      return () => clearTimeout(timer)
   }, [locale])

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height
            setMousePosition({ x: x * 18, y: y * 18 })
         }
      }

      const hero = heroRef.current
      if (hero) {
         hero.addEventListener('mousemove', handleMouseMove)
         return () => hero.removeEventListener('mousemove', handleMouseMove)
      }
   }, [])

   if (!mounted) return null

   const buttonStyle = {
      backgroundColor: 'var(--foreground)',
      color: 'var(--background)',
      borderColor: 'var(--foreground)'
   };

   return (
      <>
         <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(72px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-96px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInPop {
                    from {
                        opacity: 0;
                        transform: scale(0.6);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .hero-text {
                    animation: ${isVisible ? 'fadeInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'};
                }

                .hero-image {
                    animation: ${isVisible ? 'fadeInPop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' : 'none'};
                }

                .hero-title {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both' : 'none'};
                }

                .hero-subtitle {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both' : 'none'};
                }

                .hero-buttons {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both' : 'none'};
                }

                .floating-element {
                    animation: float 3s ease-in-out infinite;
                }

                .gradient-text {
                    background: linear-gradient(135deg, var(--foreground), var(--muted-foreground), var(--foreground));
                    background-size: 300% 300%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradientShift 4s ease infinite;
                }

                .outline-text {
                    -webkit-text-stroke: 2.4px var(--foreground);
                    -webkit-text-fill-color: transparent;
                    text-stroke: 2.4px var(--foreground);
                    text-fill-color: transparent;
                }

                .image-filter {
                    filter: grayscale(20%) contrast(1.1) brightness(1.05);
                    transition: all 0.5s ease;
                }

                .image-filter:hover {
                    filter: grayscale(0%) contrast(1.2) brightness(1.1);
                    transform: scale(1.02);
                }

                .glass-effect {
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .button-shine {
                    position: relative;
                    overflow: hidden;
                }

                .button-shine::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transition: left 0.5s ease;
                }

                .button-shine:hover::before {
                    left: 100%;
                }
            `}</style>

         <section
            ref={heroRef}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: 'var(--background)' }}
         >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div
                  className="absolute top-20 left-10 w-24 h-24 opacity-5 rounded-full floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     transform: `translate(${mousePosition.x * 0.36}px, ${mousePosition.y * 0.36}px)`,
                     animationDelay: '0s'
                  }}
               />
               <div
                  className="absolute bottom-32 right-20 w-20 h-20 opacity-5 floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                     transform: `translate(${mousePosition.x * -0.24}px, ${mousePosition.y * -0.24}px)`,
                     animationDelay: '1s'
                  }}
               />
               <div
                  className="absolute top-1/2 right-1/4 w-15 h-15 opacity-5 floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                     transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)`,
                     animationDelay: '2s'
                  }}
               />
            </div>

            <div className="max-w-7xl w-full mx-auto px-10 relative z-10">
               <div className="relative min-h-[90vh] flex flex-col justify-center items-center">

                  <div className="relative flex flex-col items-center justify-center">

                     <div className="relative z-10 mb-12">
                        <h1
                           ref={titleRef}
                           className="hero-title text-7xl md:text-8xl lg:text-9xl xl:text-10xl font-black leading-none tracking-tight text-center"
                           style={{
                              fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif',
                              color: 'var(--foreground)',
                              fontSize: 'clamp(4.5rem, 8vw, 12rem)'
                           }}
                        >
                           {translations?.home?.title || 'Developer'}
                        </h1>
                     </div>

                     <div className="relative flex flex-col items-center justify-center mb-17">

                        <div className="relative z-10 mb-[-210px] md:mb-[-226px] lg:mb-[-265px] xl:mb-[-304px]">
                           <h2
                              ref={subtitleRef}
                              className="hero-subtitle text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-center outline-text-overlay"
                              style={{
                                 fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif',
                                 WebkitTextStroke: '1.2px var(--foreground)',
                                 WebkitTextFillColor: 'transparent',
                                 filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))',
                                 fontSize: 'clamp(2.25rem, 5vw, 7rem)'
                              } as React.CSSProperties}
                           >
                              {translations?.home?.subtitle || 'cross-platform application'}
                           </h2>
                        </div>

                        <div
                           ref={imageRef}
                           className="hero-image relative z-40"
                        >
                           <div className="relative group">
                              <div
                                 className="relative w-73 h-112 md:w-81 md:h-[476px] lg:w-91 lg:h-[530px] xl:w-100 xl:h-[601px] overflow-hidden"
                                 style={{
                                    transform: `translate(${mousePosition.x * 0.12}px, ${mousePosition.y * 0.12}px)`,
                                    transition: 'transform 0.3s ease-out'
                                 }}
                              >
                                 <Image
                                    src="/profile-main.png"
                                    alt={`${translations?.about?.name || 'Russidan Nadee'} - ${translations?.home?.title || 'Developer'}`}
                                    fill
                                    className="object-cover object-center transition-all duration-500 hover:scale-105"
                                    style={{
                                       objectPosition: 'center top',
                                       filter: 'grayscale(100%) contrast(1.2) brightness(1.05)'
                                    }}
                                    priority
                                    sizes="(max-width: 768px) 292px, (max-width: 1024px) 364px, 400px"
                                 />

                                 <div
                                    className="absolute inset-x-0 bottom-0 h-49 pointer-events-none"
                                    style={{
                                       background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)'
                                    }}
                                 />

                                 <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-5 transition-opacity duration-500"
                                    style={{
                                       background: 'linear-gradient(135deg, transparent 60%, var(--background) 100%)'
                                    }}
                                 />

                                 <div ref={buttonsRef} className="hero-buttons absolute bottom-9 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-4 z-30">
                                    <Link
                                       href={getLocalizedLink('/portfolio')}
                                       className="button-shine group inline-flex items-center justify-center px-6 py-3 lg:px-7 lg:py-4 text-sm lg:text-base font-semibold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-opacity-50"
                                       style={buttonStyle}
                                    >
                                       <span className="relative z-10 whitespace-nowrap">
                                          {translations?.home?.buttons?.portfolio || 'Projects'}
                                       </span>
                                    </Link>

                                    <Link
                                       href={getLocalizedLink('/contact')}
                                       className="button-shine group inline-flex items-center justify-center px-6 py-3 lg:px-7 lg:py-4 text-sm lg:text-base font-semibold rounded-md border border-opacity-50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                                       style={buttonStyle}
                                    >
                                       <span className="relative z-10 whitespace-nowrap">
                                          {translations?.home?.buttons?.contact || 'Contact'}
                                       </span>
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div ref={textRef} className="hero-text relative z-30 text-center mb-10 max-w-2xl">
                        <p
                           className="text-base md:text-lg lg:text-xl opacity-60 tracking-widest uppercase mb-5"
                           style={{ color: 'var(--muted-foreground)' }}
                        >
                           {translations?.home?.location || 'based in Bangkok, Thailand.'}
                        </p>

                        <p
                           className="text-xl md:text-2xl lg:text-3xl opacity-80 tracking-wide"
                           style={{ color: 'var(--muted-foreground)' }}
                        >
                           {translations?.home?.intro || 'My name is Russidan and I am a Developer'}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </>
   )
}