"use client";

import { useEffect, useState } from "react";
import { MdWorkspacePremium } from "react-icons/md";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CertificateCard from "@/components/certificate/CertificateCard";
import type { CertificateData, Locale } from "@/features/certificates/types";
import en from "../../../locales/en.json";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";

const dictionaries = { en, th, ja };

export default function CertificateContent({
  certificates,
  unavailable = false,
}: Readonly<{
  certificates: CertificateData[];
  unavailable?: boolean;
}>) {
  const [locale, setLocale] = useState<Locale>("en");
  const translations = dictionaries[locale].certificate;

  useEffect(() => {
    const stored = localStorage.getItem("lang");
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
    <main className="relative min-h-screen overflow-hidden px-6 py-16 md:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <AnimatedSection animationType="fadeInUp" duration={0.8}>
          <section className="mx-auto mb-14 max-w-3xl text-center">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <MdWorkspacePremium size={34} aria-hidden="true" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-violet-600">
              Verified learning
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {translations.title}
            </h1>
            <p
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
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
          <AnimatedSection
            animationType="fadeInUp"
            duration={0.8}
            stagger
            staggerDelay={0.08}
          >
            <section
              aria-label={translations.title}
              className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
            >
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  locale={locale}
                  translations={translations}
                />
              ))}
            </section>
          </AnimatedSection>
        )}
      </div>

      <style jsx global>{`
        .certificate-card {
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
          box-shadow: 0 28px 65px -35px rgba(76, 29, 149, 0.55);
        }
        .certificate-card:hover::after {
          transform: translateX(130%) skewX(-18deg);
        }
        @media (prefers-reduced-motion: reduce) {
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
