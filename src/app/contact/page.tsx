// src/app/contact/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { MdEmail, MdPhone, MdContentCopy } from 'react-icons/md'
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Contact() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'
   const [copiedItem, setCopiedItem] = useState<string | null>(null)
   const [loadingItem, setLoadingItem] = useState<string | null>(null)
   const [mounted, setMounted] = useState(false)
   const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

   // Helper function to get translations based on locale
   const getTranslations = (locale: string) => {
      switch (locale) {
         case 'th':
            return require('../../../locales/th.json')
         case 'ja':
            return require('../../../locales/ja.json')
         default:
            return require('../../../locales/en.json')
      }
   }

   // Load translations with fallback
   const translations = getTranslations(locale)

   // Get localized text for copied notification
   const getCopiedText = (locale: string) => {
      switch (locale) {
         case 'th':
            return 'คัดลอกแล้ว!'
         case 'ja':
            return 'コピーしました！'
         default:
            return 'Copied to clipboard!'
      }
   }

   // Get localized text for opening status
   const getOpeningText = (locale: string) => {
      switch (locale) {
         case 'th':
            return 'กำลังเปิด...'
         case 'ja':
            return '開いています...'
         default:
            return 'Opening...'
      }
   }

   useEffect(() => {
      setMounted(true)

      // Stagger card animations
      const timer = setTimeout(() => {
         contactChannels.forEach((_, index) => {
            setTimeout(() => {
               setVisibleItems(prev => new Set([...prev, index]))
            }, index * 200)
         })
      }, 300)

      return () => clearTimeout(timer)
   }, [locale]) // Re-run when locale changes

   const contactChannels = [
      {
         id: 'email',
         icon: MdEmail,
         title: translations?.contact?.channels?.email?.title || 'Email',
         info: 'russidan.nadee@gmail.com',
         action: translations?.contact?.channels?.email?.action || 'Send Message',
         href: 'mailto:russidan.nadee@gmail.com',
         color: 'transparent',
         iconColor: '#ef4444', // Gmail red
         gradient: 'from-red-500/20 via-red-400/10 to-transparent',
         onClick: () => {
            const email = 'russidan.nadee@gmail.com'
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
            window.open(gmailUrl, '_blank', 'noopener,noreferrer')
         }
      },
      {
         id: 'github',
         icon: FaGithub,
         title: translations?.contact?.channels?.github?.title || 'GitHub',
         info: 'Russidan-Nadee',
         action: translations?.contact?.channels?.github?.action || 'View Code',
         href: 'https://github.com/Russidan-Nadee',
         color: 'transparent',
         iconColor: '#6b7280', // GitHub gray
         gradient: 'from-gray-500/20 via-gray-400/10 to-transparent',
      },
      {
         id: 'linkedin',
         icon: FaLinkedin,
         title: translations?.contact?.channels?.linkedin?.title || 'LinkedIn',
         info: 'Russidan Nadee',
         action: translations?.contact?.channels?.linkedin?.action || 'Connect',
         href: 'https://www.linkedin.com/in/russidan-nadee-1734a2352/',
         color: 'transparent',
         iconColor: '#0ea5e9', // LinkedIn blue
         gradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
      },
      {
         id: 'phone',
         icon: MdPhone,
         title: translations?.contact?.channels?.phone?.title || 'Phone',
         info: '+66 93-108-9420',
         action: translations?.contact?.channels?.phone?.action || 'Call Now',
         href: 'tel:+66931089420',
         color: 'transparent',
         iconColor: '#10b981', // Phone green
         gradient: 'from-green-500/20 via-green-400/10 to-transparent',
         onClick: () => {
            window.location.href = 'tel:+66931089420'
            setTimeout(() => {
               navigator.clipboard.writeText('+66931089420')
               setCopiedItem('phone')
               setTimeout(() => setCopiedItem(null), 2000)
            }, 1000)
         }
      },
      {
         id: 'instagram',
         icon: FaInstagram,
         title: translations?.contact?.channels?.instagram?.title || 'Instagram',
         info: '@firstl._',
         action: translations?.contact?.channels?.instagram?.action || 'Follow Me',
         href: 'https://www.instagram.com/firstl._/',
         color: 'transparent',
         iconColor: '#e91e63', // Instagram pink
         gradient: 'from-pink-500/20 via-pink-400/10 to-transparent',
      },
      {
         id: 'facebook',
         icon: FaFacebook,
         title: translations?.contact?.channels?.facebook?.title || 'Facebook',
         info: 'russidan.nadee.2025',
         action: translations?.contact?.channels?.facebook?.action || 'Visit Profile',
         href: 'https://www.facebook.com/russidan.nadee.2025',
         color: 'transparent',
         iconColor: '#1877f2',  // Facebook blue
         gradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
      }
   ]

   const handleChannelClick = async (channel: any) => {
      setLoadingItem(channel.id)

      // Add haptic feedback for mobile
      if ('vibrate' in navigator) {
         navigator.vibrate(50)
      }

      try {
         if (channel.onClick) {
            channel.onClick()
         } else if (channel.href.startsWith('mailto:') || channel.href.startsWith('tel:')) {
            window.location.href = channel.href
         } else {
            window.open(channel.href, '_blank', 'noopener,noreferrer')
         }
      } catch (error) {
         console.error('Error opening channel:', error)
      } finally {
         setTimeout(() => setLoadingItem(null), 800)
      }
   }

   const handleCopy = (text: string, type: string) => {
      navigator.clipboard.writeText(text)
      setCopiedItem(type)
      setTimeout(() => setCopiedItem(null), 2000)
   }

   if (!mounted) return null

   return (
      <div className="max-w-6xl mx-auto p-8 relative">
         {/* Animated Background Elements */}
         <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30">
               <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
               <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
         </div>

         {/* Header with enhanced animations */}
         <div className="text-center mb-12 relative">
            <h1
               className="text-5xl font-bold mb-4 animate-fade-in-up"
               style={{
                  color: 'var(--foreground)',
                  animationDelay: '0.1s',
                  animationFillMode: 'both'
               }}
            >
               {translations?.contact?.title || 'Get in Touch'}
            </h1>
            <p
               className="text-lg max-w-2xl mx-auto animate-fade-in-up"
               style={{
                  color: 'var(--muted-foreground)',
                  animationDelay: '0.2s',
                  animationFillMode: 'both'
               }}
            >
               {translations?.contact?.subtitle || 'Let\'s connect and discuss opportunities'}
            </p>
         </div>

         {/* Contact Grid with staggered animations */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactChannels.map((channel, index) => {
               const IconComponent = channel.icon
               const isLoading = loadingItem === channel.id
               const isCopied = copiedItem === channel.id
               const isVisible = visibleItems.has(index)

               return (
                  <div
                     key={channel.id}
                     className={`
                        relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-700 cursor-pointer
                        hover:scale-105 hover:shadow-2xl hover:shadow-black/20
                        border border-gray-700/50 bg-transparent
                        group overflow-hidden
                        transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                     `}
                     style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                     }}
                     onClick={() => handleChannelClick(channel)}
                  >
                     {/* Animated background gradient */}
                     <div className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                     {/* Enhanced ripple effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                     {/* Pulse animation on hover */}
                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></div>

                     <div className="text-center space-y-4 relative z-10">
                        {/* Enhanced icon with animations */}
                        <div className="inline-flex p-4 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative">
                           {/* Icon glow effect */}
                           <div className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ backgroundColor: channel.iconColor }}></div>

                           {isLoading ? (
                              <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin relative z-10" style={{ color: channel.iconColor }}></div>
                           ) : (
                              <IconComponent
                                 size={48}
                                 className="relative z-10 transform group-hover:drop-shadow-lg transition-all duration-300"
                                 style={{ color: channel.iconColor }}
                              />
                           )}
                        </div>

                        {/* Content with slide animations */}
                        <div className="transform group-hover:translate-y-[-2px] transition-transform duration-300">
                           <h3 className="font-semibold text-lg mb-1 group-hover:text-shadow-sm" style={{ color: 'var(--foreground)' }}>
                              {channel.title}
                           </h3>
                           <div className="flex items-center justify-center gap-2 mb-2">
                              <p className="text-sm transition-colors duration-300" style={{ color: 'var(--muted-foreground)' }}>
                                 {channel.info}
                              </p>
                              {(channel.id === 'email' || channel.id === 'phone') && (
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation()
                                       handleCopy(channel.info, channel.id)
                                    }}
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
                           `}
                           style={{
                              backgroundColor: 'var(--muted)',
                              color: 'var(--foreground)',
                              borderColor: 'var(--border)'
                           }}
                           disabled={isLoading}
                        >
                           {/* Button shine effect */}
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                           <span className="relative z-10">
                              {isLoading ? getOpeningText(locale) : channel.action}
                           </span>
                        </button>
                     </div>
                  </div>
               )
            })}
         </div>

         {/* Enhanced Toast Notification */}
         {copiedItem && (
            <div className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg border animate-slide-up z-50"
               style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                  borderColor: 'var(--border)',
                  animation: 'slideUp 0.3s ease-out'
               }}>
               <div className="flex items-center gap-2">
                  <MdContentCopy size={16} className="animate-bounce" />
                  <span>{getCopiedText(locale)}</span>
               </div>
            </div>
         )}

         {/* Custom CSS animations */}
         <style jsx>{`
            @keyframes fade-in-up {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            @keyframes slideUp {
               from {
                  opacity: 0;
                  transform: translateY(20px) scale(0.9);
               }
               to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
               }
            }

            .animate-fade-in-up {
               animation: fade-in-up 0.6s ease-out;
            }

            .animate-slide-up {
               animation: slideUp 0.3s ease-out;
            }

            /* Hover effects for better interactivity */
            .group:hover .animate-pulse {
               animation-duration: 1s;
            }

            /* Smooth transitions for all interactive elements */
            * {
               transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Custom scrollbar for better UX */
            ::-webkit-scrollbar {
               width: 8px;
            }

            ::-webkit-scrollbar-track {
               background: var(--muted);
               border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb {
               background: var(--muted-foreground);
               border-radius: 4px;
               opacity: 0.5;
            }

            ::-webkit-scrollbar-thumb:hover {
               opacity: 0.8;
            }
         `}</style>
      </div>
   )
}