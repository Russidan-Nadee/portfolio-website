// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
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
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");
  const isLoginPage = pathname === "/admin/login";
  const isAuthCallback = pathname === "/admin/auth/callback";

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
  matcher: ["/admin/:path*"],
};
