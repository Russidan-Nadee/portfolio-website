"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";

let pendingThumbnailCleanup: Promise<void> = Promise.resolve();

export default function ResumePdfThumbnail({
  url,
  onError,
}: {
  url: string;
  onError: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | undefined;
    let renderTask: RenderTask | undefined;

    async function renderThumbnail() {
      // Keep PDF.js and its worker out of the initial home-page bundle.
      const pdfjs = await import("pdfjs-dist");
      // PDF.js cannot reuse the shared worker port while its prior document
      // is still being destroyed after a quick pointer leave/reenter.
      await pendingThumbnailCleanup;
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerPort ??= new Worker(
        new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
        { type: "module" }
      );
      loadingTask = pdfjs.getDocument({
        url,
        useWasm: false,
      });
      const document = await loadingTask.promise;
      if (cancelled) return;
      const page = await document.getPage(1);
      if (cancelled) return;
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      const original = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 480 / original.width });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      renderTask = page.render({ canvas, canvasContext: context, viewport });
      await renderTask.promise;
      if (!cancelled) setReady(true);
    }

    renderThumbnail().catch(() => {
      if (!cancelled) onError();
    });
    return () => {
      cancelled = true;
      renderTask?.cancel();
      if (loadingTask) {
        pendingThumbnailCleanup = Promise.all([
          pendingThumbnailCleanup,
          loadingTask.destroy(),
        ]).then(
          () => undefined,
          () => undefined
        );
      }
    };
  }, [url, onError]);

  return <canvas ref={canvasRef} data-thumbnail-ready={ready} />;
}
