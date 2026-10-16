// src/components/about/Timeline.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localeFromPath } from "@/lib/locale-path";
import { useEffect, useRef, useState } from "react";
import { MdSchool, MdRestaurant, MdFastfood, MdLocalBar } from "react-icons/md";
import { FaGraduationCap, FaBriefcase, FaLaptopCode } from "react-icons/fa";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";
import en from "../../../locales/en.json";
import styles from "./Timeline.module.css";

export interface LocalizedText {
  th: string;
  en: string;
  ja: string;
}

export interface ExperienceItem {
  id: string;
  type: "work" | "education";
  title: LocalizedText;
  company: string;
  startDate: string; // "yyyy-MM"
  endDate: string | null; // "yyyy-MM", null = Present
  isCurrent: boolean;
  description: LocalizedText;
  skills: string[];
  icon: string;
}

interface TimelineProps {
  // th/en/ja locale JSON files don't share an identical shape (pre-existing content
  // drift), so no single precise type covers the deep optional-chained access below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: any;
  experiences: ExperienceItem[];
}

interface DisplayItem {
  id: string;
  period: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  icon: string;
  isCurrent: boolean;
}

const localeMap: Record<string, string> = {
  th: "th-TH",
  ja: "ja-JP",
  en: "en-US",
};

function formatYearMonth(value: string, locale: string): string {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString(localeMap[locale] || "en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatPeriod(
  item: ExperienceItem,
  locale: string,
  currentText: string
): string {
  const start = formatYearMonth(item.startDate, locale);
  let end = "";
  if (item.isCurrent) {
    end = currentText;
  } else if (item.endDate) {
    end = formatYearMonth(item.endDate, locale);
  }
  return end ? `${start} - ${end}` : start;
}

export default function Timeline({
  translations,
  experiences,
}: Readonly<TimelineProps>) {
  const [locale, setLocale] = useState(useInitialLocale());

  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"work" | "education">("work");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [headerAnimated, setHeaderAnimated] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DisplayItem | null>(null);

  // Close the enlarged card modal on Escape
  useEffect(() => {
    if (!selectedCard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard]);

  // Helper function to get translations based on locale
  const getTranslations = (locale: string) => {
    switch (locale) {
      case "th":
        return th;
      case "ja":
        return ja;
      default:
        return en;
    }
  };

  // Load translations with fallback
  const currentTranslations = translations || getTranslations(locale);

  // Language change handler
  useEffect(() => {
    // Get initial language from localStorage
    // Keep the existing locale synchronization until the About page locale flow is consolidated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(localeFromPath(window.location.pathname) || "en");

    // Listen for language changes
    const handleLanguageChange = (e: Event) => {
      setLocale(
        localeFromPath(
          "/" + (e as CustomEvent<{ language: string }>).detail.language
        )
      );
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  // Get localized current text
  const getCurrentText = (locale: string) => {
    switch (locale) {
      case "th":
        return "ปัจจุบัน";
      case "ja":
        return "現在";
      default:
        return "Present";
    }
  };

  // Get data from DB-backed experiences, localized for the current display language
  const currentText = getCurrentText(locale);
  const currentData = experiences
    .filter((item) => item.type === activeTab)
    .map((item) => ({
      id: item.id,
      period: formatPeriod(item, locale, currentText),
      title: item.title[locale as keyof LocalizedText] || item.title.en,
      company: item.company,
      description:
        item.description[locale as keyof LocalizedText] || item.description.en,
      skills: item.skills,
      icon: item.icon,
      isCurrent: item.isCurrent,
    }));

  // Get professional icon based on data from locale files
  const getTimelineIcon = (item: DisplayItem) => {
    // Use icon from locale data if available first
    const iconName = item.icon;

    // Map icon names to actual React components
    const iconMap: { [key: string]: React.ReactNode } = {
      FaBriefcase: <FaBriefcase />, // Professional work
      FaLaptopCode: <FaLaptopCode />, // Developer/Programming
      FaGraduationCap: <FaGraduationCap />, // University/College
      MdWork: <MdLocalBar />, // Beverage Staff/Bartender
      MdRestaurant: <MdRestaurant />, // Restaurant/service work
      MdFastfood: <MdFastfood />, // Fast food/kitchen work
      MdSchool: <MdSchool />, // High school
    };

    // Return the mapped icon or fallback
    if (iconName && iconMap[iconName]) {
      return iconMap[iconName];
    }

    // Fallback logic based on title
    const title = item.title?.toLowerCase() || "";

    if (activeTab === "education") {
      return <MdSchool />;
    }

    if (activeTab === "work") {
      if (
        title.includes("developer") ||
        title.includes("engineer") ||
        title.includes("programmer")
      ) {
        return <FaLaptopCode />;
      }
      return <FaBriefcase />;
    }

    // Default fallback
    return <FaBriefcase />;
  };

  useEffect(() => {
    const handleScroll = () => {
      // Header animation
      if (headerRef.current && !headerAnimated) {
        const headerRect = headerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (headerRect.top <= windowHeight * 0.8) {
          setHeaderAnimated(true);
        }
      }

      if (!timelineRef.current || animationComplete) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of timeline is visible
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Start animation when timeline enters viewport
      const startOffset = windowHeight * 0.8;
      const endOffset = windowHeight * 0.2;

      if (
        elementTop <= startOffset &&
        elementTop + elementHeight >= endOffset
      ) {
        // Calculate progress (0 to 1)
        const totalScrollableHeight = elementHeight + startOffset - endOffset;
        const currentScroll = startOffset - elementTop;
        const progress = Math.max(
          0,
          Math.min(1, currentScroll / totalScrollableHeight)
        );

        setScrollProgress(progress);

        // Show items based on progress - Faster for education with 2 items
        const totalItems = currentData.length;
        const itemsToShow: number[] = [];

        for (let i = 0; i < totalItems; i++) {
          const itemThreshold = (i + 1) / totalItems;
          // Use different threshold based on tab and number of items
          const threshold =
            activeTab === "education" && totalItems === 2 ? 0.6 : 0.7;
          if (progress >= itemThreshold * threshold) {
            itemsToShow.push(i);
          }
        }

        setVisibleItems(itemsToShow);

        // Force 100% when last card shows OR when progress is high enough
        if (
          (itemsToShow.length === totalItems && totalItems > 0) ||
          progress >= 0.85
        ) {
          setAnimationComplete(true);
          setScrollProgress(1); // Force 100%
          setVisibleItems([...new Array(totalItems).keys()]); // Show all items
        }
      } else if (elementTop > startOffset && !animationComplete) {
        // Reset when scrolled back up (only if animation not complete)
        setScrollProgress(0);
        setVisibleItems([]);
      }

      // Additional check: Force complete when very close to bottom
      const documentHeight = document.documentElement.scrollHeight;
      const currentScroll = window.pageYOffset + window.innerHeight;
      const scrollPercentage = currentScroll / documentHeight;

      if (
        scrollPercentage >= 0.87 &&
        !animationComplete &&
        currentData.length > 0
      ) {
        setAnimationComplete(true);
        setScrollProgress(1);
        setVisibleItems([...new Array(currentData.length).keys()]);
      }
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentData.length, animationComplete, headerAnimated, activeTab]);

  // Reset when tab changes
  useEffect(() => {
    // Preserve the timeline's immediate reset when switching tabs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollProgress(0);
    setVisibleItems([]);
    setAnimationComplete(false);
  }, [activeTab]);

  // Reset header animation when tab changes or locale changes
  useEffect(() => {
    // Keep the existing heading replay behavior on tab and locale changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeaderAnimated(false);
  }, [activeTab, locale]);

  // Handle empty data
  if (!currentTranslations?.about?.timeline) {
    return (
      <section className="py-16 mb-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p style={{ color: "var(--muted-foreground)" }}>
            Timeline data not available
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes iconPop {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
          }
          60% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }

        @keyframes cardSlideRight {
          0% {
            transform: scale(0.8) translateX(-100px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }

        @keyframes cardSlideLeft {
          0% {
            transform: scale(0.8) translateX(100px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }

        @keyframes titleSlideUp {
          0% {
            transform: translateY(60px) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes tabsFadeIn {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .timeline-line {
          transform: scaleY(${scrollProgress});
          transform-origin: top center;
          transition: transform 0.1s ease-out;
        }

        .timeline-icon {
          transform: translate(-50%, -50%) scale(0);
          transition: all 0.3s ease-out;
        }

        .timeline-icon.visible {
          animation: iconPop 0.6s ease-out forwards;
        }

        .timeline-item {
          opacity: 0;
          transition: all 0.3s ease-out;
        }

        .timeline-item.visible.right {
          animation: cardSlideRight 0.8s ease-out forwards;
        }

        .timeline-item.visible.left {
          animation: cardSlideLeft 0.8s ease-out forwards;
        }

        .current-item {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 20px
              color-mix(in srgb, var(--foreground) 20%, transparent) !important;
          }
          50% {
            box-shadow: 0 0 32px
              color-mix(in srgb, var(--foreground) 34%, transparent) !important;
          }
        }

        /* Mobile: Smaller cards */
        @media (max-width: 768px) {
          .timeline-item {
            width: 200px !important;
          }

          .timeline-item .rounded-xl {
            padding: 0.5rem !important;
          }

          .timeline-icon {
            width: 3rem !important;
            height: 3rem !important;
            font-size: 1rem !important;
          }

          .timeline-item h3 {
            font-size: 0.875rem !important;
            margin-bottom: 0.125rem !important;
          }

          .timeline-item h4 {
            font-size: 0.75rem !important;
            margin-bottom: 0.125rem !important;
          }

          .timeline-item p {
            font-size: 0.625rem !important;
            margin-bottom: 0.5rem !important;
          }
        }

        /* Modal animations */
        @keyframes modalFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          0% {
            transform: scale(0.8) translateY(30px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .modal-overlay {
          animation: modalFadeIn 0.3s ease-out forwards;
        }

        .modal-content {
          animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }

        .header-title {
          transform: translateY(60px) scale(0.8);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .header-title.animated {
          animation: titleSlideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .header-tabs {
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.6s ease-out;
        }

        .header-tabs.animated {
          animation: tabsFadeIn 0.8s ease-out 0.3s forwards;
        }

        .animated-gradient {
          background: linear-gradient(
            -45deg,
            var(--foreground),
            var(--muted-foreground),
            var(--foreground)
          );
          background-size: 400% 400%;
          animation: gradientShift 3s ease infinite;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent !important;
          text-fill-color: transparent !important;
          color: transparent !important;
        }
      `}</style>

      <section ref={timelineRef} className={`py-16 mb-16 ${styles.section}`}>
        <div className="max-w-6xl mx-auto px-8">
          <div ref={headerRef} className={`text-center mb-16 ${styles.header}`}>
            <h2
              ref={titleRef}
              className={`header-title text-4xl md:text-5xl font-bold mb-8 ${styles.title} ${headerAnimated ? "animated animated-gradient" : ""}`}
              style={{
                color: headerAnimated ? "transparent" : "var(--foreground)",
              }}
            >
              {currentTranslations?.about?.timeline?.title ||
                "Experience & Background"}
            </h2>

            <div
              ref={tabsRef}
              className={`header-tabs inline-flex p-1 mb-8 ${styles.tabs} ${headerAnimated ? "animated" : ""}`}
            >
              <button
                onClick={() => setActiveTab("work")}
                className={`px-3 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold transition-all duration-300 flex items-center gap-2 ${styles.tab}`}
                aria-pressed={activeTab === "work"}
              >
                <FaBriefcase aria-hidden="true" />
                {currentTranslations?.about?.timeline?.tabs?.work ||
                  "Experience"}
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-3 py-2 md:px-6 md:py-3 text-xs md:text-base font-semibold transition-all duration-300 flex items-center gap-2 ${styles.tab}`}
                aria-pressed={activeTab === "education"}
              >
                <FaGraduationCap aria-hidden="true" />
                {currentTranslations?.about?.timeline?.tabs?.education ||
                  "Education"}
              </button>
            </div>
          </div>

          {currentData.length === 0 ? (
            <div className="text-center py-16">
              <p style={{ color: "var(--muted-foreground)" }}>
                No {activeTab} data available
              </p>
            </div>
          ) : (
            <div
              className={`relative max-w-4xl mx-auto ${styles.timeline}`}
              style={{
                minHeight: currentData.length === 2 ? "800px" : "600px",
              }}
            >
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 flex justify-center">
                <div className={`timeline-line h-full ${styles.line}`} />
              </div>

              {/* Timeline Items */}
              <div
                className="relative z-10 pt-8"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: currentData.length === 2 ? "12rem" : "8rem",
                }}
              >
                {currentData.map((item, index) => {
                  const isRight = index % 2 === 0;
                  const isVisible = visibleItems.includes(index);

                  return (
                    <div
                      key={`${activeTab}-${item.id}-${locale}`}
                      className="relative flex items-center justify-center min-h-[200px]"
                    >
                      {/* Timeline Item */}
                      <div
                        className={`timeline-item absolute w-80 ${isRight ? "left-1/2 ml-8 md:ml-16" : "right-1/2 mr-8 md:mr-16"} ${isVisible ? "visible" : ""} ${isRight ? "right" : "left"}`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className={`rounded-xl p-6 border transition-all duration-300 cursor-pointer ${styles.card} ${item.isCurrent ? styles.currentCard : ""}`}
                          onClick={() => setSelectedCard(item)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedCard(item);
                            }
                          }}
                        >
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${styles.badge}`}
                            >
                              {item.period}
                            </span>
                            {item.isCurrent && isVisible && (
                              <div
                                className={`current-item absolute inset-0 rounded-xl pointer-events-none ${styles.currentPulse}`}
                                style={{
                                  background: "transparent",
                                }}
                              />
                            )}
                          </div>

                          <h3
                            className="text-xl font-bold mb-2"
                            style={{ color: "var(--foreground)" }}
                          >
                            {item.title}
                          </h3>

                          <h4
                            className="text-md font-semibold mb-1"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {item.company}
                          </h4>

                          <p
                            className="leading-relaxed mb-4 text-sm"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {item.skills?.map((skill: string) => (
                              <span
                                key={skill}
                                className={`text-xs px-2 py-1 transition-colors ${styles.skill}`}
                              >
                                {skill}
                              </span>
                            )) || []}
                          </div>
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`timeline-icon absolute left-1/2 w-16 h-16 rounded-full flex items-center justify-center text-xl z-20 ${styles.marker} ${item.isCurrent ? styles.currentMarker : ""} ${isVisible ? "visible" : ""}`}
                      >
                        {getTimelineIcon(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal for enlarged card */}
        {selectedCard && (
          <div
            className="modal-overlay fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div
              className="modal-content relative max-w-sm md:max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold z-10 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                ×
              </button>

              {/* Enlarged card */}
              <div
                className="rounded-xl p-8 xl:p-12 border shadow-2xl"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: selectedCard.isCurrent
                    ? "var(--foreground)"
                    : "var(--border)",
                  borderWidth: selectedCard.isCurrent ? "2px" : "1px",
                  boxShadow: selectedCard.isCurrent
                    ? "0 20px 48px rgba(0, 0, 0, 0.18)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="mb-4">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {selectedCard.period}
                  </span>
                </div>

                <h3
                  className="text-3xl xl:text-4xl font-bold mb-4"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedCard.title}
                </h3>

                <h4
                  className="text-xl xl:text-2xl font-semibold mb-3"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {selectedCard.company}
                </h4>

                <p
                  className="leading-relaxed mb-8 text-lg xl:text-xl"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {selectedCard.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedCard.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="text-base px-3 py-2 rounded-md transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: "var(--muted)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {skill}
                    </span>
                  )) || []}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
