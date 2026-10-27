// src/app/portfolio/[slug]/ProjectDetailContent.tsx
"use client";

import { useInitialLocale } from "@/components/layout/LocaleProvider";
import { useEffect, useRef, useState } from "react";
import ProjectNavigation from "@/components/portfolio/ProjectNavigation";
import ProjectHeader from "@/components/portfolio/ProjectHeader";
import ProjectInfoBar from "@/components/portfolio/ProjectInfoBar";
import ProjectTabsContent from "@/components/portfolio/ProjectTabsContent";
import type { ProjectData } from "@/app/admin/projects/types";

const BACK_TEXT: Record<string, string> = {
  th: "กลับไปหน้าผลงาน",
  en: "Back to Portfolio",
  ja: "ポートフォリオに戻る",
};

const INFO_LABELS: Record<
  string,
  { status: string; company: string; technology: string }
> = {
  th: {
    status: "สถานะ",
    company: "บริษัท",
    technology: "เทคโนโลยีหลัก",
  },
  en: {
    status: "Status",
    company: "Company",
    technology: "Core Technologies",
  },
  ja: {
    status: "ステータス",
    company: "会社",
    technology: "主要技術",
  },
};

type Locale = "th" | "en" | "ja";

export default function ProjectDetailContent({
  project,
  navigation,
}: Readonly<{
  project: ProjectData;
  navigation: {
    projectNumber: number;
    totalProjects: number;
    prevProjectSlug?: string;
    nextProjectSlug?: string;
  };
}>) {
  const [locale, setLocale] = useState<Locale>(useInitialLocale());
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      setLocale((e as CustomEvent<{ language: Locale }>).detail.language);
    };
    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  useEffect(() => {
    let frameId = 0;
    const updateProgressBar = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = height > 0 ? Math.min(1, winScroll / height) : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      frameId = 0;
    };

    const scheduleProgressBar = () => {
      if (!frameId) frameId = requestAnimationFrame(updateProgressBar);
    };

    scheduleProgressBar();
    window.addEventListener("scroll", scheduleProgressBar, { passive: true });
    window.addEventListener("resize", scheduleProgressBar);
    return () => {
      window.removeEventListener("scroll", scheduleProgressBar);
      window.removeEventListener("resize", scheduleProgressBar);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    const title = project.title[locale] || project.title.en;
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("คัดลอกลิงก์แล้ว!");
    }
  };

  const content = project.content;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="fixed top-0 left-0 w-full h-1 z-50"
        style={{ backgroundColor: "var(--muted)" }}
      >
        <div
          ref={progressBarRef}
          className="h-full transition-transform duration-300 origin-left"
          style={{
            transform: "scaleX(0)",
            backgroundColor: "var(--foreground)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto p-5">
        <ProjectNavigation
          data={{
            backLink: "/portfolio",
            backText: BACK_TEXT[locale],
            projectNumber: navigation.projectNumber,
            totalProjects: navigation.totalProjects,
            prevProjectSlug: navigation.prevProjectSlug,
            nextProjectSlug: navigation.nextProjectSlug,
          }}
          locale={locale}
        />

        <ProjectHeader
          data={{
            title: project.title[locale] || project.title.en,
            description: project.description[locale] || project.description.en,
            tags: project.tags[locale] || project.tags.en,
            githubUrl: project.repoUrl ?? undefined,
            demoUrl: project.demoUrl ?? undefined,
            liveUrl: project.liveUrl ?? undefined,
          }}
        />

        <ProjectInfoBar
          data={{
            status: project.status[locale] || project.status.en,
            company:
              content.companyNames?.[locale] ||
              content.companyNames?.en ||
              project.company,
            technologies: project.technologies,
            labels: INFO_LABELS[locale],
          }}
        />

        <ProjectTabsContent
          imagePath={project.overviewImageUrl}
          overviewMedia={content.overview.media}
          imageAlt={
            project.overviewImageAlt[locale] || project.overviewImageAlt.en
          }
          locale={locale}
          content={{
            about: { paragraphs: content.overview.about.paragraphs[locale] },
            objectives: {
              content: content.overview.objectives.content[locale],
            },
            features: content.features.map((f) => ({
              title: f.title[locale] || f.title.en,
              description: f.description[locale] || f.description.en,
            })),
            gallery: (content.gallery ?? []).map((g) => ({
              url: g.url,
              alt: g.alt[locale] || g.alt.en,
            })),
            technical: {
              details: content.technical.details.map((d) => ({
                key: d.key,
                value: d.value[locale] || d.value.en,
              })),
              challenges: (content.technical.challenges ?? []).map((c) => ({
                title: c.title[locale] || c.title.en,
                description: c.description[locale] || c.description.en,
              })),
            },
            results: content.results.map((r) => ({
              title: r.title[locale] || r.title.en,
              description: r.description[locale] || r.description.en,
            })),
            futureGoals: (content.futureGoals ?? []).map((g) => ({
              description: g.description[locale] || g.description.en,
            })),
          }}
        />
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button
          className="site-button site-button--secondary w-12 h-12"
          title="แชร์โปรเจค"
          onClick={handleShare}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </button>
        <button
          className="site-button w-12 h-12"
          title="กลับขึ้นด้านบน"
          onClick={scrollToTop}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
