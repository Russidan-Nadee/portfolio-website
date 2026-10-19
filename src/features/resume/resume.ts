import { randomUUID } from "node:crypto";

export type ResumeRecord = {
  storagePath: string;
  sizeBytes: number;
  updatedAt: Date;
};

export type ResumePublisher = {
  upload(storagePath: string, file: File): Promise<void>;
  save(input: {
    storagePath: string;
    sizeBytes: number;
  }): Promise<ResumeRecord>;
  remove(storagePath: string): Promise<void>;
};

export type ResumeReader = {
  loadCurrent(): Promise<ResumeRecord | null>;
  download(storagePath: string): Promise<Blob>;
};

export const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;
export const RESUME_DOWNLOAD_FILENAME = "russidan-resume.pdf";
const PDF_SIGNATURE = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
const PDF_EXTENSION = /\.pdf$/i;

export async function validateResume(file: File): Promise<void> {
  if (
    !file ||
    typeof file.size !== "number" ||
    typeof file.name !== "string" ||
    typeof file.type !== "string" ||
    typeof file.slice !== "function"
  ) {
    throw new Error("A resume PDF is required");
  }

  if (file.size <= 0) throw new Error("Resume PDF must not be empty");
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new Error("Resume PDF must be 10 MiB or smaller");
  }
  if (
    file.type.toLowerCase() !== "application/pdf" ||
    !PDF_EXTENSION.test(file.name)
  ) {
    throw new Error("Resume must be a PDF file");
  }

  const signature = new Uint8Array(
    await file.slice(0, PDF_SIGNATURE.length).arrayBuffer()
  );
  const hasPdfSignature =
    signature.length === PDF_SIGNATURE.length &&
    PDF_SIGNATURE.every((byte, index) => signature[index] === byte);
  if (!hasPdfSignature) throw new Error("Resume PDF has an invalid signature");
}

export function buildResumeStoragePath(): string {
  return `resumes/russidan-resume-${randomUUID().toLowerCase()}.pdf`;
}

export function assertResumeAdmin(
  email: string | undefined,
  allowedEmail: string | undefined
): void {
  if (!email || !allowedEmail || email !== allowedEmail) {
    throw new Error("Resume upload requires the configured admin account");
  }
}

export async function publishResume(
  file: File,
  dependencies: ResumePublisher
): Promise<ResumeRecord> {
  await validateResume(file);
  const storagePath = buildResumeStoragePath();

  await dependencies.upload(storagePath, file);
  try {
    return await dependencies.save({
      storagePath,
      sizeBytes: file.size,
    });
  } catch (error) {
    try {
      await dependencies.remove(storagePath);
    } catch {
      // Cleanup is best effort so the save failure remains observable.
    }
    throw error;
  }
}

export async function createResumeDownload(
  dependencies: ResumeReader,
  options: { preview?: boolean } = {}
): Promise<Response> {
  try {
    const current = await dependencies.loadCurrent();
    if (!current) {
      return new Response("Resume not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const blob = await dependencies.download(current.storagePath);
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${options.preview ? "inline" : "attachment"}; filename="${RESUME_DOWNLOAD_FILENAME}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Resume unavailable", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
