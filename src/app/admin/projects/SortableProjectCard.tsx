// src/app/admin/projects/SortableProjectCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit, MdDeleteOutline, MdClose } from "react-icons/md";
import type { ProjectData } from "./types";

export default function SortableProjectCard({
  project,
  onToggleFeatured,
  onDelete,
}: {
  project: ProjectData;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string, slug: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const title = project.title.en || project.title.th;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-xl border overflow-hidden flex flex-col"
    >
      <span
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-grab select-none text-sm w-6 h-6 rounded flex items-center justify-center"
        style={{ color: "#fff", backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        ⠿
      </span>

      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="w-full h-36 block cursor-zoom-in"
        style={{ backgroundColor: "var(--muted)" }}
        title="Preview card"
      >
        {project.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </button>

      <div className="p-3 flex flex-col gap-2">
        <div
          className="font-medium text-sm truncate"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </div>
        <div
          className="text-xs truncate"
          style={{ color: "var(--muted-foreground)" }}
        >
          {project.techSummary}
        </div>

        <label
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          <input
            type="checkbox"
            checked={project.featured}
            onChange={(e) => onToggleFeatured(project.id, e.target.checked)}
          />
          Featured
        </label>

        <div className="flex gap-3 mt-1">
          <Link
            href={`/admin/projects/${project.id}`}
            className="hover:opacity-70"
            style={{ color: "var(--foreground)" }}
            title="Edit"
          >
            <MdEdit size={16} />
          </Link>
          <button
            className="hover:opacity-70"
            style={{ color: "#dc2626" }}
            title="Delete"
            onClick={() => onDelete(project.id, project.slug)}
          >
            <MdDeleteOutline size={16} />
          </button>
        </div>
      </div>

      {previewOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Preview: ${title}`}
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--foreground)",
                }}
              >
                <MdClose size={18} />
              </button>
            </div>
            {/* Exact markup of the real /portfolio list card */}
            <div
              className="border rounded-lg overflow-hidden relative"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              {project.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnailUrl}
                  alt={title}
                  className="w-full h-auto block"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                  {title}
                </h3>
                <p className="text-white/95 text-sm drop-shadow-md">
                  {project.techSummary}
                </p>
              </div>
            </div>
            <p className="text-xs text-center mt-3" style={{ color: "#fff" }}>
              หน้าตาจริงบน /portfolio
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
