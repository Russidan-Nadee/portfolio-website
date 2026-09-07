"use client";

import { Analytics } from "@vercel/analytics/next";
import { shouldTrackAnalyticsUrl } from "../../lib/analytics-path";

export default function SiteAnalytics(): React.JSX.Element {
  return (
    <Analytics
      beforeSend={(event) =>
        shouldTrackAnalyticsUrl(event.url) ? event : null
      }
    />
  );
}
