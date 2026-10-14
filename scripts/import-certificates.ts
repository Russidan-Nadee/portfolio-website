import "dotenv/config";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";
import type { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import { createSupabaseServerClient } from "../src/lib/supabase-server";
import { buildCertificateAssetPath } from "../src/features/certificates/certificate";
import { CERTIFICATE_MANIFEST } from "./certificate-manifest";

const BUCKET = "certificate-assets";
const PDF_SIZE_LIMIT = 15 * 1024 * 1024;

async function ensureSourceFiles(sourceDirectory: string) {
  const allPaths = CERTIFICATE_MANIFEST.flatMap((item) => [
    resolve(sourceDirectory, item.sourceFilename),
    resolve(sourceDirectory, item.previewPath),
  ]);
  await Promise.all(allPaths.map((path) => access(path, constants.R_OK)));
}

async function ensurePublicBucket() {
  const supabase = createSupabaseServerClient();
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError)
    throw new Error(`Unable to list buckets: ${listError.message}`);

  const existing = buckets.find((bucket) => bucket.name === BUCKET);
  if (!existing) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: PDF_SIZE_LIMIT,
      allowedMimeTypes: [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp",
      ],
    });
    if (error) throw new Error(`Unable to create bucket: ${error.message}`);
    return;
  }

  if (!existing.public) {
    const { error } = await supabase.storage.updateBucket(BUCKET, {
      public: true,
      fileSizeLimit: PDF_SIZE_LIMIT,
      allowedMimeTypes: [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp",
      ],
    });
    if (error)
      throw new Error(`Unable to make bucket public: ${error.message}`);
  }
}

async function uploadFile(
  localPath: string,
  storagePath: string,
  contentType: string
) {
  const supabase = createSupabaseServerClient();
  const bytes = await readFile(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType, upsert: true });
  if (error)
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  const sourceDirectory =
    process.env.CERTIFICATE_SOURCE_DIR ??
    resolve(process.cwd(), "certificates");
  await ensureSourceFiles(sourceDirectory);
  await ensurePublicBucket();

  for (const item of CERTIFICATE_MANIFEST) {
    const pdfUrl = await uploadFile(
      resolve(sourceDirectory, item.sourceFilename),
      buildCertificateAssetPath(item.slug, "pdf"),
      "application/pdf"
    );
    const imageUrl = await uploadFile(
      resolve(sourceDirectory, item.previewPath),
      buildCertificateAssetPath(item.slug, "preview"),
      "image/png"
    );
    const data = {
      title: item.title as unknown as Prisma.InputJsonValue,
      issuer: item.issuer,
      issuedAt: item.issuedAt
        ? new Date(`${item.issuedAt}T00:00:00.000Z`)
        : null,
      category: item.category,
      imageUrl,
      pdfUrl,
      credentialUrl: null,
      active: true,
      order: item.order,
    };

    await prisma.certificate.upsert({
      where: { slug: item.slug },
      update: data,
      create: { ...data, slug: item.slug },
    });
    console.log(`Imported ${item.slug}`);
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
