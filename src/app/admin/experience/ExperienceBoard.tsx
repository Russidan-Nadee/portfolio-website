"use client";

import { useState } from "react";
import { MdClose, MdEdit, MdDeleteOutline } from "react-icons/md";
import { FaBriefcase, FaLaptopCode, FaGraduationCap } from "react-icons/fa";
import { MdWork, MdRestaurant, MdFastfood, MdSchool } from "react-icons/md";
import type { ExperienceData, ExperienceType, LocalizedText } from "./types";
import { ICON_OPTIONS } from "./types";

const iconPreviewMap: Record<string, React.ReactNode> = {
  FaBriefcase: <FaBriefcase />,
  FaLaptopCode: <FaLaptopCode />,
  FaGraduationCap: <FaGraduationCap />,
  MdWork: <MdWork />,
  MdRestaurant: <MdRestaurant />,
  MdFastfood: <MdFastfood />,
  MdSchool: <MdSchool />,
};

// "yyyy-MM" <-> Date helpers (month/year picker only cares about these two parts)
function yearMonthToDate(value: string | null): Date | null {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function dateToYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatYearMonth(value: string): string {
  const date = yearMonthToDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatPeriod(item: ExperienceData): string {
  const start = formatYearMonth(item.startDate);
  const end = item.isCurrent
    ? "Present"
    : item.endDate
      ? formatYearMonth(item.endDate)
      : "";
  return end ? `${start} - ${end}` : start;
}

const mockData: ExperienceData[] = [
  {
    id: "1",
    type: "work",
    title: {
      th: "นักพัฒนาซอฟต์แวร์",
      en: "Software Developer",
      ja: "ソフトウェア開発者",
    },
    company: "Fastship",
    startDate: "2026-05",
    endDate: null,
    isCurrent: true,
    description: {
      th: "พัฒนาและดูแลระบบหลังบ้าน",
      en: "Develop and maintain backend systems",
      ja: "バックエンドシステムの開発と保守",
    },
    skills: ["Laravel", "PostgreSQL", "Docker"],
    icon: "FaLaptopCode",
    order: 0,
  },
  {
    id: "2",
    type: "education",
    title: {
      th: "ปริญญาตรี วิทยาการคอมพิวเตอร์",
      en: "B.Sc. Computer Science",
      ja: "コンピュータサイエンス学士",
    },
    company: "Some University",
    startDate: "2021-08",
    endDate: "2025-05",
    isCurrent: false,
    description: {
      th: "",
      en: "",
      ja: "",
    },
    skills: [],
    icon: "FaGraduationCap",
    order: 0,
  },
];

const blankExperience = (type: ExperienceType): ExperienceData => ({
  id: "",
  type,
  title: { th: "", en: "", ja: "" },
  company: "",
  startDate: dateToYearMonth(new Date()),
  endDate: null,
  isCurrent: false,
  description: { th: "", en: "", ja: "" },
  skills: [],
  icon: "FaBriefcase",
  order: 0,
});

export default function ExperienceBoard() {
  const [items, setItems] = useState<ExperienceData[]>(mockData);
  const [activeTab, setActiveTab] = useState<ExperienceType>("work");
  const [editing, setEditing] = useState<ExperienceData | null>(null);
  const [skillDraft, setSkillDraft] = useState("");

  const visibleItems = items.filter((item) => item.type === activeTab);

  const openCreate = () => {
    setEditing(blankExperience(activeTab));
    setSkillDraft("");
  };

  const openEdit = (item: ExperienceData) => {
    setEditing(item);
    setSkillDraft("");
  };

  const handleDelete = (id: string) => {
    if (!confirm("ลบรายการนี้ใช่ไหม?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateLocalizedField = (
    field: "title" | "description",
    locale: keyof LocalizedText,
    value: string
  ) => {
    setEditing((prev) =>
      prev ? { ...prev, [field]: { ...prev[field], [locale]: value } } : prev
    );
  };

  const addSkillTag = () => {
    const value = skillDraft.trim();
    if (!value || !editing) return;
    if (editing.skills.includes(value)) {
      setSkillDraft("");
      return;
    }
    setEditing({ ...editing, skills: [...editing.skills, value] });
    setSkillDraft("");
  };

  const removeSkillTag = (skill: string) => {
    setEditing((prev) =>
      prev ? { ...prev, skills: prev.skills.filter((s) => s !== skill) } : prev
    );
  };

  const handleSubmit = () => {
    if (!editing) return;
    if (editing.id) {
      setItems((prev) =>
        prev.map((item) => (item.id === editing.id ? editing : item))
      );
    } else {
      setItems((prev) => [...prev, { ...editing, id: crypto.randomUUID() }]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Experience
        </h1>
        <button
          onClick={openCreate}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
          }}
        >
          + New {activeTab === "work" ? "Work" : "Education"}
        </button>
      </div>

      <div
        className="flex gap-1 mb-6 rounded-lg p-1 w-fit border"
        style={{ borderColor: "var(--border)" }}
      >
        {(["work", "education"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="rounded-md px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor:
                activeTab === tab ? "var(--card)" : "transparent",
              color:
                activeTab === tab
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
            }}
          >
            {tab === "work" ? "Work" : "Education"}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 && (
        <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          ยังไม่มีรายการ
        </div>
      )}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl border p-4 flex flex-col gap-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="absolute top-2 left-2 cursor-grab select-none text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              ⠿
            </span>
            <div className="absolute top-2 right-2 flex gap-3">
              <button
                className="hover:opacity-70"
                style={{ color: "var(--foreground)" }}
                title="Edit"
                onClick={() => openEdit(item)}
              >
                <MdEdit size={16} />
              </button>
              <button
                className="hover:opacity-70"
                style={{ color: "#dc2626" }}
                title="Delete"
                onClick={() => handleDelete(item.id)}
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>

            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mt-6"
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

      {editing && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setEditing(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editing.id ? "Edit Experience" : "Add Experience"}
            className="w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto"
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
                {editing.id ? "Edit" : "Add"}{" "}
                {editing.type === "work" ? "Work" : "Education"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                style={{ color: "var(--muted-foreground)" }}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Title
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(["th", "en", "ja"] as const).map((locale) => (
                    <div key={locale}>
                      <label
                        htmlFor={`exp-title-${locale}`}
                        className="text-xs mb-1 uppercase block"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {locale}
                      </label>
                      <input
                        id={`exp-title-${locale}`}
                        value={editing.title[locale]}
                        onChange={(e) =>
                          updateLocalizedField("title", locale, e.target.value)
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        style={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="exp-company"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Company / School
                </label>
                <input
                  id="exp-company"
                  value={editing.company}
                  onChange={(e) =>
                    setEditing({ ...editing, company: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="exp-start-date"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Start Date
                  </label>
                  <input
                    id="exp-start-date"
                    type="month"
                    value={editing.startDate}
                    onChange={(e) =>
                      setEditing({ ...editing, startDate: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="exp-end-date"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    End Date
                  </label>
                  {editing.isCurrent ? (
                    <div
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{
                        backgroundColor: "var(--muted)",
                        borderColor: "var(--border)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Present
                    </div>
                  ) : (
                    <input
                      id="exp-end-date"
                      type="month"
                      value={editing.endDate ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          endDate: e.target.value || null,
                        })
                      }
                      className="w-full rounded-lg border px-3 py-2"
                      style={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <div
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Description
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(["th", "en", "ja"] as const).map((locale) => (
                    <div key={locale}>
                      <label
                        htmlFor={`exp-description-${locale}`}
                        className="text-xs mb-1 uppercase block"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {locale}
                      </label>
                      <textarea
                        id={`exp-description-${locale}`}
                        value={editing.description[locale]}
                        rows={3}
                        onChange={(e) =>
                          updateLocalizedField(
                            "description",
                            locale,
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        style={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Icon
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      title={icon}
                      onClick={() => setEditing({ ...editing, icon })}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg border"
                      style={{
                        backgroundColor:
                          editing.icon === icon
                            ? "var(--foreground)"
                            : "var(--background)",
                        color:
                          editing.icon === icon
                            ? "var(--background)"
                            : "var(--foreground)",
                        borderColor:
                          editing.icon === icon
                            ? "var(--foreground)"
                            : "var(--border)",
                      }}
                    >
                      {iconPreviewMap[icon]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="exp-skill-input"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="exp-skill-input"
                    value={skillDraft}
                    onChange={(e) => setSkillDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkillTag();
                      }
                    }}
                    placeholder="พิมพ์แล้วกด Enter"
                    className="flex-1 min-w-0 rounded-lg border px-3 py-2 text-sm"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkillTag}
                    className="rounded-lg border px-3 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillTag(skill)}
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        <MdClose size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6">
              <label
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <input
                  type="checkbox"
                  checked={editing.isCurrent}
                  onChange={(e) =>
                    setEditing({ ...editing, isCurrent: e.target.checked })
                  }
                />
                <span>Is Current (กำลังทำ/กำลังศึกษาอยู่)</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
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
                  onClick={handleSubmit}
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
