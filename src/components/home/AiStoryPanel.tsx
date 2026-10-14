"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
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
  steps: string[];
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
        tag: "01 / LEARN",
        title: "ผมใช้ AI ยังไง",
        description:
          "ใช้ AI ช่วยจับประเด็นจากสิ่งที่เจอระหว่างทำงาน แล้วจัดเป็นบันทึกที่กลับมาใช้ได้",
        steps: ["คำถามที่เจอ", "แยกประเด็น", "บันทึกไว้ใช้ซ้ำ"],
        products: [],
      },
      {
        tag: "02 / BUILD",
        title: "คิดเร็วขึ้น ลงมือให้รอบคอบ",
        description:
          "ใช้ AI ช่วยแตกโจทย์และร่างทางเลือก ก่อนตรวจโค้ด ทดสอบ และตัดสินใจด้วยตัวเอง",
        steps: ["สำรวจแนวทาง", "ลงมือสร้าง", "ตรวจและทดสอบ"],
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "AI ที่ใช้งานได้จริง",
        description:
          "สองตัวอย่างที่แสดงว่า AI ช่วยลดขั้นตอนของผู้ใช้ได้อย่างไร",
        steps: [],
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
        tag: "01 / LEARN",
        title: "How I use AI",
        description:
          "I use AI to capture what I learn while building and turn it into notes I can return to.",
        steps: ["A question", "The key idea", "A reusable note"],
        products: [],
      },
      {
        tag: "02 / BUILD",
        title: "Explore faster. Build carefully.",
        description:
          "AI helps me explore approaches and draft ideas. I review the code, test the result, and make the final call.",
        steps: ["Explore", "Build", "Review and test"],
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "AI people can use",
        description:
          "Two examples of how AI can make a task simpler for the person doing it.",
        steps: [],
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
        tag: "01 / LEARN",
        title: "私の AI 活用法",
        description:
          "開発中に得た気づきを AI で整理し、後から活用できるメモに残します。",
        steps: ["疑問", "要点を整理", "再利用できるメモ"],
        products: [],
      },
      {
        tag: "02 / BUILD",
        title: "速く考え、丁寧に作る",
        description:
          "AI で方法を探り、案を形にします。コードの確認とテスト、最終判断は自分で行います。",
        steps: ["方法を探る", "作る", "確認・テスト"],
        products: [],
      },
      {
        tag: "03 / APPLY",
        title: "使える AI を形に",
        description: "AI が利用者の作業をシンプルにする二つの例です。",
        steps: [],
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
  th: ["ผมใช้ AI ยังไง", "พัฒนาให้ไวขึ้น", "AI ที่ใช้งานจริง"],
  en: ["How I use AI", "Build with AI", "AI in practice"],
  ja: ["AI の使い方", "開発での活用", "実用的な AI"],
};

function StoryBody({ scene, index }: { scene: StoryScene; index: number }) {
  return (
    <div className={styles.storyBody}>
      <div className={styles.storyCopy}>
        <span className={styles.sceneTag}>
          <span className={styles.pulse} aria-hidden="true" />
          {scene.tag}
        </span>
        <h3 className={styles.title}>{scene.title}</h3>
        <p className={styles.description}>{scene.description}</p>
        <span className={styles.sceneNumber} aria-hidden="true">
          0{index + 1}
          <span> / 03</span>
        </span>
      </div>

      <div
        className={`${styles.visual} ${scene.products.length > 0 ? styles.productVisual : ""}`}
      >
        <div className={styles.visualGrid} aria-hidden="true" />
        {scene.products.length > 0 ? (
          <div className={styles.products}>
            {scene.products.map((product, productIndex) => (
              <a
                key={product.name}
                className={styles.productCard}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.productIndex}>0{productIndex + 1}</span>
                <span className={styles.productText}>
                  <span className={styles.productType}>{product.type}</span>
                  <strong>{product.name}</strong>
                  <span className={styles.productDescription}>
                    {product.description}
                  </span>
                </span>
                <svg
                  className={styles.productArrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 19 19 5M8 5h11v11"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.process} aria-label={scene.steps.join(" → ")}>
            <div className={styles.orbit} aria-hidden="true">
              <span className={styles.orbitCore}>AI</span>
            </div>
            <div className={styles.processSteps}>
              {scene.steps.map((step, stepIndex) => (
                <div className={styles.processStep} key={step}>
                  <span>0{stepIndex + 1}</span>
                  <strong>{step}</strong>
                  <i aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiStoryPanel({ locale = "en" }: { locale?: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const copy = copyByLocale[locale];

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
      "(min-width: 1200px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
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

        <div ref={frameRef} className={styles.frame}>
          <div
            id="ai-story-panel"
            key={`${locale}-${activeScene}`}
            className={styles.sceneEnter}
          >
            <StoryBody scene={copy.scenes[activeScene]} index={activeScene} />
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
          <article className={styles.staticCard} key={scene.tag}>
            <StoryBody scene={scene} index={index} />
          </article>
        ))}
      </div>
    </section>
  );
}
