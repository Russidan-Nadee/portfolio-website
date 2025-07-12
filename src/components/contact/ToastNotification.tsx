// src/components/ToastNotification.tsx
'use client'

import { MdContentCopy } from 'react-icons/md'

interface ToastNotificationProps {
   message: string
   isVisible: boolean
}

export default function ToastNotification({ message, isVisible }: ToastNotificationProps) {
   if (!isVisible) return null

   return (
      <div
         className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg border animate-slide-up z-50"
         style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            borderColor: 'var(--border)',
            animation: 'slideUp 0.3s ease-out'
         }}
      >
         <div className="flex items-center gap-2">
            <MdContentCopy size={16} className="animate-bounce" />
            <span>{message}</span>
         </div>

         <style jsx>{`
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

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
      </div>
   )
}