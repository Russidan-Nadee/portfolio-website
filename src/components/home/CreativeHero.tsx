// src/components/home/CreativeHero.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

interface CreativeHeroProps {
   translations?: any
}

export default function CreativeHero({ translations: propTranslations }: CreativeHeroProps) {
   const [locale, setLocale] = useState('en')

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

   const getLocalizedLink = (path: string) => {
      // Since we're not using URL params anymore, just return the path
      return path
   }

   const heroRef = useRef<HTMLDivElement>(null)
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
            setMousePosition({ x: x * 12, y: y * 12 })
         }
      }

      const hero = heroRef.current
      if (hero) {
         hero.addEventListener('mousemove', handleMouseMove)
         return () => hero.removeEventListener('mousemove', handleMouseMove)
      }
   }, [])

   const handleEmailClick = () => {
      const email = 'russidan.nadee@gmail.com'
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
      window.open(gmailUrl, '_blank', 'noopener,noreferrer')
   }

   const socialLinks = [
      {
         icon: FaGithub,
         href: 'https://github.com/Russidan-Nadee',
         label: 'GitHub'
      },
      {
         icon: FaLinkedin,
         href: 'https://www.linkedin.com/in/russidan-nadee-1734a2352/',
         label: 'LinkedIn'
      },
      {
         icon: MdEmail,
         onClick: handleEmailClick,
         label: 'Email'
      }
   ]

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
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-80px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(80px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                .hero-intro {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both' : 'none'};
                }

                .hero-image {
                    animation: ${isVisible ? 'fadeInScale 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both' : 'none'};
                }

                .hero-title {
                    animation: ${isVisible ? 'fadeInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both' : 'none'};
                }

                .hero-outline {
                    animation: ${isVisible ? 'fadeInRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both' : 'none'};
                }

                .hero-buttons {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s both' : 'none'};
                }

                .hero-location {
                    animation: ${isVisible ? 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both' : 'none'};
                }

                .floating-element {
                    animation: float 4s ease-in-out infinite;
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

                .social-icon {
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .social-icon:hover {
                    transform: translateY(-3px) scale(1.15);
                }

                .hero-text-overlay {
                    pointer-events: none;
                    user-select: none;
                }
            `}</style>

         <section
            ref={heroRef}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: 'var(--background)' }}
         >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div
                  className="absolute top-20 left-16 w-20 h-20 opacity-3 rounded-full floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
                     animationDelay: '0s'
                  }}
               />
               <div
                  className="absolute bottom-32 right-20 w-16 h-16 opacity-3 floating-element"
                  style={{
                     backgroundColor: 'var(--foreground)',
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                     transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * -0.2}px)`,
                     animationDelay: '2s'
                  }}
               />
            </div>

            {/* Full Width Container */}
            <div className="w-full h-screen relative">

               {/* Introduction Text - Top Center */}
               <div className="hero-intro absolute top-12 left-1/2 transform -translate-x-1/2 z-40">
                  <p
                     className="text-lg md:text-xl lg:text-2xl text-center"
                     style={{ color: 'var(--muted-foreground)' }}
                  >
                     {translations?.home?.intro || 'My name is Russidan and I am a Developer'}
                  </p>
               </div>

               {/* Main Content Area */}
               <div className="absolute inset-0 flex items-center justify-center">

                  {/* Behind image - Hero Title at head level */}
                  <div className="hero-title absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hero-text-overlay">
                     <h1
                        className="text-7xl md:text-8xl lg:text-9xl xl:text-10xl font-black leading-none tracking-tight text-center"
                        style={{
                           fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif',
                           color: 'var(--foreground)',
                           fontSize: 'clamp(5rem, 12vw, 16rem)',
                           transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
                           lineHeight: '0.8',
                           marginTop: '-200px'
                        }}
                     >
                        {translations?.home?.title || 'Developer'}
                     </h1>
                  </div>

                  {/* Center - Main Image */}
                  <div className="hero-image relative z-20">
                     <div className="relative group">
                        <div
                           className="relative w-80 h-96 md:w-96 md:h-[480px] lg:w-[420px] lg:h-[560px] xl:w-[460px] xl:h-[600px] overflow-hidden"
                           style={{
                              transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.08}px)`,
                              transition: 'transform 0.4s ease-out'
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
                              sizes="(max-width: 768px) 256px, (max-width: 1024px) 384px, 420px"
                           />

                           {/* Bottom fade gradient */}
                           <div
                              className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                              style={{
                                 background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)'
                              }}
                           />
                        </div>

                        {/* Buttons overlaying on image bottom */}
                        <div className="hero-buttons absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-row gap-4 z-40">
                           <Link
                              href={getLocalizedLink('/portfolio')}
                              className="button-shine group inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-opacity-50"
                              style={buttonStyle}
                           >
                              <span className="relative z-10 whitespace-nowrap">
                                 {translations?.home?.buttons?.portfolio || 'View Portfolio'}
                              </span>
                           </Link>

                           <Link
                              href={getLocalizedLink('/contact')}
                              className="button-shine group inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-semibold rounded-md border border-opacity-50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                              style={{
                                 backgroundColor: 'transparent',
                                 color: 'var(--foreground)',
                                 borderColor: 'var(--foreground)'
                              }}
                           >
                              <span className="relative z-10 whitespace-nowrap">
                                 {translations?.home?.buttons?.contact || 'Contact Me'}
                              </span>
                           </Link>
                        </div>

                        {/* Mobile/Tablet: Location and Social Icons below buttons */}
                        <div className="hero-location absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center gap-4 lg:hidden">
                           <p
                              className="text-sm text-center"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              {translations?.home?.location || 'based in Bangkok, Thailand.'}
                           </p>
                           <div className="flex items-center gap-6">
                              {socialLinks.map((social, index) => (
                                 <div key={index} className="social-icon">
                                    {social.href ? (
                                       <a
                                          href={social.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                                          style={{ color: 'var(--muted-foreground)' }}
                                          aria-label={social.label}
                                       >
                                          <social.icon size={20} />
                                       </a>
                                    ) : (
                                       <button
                                          onClick={social.onClick}
                                          className="inline-flex items-center justify-center w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                                          style={{ color: 'var(--muted-foreground)' }}
                                          aria-label={social.label}
                                       >
                                          <social.icon size={20} />
                                       </button>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Behind image - Outline Text smaller to match Developer width */}
                  <div className="hero-outline absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 hero-text-overlay">
                     <h2
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight text-center whitespace-nowrap"
                        style={{
                           fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif',
                           WebkitTextStroke: `clamp(1.5px, 0.2vw, 2.5px) var(--foreground)`,
                           WebkitTextFillColor: 'transparent',
                           filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.1))',
                           fontSize: 'clamp(2.5rem, 6vw, 8rem)',
                           transform: `translate(${mousePosition.x * -0.05}px, ${mousePosition.y * -0.05}px)`,
                           marginTop: '180px'
                        } as React.CSSProperties}
                     >
                        {translations?.home?.subtitle || 'cross-platform application'}
                     </h2>
                  </div>
               </div>

               {/* Desktop: Left side - Location text below outline text */}
               <div className="hero-location absolute top-1/2 z-40 transform translate-y-32 md:translate-y-40 lg:translate-y-48 hidden lg:block"
                  style={{ left: 'clamp(1rem, 15vw, 18rem)' }}>
                  <p
                     className="text-sm md:text-base tracking-wide"
                     style={{ color: 'var(--muted-foreground)' }}
                  >
                     {translations?.home?.location || 'based in Bangkok, Thailand.'}
                  </p>
               </div>

               {/* Desktop: Right side - Social Icons below outline text */}
               <div className="absolute top-1/2 z-40 transform translate-y-32 md:translate-y-40 lg:translate-y-48 hidden lg:block"
                  style={{ right: 'clamp(1rem, 18vw, 20rem)' }}>
                  <div className="flex items-center gap-6">
                     {socialLinks.map((social, index) => (
                        <div key={index} className="social-icon">
                           {social.href ? (
                              <a
                                 href={social.href}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center justify-center w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                                 style={{ color: 'var(--muted-foreground)' }}
                                 aria-label={social.label}
                              >
                                 <social.icon size={20} />
                              </a>
                           ) : (
                              <button
                                 onClick={social.onClick}
                                 className="inline-flex items-center justify-center w-8 h-8 rounded-full opacity-60 hover:opacity-100"
                                 style={{ color: 'var(--muted-foreground)' }}
                                 aria-label={social.label}
                              >
                                 <social.icon size={20} />
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      </>
   )
}