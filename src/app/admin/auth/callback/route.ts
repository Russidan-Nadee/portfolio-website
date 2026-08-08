// src/app/admin/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerAuthClient } from "@/lib/supabase-auth-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerAuthClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Only one Google account is allowed in — anyone else who completes
      // OAuth gets signed back out immediately rather than reaching /admin.
      if (data.user.email !== process.env.ADMIN_EMAIL) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/admin/login/?error=unauthorized`
        );
      }
      return NextResponse.redirect(`${origin}/admin/`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login/?error=auth`);
}
