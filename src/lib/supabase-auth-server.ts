// src/lib/supabase-auth-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-based Supabase client for Server Components/Actions — carries the
// signed-in admin's session. Separate from src/lib/supabase-server.ts, which
// uses the service_role key for Storage uploads and has no user session.
export async function createSupabaseServerAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — middleware refreshes
            // the session cookie on the next request instead.
          }
        },
      },
    }
  );
}
