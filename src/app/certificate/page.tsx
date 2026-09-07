import type {
  CertificateData,
  LocalizedText,
} from "@/features/certificates/types";
import { prisma } from "@/lib/prisma";
import CertificateContent from "./CertificateContent";

export const dynamic = "force-dynamic";

async function loadCertificates(): Promise<{
  certificates: CertificateData[];
  unavailable: boolean;
}> {
  try {
    const records = await prisma.certificate.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    const certificates: CertificateData[] = records.map((certificate) => ({
      id: certificate.id,
      slug: certificate.slug,
      order: certificate.order,
      title: certificate.title as unknown as LocalizedText,
      issuer: certificate.issuer,
      issuedAt: certificate.issuedAt?.toISOString() ?? null,
      category: certificate.category as CertificateData["category"],
      imageUrl: certificate.imageUrl,
      pdfUrl: certificate.pdfUrl,
      credentialUrl: certificate.credentialUrl,
      active: certificate.active,
    }));
    return { certificates, unavailable: false };
  } catch (error) {
    console.error("Unable to load certificates", error);
    return { certificates: [], unavailable: true };
  }
}

export default async function CertificatePage() {
  const { certificates, unavailable } = await loadCertificates();
  return (
    <CertificateContent certificates={certificates} unavailable={unavailable} />
  );
}
