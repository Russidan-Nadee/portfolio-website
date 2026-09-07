# Admin Traffic Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collect privacy-conscious Vercel page-view analytics for public routes and show a fresh 30-day traffic overview immediately at `/admin`.

**Architecture:** A small client wrapper installs `@vercel/analytics` and filters private admin paths before collection. A server-only service queries Vercel's count and aggregate endpoints in parallel, returning a discriminated result that the `/admin` Server Component renders as ready, setup-required, or unavailable UI.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Vercel Web Analytics API, Node's built-in test runner through `tsx`.

**Spec:** `docs/superpowers/specs/2026-09-07-admin-traffic-analytics-design.md`

## Global Constraints

- Track page views only; do not add custom events.
- Never expose `VERCEL_ACCESS_TOKEN` to client code or logs.
- Exclude `/admin` and every nested admin route from analytics collection.
- Query the latest 30 calendar days on every `/admin` page load with uncached requests.
- Do not store analytics data in Supabase.
- Keep the existing admin shell and avoid a chart-library dependency.
- Update privacy copy in Thai, English, and Japanese.

---

### Task 1: Public analytics collection and private-path filter

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/lib/analytics-path.ts`
- Create: `src/lib/analytics-path.test.ts`
- Create: `src/components/analytics/SiteAnalytics.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**

- Produces: `shouldTrackAnalyticsUrl(url: string): boolean`.
- Produces: `SiteAnalytics(): React.JSX.Element`, rendered once by the root layout.

- [ ] **Step 1: Add the test command and write the failing path-filter tests**

Add `"test": "tsx --test src/lib/*.test.ts src/app/admin/*.test.tsx"` to `scripts`. Create `src/lib/analytics-path.test.ts` with cases proving `/`, `/portfolio/project`, and an absolute public URL return `true`, while `/admin`, `/admin/`, `/admin/login`, and absolute admin URLs return `false`.

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { shouldTrackAnalyticsUrl } from "./analytics-path";

test("tracks public routes", () => {
  assert.equal(shouldTrackAnalyticsUrl("/portfolio/example"), true);
});

test("does not track admin routes", () => {
  assert.equal(
    shouldTrackAnalyticsUrl("https://example.com/admin/login/"),
    false
  );
});
```

- [ ] **Step 2: Run the path-filter tests and verify they fail**

Run: `npm.cmd test -- --test-name-pattern="track"`

Expected: FAIL because `src/lib/analytics-path.ts` does not exist.

- [ ] **Step 3: Implement the URL filter and Analytics wrapper**

Implement URL parsing with a safe local base, normalize trailing slashes, and return `false` for the normalized `/admin` prefix. `SiteAnalytics.tsx` must be a Client Component and use `beforeSend` to return either the unchanged event or `null`.

```ts
export function shouldTrackAnalyticsUrl(url: string): boolean {
  const pathname = new URL(url, "https://analytics.local").pathname;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized !== "/admin" && !normalized.startsWith("/admin/");
}
```

Install the current `@vercel/analytics` package and render `<SiteAnalytics />` once near the end of the root body.

- [ ] **Step 4: Run the path-filter tests and verify they pass**

Run: `npm.cmd test -- --test-name-pattern="track"`

Expected: all public/private URL cases PASS.

- [ ] **Step 5: Commit the collection integration**

```bash
git add package.json package-lock.json src/lib/analytics-path.ts src/lib/analytics-path.test.ts src/components/analytics/SiteAnalytics.tsx src/app/layout.tsx
git commit -m "feat: collect public page analytics"
```

### Task 2: Server-side Vercel analytics service

**Files:**

- Create: `src/lib/vercel-analytics.ts`
- Create: `src/lib/vercel-analytics.test.ts`

**Interfaces:**

- Produces: `AnalyticsDashboardData` with `totals`, `trend`, `topPages`, `countries`, `referrers`, `devices`, `since`, `until`, and `updatedAt`.
- Produces: `AnalyticsResult`, discriminated by `status: "ready" | "setup" | "unavailable"`.
- Produces: `loadVercelAnalytics(dependencies?: AnalyticsDependencies): Promise<AnalyticsResult>`.

- [ ] **Step 1: Write failing tests for configuration and request construction**

Use an injected `env`, `fetcher`, and fixed `now`. Assert that missing token/project ID returns `{ status: "setup" }` without calling fetch; personal-project URLs omit `teamId`; team-project URLs include it; every request contains `since`, `until`, and `projectId`; and the Authorization header uses the configured token.

```ts
const result = await loadVercelAnalytics({
  env: { VERCEL_ACCESS_TOKEN: "secret", VERCEL_PROJECT_ID: "prj_123" },
  fetcher,
  now: new Date("2026-09-07T12:00:00.000Z"),
});
assert.equal(result.status, "ready");
assert.equal(new URL(requests[0].url).searchParams.has("teamId"), false);
```

- [ ] **Step 2: Run the service tests and verify they fail**

Run: `npm.cmd test -- --test-name-pattern="configuration|project request"`

Expected: FAIL because the service module does not exist.

- [ ] **Step 3: Implement configuration resolution and bounded API requests**

Create six requests: `visits/count`, daily `visits/aggregate`, and four dimension aggregates for `requestPath`, `country`, `referrerHostname`, and `deviceType`. Add `since` and `until` as `YYYY-MM-DD`, `limit=5` to breakdown queries, `cache: "no-store"`, and an eight-second abort timeout. Add `teamId` only when configured.

```ts
export type AnalyticsResult =
  | { status: "ready"; data: AnalyticsDashboardData }
  | { status: "setup"; missing: string[] }
  | { status: "unavailable" };

export async function loadVercelAnalytics(
  dependencies: AnalyticsDependencies = {}
): Promise<AnalyticsResult>;
```

- [ ] **Step 4: Write failing response-mapping and failure tests**

Add tests for a valid six-response set, an empty response set, a non-2xx response, invalid JSON shape, and an aborted request. Assert exact total/trend/breakdown output for valid data, zero/empty output for empty data, and `{ status: "unavailable" }` for failure cases.

- [ ] **Step 5: Run the new service tests and verify they fail**

Run: `npm.cmd test -- --test-name-pattern="maps|empty|unavailable|timeout"`

Expected: FAIL until response validation and mapping are implemented.

- [ ] **Step 6: Implement safe response parsing and result mapping**

Validate unknown JSON before reading it. Map dimension fields to a common `{ label, pageviews, visitors }` shape, preserve daily timestamps, and catch all request/parsing errors. Log only a fixed category and safe status/message; never serialize request headers or environment values.

- [ ] **Step 7: Run all service tests and verify they pass**

Run: `npm.cmd test -- src/lib/vercel-analytics.test.ts`

Expected: configuration, personal/team URL, valid, empty, API-error, invalid-response, and timeout cases PASS.

- [ ] **Step 8: Commit the service**

```bash
git add src/lib/vercel-analytics.ts src/lib/vercel-analytics.test.ts
git commit -m "feat: query Vercel traffic analytics"
```

### Task 3: Admin traffic dashboard

**Files:**

- Create: `src/app/admin/AnalyticsDashboard.tsx`
- Create: `src/app/admin/AnalyticsDashboard.test.tsx`
- Modify: `src/app/admin/page.tsx`

**Interfaces:**

- Consumes: `AnalyticsResult` and `loadVercelAnalytics()` from `src/lib/vercel-analytics.ts`.
- Produces: `AnalyticsDashboard({ result }: { result: AnalyticsResult }): React.JSX.Element`.

- [ ] **Step 1: Write failing server-render tests for all dashboard states**

Use `renderToStaticMarkup` from `react-dom/server`. Assert that setup state lists missing variable names but no secret values, unavailable state contains `Analytics temporarily unavailable`, empty ready state contains zero totals and no-data copy, and populated ready state contains totals plus labels from each breakdown.

```tsx
const html = renderToStaticMarkup(
  <AnalyticsDashboard
    result={{ status: "setup", missing: ["VERCEL_ACCESS_TOKEN"] }}
  />
);
assert.match(html, /Setup required/);
assert.match(html, /VERCEL_ACCESS_TOKEN/);
```

- [ ] **Step 2: Run the dashboard tests and verify they fail**

Run: `npm.cmd test -- src/app/admin/AnalyticsDashboard.test.tsx`

Expected: FAIL because the dashboard component does not exist.

- [ ] **Step 3: Implement responsive cards, SVG trend chart, and state panels**

Render the two summary cards, an accessible SVG with page-view and visitor series, four top-value cards, and updated-at metadata. Use existing CSS variables and Tailwind utilities. Provide explicit empty labels and keep the SVG valid when every point is zero.

- [ ] **Step 4: Load analytics from the `/admin` Server Component**

Make `AdminHomePage` async, call `loadVercelAnalytics()`, and pass the result to `AnalyticsDashboard`. Do not add a public route handler or client-side fetch.

- [ ] **Step 5: Run dashboard and full unit tests**

Run: `npm.cmd test`

Expected: every path-filter, service, and dashboard test PASS.

- [ ] **Step 6: Commit the dashboard**

```bash
git add src/app/admin/page.tsx src/app/admin/AnalyticsDashboard.tsx src/app/admin/AnalyticsDashboard.test.tsx
git commit -m "feat: show traffic on admin dashboard"
```

### Task 4: Privacy copy, setup documentation, and final verification

**Files:**

- Modify: `locales/en.json`
- Modify: `locales/th.json`
- Modify: `locales/ja.json`
- Modify: `src/app/legal/privacy-policy/page.tsx`
- Modify: `README.md`

**Interfaces:**

- Consumes: the deployed analytics behavior and environment names from Tasks 1-3.
- Produces: accurate visitor-facing disclosure and operator setup steps.

- [ ] **Step 1: Update privacy translations and fallback copy**

Set the last-updated date to September 2026. State that Vercel Web Analytics collects anonymous aggregated page-view data, including page path, referrer, approximate country, browser, operating system, and device type, without third-party cookies. Add Vercel Web Analytics to third-party services and update the rights section so it no longer claims that no usage data exists.

- [ ] **Step 2: Document Vercel setup**

Replace the README claim that no environment variables are used. Document enabling Web Analytics in the Vercel project, setting server-only `VERCEL_ACCESS_TOKEN`, using `VERCEL_PROJECT_ID` (or enabling automatic System Environment Variables), and adding optional `VERCEL_TEAM_ID` for team-owned projects.

- [ ] **Step 3: Run formatting checks and apply formatting if needed**

Run: `npx.cmd prettier --check package.json src/lib/analytics-path.ts src/lib/analytics-path.test.ts src/lib/vercel-analytics.ts src/lib/vercel-analytics.test.ts src/components/analytics/SiteAnalytics.tsx src/app/layout.tsx src/app/admin/page.tsx src/app/admin/AnalyticsDashboard.tsx src/app/admin/AnalyticsDashboard.test.tsx src/app/legal/privacy-policy/page.tsx locales/en.json locales/th.json locales/ja.json README.md`

If it fails, run the same command with `--write`, then repeat `--check` and expect PASS.

- [ ] **Step 4: Run all unit tests**

Run: `npm.cmd test`

Expected: all approved test-matrix cases PASS.

- [ ] **Step 5: Run type-check and production build**

Run: `npm.cmd run typecheck`

Expected: exit code 0 with no TypeScript errors.

Run: `npm.cmd run build`

Expected: exit code 0 and successful Next.js production output.

- [ ] **Step 6: Inspect the final diff for secrets and scope drift**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git diff --stat HEAD~3`

Expected: only analytics, admin-dashboard, privacy, README, package, and test files are changed.

- [ ] **Step 7: Commit documentation and privacy changes**

```bash
git add locales/en.json locales/th.json locales/ja.json src/app/legal/privacy-policy/page.tsx README.md
git commit -m "docs: disclose anonymous traffic analytics"
```
