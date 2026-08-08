// src/app/admin/projects/[id]/ProjectEditor.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import {
  updateProject,
  updateProjectContent,
  deleteProject,
  uploadProjectThumbnail,
  uploadProjectOverviewImage,
  uploadProjectGalleryImage,
} from "../actions";
import ProjectHeaderFields, {
  type ProjectHeaderValue,
} from "../ProjectHeaderFields";
import CardListEditor from "../CardListEditor";
import GalleryEditor from "../GalleryEditor";
import TechnicalDetailsEditor from "../TechnicalDetailsEditor";
import FutureGoalsEditor from "../FutureGoalsEditor";
import type { ProjectContent, ProjectData } from "../types";

const TABS = [
  "Header",
  "Overview",
  "Features",
  "Gallery",
  "Technical",
  "Results",
] as const;
type Tab = (typeof TABS)[number];

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

export default function ProjectEditor({
  project,
}: Readonly<{ project: ProjectData }>) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Header");

  const [header, setHeader] = useState<ProjectHeaderValue>({
    slug: project.slug,
    title: project.title,
    description: project.description,
    tags: project.tags,
    filterTags: project.filterTags,
    techSummary: project.techSummary,
    thumbnailUrl: project.thumbnailUrl,
    overviewImageUrl: project.overviewImageUrl,
    overviewImageAlt: project.overviewImageAlt,
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    liveUrl: project.liveUrl,
    duration: project.duration,
    status: project.status,
    company: project.company,
    technologies: project.technologies,
  });
  const [content, setContent] = useState<ProjectContent>(project.content);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
      await updateProject(project.id, header);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingHeader(false);
    }
  };

  const handleSaveContent = async () => {
    setSavingContent(true);
    try {
      await updateProjectContent(project.id, content, header.slug);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingContent(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ลบโปรเจกต์นี้ใช่ไหม?")) return;
    try {
      await deleteProject(project.id, project.slug);
      router.push("/admin/projects");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const paragraphsText = (locale: "th" | "en" | "ja") =>
    content.overview.about.paragraphs[locale].join("\n\n");

  const setParagraphs = (locale: "th" | "en" | "ja", value: string) => {
    setContent({
      ...content,
      overview: {
        ...content.overview,
        about: {
          paragraphs: {
            ...content.overview.about.paragraphs,
            [locale]: value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          },
        },
      },
    });
  };

  const setObjectives = (locale: "th" | "en" | "ja", value: string) => {
    setContent({
      ...content,
      overview: {
        ...content.overview,
        objectives: {
          content: { ...content.overview.objectives.content, [locale]: value },
        },
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            style={{ color: "var(--muted-foreground)" }}
          >
            <MdArrowBack size={20} />
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {header.title.en || header.title.th || "(untitled)"}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg px-4 py-2 text-sm font-medium border"
          style={{ borderColor: "#dc2626", color: "#dc2626" }}
        >
          Delete Project
        </button>
      </div>

      <div
        className="flex gap-1 mb-6 rounded-lg p-1 w-fit border flex-wrap"
        style={{ borderColor: "var(--border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="rounded-md px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor:
                activeTab === tab ? "var(--card)" : "transparent",
              color:
                activeTab === tab
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Header" && (
        <div>
          <ProjectHeaderFields
            value={header}
            onChange={setHeader}
            onUploadThumbnail={(file) => {
              const formData = new FormData();
              formData.set("file", file);
              return uploadProjectThumbnail(formData, header.slug);
            }}
            onUploadOverviewImage={(file) => {
              const formData = new FormData();
              formData.set("file", file);
              return uploadProjectOverviewImage(formData, header.slug);
            }}
          />
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveHeader}
              disabled={savingHeader}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingHeader ? "Saving..." : "Save Header"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Overview" && (
        <div className="flex flex-col gap-4">
          <div>
            <div
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              About — Paragraphs{" "}
              <span className="normal-case font-normal">
                (บรรทัดว่าง = ย่อหน้าใหม่)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["th", "en", "ja"] as const).map((locale) => (
                <div key={locale}>
                  <label
                    className="text-xs mb-1 uppercase block"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {locale}
                  </label>
                  <textarea
                    value={paragraphsText(locale)}
                    rows={8}
                    onChange={(e) => setParagraphs(locale, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              Objectives
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["th", "en", "ja"] as const).map((locale) => (
                <div key={locale}>
                  <label
                    className="text-xs mb-1 uppercase block"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {locale}
                  </label>
                  <textarea
                    value={content.overview.objectives.content[locale]}
                    rows={3}
                    onChange={(e) => setObjectives(locale, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingContent ? "Saving..." : "Save Overview"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Features" && (
        <div className="flex flex-col gap-4">
          <CardListEditor
            items={content.features}
            onChange={(features) => setContent({ ...content, features })}
            addLabel="Add Feature"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingContent ? "Saving..." : "Save Features"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Gallery" && (
        <div className="flex flex-col gap-4">
          <GalleryEditor
            items={content.gallery}
            onChange={(gallery) => setContent({ ...content, gallery })}
            onUpload={(file) => {
              const formData = new FormData();
              formData.set("file", file);
              return uploadProjectGalleryImage(formData, header.slug);
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingContent ? "Saving..." : "Save Gallery"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Technical" && (
        <div className="flex flex-col gap-6">
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              Details
            </h3>
            <TechnicalDetailsEditor
              items={content.technical.details}
              onChange={(details) =>
                setContent({
                  ...content,
                  technical: { ...content.technical, details },
                })
              }
            />
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              Challenges
            </h3>
            <CardListEditor
              items={content.technical.challenges}
              onChange={(challenges) =>
                setContent({
                  ...content,
                  technical: { ...content.technical, challenges },
                })
              }
              addLabel="Add Challenge"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingContent ? "Saving..." : "Save Technical"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Results" && (
        <div className="flex flex-col gap-6">
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              Results
            </h3>
            <CardListEditor
              items={content.results}
              onChange={(results) => setContent({ ...content, results })}
              addLabel="Add Result"
            />
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--foreground)" }}
            >
              Future Goals
            </h3>
            <FutureGoalsEditor
              items={content.futureGoals}
              onChange={(futureGoals) =>
                setContent({ ...content, futureGoals })
              }
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {savingContent ? "Saving..." : "Save Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
