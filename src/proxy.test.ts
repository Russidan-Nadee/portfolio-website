import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("public locale routing", () => {
  it("redirects an old project slug to the English URL", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/portfolio/my-project?view=full")
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/en/portfolio/my-project?view=full"
    );
  });

  it.each(["en", "th", "ja"])(
    "rewrites a %s project slug without changing its URL",
    async (locale) => {
      const response = await proxy(
        new NextRequest(`https://example.com/${locale}/portfolio/my-project`)
      );
      expect(response.headers.get("x-middleware-rewrite")).toBe(
        "https://example.com/portfolio/my-project"
      );
    }
  );

  it("keeps dots in a project slug", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/th/portfolio/release.v2"),
    );
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://example.com/portfolio/release.v2",
    );
  });

  it("leaves an unknown locale to the existing 404 route", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/fr/about")
    );
    expect(response.headers.get("location")).toBe(
      "https://example.com/en/fr/about"
    );
  });

  it("keeps the admin route outside locale paths", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/th/admin/login")
    );
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/login"
    );
  });
});
