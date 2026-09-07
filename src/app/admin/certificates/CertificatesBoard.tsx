"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { MdClose, MdPictureAsPdf, MdUpload } from "react-icons/md";
import {
  CERTIFICATE_CATEGORIES,
  type CertificateData,
  type LocalizedText,
} from "@/features/certificates/types";
import {
  createCertificate,
  deleteCertificate,
  reorderCertificates,
  toggleCertificateActive,
  updateCertificate,
  uploadCertificatePdf,
  uploadCertificatePreview,
} from "./actions";
import SortableCertificateCard from "./SortableCertificateCard";

const blankTitle = (): LocalizedText => ({ th: "", en: "", ja: "" });

const blankCertificate = (): CertificateData => ({
  id: "",
  slug: "",
  order: 0,
  title: blankTitle(),
  issuer: "",
  issuedAt: null,
  category: "professional",
  imageUrl: "",
  pdfUrl: "",
  credentialUrl: null,
  active: true,
});

export default function CertificatesBoard({
  initialItems,
}: Readonly<{ initialItems: CertificateData[] }>) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<CertificateData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"pdf" | "preview" | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (!editing) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditing(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [editing]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map(
      (item, order) => ({ ...item, order })
    );
    setItems(reordered);
    try {
      await reorderCertificates(reordered.map((item) => item.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Reorder failed");
      setItems(initialItems);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, active } : item))
    );
    try {
      await toggleCertificateActive(id, active);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
      setItems(initialItems);
    }
  };

  const handleDelete = async (certificate: CertificateData) => {
    if (!confirm(`Delete “${certificate.title.en}”?`)) return;
    setItems((current) => current.filter((item) => item.id !== certificate.id));
    try {
      await deleteCertificate(certificate.id);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
      setItems(initialItems);
    }
  };

  const handleUpload = async (kind: "pdf" | "preview", file?: File) => {
    if (!editing || !file) return;
    if (!editing.slug.trim()) {
      alert("Enter a safe slug before uploading files");
      return;
    }
    setUploading(kind);
    try {
      const formData = new FormData();
      formData.set("slug", editing.slug);
      formData.set("certificateId", editing.id);
      formData.set("file", file);
      const url =
        kind === "pdf"
          ? await uploadCertificatePdf(formData)
          : await uploadCertificatePreview(formData);
      setEditing((current) =>
        current
          ? { ...current, [kind === "pdf" ? "pdfUrl" : "imageUrl"]: url }
          : current
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("slug", editing.slug);
    formData.set("title-th", editing.title.th);
    formData.set("title-en", editing.title.en);
    formData.set("title-ja", editing.title.ja);
    formData.set("issuer", editing.issuer);
    formData.set("issuedAt", editing.issuedAt ?? "");
    formData.set("category", editing.category);
    formData.set("imageUrl", editing.imageUrl);
    formData.set("pdfUrl", editing.pdfUrl);
    formData.set("credentialUrl", editing.credentialUrl ?? "");
    if (editing.active) formData.set("active", "on");

    try {
      if (editing.id) {
        await updateCertificate(editing.id, formData);
        setItems((current) =>
          current.map((item) => (item.id === editing.id ? editing : item))
        );
      } else {
        const id = await createCertificate(formData);
        setItems((current) => [
          ...current,
          {
            ...editing,
            id,
            order: Math.max(-1, ...current.map((item) => item.order)) + 1,
          },
        ]);
      }
      setEditing(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateTitle = (locale: keyof LocalizedText, value: string) => {
    setEditing((current) =>
      current
        ? { ...current, title: { ...current.title, [locale]: value } }
        : current
    );
  };

  const canSave = Boolean(
    editing?.slug &&
    editing.title.th &&
    editing.title.en &&
    editing.title.ja &&
    editing.issuer &&
    editing.imageUrl &&
    editing.pdfUrl &&
    !uploading
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Manage public certificates, files, and display order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blankCertificate())}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
          }}
        >
          + New Certificate
        </button>
      </div>

      <DndContext
        id="admin-certificates"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((certificate) => (
              <SortableCertificateCard
                key={certificate.id}
                certificate={certificate}
                onEdit={(item) =>
                  setEditing({ ...item, title: { ...item.title } })
                }
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            borderColor: "var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          No certificates yet. Create the first card to get started.
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={() => setEditing(null)}
        >
          <form
            onSubmit={handleSubmit}
            role="dialog"
            aria-modal="true"
            aria-label={editing.id ? "Edit certificate" : "Add certificate"}
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editing.id ? "Edit Certificate" : "Add Certificate"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close certificate form"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Slug" htmlFor="certificate-slug">
                  <input
                    id="certificate-slug"
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    className="field"
                  />
                </Field>
                <Field label="Issuer" htmlFor="certificate-issuer">
                  <input
                    id="certificate-issuer"
                    value={editing.issuer}
                    onChange={(e) =>
                      setEditing({ ...editing, issuer: e.target.value })
                    }
                    required
                    className="field"
                  />
                </Field>
              </div>

              <div>
                <p
                  className="mb-2 text-sm font-medium"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Localized title
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {(["th", "en", "ja"] as const).map((locale) => (
                    <Field
                      key={locale}
                      label={locale.toUpperCase()}
                      htmlFor={`certificate-title-${locale}`}
                    >
                      <input
                        id={`certificate-title-${locale}`}
                        value={editing.title[locale]}
                        onChange={(e) => updateTitle(locale, e.target.value)}
                        required
                        className="field"
                      />
                    </Field>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Issue date" htmlFor="certificate-issued-at">
                  <input
                    id="certificate-issued-at"
                    type="date"
                    value={editing.issuedAt ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        issuedAt: e.target.value || null,
                      })
                    }
                    className="field"
                  />
                </Field>
                <Field label="Category" htmlFor="certificate-category">
                  <select
                    id="certificate-category"
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category: e.target.value as CertificateData["category"],
                      })
                    }
                    className="field"
                  >
                    {CERTIFICATE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Verification URL (optional)"
                  htmlFor="certificate-credential-url"
                >
                  <input
                    id="certificate-credential-url"
                    type="url"
                    value={editing.credentialUrl ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        credentialUrl: e.target.value || null,
                      })
                    }
                    className="field"
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AssetField
                  label="Certificate PDF"
                  value={editing.pdfUrl}
                  uploading={uploading === "pdf"}
                  icon={<MdPictureAsPdf size={22} />}
                  onChoose={() => pdfInputRef.current?.click()}
                >
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => handleUpload("pdf", e.target.files?.[0])}
                  />
                </AssetField>
                <AssetField
                  label="Card preview"
                  value={editing.imageUrl}
                  uploading={uploading === "preview"}
                  icon={<MdUpload size={22} />}
                  onChoose={() => previewInputRef.current?.click()}
                >
                  <input
                    ref={previewInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleUpload("preview", e.target.files?.[0])
                    }
                  />
                </AssetField>
              </div>

              {editing.imageUrl && (
                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editing.imageUrl}
                    alt="Certificate card preview"
                    className="max-h-64 w-full object-contain"
                    style={{ backgroundColor: "var(--muted)" }}
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) =>
                    setEditing({ ...editing, active: e.target.checked })
                  }
                />
                Active on public page
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2 text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSave || saving}
                className="rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-40"
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                {saving ? "Saving..." : "Save Certificate"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx global>{`
        .field {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 0.65rem;
          background: var(--background);
          color: var(--foreground);
          padding: 0.65rem 0.75rem;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: Readonly<{ label: string; htmlFor: string; children: React.ReactNode }>) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span
        className="mb-1 block text-sm font-medium"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function AssetField({
  label,
  value,
  uploading,
  icon,
  onChoose,
  children,
}: Readonly<{
  label: string;
  value: string;
  uploading: boolean;
  icon: React.ReactNode;
  onChoose: () => void;
  children: React.ReactNode;
}>) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-sm font-medium">{label}</p>
      <p
        className="mt-1 truncate text-xs"
        title={value}
        style={{ color: "var(--muted-foreground)" }}
      >
        {value || "No file uploaded"}
      </p>
      <button
        type="button"
        onClick={onChoose}
        disabled={uploading}
        className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
        style={{ borderColor: "var(--border)" }}
      >
        {icon}
        {uploading ? "Uploading..." : "Choose file"}
      </button>
      {children}
    </div>
  );
}
