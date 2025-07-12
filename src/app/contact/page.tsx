// src/app/contact/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ContactCard from '@/components/contact/ContactCard'
import ToastNotification from '@/components/contact/ToastNotification'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import th from '../../../locales/th.json'
import ja from '../../../locales/ja.json'
import en from '../../../locales/en.json'

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
            return th
         case 'ja':
            return ja
         default:
            return en
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
   }, [locale])

   const contactChannels = [
      {
         id: 'email',
         icon: MdEmail,
         title: translations?.contact?.channels?.email?.title || 'Email',
         info: 'russidan.nadee@gmail.com',
         action: translations?.contact?.channels?.email?.action || 'Send Message',
         href: 'mailto:russidan.nadee@gmail.com',
         iconColor: '#ef4444',
         gradient: '',
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
         iconColor: '#6b7280',
         gradient: '',
      },
      {
         id: 'linkedin',
         icon: FaLinkedin,
         title: translations?.contact?.channels?.linkedin?.title || 'LinkedIn',
         info: 'Russidan Nadee',
         action: translations?.contact?.channels?.linkedin?.action || 'Connect',
         href: 'https://www.linkedin.com/in/russidan-nadee-1734a2352/',
         iconColor: '#0ea5e9',
         gradient: '',
      },
      {
         id: 'phone',
         icon: MdPhone,
         title: translations?.contact?.channels?.phone?.title || 'Phone',
         info: '+66 93-108-9420',
         action: translations?.contact?.channels?.phone?.action || 'Call Now',
         href: 'tel:+66931089420',
         iconColor: '#10b981',
         gradient: '',
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
         iconColor: '#e91e63',
         gradient: '',
      },
      {
         id: 'facebook',
         icon: FaFacebook,
         title: translations?.contact?.channels?.facebook?.title || 'Facebook',
         info: 'russidan.nadee.2025',
         action: translations?.contact?.channels?.facebook?.action || 'Visit Profile',
         href: 'https://www.facebook.com/russidan.nadee.2025',
         iconColor: '#1877f2',
         gradient: '',
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
            // Use custom onClick function if provided
            channel.onClick()
         } else if (channel.href) {
            // Open URL in new tab for all other channels
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
         {/* Animated Background */}
         <AnimatedBackground />

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
            {contactChannels.map((channel, index) => (
               <ContactCard
                  key={channel.id}
                  {...channel}
                  isVisible={visibleItems.has(index)}
                  onClick={() => handleChannelClick(channel)}
                  onCopy={handleCopy}
                  loadingItem={loadingItem}
                  copiedItem={copiedItem}
                  getOpeningText={getOpeningText}
                  locale={locale}
               />
            ))}
         </div>

         {/* Toast Notification */}
         <ToastNotification
            message={getCopiedText(locale)}
            isVisible={!!copiedItem}
         />

         {/* Global Styles */}
         <style jsx global>{`
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
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