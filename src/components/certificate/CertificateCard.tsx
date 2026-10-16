"use client";

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

const accents: Record<CertificateData["category"], string> = {
  development: "#6366f1",
  technology: "#0891b2",
  finance: "#d97706",
  professional: "#7c3aed",
};

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
  const accent = accents[certificate.category];
  const downloadUrl = `${certificate.pdfUrl}${certificate.pdfUrl.includes("?") ? "&" : "?"}download=${encodeURIComponent(`${certificate.slug}.pdf`)}`;

  return (
    <article
      className="certificate-card group relative flex h-full flex-col overflow-hidden rounded-3xl border"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: `0 18px 50px -32px ${accent}`,
      }}
    >
      <div
        className="relative aspect-[1.414/1] overflow-hidden p-3"
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
          className="absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow"
          style={{ backgroundColor: accent }}
        >
          {translations.categories[certificate.category]}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p
          className="mb-2 min-h-10 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: accent }}
        >
          {certificate.issuer}
        </p>
        <h2
          className="flex-1 text-xl font-bold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h2>
        <p
          aria-hidden={!date}
          className="mt-3 min-h-5 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {date && `${translations.issued} ${date}`}
        </p>

        <div
          className="mt-6 flex flex-wrap items-center gap-2 border-t pt-5"
          style={{ borderColor: "var(--border)" }}
        >
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: accent }}
          >
            <MdOpenInNew aria-hidden="true" />
            {translations.openPdf}
          </a>
          <a
            href={downloadUrl}
            download={`${certificate.slug}.pdf`}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-white/5"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <MdDownload aria-hidden="true" />
            {translations.download}
          </a>
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-sm font-semibold hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: accent }}
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
