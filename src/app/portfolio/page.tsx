// src/app/portfolio/page.tsx
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { publicCacheTags } from "@/lib/public-cache-tags";
import PortfolioContent from "./PortfolioContent";
import type { PortfolioCardData } from "./PortfolioContent";

const loadPortfolioCards = unstable_cache(
  async () =>
    prisma.project.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        filterTags: true,
        techSummary: true,
        thumbnailUrl: true,
      },
    }),
  ["portfolio-cards-v1"],
  { tags: [publicCacheTags.portfolio], revalidate: 3600 }
);

export default async function Portfolio() {
  const projects = await loadPortfolioCards();

  return (
    <PortfolioContent projects={projects as unknown as PortfolioCardData[]} />
  );
}
