// src/app/admin/layout.tsx
import { headers } from "next/headers";
import AdminChrome from "./AdminChrome";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const email = (await headers()).get("x-admin-email");

  return <AdminChrome email={email}>{children}</AdminChrome>;
}
