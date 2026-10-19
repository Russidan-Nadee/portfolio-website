// src/components/portfolio/ProjectNavigation.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { localizedPath } from "@/lib/locale-path";

interface ProjectNavigationData {
  backLink: string;
  backText: string;
  projectNumber: number;
  totalProjects: number;
  prevProjectSlug?: string;
  nextProjectSlug?: string;
}

interface ProjectNavigationProps {
  data: ProjectNavigationData;
  locale?: string;
}

export default function ProjectNavigation({
  data,
  locale = "th",
}: ProjectNavigationProps) {
  const router = useRouter();

  const handleNavigation = (slug: string) => {
    router.push(localizedPath(`/portfolio/${slug}`, locale));
  };

  // Dynamic text based on locale
  const getProjectText = () => {
    switch (locale) {
      case "en":
        return `Project ${data.projectNumber} of ${data.totalProjects}`;
      case "ja":
        return `プロジェクト ${data.projectNumber} / ${data.totalProjects}`;
      default:
        return `โปรเจคที่ ${data.projectNumber} จาก ${data.totalProjects}`;
    }
  };

  return (
    <div
      className="rounded-2xl p-4 mb-5 backdrop-blur-sm border flex justify-between items-center shadow-lg"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Link
        href={localizedPath(data.backLink, locale)}
        className="site-button site-button--secondary px-4 py-2"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {data.backText}
      </Link>

      <div
        className="flex items-center gap-5 text-sm"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span
          className="px-3 py-1 rounded-full font-medium"
          style={{ backgroundColor: "var(--muted)" }}
        >
          {getProjectText()}
        </span>
        <div className="flex gap-2">
          <button
            className="site-button w-9 h-9"
            disabled={!data.prevProjectSlug}
            onClick={() => {
              if (data.prevProjectSlug) {
                handleNavigation(data.prevProjectSlug);
              }
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="site-button w-9 h-9"
            disabled={!data.nextProjectSlug}
            onClick={() => {
              if (data.nextProjectSlug) {
                handleNavigation(data.nextProjectSlug);
              }
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
