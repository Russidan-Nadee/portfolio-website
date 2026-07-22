// src/app/admin/layout.tsx
import Link from "next/link";

const navItems = [
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--background)" }}
    >
      <aside
        className="w-56 shrink-0 border-r p-6"
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
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
