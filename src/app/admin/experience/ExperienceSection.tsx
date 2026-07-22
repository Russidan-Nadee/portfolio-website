// src/app/admin/experience/ExperienceSection.tsx
"use client";

import { MdEdit, MdDeleteOutline } from "react-icons/md";
import type { ExperienceData } from "./types";

export default function ExperienceSection({
  label,
  items,
  iconPreviewMap,
  formatPeriod,
  onCreate,
  onEdit,
  onDelete,
}: Readonly<{
  label: string;
  items: ExperienceData[];
  iconPreviewMap: Record<string, React.ReactNode>;
  formatPeriod: (item: ExperienceData) => string;
  onCreate: () => void;
  onEdit: (item: ExperienceData) => void;
  onDelete: (id: string) => void;
}>) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {label}
        </h2>
        <button
          onClick={onCreate}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
          }}
        >
          + New {label}
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          ยังไม่มีรายการ
        </div>
      )}

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl border p-4 flex flex-col gap-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div className="absolute top-2 right-2 flex gap-3">
              <button
                className="hover:opacity-70"
                style={{ color: "var(--foreground)" }}
                title="Edit"
                onClick={() => onEdit(item)}
              >
                <MdEdit size={16} />
              </button>
              <button
                className="hover:opacity-70"
                style={{ color: "#dc2626" }}
                title="Delete"
                onClick={() => onDelete(item.id)}
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>

            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              {iconPreviewMap[item.icon]}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-medium text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {item.title.en || item.title.th}
              </span>
              {item.isCurrent && (
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              {item.company} · {formatPeriod(item)}
            </div>
            {item.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
