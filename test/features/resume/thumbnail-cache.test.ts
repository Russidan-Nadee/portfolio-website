import assert from "node:assert/strict";
import { test } from "vitest";
import { createResumeThumbnailCache } from "../../../src/features/resume/thumbnail-cache";

const image = { src: "data:image/png;base64,first", width: 480, height: 679 };

test("preloading and repeated hovers share one rendered image for a version", async () => {
  let renders = 0;
  let finish!: (value: typeof image) => void;
  const cache = createResumeThumbnailCache(() => {
    renders++;
    return new Promise((resolve) => (finish = resolve));
  });

  const preload = cache.load("/en/resume/preview/", "v1");
  const hover = cache.load("/th/resume/preview/", "v1");
  await Promise.resolve();
  assert.equal(renders, 1);
  assert.equal(preload, hover);
  finish(image);
  assert.equal(await preload, image);
  assert.equal(await cache.load("/en/resume/preview/", "v1"), image);
  assert.equal(cache.peek("v1"), image);
  assert.equal(renders, 1);
});

test("a new PDF version replaces the cached image", async () => {
  const urls: string[] = [];
  const cache = createResumeThumbnailCache(async (url) => {
    urls.push(url);
    return { ...image, src: url };
  });

  await cache.load("/preview?v=1", "v1");
  assert.equal(cache.peek("v2"), undefined);
  const next = await cache.load("/preview?v=2", "v2");

  assert.equal(next.src, "/preview?v=2");
  assert.equal(cache.peek("v1"), undefined);
  assert.equal(cache.peek("v2"), next);
  assert.deepEqual(urls, ["/preview?v=1", "/preview?v=2"]);
});

test("a failed preload can be retried on hover", async () => {
  let attempts = 0;
  const cache = createResumeThumbnailCache(async () => {
    if (++attempts === 1) throw new Error("PDF unavailable");
    return image;
  });

  await assert.rejects(cache.load("/preview", "v1"));
  assert.equal(cache.peek("v1"), undefined);
  assert.equal(await cache.load("/preview", "v1"), image);
  assert.equal(attempts, 2);
});

test("an older failed render does not evict a newer cached version", async () => {
  let fail!: (error: Error) => void;
  const cache = createResumeThumbnailCache((url) =>
    url === "/old"
      ? new Promise((_, reject) => (fail = reject))
      : Promise.resolve(image)
  );
  const old = cache.load("/old", "v1");
  const rejected = assert.rejects(old);
  await cache.load("/new", "v2");
  fail(new Error("old request failed"));
  await rejected;

  assert.equal(cache.peek("v2"), image);
});
