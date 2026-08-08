// src/app/admin/projects/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Prisma } from "@/generated/prisma/client";
import type { ProjectContent, ProjectData } from "./types";

type ProjectHeaderInput = Omit<
  ProjectData,
  "id" | "order" | "content" | "featured"
>;

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  revalidatePath("/");
  if (slug) revalidatePath(`/portfolio/${slug}`);
}

// Fixed path per slug (upsert) so the URL stays stable across re-uploads —
// unlike the gallery, thumbnail/overview each have exactly one slot.
async function uploadFixedSlot(
  formData: FormData,
  slug: string,
  slotName: string
) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const supabase = createSupabaseServerClient();
  const ext = file.name.split(".").pop();
  const path = `projects/${slug}/${slotName}.${ext}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProjectThumbnail(formData: FormData, slug: string) {
  return uploadFixedSlot(formData, slug, "thumbnail");
}

export async function uploadProjectOverviewImage(
  formData: FormData,
  slug: string
) {
  return uploadFixedSlot(formData, slug, "overview");
}

export async function uploadProjectGalleryImage(
  formData: FormData,
  slug: string
) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const supabase = createSupabaseServerClient();
  const ext = file.name.split(".").pop();
  const path = `projects/${slug}/gallery/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function createProject(data: ProjectHeaderInput) {
  const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });
  const order = (last?.order ?? -1) + 1;

  const project = await prisma.project.create({
    data: {
      slug: data.slug,
      order,
      title: { ...data.title },
      description: { ...data.description },
      tags: { ...data.tags } as unknown as Prisma.InputJsonValue,
      filterTags: data.filterTags,
      techSummary: data.techSummary,
      thumbnailUrl: data.thumbnailUrl,
      overviewImageUrl: data.overviewImageUrl,
      overviewImageAlt: { ...data.overviewImageAlt },
      repoUrl: data.repoUrl,
      demoUrl: data.demoUrl,
      liveUrl: data.liveUrl,
      duration: { ...data.duration },
      status: { ...data.status },
      company: data.company,
      technologies: data.technologies,
      content: {
        overview: {
          about: { paragraphs: { th: [], en: [], ja: [] } },
          objectives: { content: { th: "", en: "", ja: "" } },
        },
        features: [],
        gallery: [],
        technical: { details: [], challenges: [] },
        results: [],
        futureGoals: [],
      } satisfies ProjectContent as unknown as Prisma.InputJsonValue,
    },
  });
  revalidateProjectPaths(project.slug);
  return project.id;
}

export async function updateProject(id: string, data: ProjectHeaderInput) {
  await prisma.project.update({
    where: { id },
    data: {
      slug: data.slug,
      title: { ...data.title },
      description: { ...data.description },
      tags: { ...data.tags } as unknown as Prisma.InputJsonValue,
      filterTags: data.filterTags,
      techSummary: data.techSummary,
      thumbnailUrl: data.thumbnailUrl,
      overviewImageUrl: data.overviewImageUrl,
      overviewImageAlt: { ...data.overviewImageAlt },
      repoUrl: data.repoUrl,
      demoUrl: data.demoUrl,
      liveUrl: data.liveUrl,
      duration: { ...data.duration },
      status: { ...data.status },
      company: data.company,
      technologies: data.technologies,
    },
  });
  revalidateProjectPaths(data.slug);
}

export async function updateProjectContent(
  id: string,
  content: ProjectContent,
  slug: string
) {
  await prisma.project.update({
    where: { id },
    data: { content: content as unknown as Prisma.InputJsonValue },
  });
  revalidateProjectPaths(slug);
}

export async function deleteProject(id: string, slug: string) {
  await prisma.project.delete({ where: { id } });
  revalidateProjectPaths(slug);
}

export async function toggleFeatured(id: string, featured: boolean) {
  await prisma.project.update({ where: { id }, data: { featured } });
  revalidateProjectPaths();
}

export async function reorderProjects(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, order) =>
      prisma.project.update({ where: { id }, data: { order } })
    )
  );
  revalidateProjectPaths();
}
