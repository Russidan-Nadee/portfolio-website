import * as Flags from "country-flag-icons/react/3x2";

export default function CountryFlag({ code }: Readonly<{ code: string }>) {
  const countryCode = code.trim().toUpperCase();
  if (
    !/^[A-Z]{2}$/.test(countryCode) ||
    !Object.prototype.hasOwnProperty.call(Flags, countryCode)
  ) {
    return null;
  }

  const Flag = Flags[countryCode as keyof typeof Flags];
  return (
    <Flag
      className="h-auto w-5 shrink-0 rounded-[2px] ring-1 ring-[var(--border)]"
      aria-hidden="true"
      focusable="false"
    />
  );
}
