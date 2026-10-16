"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { publicCacheTags } from "@/lib/public-cache-tags";
import {
  assertCertificateCanActivate,
  assertCertificateSlugAvailable,
  buildCertificateAssetPath,
  parseCertificateFormData,
  validateCertificateAsset,
} from "@/features/certificates/certificate";
import type { CertificateAssetKind } from "@/features/certificates/types";

const CERTIFICATE_BUCKET = "certificate-assets";
const PDF_SIZE_LIMIT = 15 * 1024 * 1024;

function revalidateCertificatePaths() {
  revalidatePath("/certificate");
  revalidatePath("/");
  revalidatePath("/admin/certificates");
  revalidateTag(publicCacheTags.certificate, { expire: 0 });
  revalidateTag(publicCacheTags.home, { expire: 0 });
}

async function ensureCertificateBucket() {
  const supabase = createSupabaseServerClient();
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();
  if (listError)
    throw new Error(`Unable to list buckets: ${listError.message}`);

  const existing = buckets.find((bucket) => bucket.name === CERTIFICATE_BUCKET);
  if (!existing) {
    const { error } = await supabase.storage.createBucket(CERTIFICATE_BUCKET, {
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
  }
}

async function uploadCertificateAsset(
  formData: FormData,
  kind: CertificateAssetKind
) {
  const file = formData.get("file");
  const slugValue = formData.get("slug");
  const certificateIdValue = formData.get("certificateId");
  if (!(file instanceof File)) throw new Error("No file provided");
  if (typeof slugValue !== "string") throw new Error("Slug is required");

  const slug = slugValue.trim();
  const certificateId =
    typeof certificateIdValue === "string" && certificateIdValue
      ? certificateIdValue
      : null;
  const existing = await prisma.certificate.findUnique({
    where: { slug },
    select: { id: true },
  });
  assertCertificateSlugAvailable(existing?.id ?? null, certificateId);
  validateCertificateAsset(file, kind);
  const path = buildCertificateAssetPath(slug, kind);
  await ensureCertificateBucket();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(CERTIFICATE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(CERTIFICATE_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

async function removeCertificateAssets(slug: string) {
  const supabase = createSupabaseServerClient();
  const paths = [
    buildCertificateAssetPath(slug, "pdf"),
    buildCertificateAssetPath(slug, "preview"),
  ];
  const { error } = await supabase.storage
    .from(CERTIFICATE_BUCKET)
    .remove(paths);
  if (error)
    console.error(`Certificate asset cleanup failed: ${error.message}`);
}

export async function uploadCertificatePdf(formData: FormData) {
  return uploadCertificateAsset(formData, "pdf");
}

export async function uploadCertificatePreview(formData: FormData) {
  return uploadCertificateAsset(formData, "preview");
}

export async function createCertificate(formData: FormData) {
  const input = parseCertificateFormData(formData);
  const existing = await prisma.certificate.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });
  assertCertificateSlugAvailable(existing?.id ?? null, null);
  const last = await prisma.certificate.findFirst({
    orderBy: { order: "desc" },
  });

  const certificate = await prisma.certificate.create({
    data: {
      ...input,
      title: input.title as unknown as Prisma.InputJsonValue,
      order: (last?.order ?? -1) + 1,
    },
  });
  revalidateCertificatePaths();
  return certificate.id;
}

export async function updateCertificate(id: string, formData: FormData) {
  const input = parseCertificateFormData(formData);
  const previous = await prisma.certificate.findUniqueOrThrow({
    where: { id },
    select: { slug: true },
  });
  const slugOwner = await prisma.certificate.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });
  assertCertificateSlugAvailable(slugOwner?.id ?? null, id);

  await prisma.certificate.update({
    where: { id },
    data: {
      ...input,
      title: input.title as unknown as Prisma.InputJsonValue,
    },
  });

  if (previous.slug !== input.slug)
    await removeCertificateAssets(previous.slug);
  revalidateCertificatePaths();
}

export async function toggleCertificateActive(id: string, active: boolean) {
  if (active) {
    const certificate = await prisma.certificate.findUniqueOrThrow({
      where: { id },
      select: { imageUrl: true, pdfUrl: true },
    });
    assertCertificateCanActivate(certificate.imageUrl, certificate.pdfUrl);
  }
  await prisma.certificate.update({ where: { id }, data: { active } });
  revalidateCertificatePaths();
}

export async function reorderCertificates(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, order) =>
      prisma.certificate.update({ where: { id }, data: { order } })
    )
  );
  revalidateCertificatePaths();
}

export async function deleteCertificate(id: string) {
  const deleted = await prisma.certificate.delete({
    where: { id },
    select: { slug: true },
  });
  revalidateCertificatePaths();
  await removeCertificateAssets(deleted.slug);
}
