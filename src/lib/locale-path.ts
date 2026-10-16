export const locales = ["en", "th", "ja"] as const;
export type Locale = (typeof locales)[number];

export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return locales.find((locale) => locale === segment) ?? "en";
}

export function localizedPath(path: string, locale: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const withoutLocale = cleanPath.replace(/^\/(en|th|ja)(?=\/|$)/, "");
  return `/${locale}${withoutLocale === "/" || withoutLocale === "" ? "" : withoutLocale}`;
}

export function localizedDestination(
  pathname: string,
  locale: string,
  search = "",
  hash = ""
): string {
  return `${localizedPath(pathname, locale)}${search}${hash}`;
}
