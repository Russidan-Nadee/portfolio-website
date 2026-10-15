"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ResearchBrowser from "./ResearchBrowser";
import TerminalPair from "./TerminalPair";
import styles from "./AiStoryPanel.module.css";

gsap.registerPlugin(ScrollTrigger);

type Locale = "th" | "en" | "ja";

interface Product {
  name: string;
  type: string;
  description: string;
  href: string;
}

interface StoryScene {
  tag: string;
  title: string;
  description: string;
  products: Product[];
}

interface StoryCopy {
  sectionTitle: string;
  scenes: [StoryScene, StoryScene, StoryScene];
}

const copyByLocale: Record<Locale, StoryCopy> = {
  th: {
    sectionTitle: "การใช้ AI",
    scenes: [
      {
        tag: "01 / CODE",
        title: "AI เขียนโค้ด",
        description:
          "ใช้ Codex และ Claude Code ช่วยเขียนโค้ด ทำงานได้เร็วขึ้นมาก",
        products: [],
      },
      {
        tag: "02 / RESEARCH",
        title: "ให้ AI ช่วยค้น แล้วผมคิดต่อ",
        description: "ให้ AI รวบรวมข้อมูล ก่อนเลือกแนวทางที่เหมาะ",
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "AI ที่ใช้งานได้จริง",
        description: "Fastship AI ที่ผมพัฒนาให้ใช้งานได้จริง",
        products: [
          {
            name: "FormAI",
            type: "โปรเจกต์ส่วนตัว",
            description: "ช่วยกรอกฟอร์มจัดส่งจากภาษาธรรมชาติ",
            href: "https://github.com/Russidan-Nadee/formai",
          },
          {
            name: "Fastship.ai",
            type: "ผลิตภัณฑ์ของ FastShip",
            description: "AI ช่วยแนะนำ HS Code จากรายละเอียดสินค้า",
            href: "https://fastship.ai/",
          },
        ],
      },
    ],
  },
  en: {
    sectionTitle: "Using AI",
    scenes: [
      {
        tag: "01 / CODE",
        title: "Agentic coding",
        description: "Codex and Claude Code make coding much faster.",
        products: [],
      },
      {
        tag: "02 / RESEARCH",
        title: "AI searches. I connect the dots.",
        description: "Let AI gather facts. Choose the right path.",
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "AI people can use",
        description: "Fastship AI, developed by me for real-world use.",
        products: [
          {
            name: "FormAI",
            type: "Personal project",
            description: "Fill a shipping form using natural language.",
            href: "https://github.com/Russidan-Nadee/formai",
          },
          {
            name: "Fastship.ai",
            type: "FastShip product",
            description: "AI suggests HS Codes from product descriptions.",
            href: "https://fastship.ai/",
          },
        ],
      },
    ],
  },
  ja: {
    sectionTitle: "AI の活用",
    scenes: [
      {
        tag: "01 / CODE",
        title: "AI エージェントと開発",
        description:
          "Codex と Claude Code を使ってコードを書き、開発を大幅に速くしています。",
        products: [],
      },
      {
        tag: "02 / RESEARCH",
        title: "AI と調べ、自分で考える",
        description: "AI が探し、私は資料を確かめて選びます。",
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "使える AI を形に",
        description: "Fastship AI を開発し、実際に使える形にしました。",
        products: [
          {
            name: "FormAI",
            type: "個人プロジェクト",
            description: "自然な文章から配送フォームを入力します。",
            href: "https://github.com/Russidan-Nadee/formai",
          },
          {
            name: "Fastship.ai",
            type: "FastShip の製品",
            description: "商品説明から HS コードの候補を提案します。",
            href: "https://fastship.ai/",
          },
        ],
      },
    ],
  },
};

const railLabels: Record<Locale, [string, string, string]> = {
  th: ["AI เขียนโค้ด", "AI ช่วยคิด", "AI โปรดัก"],
  en: ["AI for Coding", "AI for Thinking", "AI in Practice"],
  ja: ["AI エージェントと開発", "AI と考える", "実用的な AI"],
};

const introCopy: Record<Locale, { lead: string; question: string }> = {
  th: {
    lead: "เมื่อ AI เป็นส่วนหนึ่งของงาน",
    question: "ผมใช้มันสร้างผลงานอย่างไร",
  },
  en: {
    lead: "When AI becomes part of my work,",
    question: "how do I use it to create?",
  },
  ja: {
    lead: "AI が仕事の一部となった今",
    question: "どう考え、調べ、つくるのか",
  },
};

const aiIcons = [
  "/images/ai/ai-chip-solid.svg",
  "/images/ai/ai-spark-frame.svg",
  "/images/ai/ai-code.svg",
  "/images/ai/ai-chip-outline.svg",
  "/images/ai/ai-spark-letters.svg",
  "/images/ai/ai-chip-square.svg",
];

const fastshipUrl = "https://fastship.ai/";
const fastshipLinkLabel: Record<Locale, string> = {
  th: "เปิด FastShip AI ในแท็บใหม่",
  en: "Open FastShip AI in a new tab",
  ja: "FastShip AI を新しいタブで開く",
};

function FastshipPreview() {
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const fitWebsite = () => {
      screen.style.setProperty(
        "--site-scale",
        String(screen.clientWidth / 900)
      );
    };
    fitWebsite();

    const observer = new ResizeObserver(fitWebsite);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={screenRef} className={styles.macbookScreen} aria-hidden="true">
      <iframe
        className={styles.macbookSite}
        src={fastshipUrl}
        title="FastShip AI website preview"
        loading="lazy"
        tabIndex={-1}
      />
    </div>
  );
}

function StoryBody({
  scene,
  index,
  locale,
}: {
  scene: StoryScene;
  index: number;
  locale: Locale;
}) {
  if (index < 2) {
    return (
      <div
        className={`${styles.storyBody} ${styles.windowStoryBody} ${index === 0 ? styles.terminalStoryBody : ""}`}
      >
        {index === 1 && (
          <>
            <h3
              className={`${styles.visuallyHidden} ${styles.windowSceneTitle}`}
            >
              {railLabels[locale][1]}
            </h3>
          </>
        )}
        {index === 0 ? (
          <>
            <h3 className={styles.visuallyHidden}>{scene.title}</h3>
            <TerminalPair locale={locale} />
            <p className={styles.sceneCaption}>{scene.description}</p>
          </>
        ) : (
          <>
            <ResearchBrowser key={locale} locale={locale} />
            <p className={styles.sceneCaption}>{scene.description}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.storyBody} ${styles.windowStoryBody}`}>
      <h3 className={`${styles.visuallyHidden} ${styles.windowSceneTitle}`}>
        {railLabels[locale][2]}
      </h3>
      <div className={styles.macbook}>
        <FastshipPreview />
        <Image
          className={styles.macbookFrame}
          src="/images/ai/macbook-pro-16-silver.webp"
          alt=""
          width={1800}
          height={862}
          sizes="(min-width: 1200px) 65vw, 100vw"
        />
        <a
          className={styles.macbookLink}
          href={fastshipUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fastshipLinkLabel[locale]}
        />
      </div>
      <p className={styles.sceneCaption}>{scene.description}</p>
    </div>
  );
}

export default function AiStoryPanel({ locale = "en" }: { locale?: Locale }) {
  const introRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [introVisible, setIntroVisible] = useState(false);
  const copy = copyByLocale[locale];
  const [leadBeforeAi, leadAfterAi] = introCopy[locale].lead.split("AI");

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  const goToScene = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const progress = [0.32, 0.5, 0.74][index];
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * progress,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const rail = railRef.current;
    const viewport = frame?.parentElement;
    if (!section || !frame || !rail || !viewport) return;

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
      () => {
        const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
        const mix = (from: number, to: number, progress: number) =>
          from + (to - from) * progress;
        const updateStory = (progress: number) => {
          const entrance = clamp01((progress - 0.04) / 0.25);
          const railEntrance = clamp01((progress - 0.15) / 0.1);
          const enterHorizontal = Math.min(
            72,
            Math.max(48, window.innerWidth * 0.04)
          );
          const enterVertical = Math.min(
            72,
            Math.max(56, window.innerHeight * 0.07)
          );
          const settledRight = Math.min(
            32,
            Math.max(22, window.innerWidth * 0.024)
          );
          const settledVertical = window.innerHeight < 720 ? 20 : 28;
          const settledLeft = Math.round(window.innerWidth * 0.32);
          const settledWidth =
            viewport.clientWidth - settledLeft - settledRight;
          const settledHeight = viewport.clientHeight - settledVertical * 2;
          const enterWidth = viewport.clientWidth - enterHorizontal * 2;
          const enterHeight = (enterWidth * settledHeight) / settledWidth;
          const enterBottom =
            viewport.clientHeight - enterVertical - enterHeight;
          const expandedShift = 1 - entrance;
          const terminalLift = Math.min(
            230,
            Math.max(0, enterHeight - viewport.clientHeight) * 0.68
          );
          frame.style.setProperty(
            "--terminal-entrance-y",
            `${(-terminalLift * expandedShift).toFixed(2)}px`
          );
          frame.style.setProperty(
            "--terminal-entrance-x",
            `${(Math.min(70, viewport.clientWidth * 0.04) * expandedShift).toFixed(2)}px`
          );
          const setInset = (name: string, start: number, end: number) => {
            frame.style.setProperty(
              name,
              `${mix(start, end, entrance).toFixed(2)}px`
            );
          };

          setInset("--frame-left", enterHorizontal, settledLeft);
          setInset("--frame-right", enterHorizontal, settledRight);
          setInset("--frame-top", enterVertical, settledVertical);
          setInset("--frame-bottom", enterBottom, settledVertical);

          rail.style.opacity = railEntrance.toFixed(3);
          rail.style.visibility = railEntrance === 0 ? "hidden" : "visible";
          rail.style.transform = `translateX(${mix(-24, 0, railEntrance).toFixed(2)}px)`;

          const next = progress < 0.36 ? 0 : progress < 0.64 ? 1 : 2;
          setActiveScene((current) => (current === next ? current : next));
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top+=64",
          end: "bottom bottom",
          onUpdate: (self) => updateStory(self.progress),
          onRefresh: (self) => updateStory(self.progress),
          onLeaveBack: () => updateStory(0),
        });

        triggerRef.current = trigger;
        updateStory(trigger.progress);

        return () => {
          trigger.kill();
          triggerRef.current = null;
          for (const property of [
            "--frame-left",
            "--frame-right",
            "--frame-top",
            "--frame-bottom",
            "--terminal-entrance-x",
            "--terminal-entrance-y",
          ]) {
            frame.style.removeProperty(property);
          }
          rail.style.removeProperty("opacity");
          rail.style.removeProperty("visibility");
          rail.style.removeProperty("transform");
        };
      }
    );

    return () => media.revert();
  }, []);

  return (
    <>
      <section
        ref={introRef}
        className={`${styles.intro} ${introVisible ? styles.introVisible : ""}`}
        lang={locale}
        aria-labelledby="ai-intro-title"
      >
        <h2 id="ai-intro-title" className={styles.introTitle}>
          <span>
            {leadBeforeAi}
            <span className={styles.aiMark}>
              <span className={styles.visuallyHidden}>AI</span>
              {aiIcons.map((src, index) => (
                <span
                  key={src}
                  className={styles.aiIcon}
                  aria-hidden="true"
                  style={{ animationDelay: `${index * 2}s` }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={64}
                    height={64}
                    className={styles.aiIconImage}
                  />
                </span>
              ))}
            </span>
            {leadAfterAi}
          </span>
          <strong className={styles.introQuestion}>
            {introCopy[locale].question}
          </strong>
        </h2>
      </section>
      <section
        id="ai-story"
        ref={sectionRef}
        className={styles.root}
        lang={locale}
        aria-labelledby="ai-story-title"
      >
        <h2 id="ai-story-title" className={styles.visuallyHidden}>
          {copy.sectionTitle}
        </h2>

        <div className={styles.stickyViewport}>
          <nav
            ref={railRef}
            className={styles.topicRail}
            aria-label={copy.sectionTitle}
          >
            {railLabels[locale].map((label, index) => (
              <button
                key={label}
                type="button"
                className={`${styles.topicButton} ${index === activeScene ? styles.topicActive : ""}`}
                onClick={() => goToScene(index)}
                aria-current={index === activeScene ? "step" : undefined}
                aria-controls="ai-story-panel"
              >
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div
            ref={frameRef}
            className={`${styles.frame} ${styles.windowFrame}`}
          >
            <div
              id="ai-story-panel"
              key={`${locale}-${activeScene}`}
              className={styles.sceneEnter}
            >
              <StoryBody
                scene={copy.scenes[activeScene]}
                index={activeScene}
                locale={locale}
              />
            </div>

            <div className={styles.progress} aria-hidden="true">
              {copy.scenes.map((scene, index) => (
                <span
                  key={scene.tag}
                  className={index === activeScene ? styles.progressActive : ""}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.staticList}>
          {copy.scenes.map((scene, index) => (
            <article
              className={`${styles.staticCard} ${styles.windowStaticCard}`}
              key={scene.tag}
            >
              <StoryBody scene={scene} index={index} locale={locale} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
