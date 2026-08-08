// src/app/admin/projects/TechnicalDetailsEditor.tsx
"use client";

import { MdDeleteOutline } from "react-icons/md";
import type { DetailItem } from "./types";

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

export default function TechnicalDetailsEditor({
  items,
  onChange,
}: {
  items: DetailItem[];
  onChange: (items: DetailItem[]) => void;
}) {
  const updateKey = (index: number, key: string) => {
    onChange(items.map((d, i) => (i === index ? { ...d, key } : d)));
  };

  const updateValue = (index: number, value: string) => {
    onChange(
      items.map((d, i) =>
        i === index ? { ...d, value: { th: value, en: value, ja: value } } : d
      )
    );
  };

  const deleteAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addBlank = () => {
    onChange([...items, { key: "", value: { th: "", en: "", ja: "" } }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        key/value อิสระ ไม่จำกัดจำนวน — ใช้ค่าเดียวกันทั้ง 3 ภาษา
        (ศัพท์เทคนิคปกติไม่แปล)
      </p>
      {items.map((detail, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            value={detail.key}
            placeholder="Framework"
            onChange={(e) => updateKey(index, e.target.value)}
            className="w-48 shrink-0 rounded-lg border px-3 py-2 text-sm"
            style={inputStyle}
          />
          <input
            value={detail.value.en}
            placeholder="Flutter, Node.js"
            onChange={(e) => updateValue(index, e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => deleteAt(index)}
            className="hover:opacity-70"
            style={{ color: "#dc2626" }}
            title="Delete"
          >
            <MdDeleteOutline size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addBlank}
        className="self-start rounded-lg px-4 py-2 text-sm font-medium border"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        + Add Detail
      </button>
    </div>
  );
}
