"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { localeFromPath } from "@/lib/locale-path";
import { useEffect, useState, type ReactNode, type RefObject } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CertificateCard from "@/components/certificate/CertificateCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type {
  Locale,
  PublishedCertificateData,
} from "@/features/certificates/types";
import en from "../../../locales/en.json";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";

const dictionaries = { en, th, ja };

function CertificateCardEntrance({
  children,
  index,
}: Readonly<{ children: ReactNode; index: number }>) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`certificate-card-entrance h-full${isVisible ? " certificate-card-entrance--visible" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {children}
    </div>
  );
}

export default function CertificateContent({
  certificates,
  unavailable = false,
}: Readonly<{
  certificates: PublishedCertificateData[];
  unavailable?: boolean;
}>) {
  const [locale, setLocale] = useState<Locale>(useInitialLocale());
  const translations = dictionaries[locale].certificate;

  useEffect(() => {
    const stored = localeFromPath(window.location.pathname);
    const frame = window.requestAnimationFrame(() => {
      if (stored === "th" || stored === "en" || stored === "ja") {
        setLocale(stored);
      }
    });
    const handleLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<{ language: Locale }>).detail.language;
      if (next === "th" || next === "en" || next === "ja") setLocale(next);
    };
    window.addEventListener("languageChange", handleLanguageChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden p-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <AnimatedSection animationType="fadeInUp" duration={0.8}>
          <section className="mx-auto mb-12 flex min-h-[40vh] max-w-3xl flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {translations.title}
            </h1>
            <p
              className="mx-auto mt-2 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--muted-foreground)" }}
            >
              {translations.subtitle}
            </p>
          </section>
        </AnimatedSection>

        {unavailable || certificates.length === 0 ? (
          <div
            className="rounded-3xl border p-12 text-center"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            {unavailable ? translations.unavailable : translations.empty}
          </div>
        ) : (
          <section
            aria-label={translations.title}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {certificates.map((certificate, index) => (
              <CertificateCardEntrance key={certificate.id} index={index}>
                <CertificateCard
                  certificate={certificate}
                  locale={locale}
                  translations={translations}
                />
              </CertificateCardEntrance>
            ))}
          </section>
        )}
      </div>

      <style jsx global>{`
        .certificate-card-entrance {
          opacity: 0;
          transform: scale(0.8) translateY(40px);
        }
        .certificate-card-entrance--visible {
          animation: certificate-card-enter 0.8s
            cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes certificate-card-enter {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .certificate-card {
          box-shadow: 0 18px 50px -32px var(--certificate-accent, #64748b);
          transition:
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 350ms ease;
        }
        .certificate-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform: translateX(-130%) skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.16),
            transparent
          );
          transition: transform 700ms ease;
        }
        .certificate-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 65px -35px
            color-mix(
              in srgb,
              var(--certificate-accent, #64748b) 55%,
              transparent
            );
        }
        .certificate-card:hover::after {
          transform: translateX(130%) skewX(-18deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .certificate-card-entrance {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
          .certificate-card,
          .certificate-card::after,
          .certificate-card img {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
