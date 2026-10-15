import styles from "./TerminalPair.module.css";

type Locale = "th" | "en" | "ja";

const descriptionByLocale: Record<Locale, string> = {
  th: "ภาพจำลองหน้าต่าง Terminal บน macOS สองบานที่สนทนากับ Codex และ Claude Code",
  en: "Illustration of two macOS Terminal windows showing conversations with Codex and Claude Code",
  ja: "Codex と Claude Code との会話を表示した二つの macOS Terminal ウィンドウのイメージ",
};

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
  return (
    <div
      className={styles.stage}
      role="img"
      aria-label={descriptionByLocale[locale]}
    >
      <div className={`${styles.window} ${styles.codex}`} lang="en">
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
          <div className={`${styles.line} ${styles.userLine}`}>
            <span className={styles.codexPrompt}>›</span> Improve keyboard
            access in the gallery.
          </div>
          <div className={styles.line}>
            <span className={styles.codexReply}>•</span> Inspecting gallery
            controls and focus state.
          </div>
          <div className={`${styles.line} ${styles.detailLine}`}>
            Read ProjectsShowcase.tsx
          </div>
          <div className={`${styles.line} ${styles.detailLine}`}>
            Found previous / next controls.
          </div>
          <div className={`${styles.line} ${styles.detailLine}`}>
            Adding focus styles, then verifying.
          </div>
          <div className={`${styles.line} ${styles.codexFooter}`}>
            100% context left · ? for shortcuts
          </div>
        </div>
      </div>

      <div className={`${styles.window} ${styles.claude}`} lang="en">
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
          <div className={`${styles.line} ${styles.userLine}`}>
            <span className={styles.claudePrompt}>&gt;</span> Review the AI
            section at 390px.
          </div>
          <div className={`${styles.line} ${styles.claudeStatus}`}>
            ✻ Checking responsive styles…
          </div>
          <div className={`${styles.line} ${styles.toolCall}`}>
            ● Read(AiStoryPanel.module.css)
          </div>
          <div className={`${styles.line} ${styles.toolOutput}`}>
            └ Read 120 lines
          </div>
          <div
            className={`${styles.line} ${styles.toolCall} ${styles.extraLine}`}
          >
            ● Search(pattern: &quot;@media&quot;)
          </div>
          <div
            className={`${styles.line} ${styles.toolOutput} ${styles.extraLine}`}
          >
            └ Found responsive rules
          </div>
          <div className={styles.line}>
            <span className={styles.claudeReply}>●</span> The mobile layout uses
            a single column.
          </div>
          <div className={styles.currentPrompt}>
            <span className={styles.claudePrompt}>&gt;</span>
            <span className={styles.cursor} />
          </div>
        </div>
      </div>
    </div>
  );
}
