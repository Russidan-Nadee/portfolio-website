// src/app/portfolio/page.tsx
import { prisma } from "@/lib/prisma";
import PortfolioContent from "./PortfolioContent";
import type { ProjectData } from "@/app/admin/projects/types";

export default async function Portfolio() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return <PortfolioContent projects={projects as unknown as ProjectData[]} />;
}
