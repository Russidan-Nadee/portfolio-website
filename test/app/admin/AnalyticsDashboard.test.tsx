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

  it("exposes every trend point to screen readers while keeping chart points finite", () => {
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

    const points = [...html.matchAll(/<polyline[^>]*points="([^"]*)"/g)].map(
      (match) => match[1]
    );
    expect(points).toHaveLength(2);
    for (const series of points) {
      for (const coordinate of series.split(" ")) {
        const [x, y] = coordinate.split(",").map(Number);
        expect(Number.isFinite(x)).toBe(true);
        expect(Number.isFinite(y)).toBe(true);
      }
    }
  });
});
