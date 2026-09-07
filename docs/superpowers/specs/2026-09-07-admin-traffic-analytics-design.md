# Admin Traffic Analytics Design

## Goal

Show a privacy-conscious 30-day traffic overview immediately after the authorized administrator signs in and lands on `/admin`.

## Scope

- Enable Vercel Web Analytics for public pages.
- Exclude `/admin` and all nested admin routes from analytics collection.
- Query Vercel Web Analytics from the server when `/admin` is opened.
- Display total visitors, total page views, a daily traffic trend, top pages, countries, referrers, and device types.
- Update the Thai, English, and Japanese privacy-policy content to accurately describe the anonymous analytics collection.
- Do not track custom events or persist analytics data in Supabase.

## Architecture

The root layout renders the Vercel Analytics component. Its `beforeSend` callback returns `null` for URLs whose pathname is `/admin` or starts with `/admin/`, preventing login and back-office traffic from entering the public-site metrics.

A server-only analytics module owns all calls to the Vercel Web Analytics API. It reads `VERCEL_ACCESS_TOKEN` and `VERCEL_PROJECT_ID`, plus optional `VERCEL_TEAM_ID`, from server environment variables. The token is sent only in the API authorization header and is never returned to a client component or embedded in browser JavaScript.

The `/admin` Server Component requests the 30-day aggregates with uncached fetches. Independent API queries run in parallel. The page converts the service result into presentation data and renders the dashboard without introducing a client-side analytics endpoint or storing a copy in the application database.

## Data Queries

The dashboard uses the Vercel `visits` dataset:

- A count query for total `pageviews` and `visitors`.
- An aggregate query grouped by `day` for the 30-day trend.
- Aggregate queries grouped by `requestPath`, `country`, `referrerHostname`, and `deviceType`, limited to the highest-volume values.

The reporting interval is the latest 30 calendar days through the current day. Data is requested again on each `/admin` page load.

## Dashboard UI

The existing `/admin` landing page becomes the traffic overview. It keeps the current admin shell and design tokens.

- Header: `Dashboard` and `Traffic overview · Last 30 days`.
- Summary cards: Visitors and Page Views.
- Trend card: an accessible in-project SVG chart comparing daily visitors and page views, with no chart-library dependency.
- Breakdown cards: Top Pages, Countries, Referrers, and Devices.
- Footer metadata: the time of the latest successful request.

The layout uses a responsive grid on wide screens and stacks cards on narrow screens. Empty breakdowns display a clear no-data state rather than an empty box.

## Error Handling

- Missing environment variables return a setup-required result listing only the missing variable names.
- API failures, invalid responses, and timeouts return an unavailable result. They do not prevent the admin shell or other admin navigation from rendering.
- Server logs may include the endpoint category and HTTP status, but never the access token or authorization header.
- A valid response with no traffic renders zero totals and no-data messages.
- Fetch requests use a bounded timeout so a slow upstream service cannot indefinitely delay the admin landing page.

## Privacy and Security

Vercel access credentials remain server-only and must not use a `NEXT_PUBLIC_` prefix. Team-owned projects provide `VERCEL_TEAM_ID`; personal projects omit it. Production must have Vercel Web Analytics enabled before the dashboard can return traffic data.

The privacy policy in all supported languages will state that the site uses Vercel Web Analytics for anonymous, aggregated traffic measurement without third-party cookies, and will describe the relevant categories of usage data.

## Testing

The approved unit-test matrix covers:

1. Personal-project requests omit `teamId`.
2. Team-project requests include the configured `teamId`.
3. Missing configuration returns setup-required state without calling Vercel.
4. API errors and timeouts return unavailable state without crashing the admin page.
5. Valid responses map totals, daily trend, and breakdown rows correctly.
6. Empty responses map to zero totals and empty collections.
7. Analytics collection rejects `/admin` and `/admin/login` while accepting public paths.

The implementation will also be checked with the repository type-check and production build commands.

## Out of Scope

- Custom click or conversion events.
- A date-range picker or manual refresh control.
- Long-term analytics storage in Supabase.
- Speed Insights, error monitoring, or session replay.
- A separate `/admin/analytics` route.
