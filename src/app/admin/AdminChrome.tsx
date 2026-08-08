// src/app/admin/AdminChrome.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const navItems = [
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Projects", href: "/admin/projects" },
];

export default function AdminChrome({
  email,
  children,
}: Readonly<{
  email: string | null;
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--background)" }}
    >
      <aside
        className="w-56 shrink-0 border-r p-6 flex flex-col"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="font-bold text-lg mb-8"
          style={{ color: "var(--foreground)" }}
        >
          Admin
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="mt-auto pt-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {email && (
            <div
              className="text-xs mb-3 truncate"
              style={{ color: "var(--muted-foreground)" }}
            >
              {email}
            </div>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}
            >
              Log Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
