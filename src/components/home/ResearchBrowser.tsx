"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaApple, FaShieldAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiSketch } from "react-icons/si";
import styles from "./ResearchBrowser.module.css";

type Locale = "th" | "en" | "ja";

const descriptionByLocale: Record<Locale, string> = {
  th: "ภาพจำลองหน้าเริ่มต้น Safari บน Mac มีรายการโปรด รายงานความเป็นส่วนตัว และคำแนะนำจาก Siri",
  en: "Illustration of a Safari start page on Mac with Favorites, Privacy Report, and Siri Suggestions",
  ja: "お気に入り、プライバシーレポート、Siri からの提案が並ぶ Mac の Safari スタートページのイメージ",
};

const startPageCopy: Record<
  Locale,
  {
    favorites: string;
    privacy: string;
    privacySummary: string;
    suggestions: string;
    suggestionSummary: string;
  }
> = {
  th: {
    favorites: "รายการโปรด",
    privacy: "รายงานความเป็นส่วนตัว",
    privacySummary: "ตัวอย่างรายงานการป้องกันตัวติดตามใน 7 วันที่ผ่านมา",
    suggestions: "คำแนะนำจาก Siri",
    suggestionSummary: "ตัวอย่างคลัง UI สำหรับแอปเดสก์ท็อป",
  },
  en: {
    favorites: "Favorites",
    privacy: "Privacy Report",
    privacySummary: "Sample privacy report from the last seven days",
    suggestions: "Siri Suggestions",
    suggestionSummary: "Sample desktop UI library for building applications",
  },
  ja: {
    favorites: "お気に入り",
    privacy: "プライバシーレポート",
    privacySummary: "過去7日間のプライバシーレポート例",
    suggestions: "Siri からの提案",
    suggestionSummary: "デスクトップアプリ向け UI ライブラリの例",
  },
};

const favorites = [
  "apple",
  "javascript",
  "letterL",
  "sketch",
  "figma",
  "letterD",
  "google",
  "mosaic",
  "letterP",
] as const;

type FavoriteKind = (typeof favorites)[number];

function FavoriteMark({ kind }: { kind: FavoriteKind }) {
  switch (kind) {
    case "apple":
      return <FaApple />;
    case "javascript":
      return <span className={styles.jsMark}>JS</span>;
    case "letterL":
      return "L";
    case "sketch":
      return <SiSketch />;
    case "figma":
      return (
        <span className={styles.figmaMark}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    case "letterD":
      return "D";
    case "google":
      return <FcGoogle />;
    case "mosaic":
      return (
        <span className={styles.mosaicMark}>
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    case "letterP":
      return "P";
  }
}

const suggestionMarks = ["⌂", "✿", "L", "LS", "S", "▦"] as const;

// The sticky scene remounts while scrolling. Play the window entrance once
// per locale and show the finished frame on later mounts.
const playedLocales = new Set<Locale>();

function ToolbarIcon({ children }: { children: ReactNode }) {
  return <span className={styles.toolbarIcon}>{children}</span>;
}

export default function ResearchBrowser({ locale }: { locale: Locale }) {
  const copy = startPageCopy[locale];
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<{
    locale: Locale;
    phase: "idle" | "playing" | "settled";
  }>({ locale, phase: "idle" });
  const phase = progress.locale === locale ? progress.phase : "idle";

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reveal = () => {
      if (playedLocales.has(locale)) {
        setProgress({ locale, phase: "settled" });
        return;
      }

      playedLocales.add(locale);
      setProgress({ locale, phase: "playing" });
    };

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(reveal);
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [locale]);

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${phase === "playing" ? styles.playing : ""} ${phase === "settled" ? styles.settled : ""}`}
      role="img"
      aria-label={descriptionByLocale[locale]}
    >
      <div className={styles.window} aria-hidden="true">
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <span className={styles.trafficLights}>
              <span className={styles.close} />
              <span className={styles.minimize} />
              <span className={styles.zoom} />
            </span>
            <ToolbarIcon>
              <svg viewBox="0 0 20 20" fill="none">
                <rect x="2.5" y="3" width="15" height="14" rx="2" />
                <path d="M7.5 3v14" />
              </svg>
            </ToolbarIcon>
            <span className={styles.navigation}>
              <ToolbarIcon>
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m12 5-5 5 5 5" />
                </svg>
              </ToolbarIcon>
              <ToolbarIcon>
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m8 5 5 5-5 5" />
                </svg>
              </ToolbarIcon>
            </span>
          </div>

          <div className={styles.address}>
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="8.8" cy="8.8" r="4.7" />
              <path d="m12.4 12.4 3.5 3.5" />
            </svg>
            <span>Search or enter website name</span>
          </div>

          <div className={styles.toolbarRight}>
            <ToolbarIcon>
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M10 12V2.5m0 0L6.8 5.7M10 2.5l3.2 3.2" />
                <path d="M5 8.5H4a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 4 17.5h12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 16 8.5h-1" />
              </svg>
            </ToolbarIcon>
            <ToolbarIcon>
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M10 3.5v13M3.5 10h13" />
              </svg>
            </ToolbarIcon>
            <ToolbarIcon>
              <svg viewBox="0 0 20 20" fill="none">
                <rect x="2.5" y="4" width="10.5" height="10.5" rx="1.7" />
                <path d="M7 15.5a1.5 1.5 0 0 0 1.5 1.5H16a1.5 1.5 0 0 0 1.5-1.5V8A1.5 1.5 0 0 0 16 6.5h-1" />
              </svg>
            </ToolbarIcon>
          </div>
        </div>
        <div className={styles.page}>
          <div className={styles.startContent}>
            <section className={styles.favoritesSection}>
              <h4 className={styles.sectionTitle}>{copy.favorites}</h4>
              <div className={styles.favoritesGrid}>
                {favorites.map((kind) => (
                  <div className={styles.favorite} key={kind}>
                    <span className={`${styles.favoriteTile} ${styles[kind]}`}>
                      <FavoriteMark kind={kind} />
                    </span>
                    <span className={styles.favoriteDomain}>example.com</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.privacySection}>
              <h4 className={styles.sectionTitle}>{copy.privacy}</h4>
              <div className={styles.privacyStrip}>
                <span className={styles.privacyShield} aria-hidden="true">
                  <FaShieldAlt />
                </span>
                <strong>13</strong>
                <span>{copy.privacySummary}</span>
              </div>
            </section>

            <section className={styles.suggestionsSection}>
              <h4 className={styles.sectionTitle}>{copy.suggestions}</h4>
              <div className={styles.suggestionsGrid}>
                {suggestionMarks.map((mark, index) => (
                  <div
                    className={styles.suggestionCard}
                    key={`${mark}-${index}`}
                  >
                    <span className={styles.suggestionText}>
                      <span>{copy.suggestionSummary}</span>
                      <small>example.com</small>
                    </span>
                    <span
                      className={`${styles.suggestionIcon} ${styles[`suggestionIcon${index + 1}`]}`}
                    >
                      {mark}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
