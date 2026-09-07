import {
  CERTIFICATE_CATEGORIES,
  type CertificateAssetKind,
  type CertificateAssetMetadata,
  type CertificateCategory,
  type CertificateInput,
  type Locale,
  type LocalizedText,
} from "./types";

const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function requirePublicUrl(value: string, fieldName: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
    return value;
  } catch {
    throw new Error(`${fieldName} must be a valid public URL`);
  }
}

function parseIssuedAt(value: string): Date | null {
  if (!value) return null;
  if (!DATE_PATTERN.test(value)) {
    throw new Error("Issue date must use YYYY-MM-DD");
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Issue date must use a valid YYYY-MM-DD date");
  }
  return date;
}

function isCertificateCategory(value: string): value is CertificateCategory {
  return CERTIFICATE_CATEGORIES.some((category) => category === value);
}

export function parseCertificateFormData(formData: FormData): CertificateInput {
  const slug = getString(formData, "slug");
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Slug must contain lowercase letters, numbers, and hyphens only"
    );
  }

  const title = {
    th: getString(formData, "title-th"),
    en: getString(formData, "title-en"),
    ja: getString(formData, "title-ja"),
  };
  if (!title.th || !title.en || !title.ja) {
    throw new Error("Title is required for th, en, and ja");
  }

  const issuer = getString(formData, "issuer");
  if (!issuer) throw new Error("Issuer is required");

  const category = getString(formData, "category");
  if (!isCertificateCategory(category)) {
    throw new Error("Select a valid certificate category");
  }

  const imageUrl = requirePublicUrl(
    getString(formData, "imageUrl"),
    "Preview URL"
  );
  const pdfUrl = requirePublicUrl(getString(formData, "pdfUrl"), "PDF URL");
  const credentialValue = getString(formData, "credentialUrl");

  return {
    slug,
    title,
    issuer,
    issuedAt: parseIssuedAt(getString(formData, "issuedAt")),
    category,
    imageUrl,
    pdfUrl,
    credentialUrl: credentialValue
      ? requirePublicUrl(credentialValue, "Credential URL")
      : null,
    active: formData.get("active") === "on",
  };
}

export function validateCertificateAsset(
  file: CertificateAssetMetadata,
  kind: CertificateAssetKind
): void {
  const allowedTypes =
    kind === "pdf"
      ? ["application/pdf"]
      : ["image/png", "image/jpeg", "image/webp"];
  const sizeLimit = kind === "pdf" ? 15 * 1024 * 1024 : 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      kind === "pdf" ? "Select a PDF file" : "Select a PNG, JPEG, or WebP image"
    );
  }
  if (file.size > sizeLimit) {
    throw new Error(
      `${kind === "pdf" ? "PDF" : "Preview"} must be ${kind === "pdf" ? 15 : 5} MB or smaller`
    );
  }
}

export function getLocalizedCertificateTitle(
  title: LocalizedText,
  locale: Locale
): string {
  return (
    title[locale].trim() ||
    title.en.trim() ||
    title.th.trim() ||
    title.ja.trim()
  );
}

export function buildCertificateAssetPath(
  slug: string,
  kind: CertificateAssetKind
): string {
  if (!SAFE_SLUG_PATTERN.test(slug)) {
    throw new Error(
      "Slug must contain lowercase letters, numbers, and hyphens only"
    );
  }
  return `certificates/${slug}/${kind === "pdf" ? "certificate.pdf" : "preview"}`;
}

export function formatCertificateDate(
  issuedAt: Date | string | null,
  locale: Locale
): string {
  if (!issuedAt) return "";
  const date = issuedAt instanceof Date ? issuedAt : new Date(issuedAt);
  const localeName = { en: "en-US", th: "th-TH", ja: "ja-JP" }[locale];
  return new Intl.DateTimeFormat(localeName, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function assertCertificateSlugAvailable(
  existingRecordId: string | null,
  currentRecordId: string | null
): void {
  if (existingRecordId && existingRecordId !== currentRecordId) {
    throw new Error("Slug is already in use by another certificate");
  }
}
