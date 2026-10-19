// src/app/about/AboutContent.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localeFromPath, localizedPath } from "@/lib/locale-path";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import PersonalIntro from "../../components/about/PersonalIntro";
import SkillsGrid, { CategoryItem } from "../../components/about/SkillsGrid";
import Timeline, { ExperienceItem } from "../../components/about/Timeline";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";
import en from "../../../locales/en.json";

gsap.registerPlugin(ScrollTrigger);

export default function AboutContent({
  skillCategories,
  experiences,
}: Readonly<{
  skillCategories: CategoryItem[];
  experiences: ExperienceItem[];
}>) {
  const [locale, setLocale] = useState(useInitialLocale());

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

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
  const translations = getTranslations(locale);

  // Helper function to generate localized links
  const getLocalizedLink = (path: string) => {
    return localizedPath(path, locale);
  };

  // Language change handler
  useEffect(() => {
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

  useEffect(() => {
    const context = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Description animation
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: descriptionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => context.revert();
  }, [locale]); // Re-run when locale changes

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Personal Introduction */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <PersonalIntro translations={translations} />
      </div>

      {/* Experience Timeline */}
      <div className="max-w-6xl mx-auto px-8">
        <Timeline translations={translations} experiences={experiences} />
      </div>

      {/* Skills Section */}
      <div className="max-w-6xl mx-auto px-8">
        <SkillsGrid translations={translations} categories={skillCategories} />
      </div>

      {/* Contact CTA */}
      <div
        className="py-16"
        style={{
          backgroundColor: "var(--muted)",
        }}
      >
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2
            ref={titleRef}
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            {translations?.about?.cta?.title || "Let's Connect & Collaborate"}
          </h2>
          <p
            ref={descriptionRef}
            className="text-xl mb-8 opacity-80"
            style={{ color: "var(--muted-foreground)" }}
          >
            {translations?.about?.cta?.description ||
              "Interested in working together or learning more about my projects? I'd love to hear from you!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={getLocalizedLink("/contact")}
              className="site-button px-8 py-4"
            >
              {translations?.about?.cta?.contact || "Get In Touch"}
            </Link>
            <Link
              href={getLocalizedLink("/portfolio")}
              className="site-button site-button--secondary px-8 py-4"
            >
              {translations?.about?.cta?.projects || "View Projects"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
