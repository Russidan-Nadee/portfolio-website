// src/app/admin/projects/GalleryEditor.tsx
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
import { useRef, useState } from "react";
import { MdDeleteOutline, MdUpload } from "react-icons/md";
import type { GalleryImage, LocalizedText } from "./types";

const LOCALES = ["th", "en", "ja"] as const;

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

function SortableGalleryItem({
  id,
  image,
  index,
  onChange,
  onDelete,
}: {
  id: string;
  image: GalleryImage;
  index: number;
  onChange: (index: number, image: GalleryImage) => void;
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

  const updateAlt = (locale: keyof LocalizedText, value: string) => {
    onChange(index, { ...image, alt: { ...image.alt, [locale]: value } });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border p-3 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab select-none"
          style={{ color: "var(--muted-foreground)" }}
        >
          ⠿
        </span>
        <div
          className="flex-1 h-24 rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--muted)" }}
        >
          {image.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="hover:opacity-70"
          style={{ color: "#dc2626" }}
          title="Delete"
        >
          <MdDeleteOutline size={18} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {LOCALES.map((locale) => (
          <input
            key={locale}
            value={image.alt[locale]}
            placeholder={`alt (${locale})`}
            onChange={(e) => updateAlt(locale, e.target.value)}
            className="w-full rounded-lg border px-2 py-1 text-xs"
            style={inputStyle}
          />
        ))}
      </div>
    </div>
  );
}

export default function GalleryEditor({
  items,
  onChange,
  onUpload,
}: {
  items: GalleryImage[];
  onChange: (items: GalleryImage[]) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const ids = items.map((_, i) => `gallery-${i}`);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => onUpload(file)));
      onChange([
        ...items,
        ...uploaded.map((url) => ({ url, alt: { th: "", en: "", ja: "" } })),
      ]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const updateAt = (index: number, image: GalleryImage) => {
    onChange(items.map((img, i) => (i === index ? image : img)));
  };

  const deleteAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        id="gallery-editor"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            {items.map((image, index) => (
              <SortableGalleryItem
                key={ids[index]}
                id={ids[index]}
                image={image}
                index={index}
                onChange={updateAt}
                onDelete={deleteAt}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg px-4 py-2 text-sm font-medium border flex items-center gap-2 disabled:opacity-50"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          <MdUpload size={16} />
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
      </div>
    </div>
  );
}
