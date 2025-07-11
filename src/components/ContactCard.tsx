// src/components/ContactCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { MdContentCopy } from 'react-icons/md'
import { IconType } from 'react-icons'

interface ContactCardProps {
   id: string
   icon: IconType
   title: string
   info: string
   action: string
   href: string
   iconColor: string
   gradient: string
   isVisible: boolean
   onClick?: () => void
   onCopy?: (text: string, type: string) => void
   loadingItem: string | null
   copiedItem: string | null
   getOpeningText: (locale: string) => string
   locale: string
}

export default function ContactCard({
   id,
   icon: IconComponent,
   title,
   info,
   action,
   href,
   iconColor,
   gradient,
   isVisible,
   onClick,
   onCopy,
   loadingItem,
   copiedItem,
   getOpeningText,
   locale
}: ContactCardProps) {
   const isLoading = loadingItem === id
   const isCopied = copiedItem === id
   const showCopyButton = id === 'email' || id === 'phone'
   const [isDark, setIsDark] = useState(false)

   // Monitor theme changes
   useEffect(() => {
      const checkTheme = () => {
         const isDarkMode = document.documentElement.classList.contains('dark') ||
            document.documentElement.getAttribute('data-theme') === 'dark' ||
            document.body.classList.contains('dark')
         setIsDark(isDarkMode)
      }

      checkTheme()

      // Watch for theme changes
      const observer = new MutationObserver(checkTheme)
      observer.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ['class', 'data-theme']
      })
      observer.observe(document.body, {
         attributes: true,
         attributeFilter: ['class']
      })

      return () => observer.disconnect()
   }, [])

   const handleCardClick = () => {
      if (onClick) {
         onClick()
      } else if (href.startsWith('mailto:') || href.startsWith('tel:')) {
         window.location.href = href
      } else {
         window.open(href, '_blank', 'noopener,noreferrer')
      }
   }

   const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onCopy) {
         onCopy(info, id)
      }
   }

   return (
      <div
         className={`
        relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-700 cursor-pointer
        hover:scale-105 hover:shadow-2xl hover:shadow-black/20
        border border-gray-700/50 bg-transparent
        contact-card group overflow-hidden
        transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
         style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            '--shine-color': isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            '--button-shine-color': isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
         } as React.CSSProperties}
         onClick={handleCardClick}
      >
         {/* Shine effect - Theme responsive */}
         <div className="shine-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

         <div className="text-center space-y-4 relative z-10">
            {/* Enhanced icon with animations */}
            <div className="inline-flex p-4 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative">
               {isLoading ? (
                  <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin relative z-10" style={{ color: iconColor }}></div>
               ) : (
                  <IconComponent
                     size={48}
                     className="relative z-10 transform group-hover:drop-shadow-lg transition-all duration-300"
                     style={{ color: iconColor }}
                  />
               )}
            </div>

            {/* Content with slide animations */}
            <div className="transform group-hover:translate-y-[-2px] transition-transform duration-300">
               <h3 className="font-semibold text-lg mb-1 group-hover:text-shadow-sm" style={{ color: 'var(--foreground)' }}>
                  {title}
               </h3>
               <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-sm transition-colors duration-300" style={{ color: 'var(--muted-foreground)' }}>
                     {info}
                  </p>
                  {showCopyButton && (
                     <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-gray-600/50 rounded transition-all duration-300 hover:scale-110 hover:rotate-12"
                     >
                        <MdContentCopy size={14} style={{ color: 'var(--muted-foreground)' }} />
                     </button>
                  )}
               </div>
            </div>

            {/* Enhanced action button */}
            <button
               className={`
            w-full py-3 px-4 rounded-xl font-medium transition-all duration-500
            hover:opacity-80 border relative overflow-hidden
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            hover:shadow-lg hover:shadow-black/10
            transform hover:scale-105 active:scale-95
            action-button
          `}
               style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)'
               }}
               disabled={isLoading}
            >
               {/* Button shine effect - Theme responsive */}
               <div className="button-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

               <span className="relative z-10">
                  {isLoading ? getOpeningText(locale) : action}
               </span>
            </button>
         </div>

         <style jsx>{`
        .contact-card {
          position: relative;
          overflow: hidden;
        }

        .shine-effect {
          pointer-events: none;
          z-index: 1;
        }

        .action-button {
          position: relative;
          overflow: hidden;
        }

        .button-shine {
          pointer-events: none;
          z-index: 1;
        }

        /* Shine effect base styles */
        .shine-effect {
          transform: translateX(100%);
          transition: transform 0.8s ease-out, opacity 0.3s ease-out;
          background: linear-gradient(90deg, transparent, var(--shine-color, rgba(0,0,0,0.3)), transparent);
        }

        .button-shine {
          transform: translateX(100%);
          transition: transform 0.6s ease-out, opacity 0.3s ease-out;
          background: linear-gradient(90deg, transparent, var(--button-shine-color, rgba(0,0,0,0.25)), transparent);
        }

        /* Hover animations */
        .contact-card:hover .shine-effect {
          transform: translateX(-100%) !important;
          opacity: 1 !important;
        }

        .contact-card:not(:hover) .shine-effect {
          transform: translateX(100%) !important;
          opacity: 0 !important;
        }

        .action-button:hover .button-shine {
          transform: translateX(-100%) !important;
          opacity: 1 !important;
        }

        .action-button:not(:hover) .button-shine {
          transform: translateX(100%) !important;
          opacity: 0 !important;
        }
      `}</style>
      </div>
   )
}