"use client";

import type { CSSProperties } from "react";
import { MdDownload, MdOpenInNew, MdVerified } from "react-icons/md";
import {
  formatCertificateDate,
  getLocalizedCertificateTitle,
} from "@/features/certificates/certificate";
import type {
  CertificateData,
  Locale,
  PublishedCertificateData,
} from "@/features/certificates/types";

// Use the issuing institution's colors independently of the course category.
const issuerThemes = [
  {
    pattern: /future\s*skill/i,
    accent: "#842cdd",
    onAccent: "#ffffff",
  },
  {
    pattern:
      /ตลาดหลักทรัพย์แห่งประเทศไทย|stock\s+exchange\s+of\s+thailand|^set(?:\s+e-?learning)?$/i,
    accent: "#fcb034",
    onAccent: "#181b22",
  },
  {
    pattern:
      /มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ|\bkmutnb\b|king\s+mongkut['’]?s\s+university\s+of\s+technology\s+north\s+bangkok|^มจพ\.?$/i,
    accent: "#ac3520",
    onAccent: "#ffffff",
  },
];

const defaultIssuerTheme = { accent: "#64748b", onAccent: "#ffffff" };

export interface CertificateCardTranslations {
  issued: string;
  openPdf: string;
  download: string;
  verify: string;
  categories: Record<CertificateData["category"], string>;
}

export default function CertificateCard({
  certificate,
  locale,
  translations,
}: Readonly<{
  certificate: PublishedCertificateData;
  locale: Locale;
  translations: CertificateCardTranslations;
}>) {
  const title = getLocalizedCertificateTitle(certificate.title, locale);
  const date = formatCertificateDate(certificate.issuedAt, locale);
  const { accent, onAccent } =
    issuerThemes.find(({ pattern }) =>
      pattern.test(certificate.issuer.trim())
    ) ?? defaultIssuerTheme;
  const accentText = `color-mix(in srgb, ${accent} 60%, var(--foreground))`;
  const downloadUrl = `${certificate.pdfUrl}${certificate.pdfUrl.includes("?") ? "&" : "?"}download=${encodeURIComponent(`${certificate.slug}.pdf`)}`;

  return (
    <article
      className="certificate-card group relative flex aspect-[1429/2000] w-full flex-col overflow-hidden rounded-lg border"
      style={
        {
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          "--certificate-accent": accent,
        } as CSSProperties
      }
    >
      <div
        className="relative min-h-0 flex-1 overflow-hidden p-3"
        style={{ backgroundColor: "var(--muted)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={certificate.imageUrl}
          alt={`${title} - ${certificate.issuer}`}
          loading="lazy"
          className="h-full w-full rounded-2xl object-contain shadow-sm transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <div
          className="absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow"
          style={{ backgroundColor: accent, color: onAccent }}
        >
          {translations.categories[certificate.category]}
        </div>
      </div>

      <div className="flex shrink-0 flex-col p-4 sm:p-5">
        <p
          className="mb-1.5 line-clamp-1 text-xs font-semibold uppercase tracking-[0.18em]"
          title={certificate.issuer}
          style={{ color: accentText }}
        >
          {certificate.issuer}
        </p>
        <h2
          className="line-clamp-2 text-lg font-bold leading-snug"
          title={title}
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h2>
        <p
          aria-hidden={!date}
          className="mt-2 min-h-5 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          {date && `${translations.issued} ${date}`}
        </p>

        <div
          className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="site-button px-3 py-2 text-xs"
            style={{ backgroundColor: accent, color: onAccent }}
          >
            <MdOpenInNew aria-hidden="true" />
            {translations.openPdf}
          </a>
          <a
            href={downloadUrl}
            download={`${certificate.slug}.pdf`}
            className="site-button site-button--secondary px-3 py-2 text-xs"
            style={{
              backgroundColor: `color-mix(in srgb, ${accent} 12%, var(--card))`,
              color: accentText,
            }}
          >
            <MdDownload aria-hidden="true" />
            {translations.download}
          </a>
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: accentText }}
            >
              <MdVerified aria-hidden="true" />
              {translations.verify}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
