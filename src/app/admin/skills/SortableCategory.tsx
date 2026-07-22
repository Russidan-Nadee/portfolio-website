// src/app/admin/skills/SortableCategory.tsx
"use client";

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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDriveFileRenameOutline, MdDeleteOutline } from "react-icons/md";
import SortableSkillCard from "./SortableSkillCard";
import type { CategoryData, SkillData } from "./types";

export default function SortableCategory({
  category,
  onRename,
  onDeleteCategory,
  onCreateSkill,
  onEditSkill,
  onDeleteSkill,
  onToggleFeatured,
  onToggleActive,
  onReorderSkills,
}: {
  category: CategoryData;
  onRename: (category: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
  onCreateSkill: (categoryId: string) => void;
  onEditSkill: (skill: SkillData) => void;
  onDeleteSkill: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onReorderSkills: (categoryId: string, orderedIds: string[]) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = category.skills.findIndex((s) => s.id === active.id);
    const newIndex = category.skills.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(category.skills, oldIndex, newIndex).map(
      (s) => s.id
    );
    onReorderSkills(category.id, newOrder);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2 mb-3">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab select-none"
          style={{ color: "var(--muted-foreground)" }}
        >
          ⠿
        </span>
        <h2 className="font-semibold" style={{ color: "var(--foreground)" }}>
          {category.name.en || category.name.th}
        </h2>
        <button
          className="hover:opacity-70"
          style={{ color: "var(--muted-foreground)" }}
          title="Rename"
          onClick={() => onRename(category)}
        >
          <MdDriveFileRenameOutline size={18} />
        </button>
        <button
          className="hover:opacity-70"
          style={{ color: "#dc2626" }}
          title="Delete Category"
          onClick={() => onDeleteCategory(category.id)}
        >
          <MdDeleteOutline size={18} />
        </button>
        <button
          onClick={() => onCreateSkill(category.id)}
          className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
          }}
        >
          + New Skill
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={category.skills.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {category.skills.map((skill) => (
              <SortableSkillCard
                key={skill.id}
                skill={skill}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
                onToggleFeatured={onToggleFeatured}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
