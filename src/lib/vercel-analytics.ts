import "server-only";

const VERCEL_ANALYTICS_API = "https://api.vercel.com/v1/query/web-analytics";
const REQUEST_TIMEOUT_MS = 8_000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type AnalyticsEnv = Record<string, string | undefined> & {
  VERCEL_ACCESS_TOKEN?: string;
  VERCEL_PROJECT_ID?: string;
  VERCEL_TEAM_ID?: string;
};

export type AnalyticsDependencies = {
  env?: AnalyticsEnv;
  fetcher?: typeof fetch;
  now?: Date;
};

export type AnalyticsTotals = {
  pageviews: number;
  visitors: number;
};

export type AnalyticsTrendPoint = AnalyticsTotals & {
  timestamp: string;
};

export type AnalyticsBreakdown = AnalyticsTotals & {
  label: string;
};

export type AnalyticsDashboardData = {
  totals: AnalyticsTotals;
  trend: AnalyticsTrendPoint[];
  topPages: AnalyticsBreakdown[];
  countries: AnalyticsBreakdown[];
  referrers: AnalyticsBreakdown[];
  devices: AnalyticsBreakdown[];
  since: string;
  until: string;
  updatedAt: string;
};

export type AnalyticsResult =
  | { status: "ready"; data: AnalyticsDashboardData }
  | { status: "setup"; missing: string[] }
  | { status: "unavailable" };

type QuerySpec = {
  endpoint: string;
  groupBy?: string;
  limit?: number;
};

class AnalyticsHttpError extends Error {
  constructor(readonly status: number) {
    super("Vercel analytics request failed");
  }
}

const querySpecs: QuerySpec[] = [
  { endpoint: "visits/count" },
  { endpoint: "visits/aggregate", groupBy: "day" },
  { endpoint: "visits/aggregate", groupBy: "requestPath", limit: 100 },
  { endpoint: "visits/aggregate", groupBy: "country", limit: 5 },
  {
    endpoint: "visits/aggregate",
    groupBy: "referrerHostname",
    limit: 5,
  },
  { endpoint: "visits/aggregate", groupBy: "deviceType", limit: 5 },
];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function missingConfiguration(env: AnalyticsEnv): string[] {
  const missing: string[] = [];
  if (!env.VERCEL_ACCESS_TOKEN) missing.push("VERCEL_ACCESS_TOKEN");
  if (!env.VERCEL_PROJECT_ID) missing.push("VERCEL_PROJECT_ID");
  return missing;
}

function requestUrl(
  spec: QuerySpec,
  projectId: string,
  since: string,
  until: string,
  teamId?: string
): string {
  const params = new URLSearchParams({ projectId, since, until });
  if (teamId) params.set("teamId", teamId);
  if (spec.groupBy) params.set("by", spec.groupBy);
  if (spec.limit) params.set("limit", String(spec.limit));
  return `${VERCEL_ANALYTICS_API}/${spec.endpoint}?${params.toString()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function metric(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error("Invalid analytics metric");
  }
  return value;
}

function responseData(value: unknown): unknown {
  if (!isRecord(value) || !("data" in value)) {
    throw new Error("Invalid analytics response");
  }
  return value.data;
}

function parseTotals(value: unknown): AnalyticsTotals {
  const data = responseData(value);
  if (!isRecord(data)) throw new Error("Invalid analytics totals");
  return {
    pageviews: metric(data.pageviews),
    visitors: metric(data.visitors),
  };
}

function parseTrend(value: unknown): AnalyticsTrendPoint[] {
  const data = responseData(value);
  if (!Array.isArray(data)) throw new Error("Invalid analytics trend");
  return data.map((row) => {
    if (!isRecord(row) || typeof row.timestamp !== "string") {
      throw new Error("Invalid analytics trend row");
    }
    return {
      timestamp: row.timestamp,
      pageviews: metric(row.pageviews),
      visitors: metric(row.visitors),
    };
  });
}

function parseBreakdown(
  value: unknown,
  dimension: string
): AnalyticsBreakdown[] {
  const data = responseData(value);
  if (!Array.isArray(data)) throw new Error("Invalid analytics breakdown");
  return data.map((row) => {
    if (!isRecord(row) || typeof row[dimension] !== "string") {
      throw new Error("Invalid analytics breakdown row");
    }
    return {
      label: row[dimension],
      pageviews: metric(row.pageviews),
      visitors: metric(row.visitors),
    };
  });
}

function logFailure(error: unknown): void {
  let status: string | number = "unknown";
  let message = "request failed";

  if (error instanceof AnalyticsHttpError) {
    status = error.status;
    message = "upstream request failed";
  } else if (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  ) {
    status = "timeout";
    message = "request timed out";
  } else if (error instanceof SyntaxError) {
    status = "invalid-response";
    message = "invalid JSON response";
  } else if (
    error instanceof Error &&
    [
      "Invalid analytics response",
      "Invalid analytics metric",
      "Invalid analytics totals",
      "Invalid analytics trend",
      "Invalid analytics trend row",
      "Invalid analytics breakdown",
      "Invalid analytics breakdown row",
    ].includes(error.message)
  ) {
    status = "invalid-response";
    message = error.message;
  } else if (error instanceof TypeError) {
    status = "network";
    message = "network request failed";
  }

  // Keep diagnostics readable across the server-to-browser development overlay.
  // Only controlled messages are logged; upstream error text can contain secrets.
  console.error(`[vercel-analytics] ${status}: ${message}`);
}

export async function loadVercelAnalytics(
  dependencies: AnalyticsDependencies = {}
): Promise<AnalyticsResult> {
  const env = dependencies.env ?? process.env;
  const missing = missingConfiguration(env);
  if (missing.length > 0) {
    return { status: "setup", missing };
  }

  const now = dependencies.now ?? new Date();
  const until = formatDate(now);
  const since = formatDate(new Date(now.getTime() - 29 * DAY_MS));
  const fetcher = dependencies.fetcher ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const responses = await Promise.all(
      querySpecs.map((spec) =>
        fetcher(
          requestUrl(
            spec,
            env.VERCEL_PROJECT_ID as string,
            since,
            until,
            env.VERCEL_TEAM_ID
          ),
          {
            method: "GET",
            headers: { Authorization: `Bearer ${env.VERCEL_ACCESS_TOKEN}` },
            cache: "no-store",
            signal: controller.signal,
          }
        ).then((response) => {
          if (!response.ok) {
            throw new AnalyticsHttpError(response.status);
          }
          return response;
        })
      )
    );
    const payloads = await Promise.all(
      responses.map((response) => response.json() as Promise<unknown>)
    );
    const [totals, trend, topPages, countries, referrers, devices] = payloads;

    return {
      status: "ready",
      data: {
        totals: parseTotals(totals),
        trend: parseTrend(trend),
        topPages: parseBreakdown(topPages, "requestPath"),
        countries: parseBreakdown(countries, "country"),
        referrers: parseBreakdown(referrers, "referrerHostname"),
        devices: parseBreakdown(devices, "deviceType"),
        since,
        until,
        updatedAt: now.toISOString(),
      },
    };
  } catch (error) {
    controller.abort();
    logFailure(error);
    return { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
