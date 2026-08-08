// src/app/admin/projects/SortableProjectCard.tsx
"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
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

      <div className="w-full h-36" style={{ backgroundColor: "var(--muted)" }}>
        {project.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailUrl}
            alt={project.title.en || project.title.th}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div
          className="font-medium text-sm truncate"
          style={{ color: "var(--foreground)" }}
        >
          {project.title.en || project.title.th}
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
    </div>
  );
}
