'use client'

import React from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animationType?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp' | 'slideInDown' | 'rotateIn'
  delay?: number
  duration?: number
  threshold?: number
  triggerOnce?: boolean
  stagger?: boolean
  staggerDelay?: number
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeInUp',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  triggerOnce = true,
  stagger = false,
  staggerDelay = 0
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay
  })

  const getAnimationClass = () => {
    const baseClass = 'animated-section'
    const visibleClass = isVisible ? 'animated-section--visible' : ''
    return `${baseClass} ${baseClass}--${animationType} ${visibleClass} ${className}`.trim()
  }

  const staggerChildren = () => {
    if (!stagger || !React.Children.count(children)) return children

    return React.Children.map(children, (child, index) => (
      <div
        className="animated-section-child"
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      >
        {child}
      </div>
    ))
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={getAnimationClass()}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      }}
    >
      {stagger ? staggerChildren() : children}

      <style jsx>{`
        .animated-section {
          opacity: 0;
          will-change: transform, opacity;
          transition: none;
        }

        .animated-section--visible {
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Fade In Up */
        .animated-section--fadeInUp {
          transform: translateY(60px);
        }

        .animated-section--fadeInUp.animated-section--visible {
          animation-name: fadeInUp;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Fade In Down */
        .animated-section--fadeInDown {
          transform: translateY(-60px);
        }

        .animated-section--fadeInDown.animated-section--visible {
          animation-name: fadeInDown;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Fade In Left */
        .animated-section--fadeInLeft {
          transform: translateX(-60px);
        }

        .animated-section--fadeInLeft.animated-section--visible {
          animation-name: fadeInLeft;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Fade In Right */
        .animated-section--fadeInRight {
          transform: translateX(60px);
        }

        .animated-section--fadeInRight.animated-section--visible {
          animation-name: fadeInRight;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Scale In */
        .animated-section--scaleIn {
          transform: scale(0.8);
        }

        .animated-section--scaleIn.animated-section--visible {
          animation-name: scaleIn;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Slide In Up */
        .animated-section--slideInUp {
          transform: translateY(100px);
        }

        .animated-section--slideInUp.animated-section--visible {
          animation-name: slideInUp;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Slide In Down */
        .animated-section--slideInDown {
          transform: translateY(-100px);
        }

        .animated-section--slideInDown.animated-section--visible {
          animation-name: slideInDown;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Rotate In */
        .animated-section--rotateIn {
          transform: rotate(-10deg) scale(0.8);
        }

        .animated-section--rotateIn.animated-section--visible {
          animation-name: rotateIn;
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }

        /* Stagger children animations */
        .animated-section-child {
          opacity: 0;
          transform: translateY(30px);
        }

        .animated-section--visible .animated-section-child {
          animation-name: childFadeInUp;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes childFadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animated-section,
          .animated-section-child {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AnimatedSection