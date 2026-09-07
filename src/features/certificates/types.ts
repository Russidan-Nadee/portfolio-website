export type Locale = "th" | "en" | "ja";

export interface LocalizedText {
  th: string;
  en: string;
  ja: string;
}

export const CERTIFICATE_CATEGORIES = [
  "development",
  "technology",
  "finance",
  "professional",
] as const;

export type CertificateCategory = (typeof CERTIFICATE_CATEGORIES)[number];

export interface CertificateInput {
  slug: string;
  title: LocalizedText;
  issuer: string;
  issuedAt: Date | null;
  category: CertificateCategory;
  imageUrl: string;
  pdfUrl: string;
  credentialUrl: string | null;
  active: boolean;
}

export interface CertificateData extends Omit<CertificateInput, "issuedAt"> {
  id: string;
  order: number;
  issuedAt: string | null;
}

export interface CertificateAssetMetadata {
  name: string;
  type: string;
  size: number;
}

export type CertificateAssetKind = "pdf" | "preview";
