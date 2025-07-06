// src/components/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
   theme: Theme
   toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
   const [theme, setTheme] = useState<Theme>('light')
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)

      // Check localStorage for saved theme
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
         setTheme(savedTheme)
         document.documentElement.setAttribute('data-theme', savedTheme)
      } else {
         // Check system preference
         const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
         setTheme(systemTheme)
         document.documentElement.setAttribute('data-theme', systemTheme)
      }
   }, [])

   useEffect(() => {
      if (mounted) {
         // Apply theme to document
         document.documentElement.setAttribute('data-theme', theme)
         localStorage.setItem('theme', theme)
      }
   }, [theme, mounted])

   const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light')
   }

   const value = {
      theme,
      toggleTheme
   }

   return (
      <ThemeContext.Provider value={value}>
         {children}
      </ThemeContext.Provider>
   )
}

export function useTheme() {
   const context = useContext(ThemeContext)
   if (context === undefined) {
      throw new Error('useTheme must be used within a ThemeProvider')
   }
   return context
}