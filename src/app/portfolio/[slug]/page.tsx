// src/app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { publicCacheTags } from "@/lib/public-cache-tags";
import ProjectDetailContent from "./ProjectDetailContent";
import type { ProjectData } from "@/app/admin/projects/types";

const loadProjectDetail = unstable_cache(
  async (slug: string) =>
    Promise.all([
      prisma.project.findUnique({ where: { slug } }),
      prisma.project.findMany({
        orderBy: { order: "asc" },
        select: { slug: true },
      }),
    ]),
  ["project-detail-v1"],
  { tags: [publicCacheTags.portfolio], revalidate: 3600 }
);

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, allProjects] = await loadProjectDetail(slug);

  if (!project) notFound();

  const index = allProjects.findIndex((p) => p.slug === slug);
  const navigation = {
    projectNumber: index + 1,
    totalProjects: allProjects.length,
    prevProjectSlug: allProjects[index - 1]?.slug,
    nextProjectSlug: allProjects[index + 1]?.slug,
  };

  return (
    <ProjectDetailContent
      project={project as unknown as ProjectData}
      navigation={navigation}
    />
  );
}
