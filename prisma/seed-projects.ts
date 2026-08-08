// prisma/seed-projects.ts
// One-off seed: migrates the 7 real portfolio projects into the Project table.
// Reconciles 3 previously-separate sources: prisma/seed-data/projects (detail content,
// no longer used by the app itself — kept here only as this seed's source of truth),
// locales/*.json portfolio.projects.* (grid tech summary), and the hardcoded
// array in src/app/portfolio/page.tsx (thumbnail/filterTags/order).
// Gallery is seeded empty — the old data was caption-only placeholders with no
// real images, so real gallery uploads start fresh through the admin.
// Run with: npx tsx prisma/seed-projects.ts
import "dotenv/config";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { ProjectData as SourceProjectData } from "./seed-data/projects/types";

// th/en/ja project data, aliased per language
import { kinraiDData as kinraiD_th } from "./seed-data/projects/translations/th/kinrai-d-project";
import { kinraiDData as kinraiD_en } from "./seed-data/projects/translations/en/kinrai-d-project";
import { kinraiDData as kinraiD_ja } from "./seed-data/projects/translations/ja/kinrai-d-project";

import { assetDashboardData as tpRfid_th } from "./seed-data/projects/translations/th/tp-rfid";
import { assetDashboardData as tpRfid_en } from "./seed-data/projects/translations/en/tp-rfid";
import { assetDashboardData as tpRfid_ja } from "./seed-data/projects/translations/ja/tp-rfid";

import { investFamData as investFam_th } from "./seed-data/projects/translations/th/invest-fam";
import { investFamData as investFam_en } from "./seed-data/projects/translations/en/invest-fam";
import { investFamData as investFam_ja } from "./seed-data/projects/translations/ja/invest-fam";

import { portfolioWebsiteData as portfolioSite_th } from "./seed-data/projects/translations/th/portfolio-website";
import { portfolioWebsiteData as portfolioSite_en } from "./seed-data/projects/translations/en/portfolio-website";
import { portfolioWebsiteData as portfolioSite_ja } from "./seed-data/projects/translations/ja/portfolio-website";

import { assetManagementData as assetMgmt_th } from "./seed-data/projects/translations/th/asset-management";
import { assetManagementData as assetMgmt_en } from "./seed-data/projects/translations/en/asset-management";
import { assetManagementData as assetMgmt_ja } from "./seed-data/projects/translations/ja/asset-management";

import { calculatorData as calculator_th } from "./seed-data/projects/translations/th/calculator";
import { calculatorData as calculator_en } from "./seed-data/projects/translations/en/calculator";
import { calculatorData as calculator_ja } from "./seed-data/projects/translations/ja/calculator";

import { moneyTrackerData as moneyTracker_th } from "./seed-data/projects/translations/th/money-tracker-app";
import { moneyTrackerData as moneyTracker_en } from "./seed-data/projects/translations/en/money-tracker-app";
import { moneyTrackerData as moneyTracker_ja } from "./seed-data/projects/translations/ja/money-tracker-app";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type Lang = {
  th: SourceProjectData;
  en: SourceProjectData;
  ja: SourceProjectData;
};
type L3 = { th: string; en: string; ja: string };

function pickText(t: Lang, path: (d: SourceProjectData) => string): L3 {
  return { th: path(t.th), en: path(t.en), ja: path(t.ja) };
}

function pickTextArray(
  t: Lang,
  path: (d: SourceProjectData) => string[]
): { th: string[]; en: string[]; ja: string[] } {
  return { th: path(t.th), en: path(t.en), ja: path(t.ja) };
}

// features/challenges/results/futureGoals: th/en/ja arrays are normally index-aligned
// (same length, same order) — combine into one array per item, all 3 languages together.
// Some projects (e.g. invest-fam) have a stale/incomplete ja translation with fewer
// items than th/en — pad missing ja entries with the en text rather than dropping
// real th/en content or crashing. Flagged in the seed log for a manual translation pass.
function zipCards(
  t: Lang,
  path: (d: SourceProjectData) => { title: string; description: string }[]
) {
  const th = path(t.th);
  const en = path(t.en);
  const ja = path(t.ja);
  if (ja.length < en.length) {
    console.warn(
      `  ! ja content shorter than en/th (${ja.length} vs ${en.length}) — padding with en text`
    );
  }
  return en.map((_, i) => ({
    title: {
      th: th[i]?.title ?? en[i].title,
      en: en[i].title,
      ja: ja[i]?.title ?? en[i].title,
    },
    description: {
      th: th[i]?.description ?? en[i].description,
      en: en[i].description,
      ja: ja[i]?.description ?? en[i].description,
    },
  }));
}

function zipGoals(
  t: Lang,
  path: (d: SourceProjectData) => { description: string }[]
) {
  const th = path(t.th);
  const en = path(t.en);
  const ja = path(t.ja);
  if (ja.length < en.length) {
    console.warn(
      `  ! ja goals shorter than en/th (${ja.length} vs ${en.length}) — padding with en text`
    );
  }
  return en.map((_, i) => ({
    description: {
      th: th[i]?.description ?? en[i].description,
      en: en[i].description,
      ja: ja[i]?.description ?? en[i].description,
    },
  }));
}

// technical.details keys/values are identical across th/en/ja in the source data
// (English technical jargon, never translated) — still stored as {th,en,ja} for
// consistency with the rest of the schema and so the admin can localize later.
function zipDetails(t: Lang) {
  const details = t.en.tabsContent.technical.details as Record<string, string>;
  return Object.entries(details).map(([key, value]) => ({
    key,
    value: { th: value, en: value, ja: value },
  }));
}

function buildContent(t: Lang) {
  return {
    overview: {
      about: {
        paragraphs: pickTextArray(
          t,
          (d) => d.tabsContent.overview.about.paragraphs
        ),
      },
      objectives: {
        content: pickText(t, (d) => d.tabsContent.overview.objectives.content),
      },
    },
    features: zipCards(t, (d) => d.tabsContent.features.items),
    gallery: [] as { url: string; alt: L3 }[], // real uploads start fresh via admin
    technical: {
      details: zipDetails(t),
      challenges: zipCards(t, (d) => d.tabsContent.technical.challenges.items),
    },
    results: zipCards(t, (d) => d.tabsContent.results.items),
    futureGoals: zipGoals(t, (d) => d.tabsContent.results.futureGoals.items),
  };
}

// Metadata not present in src/data/projects — reconciled from
// src/app/portfolio/page.tsx (order/filterTags/thumbnail) and the actually-live
// home ProjectsShowcase.tsx component (featured set — its hardcoded slugs, not
// the stale/unused locales JSON keys that don't even match its own lookup paths).
const projects: Array<{
  slug: string;
  data: Lang;
  order: number;
  featured: boolean;
  filterTags: string[];
  techSummary: string;
  thumbnailUrl: string;
  overviewImageUrl: string;
}> = [
  {
    slug: "money-tracker-app",
    data: { th: moneyTracker_th, en: moneyTracker_en, ja: moneyTracker_ja },
    order: 0,
    featured: true,
    filterTags: ["web"],
    techSummary: "Next.js, Prisma, Supabase",
    thumbnailUrl: "/images/projects/money-tracker-app.png",
    overviewImageUrl:
      "/images/projects/money-tracker-app/dashboard-overview.png",
  },
  {
    slug: "kinrai-d-project",
    data: { th: kinraiD_th, en: kinraiD_en, ja: kinraiD_ja },
    order: 1,
    featured: true,
    filterTags: ["crossplatform", "web", "mobile"],
    techSummary: "Flutter, Nest.js, PostgreSQL, Supabase",
    thumbnailUrl: "/images/projects/kinrai-d.png",
    overviewImageUrl: "/images/projects/kinrai-d/kinrai-d-overview.png",
  },
  {
    slug: "invest-fam",
    data: { th: investFam_th, en: investFam_en, ja: investFam_ja },
    order: 2,
    featured: true,
    filterTags: ["web"],
    techSummary: "Next.js, TypeScript, Tailwind CSS",
    thumbnailUrl: "/images/projects/investfam.jpg",
    overviewImageUrl: "/images/projects/invest-fam/investfam-overview.png",
  },
  {
    slug: "tp-rfid",
    data: { th: tpRfid_th, en: tpRfid_en, ja: tpRfid_ja },
    order: 3,
    featured: true,
    filterTags: ["crossplatform", "web", "desktop", "mobile"],
    techSummary: "Flutter, Node.js, Express, Prisma, MySQL",
    thumbnailUrl: "/images/projects/tp-rfid.jpg",
    overviewImageUrl: "/images/projects/tp-rfid/dashboard-overview.png",
  },
  {
    slug: "portfolio-website",
    data: { th: portfolioSite_th, en: portfolioSite_en, ja: portfolioSite_ja },
    order: 4,
    featured: false,
    filterTags: ["web"],
    techSummary: "Next.js, TypeScript, Tailwind CSS",
    thumbnailUrl: "/images/projects/portfolio-website.jpg",
    overviewImageUrl:
      "/images/projects/portfolio-website/portfolio-website-overview.png",
  },
  {
    slug: "asset-management",
    data: { th: assetMgmt_th, en: assetMgmt_en, ja: assetMgmt_ja },
    order: 5,
    featured: false,
    filterTags: ["mobile"],
    techSummary: "Flutter, Node.js, Express, MySQL",
    thumbnailUrl: "/images/projects/asset-management-mobile.jpg",
    overviewImageUrl:
      "/images/projects/asset-management/asset-management-overview.jpg",
  },
  {
    slug: "calculator",
    data: { th: calculator_th, en: calculator_en, ja: calculator_ja },
    order: 6,
    featured: false,
    filterTags: ["desktop"],
    techSummary: "Python, Tkinter",
    thumbnailUrl: "/images/projects/calculator-app.jpg",
    overviewImageUrl: "/images/projects/calculator-app/calculator-overview.png",
  },
];

async function main() {
  const existing = await prisma.project.count();
  if (existing > 0) {
    console.log(
      `Skipping: ${existing} project(s) already exist. Delete them first if you want to reseed.`
    );
    return;
  }

  for (const p of projects) {
    const { data: t } = p;
    await prisma.project.create({
      data: {
        slug: p.slug,
        order: p.order,
        title: pickText(t, (d) => d.header.title),
        description: pickText(t, (d) => d.header.description),
        tags: pickTextArray(
          t,
          (d) => d.header.tags
        ) as unknown as Prisma.InputJsonValue,
        filterTags: p.filterTags,
        techSummary: p.techSummary,
        thumbnailUrl: p.thumbnailUrl,
        overviewImageUrl: p.overviewImageUrl,
        overviewImageAlt: pickText(t, (d) => d.tabsContent.overview.imageAlt),
        repoUrl: t.en.header.githubUrl ?? null,
        demoUrl: t.en.header.demoUrl ?? null,
        liveUrl: t.en.header.liveUrl ?? null,
        duration: pickText(t, (d) => d.infoBar.duration),
        status: pickText(t, (d) => d.infoBar.status),
        company: t.en.infoBar.company,
        technologies: t.en.infoBar.technologies,
        content: buildContent(t) as unknown as Prisma.InputJsonValue,
        featured: p.featured,
      },
    });
    console.log(`Seeded "${p.slug}"`);
  }
  console.log(`Seeded ${projects.length} project(s)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
