import { NextRequest } from "next/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

type Cookie = {
  name: string;
  value: string;
  options?: { path?: string; httpOnly?: boolean };
};
const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  signOut: vi.fn(),
  setCookies: undefined as ((cookies: Cookie[]) => void) | undefined,
  requestHeaders: new Headers(),
}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(
    (
      _url: string,
      _key: string,
      options: { cookies: { setAll: (cookies: Cookie[]) => void } }
    ) => {
      auth.setCookies = options.cookies.setAll;
      return { auth: { getUser: auth.getUser, signOut: auth.signOut } };
    }
  ),
}));
vi.mock("next/headers", () => ({ headers: async () => auth.requestHeaders }));
vi.mock("../../../src/app/admin/AdminChrome", () => ({ default: () => null }));
vi.mock("@/lib/supabase-auth-server", () => ({
  createSupabaseServerAuthClient: async () => ({
    auth: { getUser: auth.getUser },
  }),
}));

import { proxy } from "../../../src/proxy";
import AdminLayout from "../../../src/app/admin/layout";

describe("admin authentication forwarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key");
    auth.getUser.mockResolvedValue({ data: { user: null } });
    auth.signOut.mockResolvedValue({ error: null });
    auth.requestHeaders = new Headers();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("checks the admin once and reuses the verified email in the layout", async () => {
    auth.getUser.mockResolvedValue({
      data: { user: { email: "admin@example.com" } },
    });
    const response = await proxy(
      new NextRequest("https://example.com/admin/projects/", {
        headers: { "x-admin-email": "spoofed@example.com" },
      })
    );
    const verified = response.headers.get("x-middleware-request-x-admin-email");
    expect(verified).toBe("admin@example.com");
    auth.requestHeaders.set("x-admin-email", verified!);
    const layout = await AdminLayout({ children: "projects" });
    expect(layout.props.email).toBe("admin@example.com");
    expect(auth.getUser).toHaveBeenCalledTimes(1);
    expect(response.headers.get("x-admin-email")).toBeNull();
  });

  it("does not accept a forged email without an authenticated user", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/admin/projects/", {
        headers: { "x-admin-email": "admin@example.com" },
      })
    );
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/login/"
    );
  });

  it("clears forged headers on login and callback requests", async () => {
    for (const path of ["login/", "auth/callback/"]) {
      const response = await proxy(
        new NextRequest(`https://example.com/admin/${path}`, {
          headers: { "x-admin-email": "admin@example.com" },
        })
      );
      expect(
        response.headers.get("x-middleware-request-x-admin-email")
      ).toBeNull();
    }
  });

  it("signs out an authenticated account that is not the configured admin", async () => {
    auth.getUser.mockResolvedValue({
      data: { user: { email: "other@example.com" } },
    });
    const response = await proxy(
      new NextRequest("https://example.com/admin/skills/")
    );
    expect(auth.signOut).toHaveBeenCalledTimes(1);
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/login/"
    );
  });

  it("still authenticates admin paths containing a dot", async () => {
    const response = await proxy(
      new NextRequest("https://example.com/admin/projects/release.v2")
    );
    expect(auth.getUser).toHaveBeenCalledTimes(1);
    expect(
      new URL(response.headers.get("location")!).pathname.replace(/\/$/, "")
    ).toBe("/admin/login");
  });

  it("preserves refreshed cookies in both the forwarded request and response", async () => {
    auth.getUser.mockImplementation(async () => {
      auth.setCookies?.([
        {
          name: "sb-test",
          value: "refreshed",
          options: { path: "/", httpOnly: true },
        },
      ]);
      return { data: { user: { email: "admin@example.com" } } };
    });
    const response = await proxy(
      new NextRequest("https://example.com/admin/projects/")
    );
    expect(response.cookies.get("sb-test")?.value).toBe("refreshed");
    expect(response.headers.get("x-middleware-request-cookie")).toContain(
      "sb-test=refreshed"
    );
  });

  it("keeps refreshed cookies when redirecting a signed-in admin away from login", async () => {
    auth.getUser.mockImplementation(async () => {
      auth.setCookies?.([
        { name: "sb-test", value: "refreshed", options: { path: "/" } },
      ]);
      return { data: { user: { email: "admin@example.com" } } };
    });
    const response = await proxy(
      new NextRequest("https://example.com/admin/login/")
    );
    expect(response.headers.get("location")).toBe("https://example.com/admin/");
    expect(response.cookies.get("sb-test")?.value).toBe("refreshed");
  });
});
