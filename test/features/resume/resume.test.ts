import assert from "node:assert/strict";
import { test } from "vitest";
import {
  assertResumeAdmin,
  buildResumeStoragePath,
  createResumeDownload,
  publishResume,
  validateResume,
  type ResumePublisher,
  type ResumeReader,
  type ResumeRecord,
} from "../../../src/features/resume/resume";

const PDF_HEADER = new TextEncoder().encode("%PDF-1.7\n");
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

function makeResumeFile(
  options: {
    name?: string;
    type?: string;
    size?: number;
    content?: Uint8Array;
  } = {}
): File {
  const {
    name = "russidan-resume.pdf",
    type = "application/pdf",
    size = PDF_HEADER.length,
    content,
  } = options;
  const bytes = content ?? new Uint8Array(size);
  if (!content) bytes.set(PDF_HEADER.subarray(0, size));
  return new File([bytes], name, { type });
}

type PublisherFailure = "upload" | "save" | "remove";

function makePublisherAdapter(initialCurrent: ResumeRecord | null = null) {
  let current = initialCurrent;
  const objects = new Map<string, File>();
  const calls: Array<{ operation: string; storagePath?: string }> = [];
  const failures = new Map<PublisherFailure, Error>();

  if (initialCurrent) {
    objects.set(
      initialCurrent.storagePath,
      makeResumeFile({ name: "old.pdf" })
    );
  }

  const dependencies: ResumePublisher = {
    async upload(storagePath, file) {
      calls.push({ operation: "upload", storagePath });
      const failure = failures.get("upload");
      if (failure) throw failure;
      objects.set(storagePath, file);
    },
    async save(input) {
      calls.push({ operation: "save", storagePath: input.storagePath });
      const failure = failures.get("save");
      if (failure) throw failure;
      current = {
        ...input,
        updatedAt: new Date("2026-10-19T00:00:00.000Z"),
      };
      return current;
    },
    async remove(storagePath) {
      calls.push({ operation: "remove", storagePath });
      const failure = failures.get("remove");
      if (failure) throw failure;
      objects.delete(storagePath);
    },
  };

  return {
    dependencies,
    calls,
    objects,
    failures,
    getCurrent: () => current,
  };
}

test("accepts a nonempty genuine PDF at the 10 MiB limit", async () => {
  const file = makeResumeFile({ size: MAX_RESUME_SIZE_BYTES });

  await validateResume(file);
});

test("rejects an empty PDF upload", async () => {
  const file = makeResumeFile({ size: 0 });

  await assert.rejects(() => validateResume(file));
});

test("rejects a PDF-sized upload with the wrong MIME type", async () => {
  const file = makeResumeFile({ type: "application/octet-stream" });

  await assert.rejects(() => validateResume(file));
});

test("rejects a PDF upload without a .pdf extension", async () => {
  const file = makeResumeFile({ name: "resume.txt" });

  await assert.rejects(() => validateResume(file));
});

test("rejects a non-PDF byte signature", async () => {
  const file = makeResumeFile({
    content: new TextEncoder().encode("not a PDF"),
  });

  await assert.rejects(() => validateResume(file));
});

test("rejects a PDF larger than 10 MiB", async () => {
  const file = makeResumeFile({ size: MAX_RESUME_SIZE_BYTES + 1 });

  await assert.rejects(() => validateResume(file));
});

test("builds unique lowercase immutable resume storage paths", () => {
  const first = buildResumeStoragePath();
  const second = buildResumeStoragePath();

  assert.match(first, /^resumes\/russidan-resume-[0-9a-f-]+\.pdf$/);
  assert.match(second, /^resumes\/russidan-resume-[0-9a-f-]+\.pdf$/);
  assert.notEqual(first, second);
});

test("allows only the configured authenticated admin account", () => {
  assert.doesNotThrow(() =>
    assertResumeAdmin("admin@example.com", "admin@example.com")
  );
  assert.throws(() => assertResumeAdmin(undefined, "admin@example.com"));
  assert.throws(() =>
    assertResumeAdmin("other@example.com", "admin@example.com")
  );
  assert.throws(() => assertResumeAdmin("admin@example.com", undefined));
});

test("uploads before saving and returns the newly saved resume record", async () => {
  const adapter = makePublisherAdapter();
  const file = makeResumeFile({ size: 128 });

  const record = await publishResume(file, adapter.dependencies);

  assert.deepEqual(
    adapter.calls.map(({ operation }) => operation),
    ["upload", "save"]
  );
  assert.equal(record.storagePath, adapter.calls[0]?.storagePath);
  assert.equal(record.storagePath, adapter.calls[1]?.storagePath);
  assert.equal(record.sizeBytes, file.size);
  assert.equal(adapter.objects.get(record.storagePath), file);
  assert.equal(adapter.getCurrent(), record);
});

test("does not write storage when resume validation fails", async () => {
  const adapter = makePublisherAdapter();
  const file = makeResumeFile({ type: "text/plain" });

  await assert.rejects(() => publishResume(file, adapter.dependencies));

  assert.deepEqual(adapter.calls, []);
  assert.equal(adapter.getCurrent(), null);
});

test("preserves the previous resume when upload fails", async () => {
  const previous = {
    storagePath: "resumes/russidan-resume-previous.pdf",
    sizeBytes: 64,
    updatedAt: new Date("2026-10-18T00:00:00.000Z"),
  } satisfies ResumeRecord;
  const adapter = makePublisherAdapter(previous);
  const uploadFailure = new Error("storage upload failed");
  adapter.failures.set("upload", uploadFailure);

  await assert.rejects(
    () => publishResume(makeResumeFile({ size: 128 }), adapter.dependencies),
    (error) => error === uploadFailure
  );

  assert.equal(adapter.getCurrent(), previous);
  assert.equal(adapter.objects.has(previous.storagePath), true);
  assert.deepEqual(
    adapter.calls.map(({ operation }) => operation),
    ["upload"]
  );
});

test("removes only the new object and preserves the previous resume when save fails", async () => {
  const previous = {
    storagePath: "resumes/russidan-resume-previous.pdf",
    sizeBytes: 64,
    updatedAt: new Date("2026-10-18T00:00:00.000Z"),
  } satisfies ResumeRecord;
  const adapter = makePublisherAdapter(previous);
  const saveFailure = new Error("database save failed");
  adapter.failures.set("save", saveFailure);

  await assert.rejects(
    () => publishResume(makeResumeFile({ size: 128 }), adapter.dependencies),
    (error) => error === saveFailure
  );

  const newPath = adapter.calls[0]?.storagePath;
  assert.ok(newPath);
  assert.equal(adapter.getCurrent(), previous);
  assert.equal(adapter.objects.has(previous.storagePath), true);
  assert.equal(adapter.objects.has(newPath), false);
  assert.deepEqual(
    adapter.calls.map(({ operation }) => operation),
    ["upload", "save", "remove"]
  );
  assert.equal(adapter.calls[2]?.storagePath, newPath);
});

test("keeps the original save failure when cleanup also fails", async () => {
  const adapter = makePublisherAdapter();
  const saveFailure = new Error("database save failed");
  adapter.failures.set("save", saveFailure);
  adapter.failures.set("remove", new Error("cleanup failed"));

  await assert.rejects(
    () => publishResume(makeResumeFile(), adapter.dependencies),
    (error) => error === saveFailure
  );
});

test("returns 404 without touching storage when no current resume exists", async () => {
  let downloadCalls = 0;
  const reader: ResumeReader = {
    async loadCurrent() {
      return null;
    },
    async download() {
      downloadCalls += 1;
      return new Blob();
    },
  };

  const response = await createResumeDownload(reader);

  assert.equal(response.status, 404);
  assert.equal(downloadCalls, 0);
});

test("maps database failures to a generic 502 response", async () => {
  const internalFailure = "DATABASE_PASSWORD=do-not-expose";
  const reader: ResumeReader = {
    async loadCurrent() {
      throw new Error(internalFailure);
    },
    async download() {
      return new Blob();
    },
  };

  const response = await createResumeDownload(reader);

  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), new RegExp(internalFailure));
});

test("maps storage failures to a generic 502 response", async () => {
  const record = {
    storagePath: "resumes/russidan-resume-current.pdf",
    sizeBytes: 128,
    updatedAt: new Date("2026-10-19T00:00:00.000Z"),
  } satisfies ResumeRecord;
  const internalFailure = "storage service token";
  const reader: ResumeReader = {
    async loadCurrent() {
      return record;
    },
    async download() {
      throw new Error(internalFailure);
    },
  };

  const response = await createResumeDownload(reader);

  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), new RegExp(internalFailure));
});

test("returns the current PDF as an uncached attachment with the fixed filename", async () => {
  const record = {
    storagePath: "resumes/russidan-resume-current.pdf",
    sizeBytes: 16,
    updatedAt: new Date("2026-10-19T00:00:00.000Z"),
  } satisfies ResumeRecord;
  const bytes = new Uint8Array([
    0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
  ]);
  let downloadedPath = "";
  const reader: ResumeReader = {
    async loadCurrent() {
      return record;
    },
    async download(storagePath) {
      downloadedPath = storagePath;
      return new Blob([bytes], { type: "application/pdf" });
    },
  };

  const response = await createResumeDownload(reader);

  assert.equal(response.status, 200);
  assert.equal(downloadedPath, record.storagePath);
  assert.equal(response.headers.get("Content-Type"), "application/pdf");
  assert.equal(
    response.headers.get("Content-Disposition"),
    'attachment; filename="russidan-resume.pdf"'
  );
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});

test("serves the current PDF inline for preview instead of triggering a download", async () => {
  const reader: ResumeReader = {
    async loadCurrent() {
      return {
        storagePath: "resumes/russidan-resume-latest.pdf",
        sizeBytes: 16,
        updatedAt: new Date("2026-10-19T00:00:00.000Z"),
      };
    },
    async download(path) {
      assert.equal(path, "resumes/russidan-resume-latest.pdf");
      return new Blob(["%PDF-1.7\npreview"], { type: "application/pdf" });
    },
  };

  const response = await createResumeDownload(reader, { preview: true });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "application/pdf");
  assert.equal(
    response.headers.get("Content-Disposition"),
    'inline; filename="russidan-resume.pdf"'
  );
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(await response.text(), "%PDF-1.7\npreview");
});
