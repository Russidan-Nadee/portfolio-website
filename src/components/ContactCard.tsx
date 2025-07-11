// src/components/ContactCard.tsx
'use client'

import { useState } from 'react'
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
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
         }}
         onClick={handleCardClick}
      >
         {/* Animated background gradient */}
         <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

         {/* Shine effect */}
         <div className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-800 ease-out"></div>

         {/* Pulse animation on hover */}
         <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></div>

         <div className="text-center space-y-4 relative z-10">
            {/* Enhanced icon with animations */}
            <div className="inline-flex p-4 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative">
               {/* Icon glow effect */}
               <div className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ backgroundColor: iconColor }}></div>

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
               {/* Button shine effect */}
               <div className="button-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"></div>

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

        .contact-card:hover .shine-effect {
          animation: shine 0.8s ease-out;
        }

        .contact-card:hover .action-button:hover .button-shine {
          animation: buttonShine 0.6s ease-out;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes buttonShine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
      </div>
   )
}