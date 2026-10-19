"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CodeXml, MapPin } from "lucide-react";
import { GB, TH, JP } from "country-flag-icons/react/3x2";
import {
  localeFromPath,
  localizedDestination,
  localizedPath,
} from "@/lib/locale-path";
import styles from "./Footer.module.css";
import th from "../../../locales/th.json";
import ja from "../../../locales/ja.json";
import en from "../../../locales/en.json";

const languageOptions = [
  { code: "en", Flag: GB },
  { code: "th", Flag: TH },
  { code: "ja", Flag: JP },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  const locale = localeFromPath(pathname);
  const translations = locale === "th" ? th : locale === "ja" ? ja : en;
  const [city, country] = translations.footer.location
    .split(",")
    .map((part) => part.trim());

  const getLocalizedLink = (path: string) => localizedPath(path, locale);
  const navLinks = [
    { path: "/", label: translations.header.nav.home },
    { path: "/about", label: translations.header.nav.about },
    { path: "/portfolio", label: translations.header.nav.portfolio },
    { path: "/certificate", label: translations.header.nav.certificate },
    { path: "/contact", label: translations.header.nav.contact },
  ];

  const handleLanguageSwitch = (newLocale: string) => {
    localStorage.setItem("lang", newLocale);
    router.push(
      localizedDestination(
        pathname,
        newLocale,
        window.location.search,
        window.location.hash
      )
    );
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <Link
              href={getLocalizedLink("/")}
              className={`${styles.brand} inline-flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-70`}
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
            <p className={styles.location}>
              <MapPin aria-hidden="true" className={styles.locationIcon} />
              <span>{city},</span>
              <span>{country}</span>
            </p>
          </div>
          <div className={styles.contact}>
            <a href="mailto:russidan.nadee@gmail.com">
              russidan.nadee@gmail.com
            </a>
            <a href="tel:+66931089420">+66 93-108-9420</a>
          </div>
        </div>

        <div className={styles.middle}>
          <nav className={styles.nav} aria-label="Footer navigation">
            {navLinks.map((item) => (
              <Link key={item.path} href={getLocalizedLink(item.path)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div
            className={styles.languages}
            role="group"
            aria-label={translations.footer.sections.language}
          >
            {languageOptions.map(({ code, Flag }) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageSwitch(code)}
                aria-pressed={locale === code}
              >
                <Flag aria-hidden="true" className={styles.flag} />
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>{translations.footer.copyright}</p>
          <Link href={getLocalizedLink("/legal/privacy-policy")}>
            {translations.footer.legal.privacyPolicy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
