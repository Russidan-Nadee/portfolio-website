import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test, vi } from "vitest";
import { loadVercelAnalytics } from "../../src/lib/vercel-analytics";

const now = new Date("2026-09-07T12:00:00.000Z");

test("keeps the analytics credential boundary in the server-only module", () => {
  const source = readFileSync(
    resolve(process.cwd(), "src/lib/vercel-analytics.ts"),
    "utf8"
  );

  assert.match(source, /^import "server-only";/);
});

function responseFor(input: RequestInfo | URL): Response {
  const url = new URL(String(input));
  const data = url.pathname.endsWith("/count")
    ? { pageviews: 0, visitors: 0 }
    : [];

  return new Response(JSON.stringify({ version: 1, data }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function createFetcher(requests: Request[]) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(new Request(input, init));
    return responseFor(input);
  };
}

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function documentedCountResponse(
  pageviews: number,
  visitors: number
): Response {
  return jsonResponse({
    version: 1,
    query: {},
    data: { pageviews, visitors },
  });
}

function documentedAggregateResponse(
  groupBy: string,
  data: unknown[],
  limit?: number
): Response {
  return jsonResponse({
    version: 1,
    query: {
      since: "2026-08-09",
      until: "2026-09-07",
      groupBy: [groupBy],
      ...(limit ? { limit } : {}),
    },
    data,
  });
}

function createResponseSequenceFetcher(
  responses: Response[],
  requests: Request[] = []
) {
  let index = 0;
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    requests.push(new Request(input, init));
    const response = responses[index];
    index += 1;
    if (!response) throw new Error("fixture exhausted");
    return response;
  };
  return { fetcher, requests };
}

function validResponses(): Response[] {
  return [
    documentedCountResponse(1250, 980),
    documentedAggregateResponse("day", [
      {
        timestamp: "2026-09-01T00:00:00.000Z",
        pageviews: 220,
        visitors: 180,
      },
      {
        timestamp: "2026-09-02T00:00:00.000Z",
        pageviews: 245,
        visitors: 201,
      },
    ]),
    documentedAggregateResponse(
      "requestPath",
      [{ requestPath: "/portfolio", pageviews: 640, visitors: 510 }],
      100
    ),
    documentedAggregateResponse(
      "country",
      [{ country: "US", pageviews: 180, visitors: 150 }],
      5
    ),
    documentedAggregateResponse(
      "referrerHostname",
      [
        {
          referrerHostname: "news.ycombinator.com",
          pageviews: 90,
          visitors: 75,
        },
      ],
      5
    ),
    documentedAggregateResponse(
      "deviceType",
      [{ deviceType: "desktop", pageviews: 80, visitors: 70 }],
      5
    ),
  ];
}

test("returns setup for missing configuration without fetching", async () => {
  const requests: Request[] = [];

  const result = await loadVercelAnalytics({
    env: {},
    fetcher: createFetcher(requests),
    now,
  });

  assert.deepEqual(result, {
    status: "setup",
    missing: ["VERCEL_ACCESS_TOKEN", "VERCEL_PROJECT_ID"],
  });
  assert.equal(requests.length, 0);
});

test("builds personal-project requests without a team id", async () => {
  const requests: Request[] = [];

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher: createFetcher(requests),
    now,
  });

  assert.equal(result.status, "ready");
  assert.equal(requests.length, 6);
  assert.deepEqual(
    requests.map((request) => new URL(request.url).pathname),
    [
      "/v1/query/web-analytics/visits/count",
      "/v1/query/web-analytics/visits/aggregate",
      "/v1/query/web-analytics/visits/aggregate",
      "/v1/query/web-analytics/visits/aggregate",
      "/v1/query/web-analytics/visits/aggregate",
      "/v1/query/web-analytics/visits/aggregate",
    ]
  );
  assert.deepEqual(
    requests.map((request) => {
      const url = new URL(request.url);
      return [url.searchParams.get("by"), url.searchParams.get("limit")];
    }),
    [
      [null, null],
      ["day", null],
      ["requestPath", "100"],
      ["country", "5"],
      ["referrerHostname", "5"],
      ["deviceType", "5"],
    ]
  );

  for (const request of requests) {
    const url = new URL(request.url);
    assert.equal(url.searchParams.get("since"), "2026-08-09");
    assert.equal(url.searchParams.get("until"), "2026-09-07");
    assert.equal(url.searchParams.get("projectId"), "prj_123");
    assert.equal(url.searchParams.has("teamId"), false);
    assert.equal(request.headers.get("authorization"), "Bearer secret");
    assert.equal(request.cache, "no-store");
  }
});

test("builds team-project requests with the configured team id", async () => {
  const requests: Request[] = [];

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
      VERCEL_TEAM_ID: "team_456",
    },
    fetcher: createFetcher(requests),
    now,
  });

  assert.equal(result.status, "ready");
  assert.equal(requests.length, 6);

  for (const request of requests) {
    const url = new URL(request.url);
    assert.equal(url.searchParams.get("teamId"), "team_456");
  }
});

test("maps documented responses into dashboard data", async () => {
  const { fetcher } = createResponseSequenceFetcher(validResponses());

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher,
    now,
  });

  assert.deepEqual(result, {
    status: "ready",
    data: {
      totals: { pageviews: 1250, visitors: 980 },
      trend: [
        {
          timestamp: "2026-09-01T00:00:00.000Z",
          pageviews: 220,
          visitors: 180,
        },
        {
          timestamp: "2026-09-02T00:00:00.000Z",
          pageviews: 245,
          visitors: 201,
        },
      ],
      topPages: [{ label: "/portfolio", pageviews: 640, visitors: 510 }],
      countries: [{ label: "US", pageviews: 180, visitors: 150 }],
      referrers: [
        {
          label: "news.ycombinator.com",
          pageviews: 90,
          visitors: 75,
        },
      ],
      devices: [{ label: "desktop", pageviews: 80, visitors: 70 }],
      since: "2026-08-09",
      until: "2026-09-07",
      updatedAt: "2026-09-07T12:00:00.000Z",
    },
  });
});

test("maps an empty response set to zero totals and empty collections", async () => {
  const { fetcher } = createResponseSequenceFetcher([
    documentedCountResponse(0, 0),
    documentedAggregateResponse("day", []),
    documentedAggregateResponse("requestPath", [], 100),
    documentedAggregateResponse("country", [], 5),
    documentedAggregateResponse("referrerHostname", [], 5),
    documentedAggregateResponse("deviceType", [], 5),
  ]);

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher,
    now,
  });

  assert.deepEqual(result, {
    status: "ready",
    data: {
      totals: { pageviews: 0, visitors: 0 },
      trend: [],
      topPages: [],
      countries: [],
      referrers: [],
      devices: [],
      since: "2026-08-09",
      until: "2026-09-07",
      updatedAt: "2026-09-07T12:00:00.000Z",
    },
  });
});

test("returns unavailable for a non-2xx response", async () => {
  const responses = validResponses();
  responses[3] = jsonResponse({ error: { code: "forbidden" } }, 403);
  const { fetcher } = createResponseSequenceFetcher(responses);

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher,
    now,
  });

  assert.deepEqual(result, { status: "unavailable" });
});

test("returns unavailable for an invalid JSON response shape", async () => {
  const responses = validResponses();
  responses[2] = jsonResponse({ version: 1, query: {}, data: { nope: true } });
  const { fetcher } = createResponseSequenceFetcher(responses);

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher,
    now,
  });

  assert.deepEqual(result, { status: "unavailable" });
});

test("returns unavailable when a request times out and honors its abort signal", async () => {
  vi.useFakeTimers();
  let abortedRequests = 0;

  const fetcher = async (
    _input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> =>
    new Promise((_, reject) => {
      const signal = init?.signal;
      if (!signal) {
        reject(new Error("missing abort signal"));
        return;
      }
      signal.addEventListener(
        "abort",
        () => {
          abortedRequests += 1;
          reject(new DOMException("The request was aborted", "AbortError"));
        },
        { once: true }
      );
    });

  try {
    const resultPromise = loadVercelAnalytics({
      env: {
        VERCEL_ACCESS_TOKEN: "secret",
        VERCEL_PROJECT_ID: "prj_123",
      },
      fetcher,
      now,
    });
    await vi.advanceTimersByTimeAsync(8_000);

    assert.deepEqual(await resultPromise, { status: "unavailable" });
    assert.equal(abortedRequests, 6);
  } finally {
    vi.useRealTimers();
  }
});

test("aborts pending requests after an immediate request failure", async () => {
  let pendingRequests = 0;
  let abortedRequests = 0;

  const fetcher = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/count")) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403,
      });
    }

    pendingRequests += 1;
    return new Promise((_, reject) => {
      const signal = init?.signal;
      if (!signal) {
        reject(new Error("missing abort signal"));
        return;
      }
      signal.addEventListener(
        "abort",
        () => {
          abortedRequests += 1;
          reject(new DOMException("The request was aborted", "AbortError"));
        },
        { once: true }
      );
    });
  };

  const result = await loadVercelAnalytics({
    env: {
      VERCEL_ACCESS_TOKEN: "secret",
      VERCEL_PROJECT_ID: "prj_123",
    },
    fetcher,
    now,
  });

  assert.deepEqual(result, { status: "unavailable" });
  assert.equal(pendingRequests, 5);
  assert.equal(abortedRequests, 5);
});

test.each([
  {
    name: "HTTP status",
    fetcher: async () =>
      jsonResponse({ error: "secret-token https://private.example" }, 403),
    expected: /403: upstream request failed/,
  },
  {
    name: "timeout",
    fetcher: async (): Promise<Response> => {
      throw new DOMException(
        "secret-token https://private.example",
        "AbortError"
      );
    },
    expected: /timeout: request timed out/,
  },
  {
    name: "network failure",
    fetcher: async (): Promise<Response> => {
      throw new TypeError("secret-token https://private.example");
    },
    expected: /network: network request failed/,
  },
  {
    name: "invalid JSON",
    fetcher: async () => new Response("secret-token https://private.example"),
    expected: /invalid-response: invalid JSON response/,
  },
  {
    name: "invalid response data",
    fetcher: async () =>
      jsonResponse({ data: "secret-token https://private.example" }),
    expected: /invalid-response: Invalid analytics totals/,
  },
  {
    name: "unexpected failure",
    fetcher: async (): Promise<Response> => {
      throw new Error("secret-token https://private.example");
    },
    expected: /unknown: request failed/,
  },
])(
  "logs $name as readable text without exposing credentials",
  async ({ fetcher, expected }) => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const result = await loadVercelAnalytics({
        env: {
          VERCEL_ACCESS_TOKEN: "secret-token",
          VERCEL_PROJECT_ID: "prj_private",
        },
        fetcher,
        now,
      });
      assert.deepEqual(result, { status: "unavailable" });
      assert.equal(errorLog.mock.calls.length, 1);
      const args = errorLog.mock.calls[0];
      assert.equal(args.length, 1);
      assert.equal(typeof args[0], "string");
      assert.match(args[0], /^\[vercel-analytics\]/);
      assert.match(args[0], expected);
      assert.doesNotMatch(args[0], /secret-token|prj_private|private\.example/);
    } finally {
      errorLog.mockRestore();
    }
  }
);
