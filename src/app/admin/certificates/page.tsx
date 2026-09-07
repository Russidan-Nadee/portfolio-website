import { prisma } from "@/lib/prisma";
import type {
  CertificateData,
  LocalizedText,
} from "@/features/certificates/types";
import CertificatesBoard from "./CertificatesBoard";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { order: "asc" },
  });

  const items: CertificateData[] = certificates.map((certificate) => ({
    id: certificate.id,
    slug: certificate.slug,
    order: certificate.order,
    title: certificate.title as unknown as LocalizedText,
    issuer: certificate.issuer,
    issuedAt: certificate.issuedAt?.toISOString().slice(0, 10) ?? null,
    category: certificate.category as CertificateData["category"],
    imageUrl: certificate.imageUrl,
    pdfUrl: certificate.pdfUrl,
    credentialUrl: certificate.credentialUrl,
    active: certificate.active,
  }));

  return <CertificatesBoard initialItems={items} />;
}
