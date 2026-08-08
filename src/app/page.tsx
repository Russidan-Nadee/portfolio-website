// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";
import type { ProjectData } from "./admin/projects/types";

export default async function Home() {
  const [skills, featuredProjects] = await Promise.all([
    prisma.skill.findMany({
      where: { featured: true, active: true },
      orderBy: { order: "asc" },
      select: { name: true, icon: true },
    }),
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <HomeContent
      technologies={skills}
      featuredProjects={featuredProjects as unknown as ProjectData[]}
    />
  );
}
