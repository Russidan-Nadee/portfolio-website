// src/app/portfolio/PortfolioContent.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localizedPath } from "@/lib/locale-path";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";
import en from "../../../locales/en.json";
import type { ProjectData } from "@/app/admin/projects/types";
import ProjectImage from "@/components/portfolio/ProjectImage";

type Locale = "th" | "en" | "ja";
export type PortfolioCardData = Pick<
  ProjectData,
  "id" | "slug" | "title" | "filterTags" | "techSummary" | "thumbnailUrl"
>;

export default function PortfolioContent({
  projects,
}: Readonly<{ projects: PortfolioCardData[] }>) {
  const [locale, setLocale] = useState<Locale>(useInitialLocale());
  const portfolioRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  const translations = getTranslations(locale);

  const [activeFilter, setActiveFilter] = useState("all");

  // Language change handler
  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (e: Event) => {
      setLocale((e as CustomEvent<{ language: Locale }>).detail.language);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  // Helper function to generate localized links
  const getLocalizedLink = (path: string) => {
    return localizedPath(path, locale);
  };

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "crossplatform", label: "Cross-Platform" },
    { key: "web", label: "Web" },
    { key: "backend", label: "Backend" },
    { key: "desktop", label: "Desktop" },
    { key: "mobile", label: "Mobile" },
  ];

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        activeFilter === "all"
          ? true
          : project.filterTags.includes(
              activeFilter as ProjectData["filterTags"][number]
            )
      ),
    [activeFilter, projects]
  );

  // Mouse tracking for background elements
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let clientX = 0;
    let clientY = 0;

    const updateFloatingElements = () => {
      frameId = 0;
      const section = portfolioRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const pointerX =
        ((clientX - rect.left - rect.width / 2) / rect.width) * 10;
      const pointerY =
        ((clientY - rect.top - rect.height / 2) / rect.height) * 10;
      const [first, second, third] = floatingElementsRef.current;
      if (first)
        first.style.translate = `${pointerX * 0.3}px ${pointerY * 0.3}px`;
      if (second)
        second.style.translate = `${pointerX * -0.2}px ${pointerY * -0.2}px`;
      if (third)
        third.style.translate = `${pointerX * 0.5}px ${pointerY * 0.5}px`;
    };

    const handleMouseMove = (e: MouseEvent): void => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!frameId) frameId = requestAnimationFrame(updateFloatingElements);
    };

    const section = portfolioRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
        if (frameId) cancelAnimationFrame(frameId);
      };
    }
  }, []);

  return (
    <div
      ref={portfolioRef}
      className="min-h-screen p-8 relative overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={(element) => {
            floatingElementsRef.current[0] = element;
          }}
          className="absolute top-20 left-10 w-20 h-20 rounded-full floating-element"
          style={{
            animationDelay: "0s",
          }}
        />
        <div
          ref={(element) => {
            floatingElementsRef.current[1] = element;
          }}
          className="absolute bottom-32 right-20 w-16 h-16 floating-element"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            animationDelay: "1s",
          }}
        />
        <div
          ref={(element) => {
            floatingElementsRef.current[2] = element;
          }}
          className="absolute top-1/2 right-1/4 w-12 h-12 floating-element"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
            animationDelay: "2s",
          }}
        />
      </div>
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Headline + Subtitle with fade-in-up animation */}
        <div className="portfolio-section-enter">
          <div
            className="mb-12 animate-fade-in-up"
            style={{
              minHeight: "40vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "var(--foreground)",
              animationDelay: "0.1s",
              animationFillMode: "both",
            }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-2">
              {translations?.portfolio?.title || "Portfolio"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {translations?.portfolio?.subtitle ||
                "Explore my latest projects and technical achievements"}
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="portfolio-section-enter">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                aria-pressed={activeFilter === filter.key}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 border ${
                  activeFilter === filter.key
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
                style={{
                  backgroundColor:
                    activeFilter === filter.key
                      ? "var(--foreground)"
                      : "var(--card)",
                  color:
                    activeFilter === filter.key
                      ? "var(--background)"
                      : "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Project grid with staggered animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProjects.map((project, index) => {
              const title = project.title[locale] || project.title.en;
              return (
                <div
                  key={project.id}
                  className="flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <Link href={getLocalizedLink(`/portfolio/${project.slug}`)}>
                    <div
                      className="project-card border rounded-lg overflow-hidden transition-all duration-500 ease-in-out relative cursor-pointer"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="relative w-full aspect-[1429/2000]">
                        <ProjectImage
                          src={project.thumbnailUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1023px) calc(50vw - 2.75rem), 368px"
                          className="object-cover"
                          fallback={
                            <div
                              className="w-full h-full flex items-center justify-center text-center p-6"
                              style={{
                                backgroundColor: "var(--muted)",
                                color: "var(--muted-foreground)",
                              }}
                            >
                              <div>
                                <div
                                  className="text-4xl mb-2"
                                  aria-hidden="true"
                                >
                                  📱
                                </div>
                                <p>{title}</p>
                              </div>
                            </div>
                          }
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                          {title}
                        </h3>
                        <p className="text-white/95 text-sm drop-shadow-md">
                          {project.techSummary}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Tags */}
                  <div className="flex gap-2 mt-4">
                    {project.filterTags.map((tag) => {
                      const tagInfo = filters.find((f) => f.key === tag);
                      return tagInfo ? (
                        <div
                          key={tag}
                          className="px-3 py-1 rounded text-xs font-medium transition-all duration-300 hover:opacity-80"
                          style={{
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                          }}
                        >
                          {tagInfo.label}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Styles */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes slideInScale {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(40px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: slideInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            animation-fill-mode: both;
          }

          .portfolio-section-enter {
            animation: fade-in-up 0.8s ease-out both;
          }

          .floating-element {
            animation: float 3s ease-in-out infinite;
            background: var(--foreground) !important;
            opacity: 0.05;
          }

          .project-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .project-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .project-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            transition: left 0.6s ease;
            z-index: 5;
          }

          .project-card:hover::before {
            left: 100%;
          }

          @media (prefers-reduced-motion: reduce) {
            .portfolio-section-enter,
            .animate-fade-in-up,
            .floating-element {
              animation: none !important;
            }
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
    </div>
  );
}
