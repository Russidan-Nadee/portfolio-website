"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./TerminalPair.module.css";

type Locale = "th" | "en" | "ja";

const descriptionByLocale: Record<Locale, string> = {
  th: "ภาพจำลองหน้าต่าง Terminal บน macOS สองบานที่สนทนากับ Codex และ Claude Code",
  en: "Illustration of two macOS Terminal windows showing conversations with Codex and Claude Code",
  ja: "Codex と Claude Code との会話を表示した二つの macOS Terminal ウィンドウのイメージ",
};

const conversation: { step: string; start: number; duration: number }[] = [
  { step: "codex-user", start: 0.15, duration: 0.55 },
  { step: "codex-reply", start: 0.8, duration: 0.35 },
  { step: "codex-read", start: 1.2, duration: 0.2 },
  { step: "codex-found", start: 1.45, duration: 0.2 },
  { step: "codex-verify", start: 1.7, duration: 0.25 },
  { step: "codex-edit", start: 2, duration: 0.2 },
  { step: "codex-check", start: 2.25, duration: 0.2 },
  { step: "codex-check-result", start: 2.5, duration: 0.25 },
  { step: "codex-done", start: 2.85, duration: 0.4 },
  { step: "claude-user", start: 3.6, duration: 0.65 },
  { step: "claude-status", start: 4.3, duration: 0.3 },
  { step: "claude-read", start: 4.65, duration: 0.25 },
  { step: "claude-read-result", start: 4.95, duration: 0.2 },
  { step: "claude-search", start: 5.2, duration: 0.25 },
  { step: "claude-search-result", start: 5.5, duration: 0.2 },
  { step: "claude-check", start: 5.75, duration: 0.25 },
  { step: "claude-check-result", start: 6.05, duration: 0.2 },
  { step: "claude-reply", start: 6.35, duration: 0.7 },
  { step: "claude-prompt", start: 7.15, duration: 0.15 },
];

function TrafficLights() {
  return (
    <span className={styles.trafficLights} aria-hidden="true">
      <span className={styles.close} />
      <span className={styles.minimize} />
      <span className={styles.zoom} />
    </span>
  );
}

export default function TerminalPair({ locale }: { locale: Locale }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const codex = stage.querySelector<HTMLElement>(
        '[data-terminal-window="codex"]'
      );
      const claude = stage.querySelector<HTMLElement>(
        '[data-terminal-window="claude"]'
      );
      if (!codex || !claude) return;

      const lines = Array.from(
        stage.querySelectorAll<HTMLElement>("[data-terminal-step]")
      );
      gsap.set(lines, { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
      gsap.set(codex, { zIndex: 3, filter: "brightness(1)" });
      gsap.set(claude, { zIndex: 1, filter: "brightness(0.8)" });

      const timeline = gsap.timeline({ repeat: -1, paused: true });
      timeline.set(codex, { zIndex: 1 }, 3.55);
      timeline.set(claude, { zIndex: 3 }, 3.55);
      timeline.to(codex, { filter: "brightness(0.8)", duration: 0.3 }, 3.55);
      timeline.to(claude, { filter: "brightness(1)", duration: 0.3 }, 3.55);
      for (const { step, start, duration } of conversation) {
        const line = stage.querySelector<HTMLElement>(
          `[data-terminal-step="${step}"]`
        );
        if (!line) continue;
        timeline.to(
          line,
          {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration,
            ease: `steps(${Math.max(8, line.textContent?.trim().length ?? 8)})`,
          },
          start
        );
      }
      timeline.to(lines, { autoAlpha: 0, duration: 0.25 }, 7.6);
      timeline.set(lines, { clipPath: "inset(0 100% 0 0)" }, 8);
      timeline.set(codex, { zIndex: 3, filter: "brightness(1)" }, 8);
      timeline.set(claude, { zIndex: 1, filter: "brightness(0.8)" }, 8);

      const observer = new IntersectionObserver(
        ([entry]) =>
          entry.isIntersecting ? timeline.play() : timeline.pause(),
        { threshold: 0.1 }
      );
      observer.observe(stage);

      return () => {
        observer.disconnect();
        timeline.kill();
        gsap.set(lines, { clearProps: "all" });
        gsap.set([codex, claude], { clearProps: "zIndex,filter" });
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="img"
      aria-label={descriptionByLocale[locale]}
    >
      <div
        className={`${styles.window} ${styles.codex}`}
        data-terminal-window="codex"
        lang="en"
      >
        <div className={styles.titleBar}>
          <TrafficLights />
          <span className={styles.windowTitle}>portfolio — codex</span>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.line}>
            <span className={styles.shellPrompt}>$</span> codex
          </div>
          <div className={`${styles.line} ${styles.codexHeading}`}>
            <span className={styles.codexMark}>&gt;_</span> OpenAI Codex
            <span className={styles.muted}> · ~/code/portfolio</span>
          </div>
          <div
            className={`${styles.line} ${styles.userLine}`}
            data-terminal-step="codex-user"
          >
            <span className={styles.codexPrompt}>›</span> Improve keyboard
            access in the gallery.
          </div>
          <div className={styles.line} data-terminal-step="codex-reply">
            <span className={styles.codexReply}>•</span> Inspecting gallery
            controls and focus state.
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-read"
          >
            Read ProjectsShowcase.tsx
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-found"
          >
            Found previous / next controls.
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-verify"
          >
            Adding focus styles, then verifying.
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-edit"
          >
            Edit(ProjectsShowcase.module.css)
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-check"
          >
            Run keyboard smoke check
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-check-result"
          >
            └ Tab reaches both gallery controls.
          </div>
          <div
            className={`${styles.line} ${styles.detailLine}`}
            data-terminal-step="codex-done"
          >
            ✓ Focus ring and keyboard flow checked.
          </div>
          <div className={`${styles.line} ${styles.codexFooter}`}>
            100% context left · ? for shortcuts
          </div>
        </div>
      </div>

      <div
        className={`${styles.window} ${styles.claude}`}
        data-terminal-window="claude"
        lang="en"
      >
        <div className={styles.titleBar}>
          <TrafficLights />
          <span className={styles.windowTitle}>portfolio — claude</span>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.line}>
            <span className={styles.shellPrompt}>$</span> claude
          </div>
          <div className={`${styles.line} ${styles.claudeHeading}`}>
            <span className={styles.claudeMark}>✻</span> Claude Code
            <span className={styles.muted}> · ~/code/portfolio</span>
          </div>
          <div
            className={`${styles.line} ${styles.userLine}`}
            data-terminal-step="claude-user"
          >
            <span className={styles.claudePrompt}>&gt;</span> Review the AI
            section at 390px.
          </div>
          <div
            className={`${styles.line} ${styles.claudeStatus}`}
            data-terminal-step="claude-status"
          >
            ✻ Checking responsive styles…
          </div>
          <div
            className={`${styles.line} ${styles.toolCall}`}
            data-terminal-step="claude-read"
          >
            ● Read(AiStoryPanel.module.css)
          </div>
          <div
            className={`${styles.line} ${styles.toolOutput}`}
            data-terminal-step="claude-read-result"
          >
            └ Read 120 lines
          </div>
          <div
            className={`${styles.line} ${styles.toolCall}`}
            data-terminal-step="claude-search"
          >
            ● Search(pattern: &quot;@media&quot;)
          </div>
          <div
            className={`${styles.line} ${styles.toolOutput}`}
            data-terminal-step="claude-search-result"
          >
            └ Found responsive rules
          </div>
          <div
            className={`${styles.line} ${styles.toolCall}`}
            data-terminal-step="claude-check"
          >
            ● Check mobile spacing and tap targets
          </div>
          <div
            className={`${styles.line} ${styles.toolOutput}`}
            data-terminal-step="claude-check-result"
          >
            └ Navigation remains reachable at 390px
          </div>
          <div className={styles.line} data-terminal-step="claude-reply">
            <span className={styles.claudeReply}>●</span> Single column works;
            increase tap targets.
          </div>
          <div
            className={styles.currentPrompt}
            data-terminal-step="claude-prompt"
          >
            <span className={styles.claudePrompt}>&gt;</span>
            <span className={styles.cursor} />
          </div>
        </div>
      </div>
    </div>
  );
}
