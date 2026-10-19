// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { publicCacheTags } from "@/lib/public-cache-tags";
import HomeContent from "./HomeContent";
import type {
  HeroCertificateData,
  HeroProjectData,
} from "@/components/home/CreativeHero";

export const dynamic = "force-dynamic";

const certificateCategoryPriority: Record<string, number> = {
  development: 0,
  technology: 1,
  professional: 2,
  finance: 3,
};

const loadHomeData = unstable_cache(
  async () => {
    return Promise.all([
      prisma.skill.findMany({
        where: { featured: true, active: true },
        orderBy: { order: "asc" },
        select: { name: true, icon: true },
      }),
      prisma.project.findMany({
        where: { featured: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnailUrl: true,
          techSummary: true,
        },
      }),
      prisma.project.findMany({
        orderBy: { order: "asc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnailUrl: true,
          techSummary: true,
        },
      }),
      prisma.certificate.findMany({
        where: {
          active: true,
          imageUrl: { not: null },
          pdfUrl: { not: null },
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          title: true,
          issuer: true,
          category: true,
          imageUrl: true,
          pdfUrl: true,
        },
      }),
      prisma.resume.findUnique({
        where: { id: "current" },
        select: { id: true },
      }),
    ]);
  },
  ["home-data-v2"],
  { tags: [publicCacheTags.home], revalidate: 3600 }
);

export default async function Home() {
  const [skills, featuredProjects, heroProjects, certificateRecords, resume] =
    await loadHomeData();

  const heroCertificates: HeroCertificateData[] = certificateRecords
    .sort(
      (a, b) =>
        (certificateCategoryPriority[a.category] ?? 4) -
          (certificateCategoryPriority[b.category] ?? 4) || a.order - b.order
    )
    .slice(0, 4)
    .map((certificate) => ({
      id: certificate.id,
      title: certificate.title as HeroCertificateData["title"],
      issuer: certificate.issuer,
      imageUrl: certificate.imageUrl!,
      pdfUrl: certificate.pdfUrl!,
    }));

  return (
    <HomeContent
      technologies={skills}
      featuredProjects={featuredProjects as unknown as HeroProjectData[]}
      heroProjects={heroProjects as unknown as HeroProjectData[]}
      heroCertificates={heroCertificates}
      resumeAvailable={Boolean(resume)}
    />
  );
}
