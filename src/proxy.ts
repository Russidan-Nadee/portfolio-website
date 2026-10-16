// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales } from "./lib/locale-path";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    /\.[^/]+$/.test(pathname) &&
    !/^\/(?:en\/|th\/|ja\/)?portfolio\//.test(pathname)
  ) {
    return NextResponse.next();
  }
  if (!pathname.startsWith("/admin/") && pathname !== "/admin") {
    const segment = pathname.split("/")[1];
    if (!locales.some((locale) => locale === segment)) {
      const url = request.nextUrl.clone();
      url.pathname = `/en${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
    if (/^\/(en|th|ja)\/admin(?:\/|$)/.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/(en|th|ja)/, "");
      return NextResponse.redirect(url);
    }
    const headers = new Headers(request.headers);
    headers.set("x-site-locale", segment);
    headers.set("x-site-pathname", pathname);
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(en|th|ja)(?=\/|$)/, "") || "/";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session if expired — required for Server Components, which
  // can't write cookies themselves.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // next.config.ts sets trailingSlash: true, so real requests arrive as
  // "/admin/login/" — normalize before comparing.
  const adminPathname = request.nextUrl.pathname.replace(/\/$/, "");
  const isLoginPage = adminPathname === "/admin/login";
  const isAuthCallback = adminPathname === "/admin/auth/callback";

  // Only one Google account is allowed in. A session for anyone else is
  // treated as unauthenticated (and cleared) rather than granted access.
  const isAuthorized = !!user && user.email === process.env.ADMIN_EMAIL;
  if (user && !isAuthorized) {
    await supabase.auth.signOut();
  }

  if (isAuthCallback) {
    return response;
  }

  if (!isLoginPage && !isAuthorized) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login/";
    return NextResponse.redirect(url);
  }

  if (isLoginPage && isAuthorized) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next).*)"],
};
