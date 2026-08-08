// src/app/admin/projects/ProjectsBoard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { MdClose } from "react-icons/md";
import {
  createProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
} from "./actions";
import SortableProjectCard from "./SortableProjectCard";
import ProjectHeaderFields, {
  type ProjectHeaderValue,
} from "./ProjectHeaderFields";
import type { ProjectData } from "./types";

const blankHeader = (): ProjectHeaderValue => ({
  slug: "",
  title: { th: "", en: "", ja: "" },
  description: { th: "", en: "", ja: "" },
  tags: { th: [], en: [], ja: [] },
  filterTags: [],
  techSummary: "",
  thumbnailUrl: "",
  overviewImageUrl: "",
  overviewImageAlt: { th: "", en: "", ja: "" },
  repoUrl: null,
  demoUrl: null,
  liveUrl: null,
  duration: { th: "", en: "", ja: "" },
  status: { th: "", en: "", ja: "" },
  company: "",
  technologies: [],
});

export default function ProjectsBoard({
  initialItems,
}: Readonly<{
  initialItems: ProjectData[];
}>) {
  const router = useRouter();
  const [items, setItems] = useState<ProjectData[]>(initialItems);
  const [creating, setCreating] = useState<ProjectHeaderValue | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);
    try {
      await reorderProjects(reordered.map((i) => i.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reorder failed");
      setItems(initialItems);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, featured } : p)));
    try {
      await toggleFeatured(id, featured);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
      setItems(initialItems);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("ลบโปรเจกต์นี้ใช่ไหม?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProject(id, slug);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
      setItems(initialItems);
    }
  };

  const handleCreate = async () => {
    if (!creating) return;
    setSaving(true);
    try {
      const id = await createProject(creating);
      setCreating(null);
      router.push(`/admin/projects/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Projects
        </h1>
        <button
          onClick={() => setCreating(blankHeader())}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
          }}
        >
          + New Project
        </button>
      </div>

      <DndContext
        id="admin-projects"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          >
            {items.map((project) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {creating && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setCreating(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add Project"
            className="w-full max-w-3xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                Add Project
              </h2>
              <button
                type="button"
                onClick={() => setCreating(null)}
                style={{ color: "var(--muted-foreground)" }}
              >
                <MdClose size={20} />
              </button>
            </div>

            <p
              className="text-xs mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              กรอก header ให้ครบก่อน — เนื้อหา tab อื่น
              (Overview/Features/Gallery/Technical/Results)
              แก้ได้ทีหลังในหน้าแก้ไข
            </p>

            <ProjectHeaderFields value={creating} onChange={setCreating} />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCreating(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium border"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !creating.slug || !creating.title.en}
                onClick={handleCreate}
                className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
