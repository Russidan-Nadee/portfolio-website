import type { AnchorHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import AdminChrome from "../../../src/app/admin/AdminChrome";
import AdminLoading from "../../../src/app/admin/loading";

const render = () =>
  renderToStaticMarkup(
    <AdminChrome email="admin@example.com">Content</AdminChrome>
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
});
