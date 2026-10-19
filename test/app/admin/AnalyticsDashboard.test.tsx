// @vitest-environment happy-dom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AnalyticsDashboard from "../../../src/app/admin/AnalyticsDashboard";
import type {
  AnalyticsDashboardData,
  AnalyticsResult,
} from "../../../src/lib/vercel-analytics";

const emptyData: AnalyticsDashboardData = {
  totals: { pageviews: 0, visitors: 0 },
  trend: [],
  topPages: [],
  countries: [],
  referrers: [],
  devices: [],
  since: "2026-08-09",
  until: "2026-09-07",
  updatedAt: "2026-09-07T12:00:00.000Z",
};

function renderResult(result: AnalyticsResult): string {
  return renderToStaticMarkup(<AnalyticsDashboard result={result} />);
}

describe("AnalyticsDashboard server rendering", () => {
  it("lists missing setup variables without exposing secret values", () => {
    const html = renderResult({
      status: "setup",
      missing: ["VERCEL_ACCESS_TOKEN", "VERCEL_PROJECT_ID"],
    });

    expect(html).toMatch(/Setup required/);
    expect(html).toMatch(/VERCEL_ACCESS_TOKEN/);
    expect(html).toMatch(/VERCEL_PROJECT_ID/);
    expect(html).not.toMatch(/top-secret-token/);
  });

  it("renders a temporary-unavailable state", () => {
    const html = renderResult({ status: "unavailable" });

    expect(html).toMatch(/Analytics temporarily unavailable/);
  });

  it("renders zero totals and no-data copy for an empty ready result", () => {
    const html = renderResult({ status: "ready", data: emptyData });

    expect(html).toMatch(/Visitors/);
    expect(html).toMatch(/Page Views/);
    expect(html).toMatch(/>0<\/[^>]+>/);
    expect(html).toMatch(/No data available for this period/);
  });

  it("renders totals, chart, breakdown labels, and update metadata", () => {
    const data: AnalyticsDashboardData = {
      ...emptyData,
      totals: { pageviews: 30, visitors: 23 },
      trend: [
        {
          timestamp: "2026-09-06T00:00:00.000Z",
          pageviews: 10,
          visitors: 8,
        },
        {
          timestamp: "2026-09-07T00:00:00.000Z",
          pageviews: 20,
          visitors: 15,
        },
      ],
      topPages: [{ label: "/home", pageviews: 20, visitors: 16 }],
      countries: [{ label: "Thailand", pageviews: 15, visitors: 12 }],
      referrers: [{ label: "search.example.com", pageviews: 10, visitors: 8 }],
      devices: [{ label: "Desktop", pageviews: 25, visitors: 20 }],
    };

    const html = renderResult({ status: "ready", data });

    expect(html).toMatch(/Visitors/);
    expect(html).toMatch(/Page Views/);
    expect(html).toMatch(/>23<\/[^>]+>/);
    expect(html).toMatch(/>30<\/[^>]+>/);
    expect(html).toMatch(/<svg[^>]*role="img"/);
    expect(html).toMatch(/Visitors series/);
    expect(html).toMatch(/Page views series/);
    expect(html).toMatch(/\/home/);
    expect(html).toMatch(/Thailand/);
    expect(html).toMatch(/search\.example\.com/);
    expect(html).toMatch(/Desktop/);
    expect(html).toMatch(/2026-09-07T12:00:00\.000Z/);
  });

  it("exposes every trend point to screen readers while keeping bar dimensions finite", () => {
    const data: AnalyticsDashboardData = {
      ...emptyData,
      trend: [
        {
          timestamp: "2026-09-06T00:00:00.000Z",
          pageviews: 101,
          visitors: 81,
        },
        {
          timestamp: "2026-09-07T00:00:00.000Z",
          pageviews: 203,
          visitors: 152,
        },
      ],
    };

    const html = renderResult({ status: "ready", data });
    const table = html.match(
      /<table[^>]*id="traffic-trend-data"[\s\S]*?<\/table>/
    )?.[0];

    expect(html).toMatch(/aria-describedby="traffic-trend-data"/);
    expect(table).toBeDefined();
    expect(table).toMatch(/2026-09-06T00:00:00\.000Z/);
    expect(table).toMatch(/2026-09-07T00:00:00\.000Z/);
    expect(table).toMatch(/>81</);
    expect(table).toMatch(/>152</);
    expect(table).toMatch(/>101</);
    expect(table).toMatch(/>203</);

    const document = new DOMParser().parseFromString(html, "text/html");
    const bars = document.querySelectorAll("svg rect");
    expect(bars).toHaveLength(4);
    for (const bar of bars) {
      for (const attribute of ["x", "y", "width", "height"]) {
        expect(bar.hasAttribute(attribute)).toBe(true);
        expect(Number.isFinite(Number(bar.getAttribute(attribute)))).toBe(true);
      }
    }
  });

  it("groups visitors and page views by day using the same height scale", () => {
    const html = renderResult({
      status: "ready",
      data: {
        ...emptyData,
        trend: [
          { timestamp: "2026-09-06", visitors: 5, pageviews: 10 },
          { timestamp: "2026-09-07", visitors: 10, pageviews: 20 },
        ],
      },
    });
    const document = new DOMParser().parseFromString(html, "text/html");
    const groups = document.querySelectorAll("svg > g");
    expect(groups).toHaveLength(2);
    expect(document.querySelector("svg polyline")).toBeNull();
    expect(document.querySelector("svg desc")?.textContent).toMatch(
      /bar chart/i
    );

    const [firstVisitors, firstViews] = groups[0].querySelectorAll("rect");
    const [secondVisitors, secondViews] = groups[1].querySelectorAll("rect");
    expect(firstVisitors.getAttribute("aria-label")).toBe("Visitors: 5");
    expect(firstViews.getAttribute("aria-label")).toBe("Page views: 10");
    expect(groups[0].textContent).toContain("2026-09-06");
    expect(groups[1].textContent).toContain("2026-09-07");
    expect(Number(firstVisitors.getAttribute("height")) * 2).toBeCloseTo(
      Number(firstViews.getAttribute("height"))
    );
    expect(Number(firstViews.getAttribute("height"))).toBeCloseTo(
      Number(secondVisitors.getAttribute("height"))
    );
    expect(Number(secondVisitors.getAttribute("height")) * 2).toBeCloseTo(
      Number(secondViews.getAttribute("height"))
    );
    const bars = [firstVisitors, firstViews, secondVisitors, secondViews];
    for (let index = 1; index < bars.length; index++) {
      const previousRight =
        Number(bars[index - 1].getAttribute("x")) +
        Number(bars[index - 1].getAttribute("width"));
      expect(Number(bars[index].getAttribute("x"))).toBeGreaterThan(
        previousRight
      );
    }
  });

  it.each([
    { visitors: 0, pageviews: 0 },
    { visitors: 0, pageviews: 10 },
    { visitors: 5, pageviews: 10 },
  ])(
    "renders a single day safely with visitors=$visitors and pageviews=$pageviews",
    (counts) => {
      const html = renderResult({
        status: "ready",
        data: {
          ...emptyData,
          trend: [{ timestamp: "2026-09-07", ...counts }],
        },
      });
      const document = new DOMParser().parseFromString(html, "text/html");
      const bars = document.querySelectorAll("svg rect");
      expect(bars).toHaveLength(2);
      for (const [index, count] of [
        counts.visitors,
        counts.pageviews,
      ].entries()) {
        const bar = bars[index];
        for (const attribute of ["x", "y", "width", "height"]) {
          const value = Number(bar.getAttribute(attribute));
          expect(Number.isFinite(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
        }
        expect(Number(bar.getAttribute("width"))).toBeGreaterThan(0);
        if (count === 0) {
          expect(Number(bar.getAttribute("height"))).toBe(0);
        } else {
          expect(Number(bar.getAttribute("height"))).toBeGreaterThan(0);
        }
      }
    }
  );

  it("renders no bars and keeps the no-data message for an empty trend", () => {
    const html = renderResult({ status: "ready", data: emptyData });
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelectorAll("svg rect")).toHaveLength(0);
    const trend = document.querySelector(
      '[aria-labelledby="traffic-trend-title"]'
    );
    expect(trend?.textContent).toContain("No data available for this period.");
    expect(trend?.querySelector("table caption")?.textContent).toBe(
      "Daily traffic trend data"
    );
  });

  it.each([
    ["www.google.com", "Google"],
    ["google.co.th", "Google"],
    ["l.facebook.com", "Facebook"],
    ["www.linkedin.com", "LinkedIn"],
    ["lnkd.in", "LinkedIn"],
    ["github.com", "GitHub"],
    ["www.instagram.com", "Instagram"],
    ["t.co", "X / Twitter"],
    ["www.youtube.com", "YouTube"],
    ["www.bing.com", "Bing"],
    ["www.reddit.com", "Reddit"],
    ["duckduckgo.com", "DuckDuckGo"],
  ])("identifies %s as %s and keeps the original domain", (domain, name) => {
    const html = renderResult({
      status: "ready",
      data: {
        ...emptyData,
        referrers: [{ label: domain, visitors: 7, pageviews: 12 }],
      },
    });
    const document = new DOMParser().parseFromString(html, "text/html");
    const source = document.querySelector(
      '[aria-labelledby="referrers-title"] li'
    );
    expect(source?.querySelector("h3")?.textContent).toBe(name);
    expect(source?.textContent).toContain(domain);
    expect(source?.textContent).toContain("7 visitors");
    expect(source?.textContent).toContain("12 views");
  });

  it.each(["news.example.com", "google.com.example.com", "notfacebook.com"])(
    "preserves unfamiliar source %s without guessing a platform",
    (domain) => {
      const html = renderResult({
        status: "ready",
        data: {
          ...emptyData,
          referrers: [{ label: domain, visitors: 2, pageviews: 3 }],
        },
      });
      const document = new DOMParser().parseFromString(html, "text/html");
      const name = document.querySelector(
        '[aria-labelledby="referrers-title"] li h3'
      );
      expect(name?.textContent).toBe(domain);
    }
  );

  it.each(["", "   ", "direct", "(direct)", "unknown"])(
    "labels missing or unspecified referrer %j without inventing a source",
    (label) => {
      const html = renderResult({
        status: "ready",
        data: {
          ...emptyData,
          referrers: [{ label, visitors: 2, pageviews: 3 }],
        },
      });
      const document = new DOMParser().parseFromString(html, "text/html");
      const source = document.querySelector(
        '[aria-labelledby="referrers-title"] li'
      );
      expect(source?.querySelector("h3")?.textContent).toBe("Direct / Unknown");
      expect(source?.textContent).toContain("2 visitors");
      expect(source?.textContent).toContain("3 views");
    }
  );

  it("keeps domains and their counts separate when they belong to the same platform", () => {
    const html = renderResult({
      status: "ready",
      data: {
        ...emptyData,
        referrers: [
          { label: "facebook.com", visitors: 7, pageviews: 12 },
          { label: "l.facebook.com", visitors: 4, pageviews: 5 },
        ],
      },
    });
    const document = new DOMParser().parseFromString(html, "text/html");
    const sources = document.querySelectorAll(
      '[aria-labelledby="referrers-title"] li'
    );
    expect(sources).toHaveLength(2);
    expect(sources[0].querySelector("h3")?.textContent).toBe("Facebook");
    expect(sources[0].textContent).toContain("facebook.com");
    expect(sources[0].textContent).toContain("7 visitors");
    expect(sources[0].textContent).toContain("12 views");
    expect(sources[1].querySelector("h3")?.textContent).toBe("Facebook");
    expect(sources[1].textContent).toContain("l.facebook.com");
    expect(sources[1].textContent).toContain("4 visitors");
    expect(sources[1].textContent).toContain("5 views");
  });

  it("does not fabricate direct traffic when no referrer data is available", () => {
    const html = renderResult({ status: "ready", data: emptyData });
    const document = new DOMParser().parseFromString(html, "text/html");
    const card = document.querySelector('[aria-labelledby="referrers-title"]');
    expect(card?.querySelectorAll("li")).toHaveLength(0);
    expect(card?.textContent).toContain("No data available for this period.");
    expect(card?.textContent).not.toContain("Direct / Unknown");
  });

  it("ranks all top pages by views, breaks ties by path, and keeps the input unchanged", () => {
    const topPages = [
      { label: "/low", visitors: 50, pageviews: 1 },
      { label: "/zeta", visitors: 8, pageviews: 20 },
      { label: "/highest", visitors: 3, pageviews: 30 },
      { label: "/alpha", visitors: 2, pageviews: 20 },
      { label: "/middle", visitors: 1, pageviews: 10 },
      { label: "/sixth", visitors: 1, pageviews: 2 },
      { label: "/seventh", visitors: 1, pageviews: 3 },
    ];
    const original = structuredClone(topPages);
    const html = renderResult({
      status: "ready",
      data: { ...emptyData, topPages },
    });
    const document = new DOMParser().parseFromString(html, "text/html");
    const card = document.querySelector('[aria-labelledby="top-pages-title"]');
    const rows = card?.querySelectorAll("li");
    expect(rows).toHaveLength(7);
    expect(
      Array.from(
        rows ?? [],
        (row) => row.querySelector(".font-medium")?.textContent
      )
    ).toEqual([
      "/highest",
      "/alpha",
      "/zeta",
      "/middle",
      "/seventh",
      "/sixth",
      "/low",
    ]);
    expect(rows?.[0].textContent).toContain("30 views");
    expect(rows?.[6].textContent).toContain("1 views");
    expect(topPages).toEqual(original);
    expect(card?.querySelector("ol")?.getAttribute("tabindex")).toBe("0");
  });

  it("keeps every page in a long list available to the scrollable card", () => {
    const html = renderResult({
      status: "ready",
      data: {
        ...emptyData,
        topPages: Array.from({ length: 100 }, (_, index) => ({
          label: `/page-${index + 1}`,
          visitors: 1,
          pageviews: index + 1,
        })),
      },
    });
    const document = new DOMParser().parseFromString(html, "text/html");
    const list = document.querySelector(
      '[aria-labelledby="top-pages-title"] ol'
    );
    const rows = list?.querySelectorAll("li");
    expect(rows).toHaveLength(100);
    expect(rows?.[0].textContent).toContain("/page-100");
    expect(rows?.[99].textContent).toContain("/page-1");
    expect(list?.getAttribute("aria-label")).toBe("Top Pages list");
    expect(list?.getAttribute("tabindex")).toBe("0");
  });

  it("keeps the top-pages empty state without an empty scrolling list", () => {
    const html = renderResult({ status: "ready", data: emptyData });
    const document = new DOMParser().parseFromString(html, "text/html");
    const card = document.querySelector('[aria-labelledby="top-pages-title"]');
    expect(card?.textContent).toContain("No data available for this period.");
    expect(card?.querySelector("ol")).toBeNull();
  });
});
