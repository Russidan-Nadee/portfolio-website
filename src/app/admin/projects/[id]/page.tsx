// src/app/admin/projects/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectEditor from "./ProjectEditor";
import type { ProjectData } from "../types";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  return <ProjectEditor project={project as unknown as ProjectData} />;
}
