// src/app/admin/skills/SortableSkillCard.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import type { SkillData } from "./types";

export default function SortableSkillCard({
  skill,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: {
  skill: SkillData;
  onEdit: (skill: SkillData) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onToggleActive: (id: string, active: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    opacity: isDragging ? 0.4 : skill.active ? 1 : 0.5,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-xl border p-4 flex flex-col items-center gap-3"
    >
      <span
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab select-none text-sm"
        style={{ color: "var(--muted-foreground)" }}
      >
        ⠿
      </span>

      <div
        className="absolute top-2 right-2 flex flex-col items-end gap-1 text-[10px]"
        style={{ color: "var(--muted-foreground)" }}
      >
        <label className="flex items-center gap-1">
          <span>Featured</span>
          <input
            type="checkbox"
            checked={skill.featured}
            onChange={(e) => onToggleFeatured(skill.id, e.target.checked)}
            title="Featured"
          />
        </label>
        <label className="flex items-center gap-1">
          <span>Active</span>
          <input
            type="checkbox"
            checked={skill.active}
            onChange={(e) => onToggleActive(skill.id, e.target.checked)}
            title="Active"
          />
        </label>
      </div>

      {!skill.active && (
        <span
          className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--muted)",
            color: "var(--muted-foreground)",
          }}
        >
          Draft
        </span>
      )}

      {skill.icon && (
        <img
          src={skill.icon}
          alt={skill.name}
          className="w-12 h-12 object-contain mt-2"
        />
      )}

      <div
        className="font-medium text-sm text-center"
        style={{ color: "var(--foreground)" }}
      >
        {skill.name}
      </div>

      <div className="flex gap-3">
        <button
          className="hover:opacity-70"
          style={{ color: "var(--foreground)" }}
          title="Edit"
          onClick={() => onEdit(skill)}
        >
          <MdEdit size={16} />
        </button>
        <button
          className="hover:opacity-70"
          style={{ color: "#dc2626" }}
          title="Delete"
          onClick={() => onDelete(skill.id)}
        >
          <MdDeleteOutline size={16} />
        </button>
      </div>
    </div>
  );
}
