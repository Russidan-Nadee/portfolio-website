// src/app/admin/projects/ProjectHeaderFields.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdUpload } from "react-icons/md";
import { FILTER_TAG_OPTIONS } from "./types";
import type { FilterTag, LocalizedList, LocalizedText } from "./types";

export interface ProjectHeaderValue {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  tags: LocalizedList;
  filterTags: FilterTag[];
  techSummary: string;
  thumbnailUrl: string;
  overviewImageUrl: string;
  overviewImageAlt: LocalizedText;
  repoUrl: string | null;
  demoUrl: string | null;
  liveUrl: string | null;
  duration: LocalizedText;
  status: LocalizedText;
  company: string;
  technologies: string[];
}

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

const LOCALES = ["th", "en", "ja"] as const;

function LocalizedInput({
  id,
  label,
  value,
  onChange,
  textarea,
}: {
  id: string;
  label: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <div
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {LOCALES.map((locale) => {
          const Field = textarea ? "textarea" : "input";
          return (
            <div key={locale}>
              <label
                htmlFor={`${id}-${locale}`}
                className="text-xs mb-1 uppercase block"
                style={{ color: "var(--muted-foreground)" }}
              >
                {locale}
              </label>
              <Field
                id={`${id}-${locale}`}
                value={value[locale]}
                rows={textarea ? 3 : undefined}
                onChange={(e) =>
                  onChange({ ...value, [locale]: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={inputStyle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommaListField({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(() => value.join(", "));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(value.join(", "));
  }, [value]);

  return (
    <input
      id={id}
      value={text}
      placeholder={placeholder}
      onFocus={() => {
        focused.current = true;
      }}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }}
      onBlur={() => {
        focused.current = false;
        setText(value.join(", "));
      }}
      className="w-full rounded-lg border px-3 py-2 text-sm"
      style={inputStyle}
    />
  );
}

function LocalizedListInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: LocalizedList;
  onChange: (next: LocalizedList) => void;
}) {
  return (
    <div>
      <div
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}{" "}
        <span className="normal-case font-normal">(คั่นด้วย comma)</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {LOCALES.map((locale) => (
          <div key={locale}>
            <label
              htmlFor={`${id}-${locale}`}
              className="text-xs mb-1 uppercase block"
              style={{ color: "var(--muted-foreground)" }}
            >
              {locale}
            </label>
            <CommaListField
              id={`${id}-${locale}`}
              value={value[locale]}
              onChange={(next) => onChange({ ...value, [locale]: next })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageUploadField({
  id,
  label,
  url,
  onUrlChange,
  onUpload,
}: {
  id: string;
  label: string;
  url: string;
  onUrlChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    setUploading(true);
    try {
      const publicUrl = await onUpload(file);
      onUrlChange(publicUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1 min-w-0 rounded-lg border px-3 py-2"
          style={inputStyle}
        />
        {onUpload && (
          <>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              title="Upload image file"
              className="shrink-0 rounded-lg border px-3 flex items-center disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <MdUpload size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
        {url && (
          <button
            type="button"
            onClick={() => onUrlChange("")}
            title="Remove image"
            className="shrink-0 rounded-lg border px-3 flex items-center"
            style={{ borderColor: "#dc2626", color: "#dc2626" }}
          >
            <MdDeleteOutline size={18} />
          </button>
        )}
      </div>
      {uploading && (
        <div
          className="text-xs mt-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          Uploading...
        </div>
      )}
      {!uploading && url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-16 mt-2 rounded object-contain" />
      )}
    </div>
  );
}

export default function ProjectHeaderFields({
  value,
  onChange,
  onUploadThumbnail,
  onUploadOverviewImage,
}: {
  value: ProjectHeaderValue;
  onChange: (next: ProjectHeaderValue) => void;
  onUploadThumbnail?: (file: File) => Promise<string>;
  onUploadOverviewImage?: (file: File) => Promise<string>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="project-slug"
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          Slug
        </label>
        <input
          id="project-slug"
          value={value.slug}
          placeholder="tp-rfid"
          onChange={(e) => onChange({ ...value, slug: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </div>

      <LocalizedInput
        id="project-title"
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />

      <LocalizedInput
        id="project-description"
        label="Description"
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
        textarea
      />

      <LocalizedListInput
        id="project-tags"
        label="Tags (badge หน้า detail)"
        value={value.tags}
        onChange={(tags) => onChange({ ...value, tags })}
      />

      <div>
        <div
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          Filter Tags (ใช้ filter หน้า /portfolio)
        </div>
        <div className="flex gap-3 flex-wrap">
          {FILTER_TAG_OPTIONS.map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--foreground)" }}
            >
              <input
                type="checkbox"
                checked={value.filterTags.includes(tag)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...value.filterTags, tag]
                    : value.filterTags.filter((t) => t !== tag);
                  onChange({ ...value, filterTags: next });
                }}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="project-tech-summary"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Tech Summary (การ์ด, ไม่แปล)
          </label>
          <input
            id="project-tech-summary"
            value={value.techSummary}
            placeholder="Flutter, Node.js, Express, MySQL"
            onChange={(e) =>
              onChange({ ...value, techSummary: e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            htmlFor="project-technologies"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Technologies (infoBar, คั่นด้วย comma)
          </label>
          <CommaListField
            id="project-technologies"
            value={value.technologies}
            onChange={(technologies) => onChange({ ...value, technologies })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUploadField
          id="project-thumbnail"
          label="Thumbnail (การ์ด list)"
          url={value.thumbnailUrl}
          onUrlChange={(thumbnailUrl) => onChange({ ...value, thumbnailUrl })}
          onUpload={onUploadThumbnail}
        />
        <ImageUploadField
          id="project-overview-image"
          label="Overview Hero Image"
          url={value.overviewImageUrl}
          onUrlChange={(overviewImageUrl) =>
            onChange({ ...value, overviewImageUrl })
          }
          onUpload={onUploadOverviewImage}
        />
      </div>

      <LocalizedInput
        id="project-overview-alt"
        label="Overview Image Alt Text"
        value={value.overviewImageAlt}
        onChange={(overviewImageAlt) =>
          onChange({ ...value, overviewImageAlt })
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <LocalizedInput
          id="project-duration"
          label="Duration"
          value={value.duration}
          onChange={(duration) => onChange({ ...value, duration })}
        />
        <LocalizedInput
          id="project-status"
          label="Status"
          value={value.status}
          onChange={(status) => onChange({ ...value, status })}
        />
      </div>

      <div>
        <label
          htmlFor="project-company"
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          Company (ไม่แปล)
        </label>
        <input
          id="project-company"
          value={value.company}
          onChange={(e) => onChange({ ...value, company: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="project-repo"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Repo URL
          </label>
          <input
            id="project-repo"
            value={value.repoUrl ?? ""}
            onChange={(e) =>
              onChange({ ...value, repoUrl: e.target.value || null })
            }
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            htmlFor="project-demo"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Demo URL
          </label>
          <input
            id="project-demo"
            value={value.demoUrl ?? ""}
            onChange={(e) =>
              onChange({ ...value, demoUrl: e.target.value || null })
            }
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div>
          <label
            htmlFor="project-live"
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Live URL
          </label>
          <input
            id="project-live"
            value={value.liveUrl ?? ""}
            onChange={(e) =>
              onChange({ ...value, liveUrl: e.target.value || null })
            }
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
