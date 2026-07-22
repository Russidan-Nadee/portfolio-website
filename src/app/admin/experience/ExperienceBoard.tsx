"use client";

import { useEffect, useState } from "react";
import {
  MdClose,
  MdWork,
  MdRestaurant,
  MdFastfood,
  MdSchool,
} from "react-icons/md";
import { FaBriefcase, FaLaptopCode, FaGraduationCap } from "react-icons/fa";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "./actions";
import ExperienceSection from "./ExperienceSection";
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
function yearMonthToDate(value: string): Date {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function dateToYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatYearMonth(value: string): string {
  return yearMonthToDate(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatPeriod(item: ExperienceData): string {
  const start = formatYearMonth(item.startDate);
  let end = "";
  if (item.isCurrent) {
    end = "Present";
  } else if (item.endDate) {
    end = formatYearMonth(item.endDate);
  }
  return end ? `${start} - ${end}` : start;
}

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
});

export default function ExperienceBoard({
  initialItems,
}: Readonly<{
  initialItems: ExperienceData[];
}>) {
  const [items, setItems] = useState<ExperienceData[]>(initialItems);
  const [editing, setEditing] = useState<ExperienceData | null>(null);
  const [skillDraft, setSkillDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const workItems = items.filter((item) => item.type === "work");
  const educationItems = items.filter((item) => item.type === "education");

  const openCreate = (type: ExperienceType) => {
    setEditing(blankExperience(type));
    setSkillDraft("");
  };

  const openEdit = (item: ExperienceData) => {
    setEditing(item);
    setSkillDraft("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้ใช่ไหม?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteExperience(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
      setItems(initialItems);
    }
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

  const handleSubmit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, ...data } = editing;
      if (id) {
        await updateExperience(id, data);
      } else {
        await createExperience(data);
      }
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Experience
      </h1>

      <ExperienceSection
        label="Work"
        items={workItems}
        iconPreviewMap={iconPreviewMap}
        formatPeriod={formatPeriod}
        onCreate={() => openCreate("work")}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <ExperienceSection
        label="Education"
        items={educationItems}
        iconPreviewMap={iconPreviewMap}
        formatPeriod={formatPeriod}
        onCreate={() => openCreate("education")}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

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
                  disabled={saving}
                  onClick={handleSubmit}
                  className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
