// Inspect the assets referenced by server-rendered HTML from a production build.
// Example: node scripts/measure-assets.mjs --origin=http://localhost:3101

import { stat } from "node:fs/promises";
import { join } from "node:path";

const origin =
  process.argv.find((value) => value.startsWith("--origin="))?.slice(9) ??
  "http://localhost:3101";
const routes = ["/en/", "/en/about/", "/en/portfolio/", "/en/contact/"];
const decode = (value) => value.replaceAll("&amp;", "&");
const attribute = (tag, name) =>
  tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i"))?.[1] ?? null;

for (const route of routes) {
  const page = await fetch(new URL(route, origin));
  const html = await page.text();
  const fontPreloads = [
    ...(page.headers.get("link") ?? "").matchAll(
      /<([^>]+)>;\s*rel=preload;\s*as="font"/g
    ),
  ].map((match) => match[1]);
  const fontBytes = await Promise.all(
    fontPreloads.map(async (url) => {
      const basename = new URL(url, origin).pathname.split("/").at(-1);
      return (await stat(join(".next", "static", "media", basename))).size;
    })
  );
  const images = (html.match(/<img\b[^>]*>/g) ?? []).map((tag) => {
    const sourceSet = decode(attribute(tag, "srcset") ?? "");
    const candidates = sourceSet
      .split(",")
      .map((candidate) => candidate.trim().split(/\s+/))
      .filter(([url]) => Boolean(url));
    const selected =
      candidates.find(([, width]) => width === "384w")?.[0] ??
      candidates[0]?.[0] ??
      decode(attribute(tag, "src") ?? "");
    return { selected, loading: attribute(tag, "loading") };
  });
  const firstImages = await Promise.all(
    images.slice(0, 6).map(async ({ selected, loading }) => {
      try {
        const response = await fetch(new URL(selected, origin));
        const bytes = (await response.arrayBuffer()).byteLength;
        return {
          selected,
          loading,
          status: response.status,
          bytes,
          contentType: response.headers.get("content-type"),
        };
      } catch (error) {
        return { selected, loading, error: String(error) };
      }
    })
  );
  console.log(
    JSON.stringify({
      route,
      fontPreloads: fontPreloads.length,
      fontPreloadBytes: fontBytes.reduce((sum, bytes) => sum + bytes, 0),
      imageCountInHtml: images.length,
      firstImages,
    })
  );
}
