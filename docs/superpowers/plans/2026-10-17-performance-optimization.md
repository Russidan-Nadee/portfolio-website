# Portfolio performance optimization plan

**Goal:** Implement the actionable findings in `docs/performance-audit-2026-10-17.md`, preserve the current design and behavior, and report measured before/after effects for each relevant navigation or interaction.

**Architecture:** Keep page data fetching in server components and visual effects in the smallest client subtree possible. Reduce unnecessary database fields, image transfer, hydration gaps, timers, animation work, and font preloads. Cache public data only with complete invalidation; retain security checks for admin pages.

**Stack:** Next.js 16 App Router, React, TypeScript, Prisma, CSS modules, PowerShell/Node for local production measurement.

**Existing work:** Preserve the current uncommitted `src/app/about/AboutContent.tsx` Link change and the audit document. No new unit-test code until the user reviews the proposed test cases under AGENTS.md.

## Task 1 — Establish comparable measurements

**Files:** `docs/performance-audit-2026-10-17.md`, measurement notes appended after work.

1. Use the existing production baseline for route response times and raw asset/query sizes.
2. Capture browser navigation/interaction timings on the same machine, viewport, cache state, and build where practical. Distinguish click-to-content from server TTFB and distinguish network bytes from elapsed milliseconds.
3. For changes affecting only idle CPU, count renders/timers or profile CPU; do not claim navigation milliseconds.

## Task 2 — Portfolio and project detail

**Files:** `src/app/portfolio/**`, `src/components/portfolio/**`, related portfolio styles.

1. Stop the reveal timer/re-render loop; clean up all timers and preserve filter/locale behavior.
2. Remove page-wide React renders from pointer and scroll effects where possible.
3. Render useful listing HTML on the server response without waiting for hydration.
4. Project only fields needed by listing cards; retain detail queries and ordering.
5. Use responsive optimized images for listing, overview, and gallery with correct priority/lazy behavior, dimensions, and fallback. Verify local and remote URLs.

## Task 3 — Home animations and images

**Files:** `src/app/HomeContent.tsx`, `src/app/HomeContent.module.css`, `src/components/home/**`.

1. Pause or unmount carousel and icon animations when offscreen; respect reduced motion.
2. Defer below-the-fold icon/image work while preserving the visible hero.
3. Profile scroll layout/paint and iframe network requests; alter the duplicate desktop/mobile mount and scroll effects only when the measurements support it.

## Task 4 — About and Contact

**Files:** `src/app/about/**`, `src/components/about/**`, `src/app/contact/**`, `src/components/contact/**`.

1. Render Contact content in initial HTML.
2. Optimize the About profile photo and defer below-the-fold skill icons.
3. Limit timeline/hover updates to animation frames or DOM variables instead of page-wide React renders.
4. Scope GSAP cleanup to triggers owned by each component; preserve all timeline and skill animations.

## Task 5 — Fonts, server data, and admin

**Files:** root layout/page, font setup, public data helpers, admin mutation actions, and admin dashboard/analytics only where measurement supports a change.

1. Reduce unnecessary font preloads without changing EN/TH/JA text rendering.
2. Measure public route queries, then add safe caching only with complete Skill/Project/Certificate invalidation across locale rewrites and slug changes.
3. Check production Link prefetch behavior before changing it; preserve fast navigation.
4. Measure admin analytics/auth request cost before modifying security-sensitive logic. Keep authorization checks.
5. Verify references before removing any unused public asset; treat deploy size separately from browser latency.

## Task 6 — Integration and verification

1. Review parallel changes for behavior and overlap; do not overwrite another worker's edits.
2. Run typecheck, lint, existing tests, and production build. Add or update unit tests only after user review of the test matrix.
3. Measure the same routes and interactions after the production build; report medians, sample counts, and variability alongside each delta.
4. Update the audit with implemented, measured, inconclusive, and deferred findings. Explain which button or route each result affects. Never convert bytes or expected CPU savings into an invented millisecond figure.
