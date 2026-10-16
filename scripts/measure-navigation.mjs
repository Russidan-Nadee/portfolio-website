// Run against an existing `next start` process and a separate headless Chrome
// started with `--remote-debugging-port=9230 --remote-allow-origins=*`.
// Example: node scripts/measure-navigation.mjs --port=9230 --origin=http://localhost:3101

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const getArgument = (name, fallback) =>
  process.argv
    .find((argument) => argument.startsWith(`--${name}=`))
    ?.split("=")[1] ?? fallback;

const debugPort = getArgument("port", "9230");
const origin = getArgument("origin", "http://localhost:3101");
const runs = Number(getArgument("runs", "5"));
const captureDir = getArgument("capture-dir", "");
const inspectHome = getArgument("inspect-home", "false") === "true";
const verifyUi = getArgument("verify-ui", "false") === "true";
const routes = ["about", "portfolio", "certificate", "contact"];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tabs = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(
  (response) => response.json()
);
const tab = tabs.find((item) => item.type === "page");
if (!tab) throw new Error("No Chrome page target found");

const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const listeners = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    clearTimeout(entry.timer);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  } else if (message.method) {
    for (const callback of listeners.get(message.method) ?? [])
      callback(message.params);
  }
});

function call(method, params = {}, timeout = 30000) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${method} timed out`));
    }, timeout);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function once(method, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      listeners.get(method)?.delete(onEvent);
      reject(new Error(`${method} event timed out`));
    }, timeout);
    const onEvent = (params) => {
      clearTimeout(timer);
      listeners.get(method)?.delete(onEvent);
      resolve(params);
    };
    if (!listeners.has(method)) listeners.set(method, new Set());
    listeners.get(method).add(onEvent);
  });
}

async function evaluate(expression, timeout = 30000) {
  const result = await call(
    "Runtime.evaluate",
    { expression, awaitPromise: true, returnByValue: true },
    timeout
  );
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result?.value;
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  throw new Error(`Wait timed out: ${expression}`);
}

await call("Page.enable");
await call("Runtime.enable");
await call("Emulation.setDeviceMetricsOverride", {
  width: 1100,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false,
});

const results = {};
let homeProbe = null;
for (const route of routes) {
  const samples = [];
  for (let index = 0; index < runs; index++) {
    const loaded = once("Page.domContentEventFired");
    await call("Page.navigate", { url: `${origin}/en/` });
    await loaded;
    await waitFor(
      `location.pathname === '/en/' && Boolean(document.querySelector('[data-creative-hero]')) && Boolean(document.querySelector('header a[href="/en/${route}/"]'))`
    );
    if (captureDir && route === routes[0] && index === 0) {
      await mkdir(captureDir, { recursive: true });
      await delay(1000);
      const capture = await call("Page.captureScreenshot", { format: "png" });
      await writeFile(
        join(captureDir, "home.png"),
        Buffer.from(capture.data, "base64")
      );
    }
    if (inspectHome && route === routes[0] && index === 0) {
      await evaluate(
        `document.querySelector('iframe[src*="fastwork"]')?.scrollIntoView({ block: 'center' })`
      );
      await delay(2500);
      homeProbe = await evaluate(`({
        pathname: location.pathname,
        aiStoryPresent: Boolean(document.querySelector('#ai-story')),
        aiStoryHeight: document.querySelector('#ai-story')?.getBoundingClientRect().height ?? null,
        mainHtmlLength: document.querySelector('main')?.innerHTML.length ?? null,
        mainTextTail: document.querySelector('main')?.textContent?.slice(-300) ?? null,
        sectionIds: [...document.querySelectorAll('main section[id]')].map(node => node.id),
        iframes: [...document.querySelectorAll('iframe')].map(node => ({
          src: node.src,
          loading: node.loading,
          hiddenByCss: [...(function* (element) { while (element) { yield element; element = element.parentElement; } })(node)].some(element => getComputedStyle(element).display === 'none')
        })),
        rscRequests: performance.getEntriesByType('resource').filter(entry => entry.name.includes('_rsc=')).map(entry => entry.name),
        iframeRequests: performance.getEntriesByType('resource').filter(entry => /fastwork|fastship|youtube/i.test(entry.name)).map(entry => entry.name)
      })`);
      await evaluate(`window.scrollTo(0, 0)`);
      await delay(300);
    }
    // Give hydration and the site's normal Link prefetch the same window.
    await delay(500);
    const elapsed = await evaluate(
      `(async () => {
      const path = '/en/${route}/';
      const link = document.querySelector('header a[href="' + path + '"]');
      const oldMain = document.querySelector('main')?.innerHTML;
      const start = performance.now();
      link.click();
      await new Promise((resolve, reject) => {
        const deadline = setTimeout(() => { observer.disconnect(); reject(new Error('Navigation timed out')); }, 15000);
        const ready = () => {
          const main = document.querySelector('main');
          const active = document.querySelector('header a[aria-current="page"][href="' + path + '"]');
          if (location.pathname === path && active && main && main.innerHTML !== oldMain && main.textContent.trim().length > 20) {
            clearTimeout(deadline);
            observer.disconnect();
            requestAnimationFrame(() => requestAnimationFrame(resolve));
          }
        };
        const observer = new MutationObserver(ready);
        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current'] });
        ready();
      });
      return Math.round(performance.now() - start);
    })()`,
      20000
    );
    samples.push(elapsed);
    if (captureDir && index === 0) {
      await delay(1000);
      const capture = await call("Page.captureScreenshot", { format: "png" });
      await writeFile(
        join(captureDir, `${route}.png`),
        Buffer.from(capture.data, "base64")
      );
    }
  }
  results[route] = samples;
}

let uiVerification = null;
if (verifyUi) {
  const legalPages = {};
  for (const locale of ["th", "ja"]) {
    const loaded = once("Page.domContentEventFired");
    await call("Page.navigate", {
      url: `${origin}/${locale}/legal/privacy-policy/`,
    });
    await loaded;
    await waitFor(
      `location.pathname === '/${locale}/legal/privacy-policy/' && Boolean(document.querySelector('main h1'))`
    );
    legalPages[locale] = await evaluate(`({
      lang: document.documentElement.lang,
      heading: document.querySelector('main h1')?.textContent?.trim()
    })`);
  }
  const contactLoaded = once("Page.domContentEventFired");
  await call("Page.navigate", { url: `${origin}/en/contact/` });
  await contactLoaded;
  await waitFor(
    `location.pathname === '/en/contact/' && Boolean(document.querySelector('button[aria-label^="Switch to"]'))`
  );
  const before = await evaluate(
    `document.documentElement.getAttribute('data-theme')`
  );
  await evaluate(
    `document.querySelector('button[aria-label^="Switch to"]')?.click()`
  );
  await waitFor(
    `document.documentElement.getAttribute('data-theme') !== '${before}'`
  );
  const after = await evaluate(
    `document.documentElement.getAttribute('data-theme')`
  );
  const reloaded = once("Page.domContentEventFired");
  await call("Page.reload");
  await reloaded;
  await waitFor(
    `location.pathname === '/en/contact/' && document.documentElement.getAttribute('data-theme') === '${after}'`
  );
  const persisted = await evaluate(
    `document.documentElement.getAttribute('data-theme')`
  );
  uiVerification = { legalPages, theme: { before, after, persisted } };
}

console.log(
  JSON.stringify(
    {
      origin,
      runs,
      metric: "header-click-to-route-content-plus-two-frames",
      results,
      ...(inspectHome ? { homeProbe } : {}),
      ...(verifyUi ? { uiVerification } : {}),
    },
    null,
    2
  )
);
socket.close();
