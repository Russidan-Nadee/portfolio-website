// src/app/admin/experience/page.tsx
import { prisma } from "@/lib/prisma";
import ExperienceBoard from "./ExperienceBoard";
import type { ExperienceData } from "./types";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <ExperienceBoard
      initialItems={experiences as unknown as ExperienceData[]}
    />
  );
}
