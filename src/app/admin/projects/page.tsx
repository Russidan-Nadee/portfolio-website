// src/app/admin/projects/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectsBoard from "./ProjectsBoard";
import type { ProjectData } from "./types";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return <ProjectsBoard initialItems={projects as unknown as ProjectData[]} />;
}
