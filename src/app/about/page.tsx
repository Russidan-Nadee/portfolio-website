// src/app/about/page.tsx
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { publicCacheTags } from "@/lib/public-cache-tags";
import AboutContent from "./AboutContent";
import type { CategoryItem } from "../../components/about/SkillsGrid";
import type { ExperienceItem } from "../../components/about/Timeline";

const loadAboutData = unstable_cache(
  async () =>
    Promise.all([
      prisma.category.findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          skills: {
            where: { active: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              icon: true,
              url: true,
              description: true,
            },
          },
        },
      }),
      prisma.experience.findMany({
        orderBy: { startDate: "desc" },
        select: {
          id: true,
          type: true,
          title: true,
          company: true,
          startDate: true,
          endDate: true,
          isCurrent: true,
          description: true,
          skills: true,
          icon: true,
        },
      }),
    ]),
  ["about-data-v1"],
  { tags: [publicCacheTags.about], revalidate: 3600 }
);

export default async function About() {
  const [categories, experiences] = await loadAboutData();

  // ซ่อน category ที่ skill ทั้งหมดข้างในเป็น draft (active: false) หมด ไม่ให้เห็นหัวข้อว่างๆ
  const visibleCategories = categories.filter(
    (category) => category.skills.length > 0
  );

  return (
    <AboutContent
      skillCategories={visibleCategories as unknown as CategoryItem[]}
      experiences={experiences as unknown as ExperienceItem[]}
    />
  );
}
