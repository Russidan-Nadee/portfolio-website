"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "@/lib/locale-path";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: { language: localeFromPath(pathname) },
        }),
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useInitialLocale(): Locale {
  return useContext(LocaleContext);
}
