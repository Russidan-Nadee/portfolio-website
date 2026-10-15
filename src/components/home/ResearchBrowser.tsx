"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { FaApple, FaShieldAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiSketch } from "react-icons/si";
import styles from "./ResearchBrowser.module.css";

type Locale = "th" | "en" | "ja";

const descriptionByLocale: Record<Locale, string> = {
  th: "ภาพจำลอง Safari ที่ Codex และ Claude สลับกันค้นหา เปิดหน้าเอกสาร และเลือกข้อความสำคัญ",
  en: "Illustration of Codex and Claude searching, opening documentation, and highlighting key passages in Safari",
  ja: "Codex と Claude が Safari で検索し、資料を開いて重要な文章を選択するイメージ",
};

const searches = [
  {
    id: "codex",
    name: "Codex",
    mark: ">_",
    query: "keyboard accessibility docs",
    results: [
      { title: "Keyboard interaction guide", domain: "docs.example.com" },
      {
        title: "Focus and navigation examples",
        domain: "examples.example.com",
      },
    ],
    article: {
      category: "ACCESSIBILITY GUIDE",
      title: "Keyboard interaction guide",
      lead: "Make every interactive control reachable without a mouse.",
      heading: "Core keyboard behavior",
      lines: [
        "Tab moves focus through interactive elements in a logical order.",
        "A visible focus indicator shows the current keyboard position.",
      ],
    },
  },
  {
    id: "claude",
    name: "Claude",
    mark: "✻",
    query: "responsive UI examples",
    results: [
      { title: "Responsive layout guide", domain: "patterns.example.com" },
      { title: "Mobile interaction patterns", domain: "community.example.com" },
    ],
    article: {
      category: "DESIGN REFERENCE",
      title: "Responsive layout guide",
      lead: "Adapt layouts to the available space and the reader's context.",
      heading: "Patterns to consider",
      lines: [
        "Flexible columns keep content readable across screen sizes.",
        "Navigation and touch targets need room on narrow screens.",
      ],
    },
  },
] as const;

const crossCheck = {
  id: "community",
  title: "Mobile interaction patterns",
  address: "community.example.com / questions / mobile-navigation",
  lines: [
    "Keep primary actions within easy reach on small screens.",
    "Test navigation with touch, keyboard, and screen readers.",
  ],
} as const;

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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const placeholder = stage.querySelector<HTMLElement>(
        "[data-search-placeholder]"
      );
      const codexQuery = stage.querySelector<HTMLElement>(
        '[data-search-query="codex"]'
      );
      const claudeQuery = stage.querySelector<HTMLElement>(
        '[data-search-query="claude"]'
      );
      const codexPanel = stage.querySelector<HTMLElement>(
        '[data-search-panel="codex"]'
      );
      const claudePanel = stage.querySelector<HTMLElement>(
        '[data-search-panel="claude"]'
      );
      if (
        !placeholder ||
        !codexQuery ||
        !claudeQuery ||
        !codexPanel ||
        !claudePanel
      ) {
        return;
      }

      const queries = [codexQuery, claudeQuery];
      const panels = [codexPanel, claudePanel];
      const results = panels.flatMap((panel) =>
        Array.from(panel.querySelectorAll<HTMLElement>("[data-search-result]"))
      );
      const articles = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-article]")
      );
      const addresses = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-site-address]")
      );
      const highlights = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-highlight-ink]")
      );
      const startTab = stage.querySelector<HTMLElement>("[data-start-tab]");
      const tabs = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-browser-tab]")
      );
      if (
        !startTab ||
        tabs.length !== searches.length + 1 ||
        articles.length !== tabs.length ||
        addresses.length !== tabs.length ||
        highlights.length !== tabs.length * 2
      )
        return;
      gsap.set(queries, { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(panels, { autoAlpha: 0, y: -8 });
      gsap.set(results, { autoAlpha: 0, y: 6 });
      gsap.set([...articles, ...addresses], { autoAlpha: 0 });
      gsap.set(highlights, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(tabs, { autoAlpha: 0, y: 6 });

      const timeline = gsap.timeline({ repeat: -1, paused: true });
      timeline.to(placeholder, { autoAlpha: 0, duration: 0.15 }, 0.3);
      searches.forEach((search, index) => {
        const start = index * 5.8;
        const query = queries[index];
        const panel = panels[index];
        const article = articles[index];
        const address = addresses[index];
        const resultPair = results.slice(index * 2, index * 2 + 2);
        const inkPair = highlights.slice(index * 2, index * 2 + 2);
        const tab = tabs[index];

        timeline.to(
          query,
          {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.75,
            ease: `steps(${search.query.length})`,
          },
          start + 0.5
        );
        timeline.to(panel, { autoAlpha: 1, y: 0, duration: 0.2 }, start + 1.35);
        timeline.to(
          resultPair[0],
          { autoAlpha: 1, y: 0, duration: 0.18 },
          start + 1.6
        );
        timeline.to(
          resultPair[1],
          { autoAlpha: 1, y: 0, duration: 0.18 },
          start + 1.85
        );
        timeline.to(
          resultPair[0],
          { backgroundColor: "#eaf0f8", duration: 0.16 },
          start + 2.15
        );
        timeline.to(
          [panel, query],
          { autoAlpha: 0, duration: 0.18 },
          start + 2.4
        );
        timeline.to(tab, { autoAlpha: 1, y: 0, duration: 0.22 }, start + 2.45);
        timeline.to(
          startTab,
          { backgroundColor: "#e8eaed", duration: 0.2 },
          start + 2.45
        );
        timeline.to(
          tab,
          { backgroundColor: "#fff", duration: 0.2 },
          start + 2.45
        );
        timeline.to(article, { autoAlpha: 1, duration: 0.28 }, start + 2.55);
        timeline.to(address, { autoAlpha: 1, duration: 0.18 }, start + 2.6);
        timeline.to(
          inkPair[0],
          { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power1.inOut" },
          start + 3.05
        );
        timeline.to(
          inkPair[1],
          { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power1.inOut" },
          start + 3.85
        );
        timeline.to(
          [article, address],
          { autoAlpha: 0, duration: 0.25 },
          start + 5.15
        );
        timeline.to(
          tab,
          { backgroundColor: "#e8eaed", duration: 0.2 },
          start + 5.15
        );
        if (index === 0) {
          timeline.to(
            startTab,
            { backgroundColor: "#fff", duration: 0.2 },
            start + 5.15
          );
        }
      });
      timeline.to(
        tabs[2],
        { autoAlpha: 1, y: 0, backgroundColor: "#fff", duration: 0.25 },
        11.1
      );
      timeline.to(articles[2], { autoAlpha: 1, duration: 0.28 }, 11.2);
      timeline.to(addresses[2], { autoAlpha: 1, duration: 0.18 }, 11.25);
      timeline.to(
        highlights[4],
        { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power1.inOut" },
        11.7
      );
      timeline.to(
        highlights[5],
        { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power1.inOut" },
        12.55
      );
      timeline.to(
        [articles[2], addresses[2]],
        { autoAlpha: 0, duration: 0.25 },
        14.2
      );
      timeline.to(tabs[2], { backgroundColor: "#e8eaed", duration: 0.2 }, 14.2);
      timeline.to(startTab, { backgroundColor: "#fff", duration: 0.2 }, 14.2);
      timeline.to(placeholder, { autoAlpha: 1, duration: 0.2 }, 14.55);
      timeline.set(queries, { clipPath: "inset(0 100% 0 0)" }, 15);
      timeline.set(panels, { y: -8 }, 15);
      timeline.set(
        results,
        { autoAlpha: 0, y: 6, backgroundColor: "#fff" },
        15
      );
      timeline.set(highlights, { clipPath: "inset(0 100% 0 0)" }, 15);
      timeline.set(
        tabs,
        { autoAlpha: 0, y: 6, backgroundColor: "#e8eaed" },
        15
      );

      const observer = new IntersectionObserver(
        ([entry]) =>
          entry.isIntersecting ? timeline.play() : timeline.pause(),
        { threshold: 0.15 }
      );
      observer.observe(stage);

      return () => {
        observer.disconnect();
        timeline.kill();
        gsap.set(
          [
            placeholder,
            ...queries,
            ...panels,
            ...results,
            ...articles,
            ...addresses,
            ...highlights,
            ...tabs,
            startTab,
          ],
          {
            clearProps: "all",
          }
        );
      };
    });

    return () => media.revert();
  }, []);

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
            <span data-search-placeholder>Search or enter website name</span>
            {searches.map((search) => (
              <span
                className={styles.addressQuery}
                data-search-query={search.id}
                key={search.id}
              >
                {search.query}
              </span>
            ))}
            {searches.map((search) => (
              <span
                className={styles.addressQuery}
                data-site-address={search.id}
                key={`${search.id}-site`}
              >
                {search.id === "codex"
                  ? "docs.example.com / accessibility"
                  : "patterns.example.com / responsive-layout"}
              </span>
            ))}
            <span
              className={styles.addressQuery}
              data-site-address={crossCheck.id}
            >
              {crossCheck.address}
            </span>
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
        <div className={styles.tabBar}>
          <span
            className={`${styles.browserTab} ${styles.startTab}`}
            data-start-tab
          >
            <span className={styles.tabFavicon}>⌂</span>
            <span className={styles.tabTitle}>Start Page</span>
            <span className={styles.tabClose}>×</span>
          </span>
          {searches.map((search) => (
            <span
              className={`${styles.browserTab} ${search.id === "claude" ? styles.patternTab : ""}`}
              data-browser-tab={search.id}
              key={`${search.id}-tab`}
            >
              <span className={styles.tabFavicon}>
                {search.id === "codex" ? "D" : "P"}
              </span>
              <span className={styles.tabTitle}>
                {search.id === "codex" ? "Keyboard guide" : "Layout patterns"}
              </span>
              <span className={styles.tabClose}>×</span>
            </span>
          ))}
          <span
            className={`${styles.browserTab} ${styles.communityTab}`}
            data-browser-tab={crossCheck.id}
          >
            <span className={styles.tabFavicon}>Q</span>
            <span className={styles.tabTitle}>Mobile UX Q&A</span>
            <span className={styles.tabClose}>×</span>
          </span>
        </div>
        {searches.map((search) => (
          <div
            className={styles.searchPopover}
            data-search-panel={search.id}
            key={search.id}
          >
            <div className={styles.searchActor}>
              <span
                className={`${styles.actorMark} ${search.id === "claude" ? styles.actorMarkClaude : ""}`}
              >
                {search.mark}
              </span>
              <span>{search.name} is searching</span>
              <span className={styles.searchPulse} aria-hidden="true" />
            </div>
            <div className={styles.searchResults}>
              {search.results.map((result) => (
                <div
                  className={styles.searchResult}
                  data-search-result
                  key={result.title}
                >
                  <span className={styles.resultTitle}>{result.title}</span>
                  <span className={styles.resultDomain}>{result.domain}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
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
          {searches.map((search) => (
            <article
              className={`${styles.articlePage} ${search.id === "claude" ? styles.patternPage : ""}`}
              data-article={search.id}
              key={search.id}
            >
              <div className={styles.articleTopbar}>
                <span className={styles.articleLogo}>
                  {search.id === "codex" ? "D" : "P"}
                </span>
                <span>
                  {search.id === "codex" ? "Docs Library" : "Pattern Atlas"}
                </span>
                <span className={styles.articleNav}>
                  {search.id === "codex" ? (
                    <>Guides&nbsp;&nbsp; Examples&nbsp;&nbsp; Reference</>
                  ) : (
                    <>Explore&nbsp;&nbsp; Patterns&nbsp;&nbsp; About</>
                  )}
                </span>
              </div>
              {search.id === "codex" ? (
                <div className={styles.articleBody}>
                  <span className={styles.articleCategory}>
                    {search.article.category}
                  </span>
                  <h3>{search.article.title}</h3>
                  <p className={styles.articleLead}>{search.article.lead}</p>
                  <div className={styles.articleRule} />
                  <h4>{search.article.heading}</h4>
                  <div className={styles.articleParagraphs}>
                    {search.article.lines.map((line) => (
                      <p className={styles.articleLine} key={line}>
                        <span>{line}</span>
                        <span
                          className={styles.highlightInk}
                          data-highlight-ink
                          aria-hidden="true"
                        >
                          {line}
                        </span>
                      </p>
                    ))}
                  </div>
                  <span className={styles.readerBadge}>
                    <span className={styles.actorMark}>{search.mark}</span>
                    {search.name} reading source
                  </span>
                </div>
              ) : (
                <div className={styles.patternLayout}>
                  <aside className={styles.patternSidebar}>
                    <span className={styles.patternSidebarLabel}>EXPLORE</span>
                    <span className={styles.patternSidebarActive}>
                      Overview
                    </span>
                    <span>Layouts</span>
                    <span>Components</span>
                  </aside>
                  <div className={styles.patternMain}>
                    <span className={styles.articleCategory}>
                      {search.article.category}
                    </span>
                    <h3>{search.article.title}</h3>
                    <p className={styles.articleLead}>{search.article.lead}</p>
                    <div className={styles.patternCards}>
                      {search.article.lines.map((line, index) => (
                        <div className={styles.patternCard} key={line}>
                          <div
                            className={styles.patternPreview}
                            aria-hidden="true"
                          >
                            <i />
                            <i />
                            <i />
                          </div>
                          <span className={styles.patternCardTitle}>
                            {index === 0
                              ? "Fluid columns"
                              : "Touch-first navigation"}
                          </span>
                          <p className={styles.articleLine}>
                            <span>{line}</span>
                            <span
                              className={styles.highlightInk}
                              data-highlight-ink
                              aria-hidden="true"
                            >
                              {line}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <span className={styles.readerBadge}>
                      <span
                        className={`${styles.actorMark} ${styles.actorMarkClaude}`}
                      >
                        {search.mark}
                      </span>
                      {search.name} reading source
                    </span>
                    <span className={styles.patternNext}>
                      Community discussion →
                    </span>
                  </div>
                </div>
              )}
            </article>
          ))}
          <article
            className={`${styles.articlePage} ${styles.communityPage}`}
            data-article={crossCheck.id}
          >
            <div className={styles.communityTopbar}>
              <span className={styles.communityLogo}>Q</span>
              <strong>Interface Exchange</strong>
              <span className={styles.communitySearch}>Search questions</span>
            </div>
            <div className={styles.communityLayout}>
              <div className={styles.communityMain}>
                <span className={styles.communityTag}>MOBILE UX</span>
                <h3>{crossCheck.title}</h3>
                <span className={styles.communityMeta}>
                  Asked by a designer · 4 answers · Updated today
                </span>
                <div className={styles.answerCard}>
                  <div className={styles.answerAuthor}>
                    <span className={styles.answerAvatar}>A</span>
                    <span>
                      <strong>Alex Morgan</strong>
                      <small>UX contributor</small>
                    </span>
                    <span className={styles.acceptedAnswer}>
                      ✓ Accepted answer
                    </span>
                  </div>
                  <div className={styles.answerLines}>
                    {crossCheck.lines.map((line) => (
                      <p className={styles.articleLine} key={line}>
                        <span>{line}</span>
                        <span
                          className={styles.highlightInk}
                          data-highlight-ink
                          aria-hidden="true"
                        >
                          {line}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
                <span className={styles.readerBadge}>
                  <span
                    className={`${styles.actorMark} ${styles.actorMarkClaude}`}
                  >
                    ✻
                  </span>
                  Claude cross-checking source
                </span>
              </div>
              <aside className={styles.communityAside}>
                <strong>Related topics</strong>
                <span>Accessible navigation</span>
                <span>Responsive menus</span>
                <span>Touch target sizing</span>
              </aside>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
