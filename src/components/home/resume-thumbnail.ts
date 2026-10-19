import { createResumeThumbnailCache } from "@/features/resume/thumbnail-cache";

// Serializing version changes also prevents reuse of the worker during destroy().
let renderQueue: Promise<unknown> = Promise.resolve();

export const resumeThumbnailCache = createResumeThumbnailCache((url) => {
  const result = renderQueue
    .catch(() => undefined)
    .then(async () => {
      // PDF.js stays out of the initial page bundle and runs only after the intro.
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerPort ??= new Worker(
        new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
        { type: "module" }
      );
      const loadingTask = pdfjs.getDocument({ url, useWasm: false });
      try {
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Thumbnail canvas is unavailable");
        const original = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: 480 / original.width });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        try {
          await page.render({ canvas, canvasContext: context, viewport })
            .promise;
          const src = canvas.toDataURL("image/webp", 0.9);
          // Decode before publishing so opening the tooltip only paints an image.
          const image = new Image();
          image.src = src;
          await image.decode();
          return { src, width: canvas.width, height: canvas.height };
        } finally {
          canvas.width = canvas.height = 0;
        }
      } finally {
        await loadingTask.destroy();
      }
    });
  // Do not retain the image through this queue after its cache entry is replaced.
  renderQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
});
