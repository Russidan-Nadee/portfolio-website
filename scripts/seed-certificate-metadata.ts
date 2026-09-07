import "dotenv/config";
import type { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import { CERTIFICATE_MANIFEST } from "./certificate-manifest";

async function main() {
  for (const item of CERTIFICATE_MANIFEST) {
    const metadata = {
      order: item.order,
      title: item.title as unknown as Prisma.InputJsonValue,
      issuer: item.issuer,
      issuedAt: item.issuedAt
        ? new Date(`${item.issuedAt}T00:00:00.000Z`)
        : null,
      category: item.category,
    };

    const certificate = await prisma.certificate.upsert({
      where: { slug: item.slug },
      update: metadata,
      create: {
        ...metadata,
        slug: item.slug,
        imageUrl: null,
        pdfUrl: null,
        credentialUrl: null,
        active: false,
      },
      select: { slug: true, active: true, imageUrl: true, pdfUrl: true },
    });

    console.log(
      `${certificate.slug}: metadata ready (${certificate.active ? "active" : "draft"}, assets ${certificate.imageUrl && certificate.pdfUrl ? "complete" : "pending"})`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
