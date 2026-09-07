export function shouldTrackAnalyticsUrl(url: string): boolean {
  const pathname = new URL(url, "https://analytics.local").pathname;
  const normalized = pathname.replace(/\/+$/, "") || "/";

  return normalized !== "/admin" && !normalized.startsWith("/admin/");
}
