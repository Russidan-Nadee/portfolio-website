"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SiClaude } from "react-icons/si";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  Plus,
  Search,
} from "lucide-react";
import styles from "./ResearchBrowser.module.css";

type Locale = "th" | "en" | "ja";
interface SearchCopy {
  description: string;
  eyebrow: string;
  title: string;
  query: string;
  statuses: [string, string, string];
  sources: string;
  sourceTitles: [string, string, string];
  answer: string;
  summary: string;
  points: [string, string];
  takeaway: string;
  conclusion: string;
  followUp: string;
  suggestion: string;
}
const copyByLocale: Record<Locale, SearchCopy> = {
  th: {
    description:
      "ภาพสาธิต Claude Search พร้อมไอคอน Claude เคลื่อนบนจอเพื่อค้นข้อมูล อ่านแหล่งอ้างอิง และสรุปแนวทางออกแบบเว็บไซต์",
    eyebrow: "ค้นให้ลึกขึ้น คิดให้ไกลกว่าเดิม",
    title: "ทุกไอเดีย เริ่มจากคำถาม",
    query: "ออกแบบเว็บให้ใช้ได้ดี ทั้งมือถือและคีย์บอร์ดได้อย่างไร?",
    statuses: [
      "กำลังค้นหาแหล่งข้อมูลที่เกี่ยวข้อง",
      "กำลังอ่านและเชื่อมโยงข้อมูลจาก 3 แหล่ง",
      "ค้นคว้าเสร็จแล้ว · อ้างอิงจาก 3 แหล่ง",
    ],
    sources: "แหล่งข้อมูล",
    sourceTitles: [
      "การใช้งานด้วยคีย์บอร์ด",
      "แนวทางการเข้าถึงเว็บไซต์",
      "พื้นฐาน Responsive Design",
    ],
    answer: "สรุปจากการค้นคว้า",
    summary:
      "เริ่มจากโครงสร้างที่ชัดเจน แล้วออกแบบให้ทุกคนเข้าถึงเนื้อหาและใช้งานได้สะดวก ไม่ว่าจะใช้อุปกรณ์แบบไหน",
    points: [
      "ใช้คีย์บอร์ดเข้าถึงทุกส่วน และแสดงตำแหน่งโฟกัสให้ชัดเจน",
      "ปรับเลย์เอาต์ตามหน้าจอ พร้อมเว้นพื้นที่ให้ปุ่มกดใช้งานง่าย",
    ],
    takeaway: "นำไปคิดต่อ",
    conclusion: "เริ่มจากมือถือ แล้วทดสอบทั้งการแตะและคีย์บอร์ด",
    followUp: "ถามต่อเพื่อสำรวจให้ลึกขึ้น…",
    suggestion: "มีจุดไหนที่ควรทดสอบก่อนบ้าง?",
  },
  en: {
    description:
      "Illustration of Claude Search with a Claude cursor moving between a search query, three sources, and an answer about responsive, keyboard-accessible websites",
    eyebrow: "SEARCH DEEPER. THINK FURTHER.",
    title: "A good idea starts with a question.",
    query: "How do I design a website for mobile and keyboard users?",
    statuses: [
      "Searching for relevant sources",
      "Reading and connecting 3 sources",
      "Research complete · Based on 3 sources",
    ],
    sources: "Sources",
    sourceTitles: [
      "Keyboard navigation",
      "Web accessibility guidelines",
      "Responsive design basics",
    ],
    answer: "What I found",
    summary:
      "Start with a clear structure. Make content and actions easy to reach, whatever device or input someone uses.",
    points: [
      "Keep every control keyboard-accessible with a visible focus state.",
      "Use flexible layouts and give touch targets enough room.",
    ],
    takeaway: "CONNECTING THE DOTS",
    conclusion: "Start mobile-first. Validate with touch and keyboard.",
    followUp: "Ask a follow-up to go deeper…",
    suggestion: "What should I test first?",
  },
  ja: {
    description:
      "Claude のアイコンが検索欄、3つの情報源、回答の間を移動し、サイトの設計を調べて要約する Claude Search のイメージ",
    eyebrow: "深く調べて、考えを広げる",
    title: "アイデアは、問いから始まる。",
    query: "モバイルでもキーボードでも使いやすいサイトにするには？",
    statuses: [
      "関連する情報源を検索中",
      "3つの情報源を読み、整理中",
      "リサーチ完了 · 3つの情報源を参照",
    ],
    sources: "情報源",
    sourceTitles: [
      "キーボードナビゲーション",
      "ウェブアクセシビリティ",
      "レスポンシブ設計の基本",
    ],
    answer: "調べてわかったこと",
    summary:
      "明確な構造から始め、どのデバイスや入力方法でも、情報や操作にアクセスしやすく設計します。",
    points: [
      "すべての操作にキーボードでアクセスでき、フォーカスを明示する。",
      "柔軟なレイアウトを使い、タッチ操作に十分な余白を確保する。",
    ],
    takeaway: "考えをつなげる",
    conclusion: "モバイルから設計し、タッチとキーボードで確かめる。",
    followUp: "さらに詳しく質問する…",
    suggestion: "最初に何をテストする？",
  },
};
const sourceDomains = ["developer.mozilla.org", "w3.org", "web.dev"];
// Keep the entrance from replaying when the sticky story changes scenes.
const playedLocales = new Set<Locale>();

export default function ResearchBrowser({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const media = gsap.matchMedia();
    media.add("all", () => {
      const canvas = stage.firstElementChild as HTMLDivElement;
      const parent = stage.parentElement;
      const frame = parent?.closest<HTMLElement>("[data-ai-story-frame]");
      const caption = parent?.querySelector<HTMLElement>(
        "[data-ai-story-caption]"
      );
      if (!parent) return;
      const stickyLayout = window.matchMedia(
        "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)"
      );
      // Scale the same desktop canvas on every screen so its proportions
      // and two-column layout stay consistent.
      const fit = () => {
        const height = canvas.offsetHeight;
        if (!height || !parent.clientWidth) return;
        let availableHeight = Infinity;
        if (stickyLayout.matches && frame && caption) {
          const frameStyle = getComputedStyle(frame);
          availableHeight = Math.max(
            0,
            frame.clientHeight -
              parseFloat(frameStyle.paddingTop) -
              parseFloat(frameStyle.paddingBottom) -
              caption.offsetHeight -
              parseFloat(getComputedStyle(parent).rowGap)
          );
        }
        const scale = Math.min(
          1,
          parent.clientWidth / 920,
          availableHeight / height
        );
        stage.style.setProperty("--research-scale", String(scale));
        stage.style.setProperty("--research-width", `${920 * scale}px`);
      };
      const observer = new ResizeObserver(fit);
      observer.observe(parent);
      if (frame) observer.observe(frame);
      if (caption) observer.observe(caption);
      observer.observe(canvas);
      window.addEventListener("resize", fit);
      stickyLayout.addEventListener("change", fit);
      fit();
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", fit);
        stickyLayout.removeEventListener("change", fit);
        for (const property of ["--research-scale", "--research-width"]) {
          stage.style.removeProperty(property);
        }
      };
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const query = stage.querySelector<HTMLElement>("[data-query]");
      const statuses = gsap.utils.toArray<HTMLElement>("[data-status]", stage);
      const sources = gsap.utils.toArray<HTMLElement>("[data-source]", stage);
      const answer = gsap.utils.toArray<HTMLElement>("[data-answer]", stage);
      const followUp = stage.querySelector<HTMLElement>("[data-follow-up]");
      const agent = stage.querySelector<HTMLElement>("[data-claude-cursor]");
      const queryBar = query?.parentElement;
      const submit = queryBar?.lastElementChild as HTMLElement | null;
      if (!queryBar || !submit || !agent || !followUp) return;
      // Every target shares the positioned page as its offset parent, so
      // cursor coordinates remain in the desktop canvas's unscaled pixels.
      const pointTo = (target: HTMLElement) => ({
        x: () => target.offsetLeft + Math.min(80, target.offsetWidth * 0.2),
        y: () => target.offsetTop + target.offsetHeight * 0.55,
      });
      const browserWindow = stage.querySelector("[data-window]");
      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
        repeatRefresh: true,
        paused: true,
      });
      timeline
        .set(query, { clipPath: "inset(0 100% 0 0)" })
        .set([...statuses, ...sources, ...answer, followUp], { autoAlpha: 0 })
        .set([...sources, ...answer], { y: 7 })
        .set(agent, { autoAlpha: 0, x: 125, y: 35, scale: 1 })
        .to(agent, { autoAlpha: 1, duration: 0.2 }, 0.1)
        .to(
          agent,
          { ...pointTo(queryBar), duration: 0.65, ease: "power2.inOut" },
          0.1
        )
        .to(
          query,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.3,
            ease: `steps(${copy.query.length})`,
          },
          0.3
        )
        .to(statuses[0], { autoAlpha: 1, duration: 0.2 }, 1.6)
        .to(
          agent,
          { ...pointTo(submit), duration: 0.45, ease: "power2.inOut" },
          1.3
        )
        .to(agent, { scale: 0.82, duration: 0.12, repeat: 1, yoyo: true }, 1.75)
        .to(sources, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.3 }, 2)
        .to(statuses[0], { autoAlpha: 0, duration: 0.15 }, 3.3)
        .to(statuses[1], { autoAlpha: 1, duration: 0.2 }, 3.5)
        .to(statuses[1], { autoAlpha: 0, duration: 0.15 }, 4.5)
        .to(statuses[2], { autoAlpha: 1, duration: 0.2 }, 4.7)
        .to(answer, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.25 }, 4.8)
        .to(followUp, { autoAlpha: 1, duration: 0.4 }, 6.5)
        .to(
          agent,
          { ...pointTo(answer[1]), duration: 0.7, ease: "power2.inOut" },
          4.6
        )
        .to(
          agent,
          { ...pointTo(answer[3]), duration: 0.65, ease: "power2.inOut" },
          5.4
        )
        .to(
          agent,
          { ...pointTo(answer[4]), duration: 0.6, ease: "power2.inOut" },
          6.1
        )
        .to(
          agent,
          { ...pointTo(followUp), duration: 0.65, ease: "power2.inOut" },
          6.9
        )
        .to(agent, { autoAlpha: 0, duration: 0.35 }, 8.1)
        .to({}, { duration: 3 }, 8.45);
      sources.forEach((source, index) => {
        const start = 2.05 + index * 0.7;
        timeline
          .to(
            agent,
            { ...pointTo(source), duration: 0.5, ease: "power2.inOut" },
            start
          )
          .to(
            agent,
            { scale: 0.88, duration: 0.1, repeat: 1, yoyo: true },
            start + 0.5
          )
          .to(
            source,
            {
              borderColor: "#d7ad95",
              backgroundColor: "#fff7f1",
              duration: 0.2,
            },
            start + 0.5
          )
          .to(
            source,
            {
              borderColor: "#e7e9ed",
              backgroundColor: "#fcfcfd",
              duration: 0.35,
            },
            start + 1.05
          );
      });
      const entrance = playedLocales.has(locale)
        ? null
        : gsap.from(browserWindow, {
            autoAlpha: 0,
            y: 12,
            scale: 0.985,
            duration: 0.5,
            ease: "power2.out",
            paused: true,
          });
      if (typeof IntersectionObserver === "undefined") {
        playedLocales.add(locale);
        entrance?.play();
        timeline.play();
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            playedLocales.add(locale);
            entrance?.play();
            timeline.play();
          } else {
            entrance?.pause();
            timeline.pause();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(stage);
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, [locale, copy.query]);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="img"
      aria-label={copy.description}
      lang={locale}
    >
      <div className={styles.canvas} aria-hidden="true">
        <div className={styles.window} data-window>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.trafficLights}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.navigation}>
                <ChevronLeft />
                <ChevronRight />
              </span>
            </div>
            <div className={styles.address}>
              <SiClaude />
              <span>Claude · Search</span>
            </div>
            <div className={styles.toolbarRight}>
              <Plus />
            </div>
          </div>
          <div className={styles.page}>
            <div className={styles.agentCursor} data-claude-cursor>
              <MousePointer2 className={styles.cursorPointer} />
              <span className={styles.agentBadge}>
                <SiClaude />
                <span>Claude</span>
              </span>
            </div>
            <div className={styles.brand}>
              <SiClaude />
              <span>Claude</span>
              <span className={styles.brandMode}>Search</span>
              <span className={styles.brandRule} />
            </div>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h4>{copy.title}</h4>
            </div>
            <div className={styles.queryBar}>
              <Search />
              <span className={styles.queryText} data-query>
                {copy.query}
              </span>
              <span className={styles.submit}>
                <ArrowUp />
              </span>
            </div>
            <div className={styles.status}>
              {copy.statuses.map((status, index) => (
                <span
                  className={`${styles.statusStep} ${index === 2 ? styles.complete : ""}`}
                  data-status
                  key={status}
                >
                  {index === 2 ? (
                    <Check />
                  ) : (
                    <span className={styles.searchPulse} />
                  )}
                  {status}
                </span>
              ))}
            </div>
            <div className={styles.results}>
              <div className={styles.answer}>
                <div className={styles.answerHeading} data-answer>
                  <SiClaude />
                  <h5>{copy.answer}</h5>
                </div>
                <p className={styles.summary} data-answer>
                  {copy.summary}
                  <span className={styles.citation}>1</span>
                  <span className={styles.citation}>2</span>
                </p>
                <ul className={styles.points}>
                  {copy.points.map((point, index) => (
                    <li key={point} data-answer>
                      <Check />
                      <span>
                        {point}
                        <span className={styles.citation}>
                          {index === 0 ? "1" : "3"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className={styles.takeaway} data-answer>
                  <span>{copy.takeaway}</span>
                  <p>{copy.conclusion}</p>
                </div>
              </div>
              <div className={styles.sources}>
                <div className={styles.sourcesHeading}>
                  <BookOpen />
                  <span>{copy.sources}</span>
                  <span className={styles.sourceCount}>03</span>
                </div>
                {copy.sourceTitles.map((title, index) => (
                  <div className={styles.sourceCard} data-source key={title}>
                    <div className={styles.sourceMeta}>
                      <span className={styles.sourceNumber}>{index + 1}</span>
                      <span>{sourceDomains[index]}</span>
                      <ArrowUpRight />
                    </div>
                    <p>{title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.followUp} data-follow-up>
              <span>{copy.followUp}</span>
              <span className={styles.suggestion}>
                {copy.suggestion}
                <ArrowUpRight />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
