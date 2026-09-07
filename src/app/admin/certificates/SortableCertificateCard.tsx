"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdDeleteOutline,
  MdDragIndicator,
  MdEdit,
  MdOpenInNew,
} from "react-icons/md";
import type { CertificateData } from "@/features/certificates/types";

export default function SortableCertificateCard({
  certificate,
  onEdit,
  onDelete,
  onToggleActive,
}: Readonly<{
  certificate: CertificateData;
  onEdit: (certificate: CertificateData) => void;
  onDelete: (certificate: CertificateData) => void;
  onToggleActive: (id: string, active: boolean) => void;
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: certificate.id });

  return (
    <article
      ref={setNodeRef}
      className="overflow-hidden rounded-2xl border"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      <div
        className="relative aspect-[4/3]"
        style={{ backgroundColor: "var(--muted)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={certificate.imageUrl}
          alt={certificate.title.en}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${certificate.title.en}`}
          className="absolute left-3 top-3 flex h-9 w-9 cursor-grab items-center justify-center rounded-full text-white shadow"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.62)" }}
        >
          <MdDragIndicator size={20} />
        </button>
        {!certificate.active && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
            Draft
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted-foreground)" }}
          >
            {certificate.category}
          </p>
          <h2
            className="mt-1 line-clamp-2 font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {certificate.title.en}
          </h2>
          <p
            className="mt-1 truncate text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {certificate.issuer}
          </p>
        </div>

        <label
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          <input
            type="checkbox"
            checked={certificate.active}
            onChange={(event) =>
              onToggleActive(certificate.id, event.target.checked)
            }
          />
          Active on public page
        </label>

        <div
          className="flex items-center gap-4 border-t pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={() => onEdit(certificate)}
            aria-label={`Edit ${certificate.title.en}`}
          >
            <MdEdit size={18} />
          </button>
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${certificate.title.en} PDF`}
          >
            <MdOpenInNew size={18} />
          </a>
          <button
            type="button"
            onClick={() => onDelete(certificate)}
            aria-label={`Delete ${certificate.title.en}`}
            className="ml-auto text-red-600"
          >
            <MdDeleteOutline size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
