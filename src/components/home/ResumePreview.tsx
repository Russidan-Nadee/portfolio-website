"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaRegFilePdf } from "react-icons/fa";
import { localizedPath } from "@/lib/locale-path";
import styles from "./ResumePreview.module.css";
import ResumePdfThumbnail from "./ResumePdfThumbnail";

type PreviewPosition = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function ResumePreview({ locale }: { locale: string }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<PreviewPosition | null>(null);

  const close = useCallback(() => setPosition(null), []);

  const showAbove = useCallback(() => {
    const rect = triggerRef.current?.closest("a")?.getBoundingClientRect();
    if (!rect) return;
    const availableHeight = rect.top - 28;
    if (availableHeight < 80) return;
    const height = Math.min(240 * (297 / 210), availableHeight);
    const width = Math.min(height * (210 / 297), window.innerWidth - 24);
    const left = Math.max(
      12,
      Math.min(
        rect.left + rect.width / 2 - width / 2,
        window.innerWidth - width - 12
      )
    );
    const top = rect.top - height - 16;
    setPosition({ left, top, width, height });
  }, []);

  useEffect(() => {
    const link = triggerRef.current?.closest("a");
    const handleFocus = () => {
      if (!link?.matches(":focus-visible")) return;
      showAbove();
    };
    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") showAbove();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
    };
    link?.addEventListener("pointerenter", handlePointerEnter);
    link?.addEventListener("pointerleave", close);
    link?.addEventListener("focus", handleFocus);
    link?.addEventListener("blur", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      link?.removeEventListener("pointerenter", handlePointerEnter);
      link?.removeEventListener("pointerleave", close);
      link?.removeEventListener("focus", handleFocus);
      link?.removeEventListener("blur", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, showAbove]);

  return (
    <>
      <span ref={triggerRef} className={styles.trigger} aria-hidden="true">
        <FaRegFilePdf size={14} />
      </span>
      {position &&
        createPortal(
          <div
            className={styles.preview}
            style={position}
            aria-hidden="true"
            data-resume-preview
          >
            <ResumePdfThumbnail
              url={localizedPath("/resume/preview/", locale)}
              onError={close}
            />
          </div>,
          document.body
        )}
    </>
  );
}
