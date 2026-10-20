import type { AnalyticsBreakdown } from "@/lib/vercel-analytics";

const SOURCES = [
  {
    name: "Google",
    domains: ["google.com", "google.co.th", "google.co.jp", "google.co.uk"],
  },
  {
    name: "Facebook",
    domains: ["facebook.com", "fb.com"],
  },
  {
    name: "LinkedIn",
    domains: ["linkedin.com", "lnkd.in"],
  },
  { name: "GitHub", domains: ["github.com"] },
  {
    name: "Instagram",
    domains: ["instagram.com"],
  },
  {
    name: "X / Twitter",
    domains: ["x.com", "twitter.com", "t.co"],
  },
  {
    name: "YouTube",
    domains: ["youtube.com", "youtu.be"],
  },
  { name: "Bing", domains: ["bing.com"] },
  { name: "Reddit", domains: ["reddit.com"] },
  {
    name: "DuckDuckGo",
    domains: ["duckduckgo.com"],
  },
];

function describeReferrer(label: string) {
  const domain = label.trim();
  const hostname = domain.toLowerCase().replace(/\.$/, "");
  if (
    ["", "direct", "(direct)", "unknown", "none", "(none)"].includes(hostname)
  ) {
    return {
      name: "Direct / Unknown",
      domain: null,
    };
  }

  const source = SOURCES.find(({ domains }) =>
    domains.some(
      (known) => hostname === known || hostname.endsWith(`.${known}`)
    )
  );

  return source ? { ...source, domain } : { name: domain, domain: null };
}

export default function ReferrersCard({
  items,
}: Readonly<{ items: AnalyticsBreakdown[] }>) {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-labelledby="referrers-title"
    >
      <h2
        id="referrers-title"
        className="text-lg font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        Referrers
      </h2>
      <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
        Where visitors came from
      </p>

      {items.length === 0 ? (
        <p
          className="mt-4 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          No data available for this period.
        </p>
      ) : (
        <ol
          className="mt-4 max-h-80 space-y-3 overflow-y-auto overscroll-contain rounded-md pr-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--foreground)]"
          aria-label="Referrers list"
          tabIndex={0}
        >
          {items.map((item, index) => {
            const source = describeReferrer(item.label);
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <h3
                    className="break-all font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {source.name}
                  </h3>
                  {source.domain && (
                    <p
                      className="mt-0.5 truncate text-xs"
                      title={source.domain}
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {source.domain}
                    </p>
                  )}
                  <p
                    className="mt-1 text-xs tabular-nums"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.visitors.toLocaleString("en-US")} visitors
                  </p>
                </div>
                <span
                  className="shrink-0 text-right text-xs tabular-nums"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {item.pageviews.toLocaleString("en-US")} views
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
