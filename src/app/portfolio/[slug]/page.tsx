// src/app/portfolio/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectDetailContent from "./ProjectDetailContent";
import type { ProjectData } from "@/app/admin/projects/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, allProjects] = await Promise.all([
    prisma.project.findUnique({ where: { slug } }),
    prisma.project.findMany({
      orderBy: { order: "asc" },
      select: { slug: true },
    }),
  ]);

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
