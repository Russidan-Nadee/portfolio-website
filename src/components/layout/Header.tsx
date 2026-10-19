// src/components/layout/Header.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localeFromPath, localizedPath } from "@/lib/locale-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpRight, CodeXml, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";
import en from "../../../locales/en.json";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <PublicHeader />;
}

function PublicHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState(useInitialLocale());
  const [introState, setIntroState] = useState({ pathname, complete: false });

  if (introState.pathname !== pathname) {
    setIntroState({ pathname, complete: false });
  }

  // Language change handler
  useEffect(() => {
    // Get initial language from localStorage
    const frame = window.requestAnimationFrame(() => {
      setLocale(localeFromPath(window.location.pathname) || "en");
    });

    // Listen for language changes
    const handleLanguageChange = (event: Event) => {
      setLocale(
        localeFromPath(
          "/" + (event as CustomEvent<{ language: string }>).detail.language
        )
      );
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, [pathname]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!/^\/(en|th|ja)\/?$/.test(pathname)) return;

    const revealHeader = () => setIntroState({ pathname, complete: true });
    const introMedia = window.matchMedia(
      "(min-width: 1200px) and (prefers-reduced-motion: no-preference)"
    );
    const handleMediaChange = () => {
      if (!introMedia.matches) revealHeader();
    };

    window.addEventListener("creativeHeroIntroComplete", revealHeader);
    introMedia.addEventListener("change", handleMediaChange);

    const frame = window.requestAnimationFrame(() => {
      if (
        !introMedia.matches ||
        document.querySelector(
          '[data-creative-hero][data-intro-complete="true"]'
        )
      ) {
        revealHeader();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("creativeHeroIntroComplete", revealHeader);
      introMedia.removeEventListener("change", handleMediaChange);
    };
  }, [pathname]);

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

  const pagePath = pathname.replace(/^\/(en|th|ja)(?=\/|$)/, "") || "/";
  const isActivePage = (path: string) =>
    pagePath === path || (path !== "/" && pagePath.startsWith(`${path}/`));

  // Close menu when clicking outside or on link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  if (!mounted) return <div aria-hidden="true" className="h-16" />;

  const introPending = pathname === "/" && !introState.complete;

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex h-16 items-center border-b-2 ${styles.container} ${introPending ? styles.introPending : "transition-all duration-300"}`}
        style={{
          backgroundColor: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <nav
          className={`flex justify-between items-center mx-auto w-full ${styles.nav}`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={getLocalizedLink("/")}
              className="inline-flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-70"
              onClick={closeMenu}
              aria-label="Russidan Nadee, home"
            >
              <CodeXml
                aria-hidden="true"
                className="size-8 shrink-0 lg:size-10"
                strokeWidth={2.25}
              />
              <span
                className="text-[21px] font-bold leading-none lg:text-[30px]"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                RUSSIDAN
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href={getLocalizedLink("/")}
              className={`hover:opacity-70 pb-1 transition-all ${
                isActivePage("/") ? "border-b-2" : ""
              }`}
              style={{
                color: "var(--foreground)",
                borderColor: isActivePage("/")
                  ? "var(--foreground)"
                  : "transparent",
              }}
              aria-current={isActivePage("/") ? "page" : undefined}
            >
              {translations?.header?.nav?.home || "Home"}
            </Link>
            <Link
              href={getLocalizedLink("/about")}
              className={`hover:opacity-70 pb-1 transition-all ${
                isActivePage("/about") ? "border-b-2" : ""
              }`}
              style={{
                color: "var(--foreground)",
                borderColor: isActivePage("/about")
                  ? "var(--foreground)"
                  : "transparent",
              }}
              aria-current={isActivePage("/about") ? "page" : undefined}
            >
              {translations?.header?.nav?.about || "About"}
            </Link>
            <Link
              href={getLocalizedLink("/portfolio")}
              className={`hover:opacity-70 pb-1 transition-all ${
                isActivePage("/portfolio") ? "border-b-2" : ""
              }`}
              style={{
                color: "var(--foreground)",
                borderColor: isActivePage("/portfolio")
                  ? "var(--foreground)"
                  : "transparent",
              }}
              aria-current={isActivePage("/portfolio") ? "page" : undefined}
            >
              {translations?.header?.nav?.portfolio || "Portfolio"}
            </Link>
            <Link
              href={getLocalizedLink("/certificate")}
              className={`hover:opacity-70 pb-1 transition-all ${
                isActivePage("/certificate") ? "border-b-2" : ""
              }`}
              style={{
                color: "var(--foreground)",
                borderColor: isActivePage("/certificate")
                  ? "var(--foreground)"
                  : "transparent",
              }}
              aria-current={isActivePage("/certificate") ? "page" : undefined}
            >
              {translations?.header?.nav?.certificate || "Certificates"}
            </Link>
            <Link
              href={getLocalizedLink("/contact")}
              className={`hover:opacity-70 pb-1 transition-all ${
                isActivePage("/contact") ? "border-b-2" : ""
              }`}
              style={{
                color: "var(--foreground)",
                borderColor: isActivePage("/contact")
                  ? "var(--foreground)"
                  : "transparent",
              }}
              aria-current={isActivePage("/contact") ? "page" : undefined}
            >
              {translations?.header?.nav?.contact || "Contact"}
            </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuToggle}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                  style={{ backgroundColor: "var(--foreground)" }}
                />
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
                  style={{ backgroundColor: "var(--foreground)" }}
                />
                <span
                  className={`w-5 h-0.5 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                  style={{ backgroundColor: "var(--foreground)" }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className={`${styles.menuOverlay} md:hidden`}
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Slide Panel */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} md:hidden`}
        data-open={isMenuOpen}
        inert={!isMenuOpen}
        aria-label="Mobile menu"
      >
        <div className={styles.menuHeader}>
          <Link
            href={getLocalizedLink("/")}
            className={styles.menuBrand}
            onClick={closeMenu}
            aria-label="Russidan Nadee, home"
          >
            <CodeXml aria-hidden="true" size={28} strokeWidth={2.25} />
            <span>RUSSIDAN</span>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className={styles.menuClose}
            aria-label="Close menu"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className={styles.menuContent}>
          <nav className={styles.menuLinks} aria-label="Mobile navigation">
            {[
              { path: "/", label: translations.header.nav.home },
              { path: "/about", label: translations.header.nav.about },
              { path: "/portfolio", label: translations.header.nav.portfolio },
              {
                path: "/certificate",
                label: translations.header.nav.certificate,
              },
              { path: "/contact", label: translations.header.nav.contact },
            ].map(({ path, label }) => (
              <Link
                key={path}
                href={getLocalizedLink(path)}
                onClick={closeMenu}
                className={styles.menuLink}
                aria-current={isActivePage(path) ? "page" : undefined}
              >
                <span>{label}</span>
                <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.75} />
              </Link>
            ))}
          </nav>

          <div className={styles.menuPreferences}>
            <p className={styles.menuLabel}>
              {translations.footer.sections.language}
            </p>
            <LanguageSwitcher placement="top" />
          </div>
        </div>
      </div>
    </>
  );
}
