// src/components/AnimatedBackground.tsx
'use client'

export default function AnimatedBackground() {
   return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
               className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"
               style={{ animationDelay: '2s' }}
            ></div>
            <div
               className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-pulse"
               style={{ animationDelay: '4s' }}
            ></div>
         </div>
      </div>
   )
}