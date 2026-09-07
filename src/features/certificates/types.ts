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
  imageUrl: string | null;
  pdfUrl: string | null;
  credentialUrl: string | null;
  active: boolean;
}

export interface PublishedCertificateData extends CertificateData {
  imageUrl: string;
  pdfUrl: string;
  active: true;
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
