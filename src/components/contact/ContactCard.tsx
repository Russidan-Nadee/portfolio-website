// src/components/contact/ContactCard.tsx
"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { MdContentCopy } from "react-icons/md";
import { IconType } from "react-icons";
import Image from "next/image";

interface ContactCardProps {
  id: string;
  icon: IconType | string;
  title: string;
  info: string;
  action: string;
  href: string;
  iconColor: string;
  // Fix: Remove unused gradient parameter
  animationDelayMs: number;
  onClick?: () => void;
  onCopy?: (text: string, type: string) => void;
  loadingItem: string | null;
  getOpeningText: (locale: string) => string;
  locale: string;
}

export default function ContactCard({
  id,
  icon: IconComponent,
  title,
  info,
  action,
  href,
  iconColor,
  // Fix: Remove gradient from destructuring
  animationDelayMs,
  onClick,
  onCopy,
  loadingItem,
  getOpeningText,
  locale,
}: ContactCardProps) {
  const isLoading = loadingItem === id;
  // Fix: Remove unused isCopied variable
  const showCopyButton = id === "email" || id === "phone";
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(info, id);
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-700 cursor-pointer
        hover:scale-105 hover:shadow-2xl hover:shadow-black/20
        border border-gray-700/50 bg-transparent
        contact-card group overflow-hidden
        transform contact-card-entry
      `}
      style={
        {
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          animationDelay: `${animationDelayMs}ms`,
          "--shine-color": isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          "--button-shine-color": isDark
            ? "rgba(255,255,255,0.25)"
            : "rgba(0,0,0,0.25)",
        } as React.CSSProperties
      }
      onClick={handleCardClick}
    >
      {/* Shine effect - Theme responsive */}
      <div className="shine-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="text-center space-y-4 relative z-10">
        {/* Enhanced icon with animations */}
        <div className="inline-flex p-4 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative">
          {isLoading ? (
            <div
              className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin relative z-10"
              style={{ color: iconColor }}
            ></div>
          ) : typeof IconComponent === "string" ? (
            <Image
              src={IconComponent}
              alt=""
              width={48}
              height={48}
              className="relative z-10 transform group-hover:drop-shadow-lg transition-all duration-300"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "brightness(0)",
              }}
            />
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
          <h3
            className="font-semibold text-lg mb-1 group-hover:text-shadow-sm"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <p
              className="text-sm transition-colors duration-300"
              style={{ color: "var(--muted-foreground)" }}
            >
              {info}
            </p>
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-600/50 rounded transition-all duration-300 hover:scale-110 hover:rotate-12"
              >
                <MdContentCopy
                  size={14}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Enhanced action button */}
        <button
          className={`
            w-full py-3 px-4 rounded-xl font-medium transition-all duration-500
            hover:opacity-80 border relative overflow-hidden
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            hover:shadow-lg hover:shadow-black/10
            transform hover:scale-105 active:scale-95
            action-button
          `}
          style={{
            backgroundColor: "var(--muted)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
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
        @keyframes contact-card-enter {
          from {
            opacity: 0;
            translate: 0 32px;
          }
          to {
            opacity: 1;
            translate: 0 0;
          }
        }

        .contact-card-entry {
          animation: contact-card-enter 0.7s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-card-entry {
            animation: none;
          }
        }

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
          transition:
            transform 0.8s ease-out,
            opacity 0.3s ease-out;
          background: linear-gradient(
            90deg,
            transparent,
            var(--shine-color, rgba(0, 0, 0, 0.3)),
            transparent
          );
        }

        .button-shine {
          transform: translateX(100%);
          transition:
            transform 0.6s ease-out,
            opacity 0.3s ease-out;
          background: linear-gradient(
            90deg,
            transparent,
            var(--button-shine-color, rgba(0, 0, 0, 0.25)),
            transparent
          );
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
  );
}
