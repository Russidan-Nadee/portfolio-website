// src/app/admin/projects/FutureGoalsEditor.tsx
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
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline } from "react-icons/md";
import type { FutureGoal, LocalizedText } from "./types";

const LOCALES = ["th", "en", "ja"] as const;

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

function SortableGoalRow({
  id,
  goal,
  index,
  onChange,
  onDelete,
}: {
  id: string;
  goal: FutureGoal;
  index: number;
  onChange: (index: number, goal: FutureGoal) => void;
  onDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    opacity: isDragging ? 0.4 : 1,
  };

  const updateField = (locale: keyof LocalizedText, value: string) => {
    onChange(index, {
      description: { ...goal.description, [locale]: value },
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab select-none pt-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          ⠿
        </span>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {LOCALES.map((locale) => (
            <div key={locale}>
              <label
                className="text-xs mb-1 uppercase block"
                style={{ color: "var(--muted-foreground)" }}
              >
                {locale}
              </label>
              <input
                value={goal.description[locale]}
                onChange={(e) => updateField(locale, e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={inputStyle}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="hover:opacity-70 pt-2"
          style={{ color: "#dc2626" }}
          title="Delete"
        >
          <MdDeleteOutline size={18} />
        </button>
      </div>
    </div>
  );
}

export default function FutureGoalsEditor({
  items,
  onChange,
}: {
  items: FutureGoal[];
  onChange: (items: FutureGoal[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const ids = items.map((_, i) => `goal-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const updateAt = (index: number, goal: FutureGoal) => {
    onChange(items.map((g, i) => (i === index ? goal : g)));
  };

  const deleteAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addBlank = () => {
    onChange([...items, { description: { th: "", en: "", ja: "" } }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        id="future-goals-editor"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {items.map((goal, index) => (
              <SortableGoalRow
                key={ids[index]}
                id={ids[index]}
                goal={goal}
                index={index}
                onChange={updateAt}
                onDelete={deleteAt}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={addBlank}
        className="self-start rounded-lg px-4 py-2 text-sm font-medium border"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        + Add Future Goal
      </button>
    </div>
  );
}
