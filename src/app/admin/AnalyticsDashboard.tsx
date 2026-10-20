import { Fragment } from "react";
import CountryFlag from "./CountryFlag";
import ReferrersCard from "./ReferrersCard";
import type {
  AnalyticsBreakdown,
  AnalyticsDashboardData,
  AnalyticsResult,
} from "@/lib/vercel-analytics";

const CHART_WIDTH = 640;
const CHART_BASELINE = 196;
const CHART_HEIGHT = 164;
const CHART_LEFT = 44;
const CHART_RIGHT = 16;
const CHART_TICK_COUNT = 4;
const CHART_COLORS = {
  visitors: "#3b82f6",
  pageviews: "#8b5cf6",
};

function formatMetric(value: number): string {
  return value.toLocaleString("en-US");
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
  const largestValue = Math.max(
    1,
    ...data.trend.flatMap((point) => [point.pageviews, point.visitors])
  );
  const tickStep = Math.max(1, Math.ceil(largestValue / CHART_TICK_COUNT));
  const maximum = tickStep * CHART_TICK_COUNT;
  const slotWidth =
    (CHART_WIDTH - CHART_LEFT - CHART_RIGHT) / Math.max(1, data.trend.length);
  const barGap = Math.min(3, slotWidth * 0.1);
  const barWidth = Math.min(24, (slotWidth * 0.72 - barGap) / 2);
  const labelInterval = Math.max(1, Math.ceil(data.trend.length / 6));

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
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CHART_COLORS.visitors }}
              aria-hidden="true"
            />
            Visitors series
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CHART_COLORS.pageviews }}
              aria-hidden="true"
            />
            Page views series
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          className="h-auto min-w-[40rem] w-full"
          viewBox={`0 0 ${CHART_WIDTH} 252`}
          role="img"
          aria-label="Daily traffic trend bar chart"
          aria-describedby="traffic-trend-data"
        >
          <title>Daily traffic trend</title>
          <desc>
            A grouped bar chart comparing daily visitors and page views for the
            last 30 days. Each day has two bars using the same scale.
          </desc>
          {Array.from({ length: CHART_TICK_COUNT + 1 }, (_, index) => {
            const value = index * tickStep;
            const y =
              CHART_BASELINE - (index / CHART_TICK_COUNT) * CHART_HEIGHT;

            return (
              <Fragment key={`level-${index}`}>
                <line
                  x1={CHART_LEFT}
                  y1={y}
                  x2={CHART_WIDTH - CHART_RIGHT}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray={index === 0 ? undefined : "3 4"}
                  vectorEffect="non-scaling-stroke"
                  aria-hidden="true"
                />
                <text
                  x={CHART_LEFT - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                  aria-hidden="true"
                >
                  {value.toLocaleString("en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })}
                </text>
              </Fragment>
            );
          })}
          {data.trend.length > 0 &&
            Array.from({ length: data.trend.length + 1 }, (_, index) => (
              <line
                key={`day-boundary-${index}`}
                x1={CHART_LEFT + index * slotWidth}
                y1={CHART_BASELINE - CHART_HEIGHT}
                x2={CHART_LEFT + index * slotWidth}
                y2={CHART_BASELINE}
                stroke="var(--border)"
                strokeOpacity={index % labelInterval === 0 ? 0.8 : 0.35}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                aria-hidden="true"
              />
            ))}
          {data.trend.map((point, index) => {
            const center = CHART_LEFT + (index + 0.5) * slotWidth;
            const visitorsHeight = (point.visitors / maximum) * CHART_HEIGHT;
            const pageviewsHeight = (point.pageviews / maximum) * CHART_HEIGHT;

            return (
              <g key={`${point.timestamp}-${index}`}>
                <title>{point.timestamp.slice(0, 10)}</title>
                <rect
                  x={center - barGap / 2 - barWidth}
                  y={CHART_BASELINE - visitorsHeight}
                  width={barWidth}
                  height={visitorsHeight}
                  rx="2"
                  fill={CHART_COLORS.visitors}
                  aria-label={`Visitors: ${formatMetric(point.visitors)}`}
                >
                  <title>{`${point.timestamp.slice(0, 10)} · Visitors: ${formatMetric(point.visitors)}`}</title>
                </rect>
                <rect
                  x={center + barGap / 2}
                  y={CHART_BASELINE - pageviewsHeight}
                  width={barWidth}
                  height={pageviewsHeight}
                  rx="2"
                  fill={CHART_COLORS.pageviews}
                  aria-label={`Page views: ${formatMetric(point.pageviews)}`}
                >
                  <title>{`${point.timestamp.slice(0, 10)} · Page views: ${formatMetric(point.pageviews)}`}</title>
                </rect>
                <text
                  x={center}
                  y={CHART_BASELINE + 12}
                  transform={`rotate(-90 ${center} ${CHART_BASELINE + 12})`}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  {point.timestamp.slice(5, 10)}
                </text>
              </g>
            );
          })}
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
  showCountryFlags = false,
  scrollable = false,
}: Readonly<{
  title: string;
  items: AnalyticsBreakdown[];
  showCountryFlags?: boolean;
  scrollable?: boolean;
}>) {
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
        <ol
          className={
            scrollable
              ? "mt-4 max-h-80 space-y-3 overflow-y-auto overscroll-contain rounded-md pr-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--foreground)]"
              : "mt-4 space-y-3"
          }
          aria-label={scrollable ? `${title} list` : undefined}
          tabIndex={scrollable ? 0 : undefined}
        >
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <span className="min-w-0">
                <span
                  className="flex items-center gap-2 font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {showCountryFlags && <CountryFlag code={item.label} />}
                  <span className="truncate">{item.label}</span>
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
  const topPages = [...data.topPages].sort(
    (first, second) =>
      second.pageviews - first.pageviews ||
      first.label.localeCompare(second.label, "en")
  );

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
        <BreakdownCard title="Top Pages" items={topPages} scrollable />
        <BreakdownCard
          title="Countries"
          items={data.countries}
          showCountryFlags
          scrollable
        />
        <ReferrersCard items={data.referrers} />
        <BreakdownCard title="Devices" items={data.devices} scrollable />
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
