"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  buildCertificateAssetPath,
  parseCertificateFormData,
  validateCertificateAsset,
} from "@/features/certificates/certificate";
import type { CertificateAssetKind } from "@/features/certificates/types";

const CERTIFICATE_BUCKET = "certificate-assets";

function revalidateCertificatePaths() {
  revalidatePath("/certificate");
  revalidatePath("/admin/certificates");
}

async function uploadCertificateAsset(
  formData: FormData,
  kind: CertificateAssetKind
) {
  const file = formData.get("file");
  const slugValue = formData.get("slug");
  if (!(file instanceof File)) throw new Error("No file provided");
  if (typeof slugValue !== "string") throw new Error("Slug is required");

  const slug = slugValue.trim();
  validateCertificateAsset(file, kind);
  const path = buildCertificateAssetPath(slug, kind);
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
  const last = await prisma.certificate.findFirst({
    orderBy: { order: "desc" },
  });

  try {
    const certificate = await prisma.certificate.create({
      data: {
        ...input,
        title: input.title as unknown as Prisma.InputJsonValue,
        order: (last?.order ?? -1) + 1,
      },
    });
    revalidateCertificatePaths();
    return certificate.id;
  } catch (error) {
    await removeCertificateAssets(input.slug);
    throw error;
  }
}

export async function updateCertificate(id: string, formData: FormData) {
  const input = parseCertificateFormData(formData);
  const previous = await prisma.certificate.findUniqueOrThrow({
    where: { id },
    select: { slug: true },
  });

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
