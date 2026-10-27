export interface OverviewMedia {
  type: "image" | "iframe";
  iframeUrl: string;
}

export function getOverviewMediaError(media?: OverviewMedia): string | null {
  if (media?.type !== "iframe") return null;
  try {
    const url = new URL(media.iframeUrl.trim());
    if (url.protocol === "http:" || url.protocol === "https:") return null;
  } catch {
    // Empty, relative, and malformed URLs cannot be used as embed sources.
  }
  return "กรุณาใส่ URL iframe ที่ถูกต้อง โดยขึ้นต้นด้วย http:// หรือ https://";
}
