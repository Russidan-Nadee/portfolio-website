// src/app/admin/projects/CardListEditor.tsx
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
import type { Card, LocalizedText } from "./types";

const LOCALES = ["th", "en", "ja"] as const;

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

function SortableCardRow({
  id,
  card,
  index,
  onChange,
  onDelete,
}: {
  id: string;
  card: Card;
  index: number;
  onChange: (index: number, card: Card) => void;
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

  const updateField = (
    field: "title" | "description",
    locale: keyof LocalizedText,
    value: string
  ) => {
    onChange(index, { ...card, [field]: { ...card[field], [locale]: value } });
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
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {LOCALES.map((locale) => (
              <div key={locale}>
                <label
                  className="text-xs mb-1 uppercase block"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Title ({locale})
                </label>
                <input
                  value={card.title[locale]}
                  onChange={(e) => updateField("title", locale, e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {LOCALES.map((locale) => (
              <div key={locale}>
                <label
                  className="text-xs mb-1 uppercase block"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Description ({locale})
                </label>
                <textarea
                  value={card.description[locale]}
                  rows={2}
                  onChange={(e) =>
                    updateField("description", locale, e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
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

export default function CardListEditor({
  items,
  onChange,
  addLabel,
}: {
  items: Card[];
  onChange: (items: Card[]) => void;
  addLabel: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const ids = items.map((_, i) => `card-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const updateAt = (index: number, card: Card) => {
    onChange(items.map((c, i) => (i === index ? card : c)));
  };

  const deleteAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addBlank = () => {
    onChange([
      ...items,
      {
        title: { th: "", en: "", ja: "" },
        description: { th: "", en: "", ja: "" },
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        id="card-list-editor"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {items.map((card, index) => (
              <SortableCardRow
                key={ids[index]}
                id={ids[index]}
                card={card}
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
        + {addLabel}
      </button>
    </div>
  );
}
