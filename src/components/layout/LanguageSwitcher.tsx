// src/components/layout/LanguageSwitcher.tsx
"use client";

import { localeFromPath, localizedDestination } from "@/lib/locale-path";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GB, TH, JP } from "country-flag-icons/react/3x2";

export default function LanguageSwitcher({
  placement = "bottom",
}: {
  placement?: "top" | "bottom";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = localeFromPath(pathname);

  useEffect(() => {
    localStorage.setItem("lang", currentLocale);
    window.dispatchEvent(
      new CustomEvent("languageChange", {
        detail: { language: currentLocale },
      })
    );
  }, [currentLocale]);

  const switchLanguage = (newLocale: string) => {
    // Save to localStorage
    localStorage.setItem("lang", newLocale);
    router.push(
      localizedDestination(
        pathname,
        newLocale,
        window.location.search,
        window.location.hash
      )
    );

    setIsOpen(false);
  };

  // Language configuration with names and flags
  const locales = [
    { code: "en", name: "English", Flag: GB, nativeName: "English" },
    { code: "th", name: "Thai", Flag: TH, nativeName: "ไทย" },
    { code: "ja", name: "Japanese", Flag: JP, nativeName: "日本語" },
  ];

  // Get current language info
  const getCurrentLanguage = () => {
    const current = locales.find((locale) => locale.code === currentLocale);
    return current || locales[0]; // fallback to English
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-[var(--button-radius)] hover:opacity-70 transition-all duration-200"
        style={{
          color: "var(--foreground)",
          backgroundColor: isOpen ? "var(--muted)" : "transparent",
        }}
        aria-label={`Current language: ${currentLanguage.nativeName}. Click to change language.`}
      >
        <currentLanguage.Flag
          title={currentLanguage.name}
          className="w-5 h-[15px] rounded-sm object-cover"
        />
        <span className="text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 w-48 overflow-y-auto overscroll-contain border rounded-[var(--button-radius)] shadow-lg z-20 ${
              placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              maxHeight: "min(16rem, calc(100dvh - 2rem))",
            }}
          >
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => switchLanguage(locale.code)}
                  className={`w-full px-4 py-3 text-left hover:opacity-80 flex items-center gap-3 transition-all duration-200 ${
                    currentLocale === locale.code
                      ? "font-medium"
                      : "font-normal"
                  }`}
                  style={{
                    color: "var(--foreground)",
                    backgroundColor:
                      currentLocale === locale.code
                        ? "var(--muted)"
                        : "transparent",
                  }}
                  aria-label={`Switch to ${locale.nativeName}`}
                >
                  <locale.Flag
                    title={locale.name}
                    className="w-5 h-[15px] rounded-sm object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{locale.nativeName}</span>
                    <span className="text-xs opacity-60">{locale.name}</span>
                  </div>
                  {currentLocale === locale.code && (
                    <span className="ml-auto text-xs opacity-60">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
