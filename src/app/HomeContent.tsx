// src/app/HomeContent.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localeFromPath, localizedPath } from "@/lib/locale-path";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import CreativeHero from "../components/home/CreativeHero";
import type {
  HeroCertificateData,
  HeroProjectData,
} from "../components/home/CreativeHero";
import ProjectsShowcase from "../components/home/ProjectsShowcase";
import Technologies, { TechnologyItem } from "../components/home/Technologies";
import th from "../../locales/th.json";
import ja from "../../locales/ja.json";
import en from "../../locales/en.json";
import styles from "./HomeContent.module.css";

const FASTWORK_PROFILE_URL = "https://fastwork.com/user/afe25s";

export default function HomeContent({
  technologies,
  featuredProjects,
  heroProjects,
  heroCertificates,
  resumeAvailable,
}: Readonly<{
  technologies: TechnologyItem[];
  featuredProjects: HeroProjectData[];
  heroProjects: HeroProjectData[];
  heroCertificates: HeroCertificateData[];
  resumeAvailable: boolean;
}>) {
  const [locale, setLocale] = useState(useInitialLocale());
  const previewRef = useRef<HTMLDivElement>(null);

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

  // Language change handler
  useEffect(() => {
    // Get initial language from localStorage
    const frame = window.requestAnimationFrame(() => {
      setLocale(localeFromPath(window.location.pathname) || "en");
    });

    // Listen for language changes
    const handleLanguageChange = (e: Event) => {
      setLocale(
        localeFromPath(
          "/" + (e as CustomEvent<{ language: string }>).detail.language
        )
      );
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        preview.style.setProperty(
          "--preview-scale",
          String(entry.contentRect.width / 900)
        );
      }
    });

    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <CreativeHero
        translations={translations}
        projects={heroProjects}
        certificates={heroCertificates}
        locale={locale as "th" | "en" | "ja"}
        resumeAvailable={resumeAvailable}
      />
      <Technologies translations={translations} technologies={technologies} />
      <ProjectsShowcase
        translations={translations}
        projects={featuredProjects}
        locale={locale as "th" | "en" | "ja"}
      />

      <section
        className={styles.cta}
        lang={locale}
        aria-labelledby="home-cta-title"
      >
        <div className={styles.ctaCard}>
          <div className={styles.inner}>
            <h2 id="home-cta-title" className={styles.headline}>
              {translations.home.cta.title}
            </h2>
            <div className={styles.actions}>
              <Link
                href={localizedPath("/contact", locale)}
                className={styles.primaryAction}
              >
                {translations.home.cta.button}
              </Link>
              <a
                className={styles.socialLink}
                href="https://github.com/Russidan-Nadee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <FaGithub aria-hidden="true" />
              </a>
              <a
                className={styles.socialLink}
                href="https://www.linkedin.com/in/russidan-nadee-1734a2352/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className={styles.profilePreview} ref={previewRef}>
            <iframe
              className={styles.profileFrame}
              src={FASTWORK_PROFILE_URL}
              title="Russidan Nadee on Fastwork"
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
            />
            <a
              className={styles.profileLink}
              href={FASTWORK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fastwork"
            >
              <span className={styles.externalMark} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
