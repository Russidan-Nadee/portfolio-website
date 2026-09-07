import type {
  AnalyticsBreakdown,
  AnalyticsDashboardData,
  AnalyticsResult,
  AnalyticsTrendPoint,
} from "@/lib/vercel-analytics";

const CHART_WIDTH = 640;
const CHART_BASELINE = 196;
const CHART_HEIGHT = 164;
const CHART_PADDING = 16;

function formatMetric(value: number): string {
  return value.toLocaleString("en-US");
}

function chartPoints(
  trend: AnalyticsTrendPoint[],
  metric: keyof Pick<AnalyticsTrendPoint, "pageviews" | "visitors">
): string {
  if (trend.length === 0) {
    return `${CHART_PADDING},${CHART_BASELINE} ${CHART_WIDTH - CHART_PADDING},${CHART_BASELINE}`;
  }

  const maximum = Math.max(
    1,
    ...trend.flatMap((point) => [point.pageviews, point.visitors])
  );
  const span = CHART_WIDTH - CHART_PADDING * 2;

  return trend
    .map((point, index) => {
      const x =
        trend.length === 1
          ? CHART_WIDTH / 2
          : CHART_PADDING + (index / (trend.length - 1)) * span;
      const y = CHART_BASELINE - (point[metric] / maximum) * CHART_HEIGHT;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function StatePanel({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
      aria-labelledby="analytics-state-title"
    >
      <h1
        id="analytics-state-title"
        className="text-2xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h1>
      <div
        className="mt-2 text-sm leading-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        {children}
      </div>
    </section>
  );
}

function SetupState({ missing }: Readonly<{ missing: string[] }>) {
  return (
    <StatePanel title="Setup required">
      <p>Configure the following server variables to load traffic analytics:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {missing.map((variable) => (
          <li key={variable}>
            <code>{variable}</code>
          </li>
        ))}
      </ul>
    </StatePanel>
  );
}

function UnavailableState() {
  return (
    <StatePanel title="Analytics temporarily unavailable">
      <p>
        We could not load traffic data right now. The rest of the admin area is
        still available.
      </p>
    </StatePanel>
  );
}

function SummaryCard({
  label,
  value,
}: Readonly<{ label: string; value: number }>) {
  return (
    <article
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-sm font-medium"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </p>
      <p
        className="mt-3 text-3xl font-bold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        {formatMetric(value)}
      </p>
    </article>
  );
}

function TrendCard({ data }: Readonly<{ data: AnalyticsDashboardData }>) {
  const visitorsPoints = chartPoints(data.trend, "visitors");
  const pageviewsPoints = chartPoints(data.trend, "pageviews");

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
      aria-labelledby="traffic-trend-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="traffic-trend-title"
            className="text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Traffic trend
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {data.since} – {data.until}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-4 text-xs"
          style={{ color: "var(--muted-foreground)" }}
          aria-label="Traffic trend legend"
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--foreground)" }}
              aria-hidden="true"
            />
            Visitors series
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--muted-foreground)" }}
              aria-hidden="true"
            />
            Page views series
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          className="h-auto min-w-[32rem] w-full"
          viewBox={`0 0 ${CHART_WIDTH} 220`}
          role="img"
          aria-label="Daily traffic trend chart"
          aria-describedby="traffic-trend-data"
        >
          <title>Daily traffic trend</title>
          <desc>
            A line chart comparing daily visitors and page views for the last 30
            days.
          </desc>
          <line
            x1={CHART_PADDING}
            y1={CHART_BASELINE}
            x2={CHART_WIDTH - CHART_PADDING}
            y2={CHART_BASELINE}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <polyline
            points={visitorsPoints}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            aria-label="Visitors series"
          />
          <polyline
            points={pageviewsPoints}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            aria-label="Page views series"
          />
        </svg>
      </div>

      <table id="traffic-trend-data" className="sr-only">
        <caption>Daily traffic trend data</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Visitors</th>
            <th scope="col">Page views</th>
          </tr>
        </thead>
        <tbody>
          {data.trend.map((point, index) => (
            <tr key={`${point.timestamp}-${index}`}>
              <th scope="row">
                <time dateTime={point.timestamp}>{point.timestamp}</time>
              </th>
              <td>{formatMetric(point.visitors)}</td>
              <td>{formatMetric(point.pageviews)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.trend.length === 0 && (
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          No data available for this period.
        </p>
      )}
    </section>
  );
}

function BreakdownCard({
  title,
  items,
}: Readonly<{ title: string; items: AnalyticsBreakdown[] }>) {
  const titleId = `${title.toLowerCase().replaceAll(" ", "-")}-title`;

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
      aria-labelledby={titleId}
    >
      <h2
        id={titleId}
        className="text-lg font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>

      {items.length === 0 ? (
        <p
          className="mt-4 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          No data available for this period.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <span className="min-w-0">
                <span
                  className="block truncate font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.label}
                </span>
                <span
                  className="mt-1 block text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {formatMetric(item.visitors)} visitors
                </span>
              </span>
              <span
                className="shrink-0 text-right text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {formatMetric(item.pageviews)} views
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function AnalyticsDashboard({
  result,
}: Readonly<{ result: AnalyticsResult }>): React.JSX.Element {
  if (result.status === "setup") return <SetupState missing={result.missing} />;
  if (result.status === "unavailable") return <UnavailableState />;

  const { data } = result;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Dashboard
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Traffic overview · Last 30 days
          </p>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {data.since} – {data.until}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard label="Visitors" value={data.totals.visitors} />
        <SummaryCard label="Page Views" value={data.totals.pageviews} />
      </div>

      <TrendCard data={data} />

      <div className="grid gap-4 sm:grid-cols-2">
        <BreakdownCard title="Top Pages" items={data.topPages} />
        <BreakdownCard title="Countries" items={data.countries} />
        <BreakdownCard title="Referrers" items={data.referrers} />
        <BreakdownCard title="Devices" items={data.devices} />
      </div>

      <footer
        className="border-t pt-4 text-xs"
        style={{
          borderColor: "var(--border)",
          color: "var(--muted-foreground)",
        }}
      >
        Updated at <time dateTime={data.updatedAt}>{data.updatedAt}</time>
      </footer>
    </div>
  );
}

export default AnalyticsDashboard;
