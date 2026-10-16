import { describe, expect, it } from "vitest";
import {
  localeFromPath,
  localizedDestination,
  localizedPath,
} from "./locale-path";

describe("localized public paths", () => {
  it.each(["en", "th", "ja"])("recognizes %s from a project URL", (locale) => {
    expect(localeFromPath(`/${locale}/portfolio/example`)).toBe(locale);
  });

  it("keeps a project slug when changing languages", () => {
    expect(localizedPath("/en/portfolio/my-project", "ja")).toBe(
      "/ja/portfolio/my-project"
    );
  });

  it("adds a locale to every unprefixed public path", () => {
    expect(localizedPath("/legal/privacy-policy", "th")).toBe(
      "/th/legal/privacy-policy"
    );
    expect(localizedPath("/", "en")).toBe("/en");
  });

  it("keeps the query and hash when changing language", () => {
    expect(
      localizedDestination(
        "/en/portfolio/my-project",
        "th",
        "?tab=demo",
        "#gallery"
      )
    ).toBe("/th/portfolio/my-project?tab=demo#gallery");
  });
});
