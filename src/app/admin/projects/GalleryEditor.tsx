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
import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { MdDeleteOutline, MdUpload } from "react-icons/md";
import type { GalleryImage, LocalizedText } from "./types";

const LOCALES = ["th", "en", "ja"] as const;
const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 5 } };

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

const SortableGalleryItem = memo(function SortableGalleryItem({
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
          className="site-button site-button--secondary hover:opacity-70 p-2"
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
});

export default function GalleryEditor({
  items,
  onChange,
  onUpload,
}: {
  items: GalleryImage[];
  onChange: Dispatch<SetStateAction<GalleryImage[]>>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, POINTER_SENSOR_OPTIONS));
  const itemCount = items.length;
  // Text edits do not change the sortable positions. Keep the context's items
  // stable so editing one caption does not notify every sortable card.
  const ids = useMemo(
    () => Array.from({ length: itemCount }, (_, i) => `gallery-${i}`),
    [itemCount]
  );

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => onUpload(file)));
      onChange((current) => [
        ...current,
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
    if (oldIndex < 0 || newIndex < 0) return;
    onChange((current) => arrayMove(current, oldIndex, newIndex));
  };

  const updateAt = useCallback(
    (index: number, image: GalleryImage) => {
      onChange((current) =>
        current.map((img, i) => (i === index ? image : img))
      );
    },
    [onChange]
  );

  const deleteAt = useCallback(
    (index: number) => {
      onChange((current) => current.filter((_, i) => i !== index));
    },
    [onChange]
  );

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
          className="site-button site-button--secondary px-4 py-2 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
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
