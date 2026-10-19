// @vitest-environment happy-dom

import { act, type AnchorHTMLAttributes } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({
  pathname: "/admin/projects/",
  pending: false,
}));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
  useLinkStatus: () => ({ pending: navigation.pending }),
}));
vi.mock("../../../src/app/admin/actions", () => ({ logout: vi.fn() }));
vi.mock("../../../src/components/layout/Header.module.css", () => ({
  default: {},
}));

import AdminChrome from "../../../src/app/admin/AdminChrome";
import AdminLoading from "../../../src/app/admin/loading";
import Header from "../../../src/components/layout/Header";
import { ThemeProvider } from "../../../src/components/layout/ThemeProvider";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const render = () =>
  renderToStaticMarkup(
    <ThemeProvider>
      <AdminChrome email="admin@example.com">Content</AdminChrome>
    </ThemeProvider>
  );

describe("admin navigation feedback", () => {
  beforeEach(() => {
    navigation.pathname = "/admin/projects/";
    navigation.pending = false;
  });

  it("marks Projects as active on a nested editor route", () => {
    navigation.pathname = "/admin/projects/abc/";
    const html = render();
    expect(html).toMatch(/href="\/admin\/projects" aria-current="page"/);
    expect((html.match(/aria-current="page"/g) ?? []).length).toBe(1);
  });

  it("includes a link back to Overview", () => {
    navigation.pathname = "/admin/";
    expect(render()).toMatch(/href="\/admin" aria-current="page"/);
  });

  it("shows a busy label while navigation is pending", () => {
    navigation.pending = true;
    const html = render();
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Opening Projects");
    expect(html).toContain('role="status"');
  });

  it("renders the login page without admin navigation, including its trailing slash", () => {
    navigation.pathname = "/admin/login/";
    expect(render()).toBe("Content");
  });

  it("provides a streaming loading fallback", () => {
    const html = renderToStaticMarkup(<AdminLoading />);
    expect(html).toContain('role="status"');
    expect(html).toContain("Loading admin content");
  });

  it.each(["/admin", "/admin/projects/", "/admin/login/"])(
    "hides public navigation on %s",
    (pathname) => {
      navigation.pathname = pathname;
      expect(renderToStaticMarkup(<Header />)).toBe("");
    }
  );

  it("keeps the public header available outside admin routes", () => {
    navigation.pathname = "/en/about";
    expect(renderToStaticMarkup(<Header />)).not.toBe("");
  });
});

describe("mobile admin sidebar", () => {
  let root: Root;
  let container: HTMLDivElement;
  let media: MediaQueryList;
  let desktop: boolean;

  beforeEach(() => {
    navigation.pathname = "/admin/projects/";
    navigation.pending = false;
    desktop = false;
    media = new EventTarget() as MediaQueryList;
    Object.defineProperty(media, "matches", { get: () => desktop });
    vi.spyOn(window, "matchMedia").mockReturnValue(media);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    document.body.style.overflow = "scroll";
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  const mount = () =>
    act(async () =>
      root.render(
        <ThemeProvider>
          <AdminChrome email="admin@example.com">
            <button>Page action</button>
          </AdminChrome>
        </ThemeProvider>
      )
    );

  async function open() {
    const toggle = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Open admin navigation"]'
    );
    expect(toggle).not.toBeNull();
    await act(async () => toggle!.click());
    return toggle!;
  }

  it("opens as a labelled modal, locks background scrolling, and restores focus when closed", async () => {
    await mount();
    const toggle = await open();
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer?.getAttribute("aria-modal")).toBe("true");
    expect(drawer?.getAttribute("aria-labelledby")).toBe("admin-sidebar-title");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");
    const close = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close admin navigation"]'
    );
    expect(document.activeElement).toBe(close);
    await act(async () => close!.click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.activeElement).toBe(toggle);
  });

  it.each(["Escape", "backdrop"])("closes with %s", async (method) => {
    await mount();
    const toggle = await open();
    await act(async () => {
      if (method === "Escape")
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
        );
      else
        container
          .querySelector<HTMLButtonElement>(
            '[aria-label="Dismiss admin navigation"]'
          )!
          .click();
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it("keeps keyboard focus inside the open drawer", async () => {
    await mount();
    await open();
    const drawer = container.querySelector('[role="dialog"]')!;
    const first = drawer.querySelector<HTMLButtonElement>(
      'button[aria-label="Close admin navigation"]'
    )!;
    const last = drawer.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )!;
    last.focus();
    await act(async () =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          bubbles: true,
          cancelable: true,
        })
      )
    );
    expect(document.activeElement).toBe(first);
    await act(async () =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        })
      )
    );
    expect(document.activeElement).toBe(last);
    expect(container.querySelector("main")?.closest("[inert]")).not.toBeNull();
  });

  it("closes after selecting a navigation link", async () => {
    await mount();
    const toggle = await open();
    const link = container.querySelector<HTMLAnchorElement>(
      'nav a[href="/admin/skills"]'
    )!;
    link.addEventListener("click", (event) => event.preventDefault());
    await act(async () => link.click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on a route change even without a sidebar click", async () => {
    await mount();
    await open();
    navigation.pathname = "/admin/skills/";
    await mount();
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("releases mobile scroll locking when resized to desktop", async () => {
    await mount();
    await open();
    await act(async () => {
      desktop = true;
      media.dispatchEvent(new Event("change"));
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("scroll");
    expect(
      container.querySelector('nav[aria-label="Admin navigation"]')
    ).not.toBeNull();
  });
});
