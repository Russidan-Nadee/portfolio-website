// src/app/admin/layout.tsx
import { createSupabaseServerAuthClient } from "@/lib/supabase-auth-server";
import AdminChrome from "./AdminChrome";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminChrome email={user?.email ?? null}>{children}</AdminChrome>;
}
