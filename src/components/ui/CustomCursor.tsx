'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTheme } from '../layout/ThemeProvider'

interface CursorPosition {
  x: number
  y: number
}

interface CursorState {
  isHovering: boolean
  cursorType: 'default' | 'pointer' | 'text' | 'view' | 'external' | 'drag' | 'loading'
  scale: number
}

export default function CustomCursor() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    cursorType: 'default',
    scale: 1
  })
  const [isVisible, setIsVisible] = useState(true)

  // Theme-specific cursor colors
  const getCursorColor = () => {
    if (theme === 'light') {
      // White cursor with difference blend mode creates black-to-white effect
      return '#ffffff'
    } else {
      // Dark theme uses CSS variable
      return 'var(--foreground)'
    }
  }

  // Secondary cursor color (no blend mode)
  const getFollowerColor = () => {
    if (theme === 'light') {
      return '#000000' // Black in light theme
    } else {
      return 'var(--foreground)' // Same as main in dark theme
    }
  }

  // Update cursor position
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  // Handle mouse enter/leave page
  const handleMouseEnter = useCallback(() => setIsVisible(true), [])
  const handleMouseLeave = useCallback(() => setIsVisible(false), [])

  // Determine cursor type based on element
  const updateCursorType = useCallback((element: Element | null) => {
    if (!element) return

    const tagName = element.tagName.toLowerCase()
    const classList = element.classList
    const hasHref = element.getAttribute('href')
    const isButton = tagName === 'button' || element.getAttribute('role') === 'button'
    const isInput = ['input', 'textarea'].includes(tagName)
    
    // Check for specific classes or data attributes
    if (classList.contains('skill-card-container') || classList.contains('project-card')) {
      setCursorState(prev => ({ ...prev, cursorType: 'view', scale: 1.5, isHovering: true }))
    } else if (hasHref && hasHref.startsWith('http') && !hasHref.includes(window.location.hostname)) {
      setCursorState(prev => ({ ...prev, cursorType: 'external', scale: 1.3, isHovering: true }))
    } else if (isButton || classList.contains('cursor-pointer')) {
      setCursorState(prev => ({ ...prev, cursorType: 'pointer', scale: 1.2, isHovering: true }))
    } else if (hasHref) {
      setCursorState(prev => ({ ...prev, cursorType: 'pointer', scale: 1.2, isHovering: true }))
    } else if (isInput) {
      setCursorState(prev => ({ ...prev, cursorType: 'text', scale: 1, isHovering: true }))
    } else if (classList.contains('draggable')) {
      setCursorState(prev => ({ ...prev, cursorType: 'drag', scale: 1.1, isHovering: true }))
    } else {
      setCursorState(prev => ({ ...prev, cursorType: 'default', scale: 1, isHovering: false }))
    }
  }, [])

  // Handle hover events
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as Element
    updateCursorType(target)
  }, [updateCursorType])

  const handleMouseOut = useCallback(() => {
    setCursorState(prev => ({ ...prev, cursorType: 'default', scale: 1, isHovering: false }))
  }, [])

  useEffect(() => {
    setMounted(true)

    // Check if device has mouse/trackpad (not touch-only)
    const hasMouseSupport = window.matchMedia('(pointer: fine)').matches
    
    if (!hasMouseSupport) {
      // Don't show custom cursor on touch devices
      return
    }

    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    // Hide default cursor on interactive elements
    const style = document.createElement('style')
    style.textContent = `
      *, *:before, *:after {
        cursor: none !important;
      }
      
      body {
        cursor: none !important;
      }

      /* Override for iframes and external content */
      iframe {
        cursor: default !important;
      }
      
      /* Show default cursor on touch devices */
      @media (pointer: coarse) {
        *, *:before, *:after, body {
          cursor: default !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      if (style.parentNode) {
        document.head.removeChild(style)
      }
    }
  }, [updateCursorPosition, handleMouseEnter, handleMouseLeave, handleMouseOver, handleMouseOut])

  // Don't render on touch devices or if not mounted/visible
  if (!mounted || !window.matchMedia('(pointer: fine)').matches || !isVisible) return null

  const getCursorContent = () => {
    switch (cursorState.cursorType) {
      case 'view':
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        )
      case 'external':
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        )
      case 'text':
        return (
          <div className="w-0.5 h-4 bg-current opacity-80 animate-pulse" />
        )
      case 'drag':
        return (
          <div className="flex items-center justify-center w-full h-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="5,9 2,12 5,15"/>
              <polyline points="9,5 12,2 15,5"/>
              <polyline points="15,19 12,22 9,19"/>
              <polyline points="19,9 22,12 19,15"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
          </div>
        )
      case 'loading':
        return (
          <div className="animate-spin">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Main cursor */}
      <div
        className="custom-cursor-main"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: '12px',
          height: '12px',
          backgroundColor: getCursorColor(),
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease',
          mixBlendMode: 'difference',
        }}
      />

      {/* Cursor follower with content */}
      <div
        className="custom-cursor-follower"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: `${20 * cursorState.scale}px`,
          height: `${20 * cursorState.scale}px`,
          border: `1px solid ${getCursorColor()}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          backgroundColor: cursorState.isHovering ? getCursorColor() : 'transparent',
          color: cursorState.isHovering ? (theme === 'light' ? '#000000' : 'var(--background)') : getCursorColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          opacity: cursorState.isHovering ? 0.9 : 0.6,
          mixBlendMode: 'difference',
        }}
      >
        {getCursorContent()}
      </div>

      {/* Styles */}
      <style jsx>{`
        .custom-cursor-main {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }

        /* Smooth cursor movement */
        .custom-cursor-main,
        .custom-cursor-follower {
          will-change: transform;
        }
      `}</style>
    </>
  )
}