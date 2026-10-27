// src/components/portfolio/ProjectTabsContent.tsx
"use client";

import { useState } from "react";
import ProjectImage from "./ProjectImage";
import {
  getOverviewMediaError,
  type OverviewMedia,
} from "@/lib/project-overview-media";

interface TextItem {
  title: string;
  description: string;
}

interface DetailItem {
  key: string;
  value: string;
}

interface GalleryItem {
  url: string;
  alt: string;
}

export interface ResolvedProjectContent {
  about: { paragraphs: string[] };
  objectives: { content: string };
  features: TextItem[];
  gallery: GalleryItem[];
  technical: {
    details: DetailItem[];
    challenges: TextItem[];
  };
  results: TextItem[];
  futureGoals: { description: string }[];
}

interface ProjectTabsContentProps {
  content: ResolvedProjectContent;
  imagePath: string;
  imageAlt: string;
  overviewMedia?: OverviewMedia;
  locale: string;
}

const WIDESCREEN_OVERVIEW_PATHS = new Set([
  "/images/projects/asset-management/asset-management-overview.jpg",
  "/images/projects/calculator-app/calculator-overview.png",
]);

// Page chrome (tab names, section headings) — same wording across every project,
// so it isn't admin-editable content; kept here instead of in the database.
const LABELS: Record<string, Record<string, string>> = {
  th: {
    overview: "ภาพรวม",
    features: "ฟีเจอร์",
    gallery: "แกลเลอรี",
    technical: "รายละเอียดเทคนิค",
    results: "ผลลัพธ์",
    about: "เกี่ยวกับโปรเจค",
    objectives: "วัตถุประสงค์",
    keyFeatures: "ฟีเจอร์หลัก",
    screenshots: "ภาพหน้าจอ",
    challenges: "ความท้าทาย",
    futureGoals: "เป้าหมายในอนาคต",
    noImages: "ยังไม่มีรูปภาพ",
  },
  en: {
    overview: "Overview",
    features: "Features",
    gallery: "Gallery",
    technical: "Technical Details",
    results: "Results",
    about: "About the Project",
    objectives: "Objectives",
    keyFeatures: "Key Features",
    screenshots: "Screenshots",
    challenges: "Challenges",
    futureGoals: "Future Goals",
    noImages: "No images yet",
  },
  ja: {
    overview: "概要",
    features: "機能",
    gallery: "スクリーンショット",
    technical: "技術詳細",
    results: "結果",
    about: "プロジェクトについて",
    objectives: "目的",
    keyFeatures: "主要機能",
    screenshots: "スクリーンショット",
    challenges: "課題",
    futureGoals: "将来の目標",
    noImages: "まだ画像がありません",
  },
};

export default function ProjectTabsContent({
  content,
  imagePath,
  imageAlt,
  overviewMedia,
  locale,
}: ProjectTabsContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const t = LABELS[locale] || LABELS.en;
  const overviewPath = imagePath.split(/[?#]/, 1)[0];
  const overviewAspectRatio = WIDESCREEN_OVERVIEW_PATHS.has(overviewPath)
    ? "16 / 9"
    : "4 / 3";

  const iframeUrl =
    overviewMedia?.type === "iframe" && !getOverviewMediaError(overviewMedia)
      ? overviewMedia.iframeUrl.trim()
      : null;

  const tabs = [
    { id: "overview", label: t.overview },
    { id: "features", label: t.features },
    { id: "gallery", label: t.gallery },
    { id: "technical", label: t.technical },
    { id: "results", label: t.results },
  ];

  return (
    <div
      className="rounded-2xl p-8 mb-5 border shadow-lg backdrop-blur-sm"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`site-button flex-1 px-3 py-2 text-xs sm:text-sm lg:text-base ${
              activeTab === tab.id ? "" : "site-button--secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div className="mb-8">
            {iframeUrl ? (
              <div
                className="relative w-full mb-5 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  aspectRatio: overviewAspectRatio,
                  backgroundColor: "var(--card)",
                }}
              >
                <iframe
                  src={iframeUrl}
                  title={imageAlt || t.overview}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                />
              </div>
            ) : imagePath ? (
              <div
                className="relative w-full mb-5 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  aspectRatio: overviewAspectRatio,
                  backgroundColor: "var(--card)",
                }}
              >
                <ProjectImage
                  src={imagePath}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 4.5rem), (max-width: 1200px) calc(100vw - 7rem), 1088px"
                  className="object-contain"
                  fallback={
                    <div
                      className="w-full h-full flex items-center justify-center text-lg font-semibold border-2 border-dashed"
                      style={{
                        backgroundColor: "var(--muted)",
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {imageAlt}
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                className="w-full rounded-2xl flex items-center justify-center text-lg font-semibold border-2 border-dashed mb-5"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                  height: "280px",
                  aspectRatio: "16/9",
                }}
              >
                {imageAlt}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.about}
            </h3>
            {content.about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.objectives}
            </h3>
            <p style={{ color: "var(--muted-foreground)" }}>
              {content.objectives.content}
            </p>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === "features" && (
        <div>
          <h3
            className="text-xl font-semibold mb-6 flex items-center gap-2"
            style={{ color: "var(--foreground)" }}
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {t.keyFeatures}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border-l-4 flex items-start gap-3"
                style={{
                  backgroundColor: "var(--muted)",
                  borderLeftColor: "var(--foreground)",
                }}
              >
                <div>
                  <strong style={{ color: "var(--foreground)" }}>
                    {feature.title}
                  </strong>
                  <br />
                  <span style={{ color: "var(--muted-foreground)" }}>
                    {feature.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div>
          <h3
            className="text-xl font-semibold mb-6 flex items-center gap-2"
            style={{ color: "var(--foreground)" }}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t.screenshots}
          </h3>
          {content.gallery.length === 0 ? (
            <p style={{ color: "var(--muted-foreground)" }}>{t.noImages}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.gallery.map((image) => (
                <div
                  key={image.url}
                  className="relative rounded-xl overflow-hidden border transition-transform duration-300 hover:scale-105"
                  style={{ borderColor: "var(--border)", height: "180px" }}
                >
                  <ProjectImage
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 4.5rem), (max-width: 1023px) calc(50vw - 3.5rem), 340px"
                    className="object-cover"
                    fallback={
                      <div
                        className="w-full h-full flex items-center justify-center text-center p-4"
                        style={{
                          backgroundColor: "var(--muted)",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {image.alt}
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technical Tab */}
      {activeTab === "technical" && (
        <div>
          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              {t.technical}
            </h3>
            <div
              className="space-y-3"
              style={{ color: "var(--muted-foreground)" }}
            >
              {content.technical.details.map((detail, index) => (
                <p key={index}>
                  <strong style={{ color: "var(--foreground)" }}>
                    {detail.key}:
                  </strong>{" "}
                  {detail.value}
                </p>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-4 flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              {t.challenges}
            </h3>
            <div className="space-y-3">
              {content.technical.challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: "var(--muted)",
                    borderLeftColor: "var(--muted-foreground)",
                  }}
                >
                  <strong style={{ color: "var(--foreground)" }}>
                    {challenge.title}:
                  </strong>
                  <span
                    style={{ color: "var(--muted-foreground)" }}
                    className="ml-2"
                  >
                    {challenge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div>
          <h3
            className="text-xl font-semibold mb-6 flex items-center gap-2"
            style={{ color: "var(--foreground)" }}
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t.results}
          </h3>
          <div className="space-y-3">
            {content.results.map((result, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: "var(--muted)",
                  borderLeftColor: "var(--foreground)",
                }}
              >
                <strong style={{ color: "var(--foreground)" }}>
                  {result.title}:
                </strong>
                <span
                  style={{ color: "var(--muted-foreground)" }}
                  className="ml-2"
                >
                  {result.description}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-6 rounded-lg border"
            style={{
              backgroundColor: "var(--muted)",
              borderColor: "var(--border)",
            }}
          >
            <h4
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              {t.futureGoals}
            </h4>
            <ul
              className="space-y-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {content.futureGoals.map((goal, index) => (
                <li key={index}>• {goal.description}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
