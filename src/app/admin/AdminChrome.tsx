// src/app/admin/AdminChrome.tsx
"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Resume", href: "/admin/resume" },
];

function NavigationLabel({ label }: Readonly<{ label: string }>) {
  const { pending } = useLinkStatus();
  return (
    <span
      className="flex items-center justify-between gap-2"
      aria-busy={pending}
    >
      {label}
      {pending && (
        <>
          <span
            aria-hidden="true"
            className="size-3 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
          />
          <span className="sr-only" role="status">
            Opening {label}…
          </span>
        </>
      )}
    </span>
  );
}

export default function AdminChrome({
  email,
  children,
}: Readonly<{
  email: string | null;
  children: React.ReactNode;
}>) {
  const pathname = usePathname().replace(/\/$/, "");

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "var(--background)" }}
    >
      <aside
        className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r p-4 md:p-6 flex flex-col"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="font-bold text-lg mb-8"
          style={{ color: "var(--foreground)" }}
        >
          Admin
        </div>
        <nav
          aria-label="Admin navigation"
          className="flex flex-wrap md:flex-col gap-1"
        >
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
                style={{
                  color: active
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  backgroundColor: active ? "var(--muted)" : undefined,
                }}
              >
                <NavigationLabel label={item.label} />
              </Link>
            );
          })}
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
              className="site-button site-button--secondary w-full text-left px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity justify-start"
              style={{ color: "var(--muted-foreground)" }}
            >
              Log Out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
