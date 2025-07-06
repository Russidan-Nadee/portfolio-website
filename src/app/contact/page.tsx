// src/app/contact/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Contact() {
   const searchParams = useSearchParams()
   const locale = searchParams.get('lang') || 'en'

   // Load translations based on current locale
   const translations = locale === 'th' ? require('../../../locales/th.json') : require('../../../locales/en.json')

   const contactChannels = [
      {
         id: 'email',
         icon: MdEmail,
         title: translations.contact.channels.email.title,
         info: 'russidan.nadee@gmail.com',
         action: translations.contact.channels.email.action,
         href: 'mailto:russidan.nadee@gmail.com',
         onClick: () => {
            // ลอง Gmail URL format ใหม่
            const email = 'russidan.nadee@gmail.com'
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
            window.open(gmailUrl, '_blank', 'noopener,noreferrer')
         }
      },
      {
         id: 'github',
         icon: FaGithub,
         title: translations.contact.channels.github.title,
         info: 'Russidan-Nadee',
         action: translations.contact.channels.github.action,
         href: 'https://github.com/Russidan-Nadee'
      },
      {
         id: 'linkedin',
         icon: FaLinkedin,
         title: translations.contact.channels.linkedin.title,
         info: 'Russidan Nadee',
         action: translations.contact.channels.linkedin.action,
         href: 'https://www.linkedin.com/in/russidan-nadee-1734a2352/'
      },
      {
         id: 'phone',
         icon: MdPhone,
         title: translations.contact.channels.phone.title,
         info: '+66 93-108-9420',
         action: translations.contact.channels.phone.action,
         href: 'tel:+66931089420',
         onClick: () => {
            // ลอง tel: ก่อน (เปิด dialer app)
            window.location.href = 'tel:+66931089420'

            // Fallback: copy phone number ถ้า user ไม่มี dialer app
            setTimeout(() => {
               navigator.clipboard.writeText('+66931089420')
               console.log('Phone number copied to clipboard')
            }, 1000)
         }
      },
      {
         id: 'instagram',
         icon: FaInstagram,
         title: translations.contact.channels.instagram.title,
         info: '@firstl._',
         action: translations.contact.channels.instagram.action,
         href: 'https://www.instagram.com/firstl._/'
      },
      {
         id: 'facebook',
         icon: FaFacebook,
         title: translations.contact.channels.facebook.title,
         info: 'russidan.nadee.2025',
         action: translations.contact.channels.facebook.action,
         href: 'https://www.facebook.com/russidan.nadee.2025'
      }
   ]

   const handleChannelClick = (channel: {
      id: string;
      icon: any;
      title: string;
      info: string;
      action: string;
      href: string;
      onClick?: () => void;
   }) => {
      if (channel.onClick) {
         // ใช้ custom onClick function
         channel.onClick()
      } else if (channel.href.startsWith('mailto:') || channel.href.startsWith('tel:')) {
         // ใช้ default behavior สำหรับ email/phone
         window.location.href = channel.href
      } else {
         // เปิด external links ในแท็บใหม่
         window.open(channel.href, '_blank', 'noopener,noreferrer')
      }
   }

   return (
      <div className="max-w-6xl mx-auto p-8">
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
               {translations.contact.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
               {translations.contact.subtitle}
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactChannels.map((channel) => {
               const IconComponent = channel.icon

               return (
                  <div
                     key={channel.id}
                     onClick={() => handleChannelClick(channel)}
                     className="
                        relative p-6 rounded-2xl border cursor-pointer transition-all duration-300
                        hover:scale-105 hover:shadow-lg border-gray-200 dark:border-gray-700
                     "
                     style={{
                        backgroundColor: 'var(--card)',
                        color: 'var(--card-foreground)',
                        borderColor: 'var(--border)'
                     }}
                  >
                     <div className="text-center space-y-4">
                        <div
                           className="inline-flex p-4 rounded-full"
                           style={{ color: 'var(--foreground)' }}
                        >
                           <IconComponent size={32} />
                        </div>

                        <div>
                           <h3
                              className="font-semibold text-lg mb-2"
                              style={{ color: 'var(--foreground)' }}
                           >
                              {channel.title}
                           </h3>
                           <p
                              className="text-sm mb-4"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              {channel.info}
                           </p>
                        </div>

                        <button
                           className="
                              w-full py-2 px-4 rounded-lg font-medium transition-colors
                              hover:opacity-80 border
                           "
                           style={{
                              backgroundColor: 'var(--muted)',
                              color: 'var(--foreground)',
                              borderColor: 'var(--border)'
                           }}
                        >
                           {channel.action}
                        </button>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   )
}