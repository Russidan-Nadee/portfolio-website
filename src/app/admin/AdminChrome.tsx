// src/app/admin/AdminChrome.tsx
"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  CodeXml,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { logout } from "./actions";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Skills", href: "/admin/skills", icon: CodeXml },
  { label: "Experience", href: "/admin/experience", icon: BriefcaseBusiness },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Resume", href: "/admin/resume", icon: FileText },
];

function NavigationLabel({ label }: Readonly<{ label: string }>) {
  const { pending } = useLinkStatus();
  return (
    <span
      className="flex min-w-0 flex-1 items-center justify-between gap-2"
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
  const [drawer, setDrawer] = useState({ pathname, open: false });
  const sidebarRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeSidebar = useCallback(() => {
    setDrawer((current) => ({ ...current, open: false }));
  }, [setDrawer]);

  if (drawer.pathname !== pathname) {
    setDrawer({ pathname, open: false });
  }
  const mobileOpen = drawer.pathname === pathname && drawer.open;

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const toggle = openButtonRef.current;
    const media = window.matchMedia("(min-width: 768px)");
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleBreakpoint = () => {
      if (media.matches) closeSidebar();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      const first = focusable?.[0];
      const last = focusable?.[focusable.length - 1];
      if (!first || !last) return;
      const outside = !sidebarRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || outside)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    media.addEventListener("change", handleBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      media.removeEventListener("change", handleBreakpoint);
      toggle?.focus();
    };
  }, [mobileOpen, closeSidebar]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <aside
        id="admin-sidebar"
        ref={sidebarRef}
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen ? true : undefined}
        aria-labelledby="admin-sidebar-title"
        className={`fixed inset-y-0 left-0 z-[10001] flex h-full w-64 max-w-[calc(100vw-3rem)] shrink-0 flex-col border-r transition-[transform,visibility] duration-200 motion-reduce:transition-none md:visible md:static md:z-auto md:max-w-none md:translate-x-0 ${mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"}`}
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div
          className="flex h-20 shrink-0 items-center justify-between border-b px-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div
              id="admin-sidebar-title"
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Admin
            </div>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Content workspace
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeSidebar}
            aria-label="Close admin navigation"
            className="rounded-lg p-2 hover:opacity-70 md:hidden"
            style={{ color: "var(--foreground)" }}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
          <p
            className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            Workspace
          </p>
          <nav aria-label="Admin navigation" className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    color: active
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                    backgroundColor: active ? "var(--muted)" : undefined,
                  }}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                  <NavigationLabel label={item.label} />
                </Link>
              );
            })}
          </nav>
          <Link
            href="/en"
            onClick={closeSidebar}
            className="mt-6 flex items-center gap-3 border-t px-3 pt-5 text-sm transition-opacity hover:opacity-70"
            style={{
              color: "var(--muted-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <ExternalLink className="size-[18px] shrink-0" aria-hidden="true" />
            View website
          </Link>
        </div>

        <div
          className="shrink-0 border-t p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Administrator
              </p>
              {email && (
                <p
                  className="mt-1 truncate text-xs"
                  title={email}
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {email}
                </p>
              )}
            </div>
            <ThemeToggle />
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="site-button site-button--secondary w-full text-left px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity justify-start"
              style={{ color: "var(--muted-foreground)" }}
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              Log Out
            </button>
          </form>
        </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Dismiss admin navigation"
          tabIndex={-1}
          onClick={closeSidebar}
          className="fixed inset-0 z-[10000] bg-black/50 md:hidden"
        />
      )}
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden"
        inert={mobileOpen}
      >
        <div
          className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:hidden"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <button
            ref={openButtonRef}
            type="button"
            aria-label="Open admin navigation"
            aria-controls="admin-sidebar"
            aria-expanded={mobileOpen}
            onClick={() => setDrawer({ pathname, open: true })}
            className="rounded-lg p-2 hover:opacity-70"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold">Admin</span>
        </div>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
