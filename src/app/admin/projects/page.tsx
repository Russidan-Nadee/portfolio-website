// src/app/admin/projects/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectsBoard from "./ProjectsBoard";
import type { ProjectSummary } from "./types";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      order: true,
      title: true,
      techSummary: true,
      thumbnailUrl: true,
      featured: true,
    },
  });

  return (
    <ProjectsBoard initialItems={projects as unknown as ProjectSummary[]} />
  );
}
