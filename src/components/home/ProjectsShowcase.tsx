"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { localizedPath } from "@/lib/locale-path";
import type { ProjectData } from "@/app/admin/projects/types";
import AiStoryPanel from "./AiStoryPanel";
import styles from "./ProjectsShowcase.module.css";

interface ProjectsShowcaseProps {
  // The three locale files do not currently share one translation type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations?: any;
  projects: ProjectData[];
  locale?: "th" | "en" | "ja";
}

const labels = {
  en: {
    previous: "Previous project",
    next: "Next project",
    show: "Show project",
    view: "View project",
    jump: "Go to project",
  },
  th: {
    previous: "โปรเจคก่อนหน้า",
    next: "โปรเจคถัดไป",
    show: "แสดงโปรเจค",
    view: "ดูโปรเจค",
    jump: "ไปที่โปรเจค",
  },
  ja: {
    previous: "前のプロジェクト",
    next: "次のプロジェクト",
    show: "プロジェクトを表示",
    view: "プロジェクトを見る",
    jump: "プロジェクトに移動",
  },
} as const;

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

export default function ProjectsShowcase({
  translations,
  projects,
  locale = "en",
}: ProjectsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; id: number } | null>(
    null
  );
  const suppressClickRef = useRef(false);

  const [activeSequence, setActiveSequence] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [isVisible, setIsVisible] = useState(false);
  const [entranceFinished, setEntranceFinished] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const projectCount = projects.length;
  const activeIndex = projectCount
    ? wrapIndex(activeSequence, projectCount)
    : 0;
  const copy = labels[locale];
  const step = Math.round(cardWidth * 0.88);
  const cardHeight = Math.round(cardWidth * 1.25);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [projectCount]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let addedPadding = 0;
    const updateTransition = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const bounds = section.getBoundingClientRect();
      const maxInset = Math.min(80, window.innerWidth * 0.042);
      const entryProgress = Math.min(
        1,
        Math.max(0, (viewportHeight - bounds.top) / (viewportHeight * 0.7))
      );
      const entryInset = (1 - entryProgress) * maxInset;
      const originalBottom = bounds.bottom - addedPadding;
      const exitProgress = Math.min(
        1,
        Math.max(0, (viewportHeight - originalBottom) / (viewportHeight / 4))
      );
      const exitInset = exitProgress * maxInset;
      addedPadding = exitProgress * 96;
      section.style.setProperty("--entry-inset", `${entryInset.toFixed(1)}px`);
      section.style.setProperty(
        "--entry-radius",
        `${((1 - entryProgress) * 48).toFixed(1)}px`
      );
      section.style.setProperty("--exit-inset", `${exitInset.toFixed(1)}px`);
      section.style.setProperty(
        "--exit-radius",
        `${(exitProgress * 48).toFixed(1)}px`
      );
      section.style.setProperty(
        "--exit-padding",
        `${addedPadding.toFixed(1)}px`
      );
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateTransition);
    };

    updateTransition();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(frame);
      section.style.removeProperty("--entry-inset");
      section.style.removeProperty("--entry-radius");
      section.style.removeProperty("--exit-inset");
      section.style.removeProperty("--exit-radius");
      section.style.removeProperty("--exit-padding");
    };
  }, [projectCount]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(Math.min(320, Math.max(230, entry.contentRect.width - 80)));
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [projectCount]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = window.setTimeout(
      () => setEntranceFinished(true),
      prefersReducedMotion ? 0 : 1250
    );
    return () => window.clearTimeout(timeout);
  }, [isVisible, prefersReducedMotion]);

  useEffect(() => {
    if (
      !entranceFinished ||
      prefersReducedMotion ||
      isDragging ||
      projectCount < 2
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      if (!sectionRef.current?.contains(document.activeElement)) {
        setActiveSequence((previous) => previous + 1);
      }
    }, 3000);
    return () => window.clearInterval(interval);
  }, [
    activeSequence,
    entranceFinished,
    prefersReducedMotion,
    isDragging,
    projectCount,
  ]);

  const move = useCallback((direction: number) => {
    setActiveSequence((previous) => previous + direction);
  }, []);

  const moveTo = useCallback(
    (target: number) => {
      if (projectCount < 2) return;
      setActiveSequence((previous) => {
        const current = wrapIndex(previous, projectCount);
        let distance = target - current;
        if (distance > projectCount / 2) distance -= projectCount;
        if (distance < -projectCount / 2) distance += projectCount;
        return previous + distance;
      });
    },
    [projectCount]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    suppressClickRef.current = false;
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
    setIsDragging(true);
  };

  const finishPointer = useCallback(
    (clientX: number, clientY: number, pointerId: number) => {
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      setIsDragging(false);
      if (!start || start.id !== pointerId || projectCount < 2) return;

      const distanceX = clientX - start.x;
      const distanceY = clientY - start.y;
      if (
        Math.abs(distanceX) > 48 &&
        Math.abs(distanceX) > Math.abs(distanceY)
      ) {
        suppressClickRef.current = true;
        move(distanceX < 0 ? 1 : -1);
      }
    },
    [move, projectCount]
  );

  useEffect(() => {
    const handlePointerUp = (event: PointerEvent) => {
      finishPointer(event.clientX, event.clientY, event.pointerId);
    };
    const handlePointerCancel = () => {
      pointerStartRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [finishPointer]);

  if (projectCount === 0) {
    return (
      <section
        ref={sectionRef}
        className={`${styles.showcase} ${styles.emptyShowcase}`}
        aria-label={
          translations?.home?.projectsShowcase?.title || "Featured Projects"
        }
      >
        <AiStoryPanel locale={locale} />
      </section>
    );
  }

  const visibleOffsets = projectCount === 1 ? [0] : [-3, -2, -1, 0, 1, 2, 3];

  return (
    <section
      ref={sectionRef}
      className={`${styles.showcase} ${isVisible ? styles.isVisible : ""}`}
      aria-label={
        translations?.home?.projectsShowcase?.title || "Featured Projects"
      }
    >
      <div className={styles.content}>
        <h2 className={styles.heading}>
          {translations?.home?.projectsShowcase?.title || "Featured Projects"}
        </h2>

        <div
          ref={stageRef}
          className={styles.stage}
          style={{ height: cardHeight + 90 }}
          onPointerDown={handlePointerDown}
          onClickCapture={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }
          }}
        >
          {visibleOffsets.map((offset) => {
            const sequence = activeSequence + offset;
            const projectIndex = wrapIndex(sequence, projectCount);
            const project = projects[projectIndex];
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const isAdjacent = distance === 1;
            const scale = distance === 0 ? 1 : distance === 1 ? 0.79 : 0.55;
            const opacity =
              distance === 0
                ? 1
                : distance === 1
                  ? 0.58
                  : distance === 2
                    ? 0.24
                    : 0;

            return (
              <article
                key={sequence}
                className={styles.card}
                data-active={isActive}
                aria-hidden={distance > 1}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: 10 - distance,
                  opacity,
                  filter:
                    distance === 0
                      ? "none"
                      : distance === 1
                        ? "brightness(0.7) saturate(0.75)"
                        : "brightness(0.55) saturate(0.6)",
                  transform: `translate(-50%, -50%) translateX(${offset * step}px) scale(${scale})`,
                  pointerEvents: distance > 1 ? "none" : "auto",
                }}
              >
                <div
                  className={styles.poster}
                  style={{ animationDelay: `${180 + distance * 90}ms` }}
                >
                  {project.thumbnailUrl && (
                    // CMS thumbnails may be local or remote and are already sized for cards.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={styles.image}
                      src={project.thumbnailUrl}
                      alt=""
                      draggable={false}
                      loading={distance > 1 ? "lazy" : "eager"}
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                    />
                  )}
                  <div className={styles.imageShade} />
                  <div className={styles.cardText}>
                    <h3 className={styles.cardTitle}>
                      {project.title[locale] || project.title.en}
                    </h3>
                    <p className={styles.cardTech}>{project.techSummary}</p>
                  </div>
                </div>

                {isActive ? (
                  <Link
                    className={styles.cardAction}
                    href={localizedPath(`/portfolio/${project.slug}`, locale)}
                    draggable={false}
                    aria-label={`${copy.view} ${project.title[locale] || project.title.en}`}
                  />
                ) : isAdjacent ? (
                  <button
                    className={styles.cardAction}
                    type="button"
                    onClick={() => move(offset)}
                    aria-label={`${copy.show} ${project.title[locale] || project.title.en}`}
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        {projectCount > 1 && (
          <div className={styles.navigation}>
            <button
              className={styles.arrow}
              type="button"
              onClick={() => move(-1)}
              aria-label={copy.previous}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m14.5 5-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className={styles.dots}>
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ""}`}
                  type="button"
                  onClick={() => moveTo(index)}
                  aria-label={`${copy.jump} ${project.title[locale] || project.title.en}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <button
              className={styles.arrow}
              type="button"
              onClick={() => move(1)}
              aria-label={copy.next}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m9.5 5 7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <AiStoryPanel locale={locale} />
    </section>
  );
}
