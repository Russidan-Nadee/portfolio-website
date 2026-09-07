import assert from "node:assert/strict";
import test from "node:test";
import { shouldTrackAnalyticsUrl } from "./analytics-path";

test("tracks public routes", () => {
  for (const url of ["/", "/portfolio/project", "https://example.com/about"]) {
    assert.equal(shouldTrackAnalyticsUrl(url), true, url);
  }
});

test("does not track admin routes", () => {
  for (const url of [
    "/admin",
    "/admin/",
    "/admin/login",
    "https://example.com/admin/login/",
  ]) {
    assert.equal(shouldTrackAnalyticsUrl(url), false, url);
  }
});
