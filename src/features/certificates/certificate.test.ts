import assert from "node:assert/strict";
import { test } from "vitest";
import {
  buildCertificateAssetPath,
  assertCertificateSlugAvailable,
  formatCertificateDate,
  getLocalizedCertificateTitle,
  parseCertificateFormData,
  validateCertificateAsset,
} from "./certificate";

const validFields: Record<string, string> = {
  slug: "growth-mindset",
  "title-th": "Growth Mindset",
  "title-en": "Growth Mindset",
  "title-ja": "グロースマインドセット",
  issuer: "FutureSkill",
  issuedAt: "2025-08-13",
  category: "professional",
  imageUrl: "https://example.com/preview.webp",
  pdfUrl: "https://example.com/certificate.pdf",
  credentialUrl: "https://example.com/verify",
  active: "on",
};

function certificateForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  const values = { ...validFields, ...overrides };
  for (const [key, value] of Object.entries(values)) {
    form.set(key, value);
  }
  return form;
}

test("parses and trims a complete certificate form", () => {
  const form = certificateForm({
    slug: "  growth-mindset  ",
    "title-th": "  Growth Mindset  ",
    "title-en": " Growth Mindset ",
    "title-ja": " グロースマインドセット ",
    issuer: " FutureSkill ",
  });

  assert.deepEqual(parseCertificateFormData(form), {
    slug: "growth-mindset",
    title: {
      th: "Growth Mindset",
      en: "Growth Mindset",
      ja: "グロースマインドセット",
    },
    issuer: "FutureSkill",
    issuedAt: new Date("2025-08-13T00:00:00.000Z"),
    category: "professional",
    imageUrl: "https://example.com/preview.webp",
    pdfUrl: "https://example.com/certificate.pdf",
    credentialUrl: "https://example.com/verify",
    active: true,
  });
});

test("rejects a missing localized title", () => {
  assert.throws(
    () => parseCertificateFormData(certificateForm({ "title-ja": "" })),
    /Title is required for th, en, and ja/
  );
});

test("rejects unsafe slugs", () => {
  assert.throws(
    () => parseCertificateFormData(certificateForm({ slug: "เงินทอง" })),
    /lowercase letters, numbers, and hyphens/
  );
});

test("rejects invalid date and URL values", () => {
  assert.throws(
    () => parseCertificateFormData(certificateForm({ issuedAt: "13/08/2025" })),
    /YYYY-MM-DD/
  );
  assert.throws(
    () =>
      parseCertificateFormData(
        certificateForm({ pdfUrl: "javascript:alert(1)" })
      ),
    /valid public URL/
  );
});

test("accepts assets exactly at their size limits", () => {
  assert.doesNotThrow(() =>
    validateCertificateAsset(
      {
        name: "certificate.pdf",
        type: "application/pdf",
        size: 15 * 1024 * 1024,
      },
      "pdf"
    )
  );
  assert.doesNotThrow(() =>
    validateCertificateAsset(
      {
        name: "preview.webp",
        type: "image/webp",
        size: 5 * 1024 * 1024,
      },
      "preview"
    )
  );
});

test("rejects mismatched types and oversized assets", () => {
  assert.throws(
    () =>
      validateCertificateAsset(
        { name: "fake.pdf", type: "text/plain", size: 10 },
        "pdf"
      ),
    /PDF file/
  );
  assert.throws(
    () =>
      validateCertificateAsset(
        {
          name: "preview.png",
          type: "image/png",
          size: 5 * 1024 * 1024 + 1,
        },
        "preview"
      ),
    /5 MB/
  );
});

test("uses English then Thai then Japanese as title fallback", () => {
  assert.equal(
    getLocalizedCertificateTitle({ th: "ไทย", en: "", ja: "日本語" }, "en"),
    "ไทย"
  );
  assert.equal(
    getLocalizedCertificateTitle({ th: "", en: "", ja: "日本語" }, "en"),
    "日本語"
  );
});

test("builds fixed certificate asset paths from a safe slug", () => {
  assert.equal(
    buildCertificateAssetPath("growth-mindset", "pdf"),
    "certificates/growth-mindset/certificate.pdf"
  );
  assert.equal(
    buildCertificateAssetPath("growth-mindset", "preview"),
    "certificates/growth-mindset/preview"
  );
});

test("rejects unsafe slugs before building an asset path", () => {
  assert.throws(
    () => buildCertificateAssetPath("../secret", "pdf"),
    /lowercase letters, numbers, and hyphens/
  );
});

test("formats the same UTC issue date for each supported locale", () => {
  const date = new Date("2025-08-13T00:00:00.000Z");
  assert.equal(formatCertificateDate(date, "en"), "August 13, 2025");
  assert.equal(formatCertificateDate(date, "th"), "13 สิงหาคม 2568");
  assert.equal(formatCertificateDate(date, "ja"), "2025年8月13日");
});

test("returns an empty label when no issue date exists", () => {
  assert.equal(formatCertificateDate(null, "en"), "");
});

test("rejects a slug owned by a different certificate before upload", () => {
  assert.throws(
    () => assertCertificateSlugAvailable("existing-id", null),
    /Slug is already in use/
  );
  assert.throws(
    () => assertCertificateSlugAvailable("existing-id", "editing-id"),
    /Slug is already in use/
  );
});

test("allows an existing certificate to replace its own assets", () => {
  assert.doesNotThrow(() =>
    assertCertificateSlugAvailable("existing-id", "existing-id")
  );
  assert.doesNotThrow(() => assertCertificateSlugAvailable(null, null));
});
