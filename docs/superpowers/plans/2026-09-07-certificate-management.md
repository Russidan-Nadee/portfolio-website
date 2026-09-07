# Certificate Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multilingual, card-first `/certificate` showcase backed by a Prisma/Supabase certificate CMS and populate it with the four supplied PDFs.

**Architecture:** A focused `src/features/certificates` domain module owns types, parsing, validation, localization fallback, and category metadata. Server components query Prisma; client components render the public gallery and admin board. Server actions validate inputs, upload fixed-slot assets to a dedicated Supabase bucket, mutate Prisma, and revalidate both public and admin routes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Prisma 7/PostgreSQL, Supabase Storage, Tailwind CSS 4, dnd-kit, Node test runner through `tsx`, Python/PyMuPDF for one-time PDF inspection and preview rendering.

**Spec:** `docs/superpowers/specs/2026-09-07-certificate-management-design.md`

## Global Constraints

- Public route is `/certificate`; admin route is `/admin/certificates`.
- Binary assets live in the public `certificate-assets` Supabase bucket; database rows store URLs and metadata only.
- PDF uploads accept only `application/pdf` up to 15 MB.
- Preview uploads accept PNG, JPEG, or WebP up to 5 MB.
- Certificate titles and all interface copy support `th`, `en`, and `ja`.
- Public queries return only `active=true` records ordered by `order ASC`.
- Missing certificate metadata from the supplied PDFs remains absent and is never guessed.
- Existing untracked `docs/superpowers/specs/2026-09-07-admin-traffic-analytics-design.md` is not modified or committed.
- Unit tests are written test-first and run through a repository `test` script.

## File Structure

- `src/features/certificates/types.ts`: shared certificate, locale, category, and input types.
- `src/features/certificates/certificate.ts`: pure input parsing, validation, asset validation, locale fallback, and date formatting.
- `src/features/certificates/certificate.test.ts`: behavior tests for the pure domain module.
- `prisma/schema.prisma`: new `Certificate` persistence model.
- `prisma/migrations/20260907000000_add_certificate/migration.sql`: additive table and index migration.
- `src/app/admin/certificates/actions.ts`: storage and Prisma server actions.
- `src/app/admin/certificates/page.tsx`: admin data loader.
- `src/app/admin/certificates/CertificatesBoard.tsx`: CRUD modal, uploads, optimistic sorting/toggle behavior.
- `src/app/admin/certificates/SortableCertificateCard.tsx`: sortable admin summary card.
- `src/app/certificate/page.tsx`: public Prisma query and error boundary behavior.
- `src/app/certificate/CertificateContent.tsx`: localized gallery presentation.
- `src/components/certificate/CertificateCard.tsx`: accessible card markup and actions.
- `scripts/import-certificates.ts`: idempotent upload/upsert for the four local source PDFs and rendered previews.
- `scripts/certificate-manifest.ts`: stable source filenames, slugs, verified metadata, and categories.
- `next.config.ts`: raise server-action body limit above the 15 MB PDF limit.
- `src/components/layout/Header.tsx`, `src/app/admin/AdminChrome.tsx`, and three locale JSON files: navigation and localized copy.
- `tmp/pdfs/`: ignored intermediate page renders used only for visual inspection/import.

---

### Task 1: Certificate Domain Contract and Test Harness

**Files:**

- Modify: `package.json`
- Create: `src/features/certificates/types.ts`
- Create: `src/features/certificates/certificate.test.ts`
- Create: `src/features/certificates/certificate.ts`

**Interfaces:**

- Produces: `CertificateCategory`, `CertificateData`, `CertificateInput`, `LocalizedText`, `parseCertificateFormData(formData)`, `validateCertificateAsset(file, kind)`, `getLocalizedCertificateTitle(title, locale)`, and `formatCertificateDate(issuedAt, locale)`.
- Consumes: browser/Node `FormData` and file metadata `{ name, type, size }` only; no database or network dependency.

- [ ] **Step 1: Add the test command and write failing domain tests**

Add `"test": "tsx --test src/features/certificates/certificate.test.ts"` to `scripts`, then create table-driven Node tests covering:

```ts
test("parses and trims a complete certificate form", () => {
  const form = certificateForm({
    slug: "  growth-mindset  ",
    "title-th": "  Growth Mindset  ",
    "title-en": " Growth Mindset ",
    "title-ja": " グロースマインドセット ",
    issuer: " FutureSkill ",
    issuedAt: "2025-08-13",
    category: "professional",
    imageUrl: "https://example.com/preview.webp",
    pdfUrl: "https://example.com/certificate.pdf",
    credentialUrl: "https://example.com/verify",
    active: "on",
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
      { name: "preview.webp", type: "image/webp", size: 5 * 1024 * 1024 },
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
        { name: "preview.png", type: "image/png", size: 5 * 1024 * 1024 + 1 },
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
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd test`

Expected: FAIL because `certificate.ts` and its exported functions do not exist.

- [ ] **Step 3: Implement the minimal domain module**

Define the controlled categories and parsing contract:

```ts
export const CERTIFICATE_CATEGORIES = [
  "development",
  "technology",
  "finance",
  "professional",
] as const;

export function validateCertificateAsset(
  file: Pick<File, "name" | "type" | "size">,
  kind: "pdf" | "preview"
): void {
  const allowed =
    kind === "pdf"
      ? ["application/pdf"]
      : ["image/png", "image/jpeg", "image/webp"];
  const limit = kind === "pdf" ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
  if (!allowed.includes(file.type))
    throw new Error(
      kind === "pdf" ? "Select a PDF file" : "Select a PNG, JPEG, or WebP image"
    );
  if (file.size > limit)
    throw new Error(
      `${kind === "pdf" ? "PDF" : "Preview"} must be ${kind === "pdf" ? 15 : 5} MB or smaller`
    );
}
```

`parseCertificateFormData` trims strings, validates a lowercase ASCII slug, requires all titles/issuer/category/asset URLs, accepts only `http:` or `https:` URLs, parses an optional strict `YYYY-MM-DD` as UTC midnight, and returns `CertificateInput`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm.cmd test`

Expected: all domain tests PASS with zero warnings.

- [ ] **Step 5: Commit the domain contract**

```powershell
git add -- package.json src/features/certificates
git commit -m "test: define certificate domain behavior"
```

### Task 2: Prisma Certificate Persistence

**Files:**

- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260907000000_add_certificate/migration.sql`
- Generated: `src/generated/prisma/*`

**Interfaces:**

- Consumes: `CertificateInput` field names from Task 1.
- Produces: `prisma.certificate` CRUD API and PostgreSQL `certificates` table.

- [ ] **Step 1: Add the Prisma model and additive SQL migration**

Add:

```prisma
model Certificate {
  id            String   @id @default(cuid())
  slug          String   @unique
  order         Int
  title         Json
  issuer        String
  issuedAt      DateTime?
  category      String
  imageUrl      String
  pdfUrl        String
  credentialUrl String?
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([active, order])
  @@map("certificates")
}
```

The SQL migration creates the table, unique slug index, and compound public-query index without altering an existing table.

- [ ] **Step 2: Validate schema and generate the client**

Run: `npx.cmd prisma validate`

Expected: `The schema at prisma/schema.prisma is valid`.

Run: `npx.cmd prisma generate`

Expected: Prisma Client generated successfully.

- [ ] **Step 3: Re-run domain tests and typecheck**

Run: `npm.cmd test`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: exit 0.

- [ ] **Step 4: Commit persistence changes**

```powershell
git add -- prisma/schema.prisma prisma/migrations src/generated/prisma
git commit -m "feat: add certificate persistence model"
```

### Task 3: Certificate Storage and Server Actions

**Files:**

- Create: `src/app/admin/certificates/actions.ts`
- Modify: `next.config.ts`
- Modify: `src/features/certificates/certificate.test.ts`
- Modify: `src/features/certificates/certificate.ts`

**Interfaces:**

- Consumes: Task 1 parsing and asset validators; `prisma.certificate`; `createSupabaseServerClient()`.
- Produces: `uploadCertificatePdf`, `uploadCertificatePreview`, `createCertificate`, `updateCertificate`, `toggleCertificateActive`, `reorderCertificates`, and `deleteCertificate` server actions.

- [ ] **Step 1: Write failing fixed storage-path tests**

Add tests proving Unicode or whitespace never reaches Storage paths:

```ts
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
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd test`

Expected: FAIL because `buildCertificateAssetPath` is missing.

- [ ] **Step 3: Implement path builder and server actions**

Use bucket `certificate-assets`, validate `File` before upload, and upload with stable paths and `upsert: true`. Each successful mutation calls:

```ts
function revalidateCertificatePaths() {
  revalidatePath("/certificate");
  revalidatePath("/admin/certificates");
}
```

Create uses the current last `order + 1`; update retains order; reorder uses `prisma.$transaction`; delete removes the database row then calls Storage `.remove()` for the PDF and preview paths. Return or throw concrete errors. Increase `experimental.serverActions.bodySizeLimit` from `5mb` to `20mb`.

- [ ] **Step 4: Run tests, typecheck, and verify GREEN**

Run: `npm.cmd test`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: exit 0.

- [ ] **Step 5: Commit the service boundary**

```powershell
git add -- src/features/certificates src/app/admin/certificates/actions.ts next.config.ts
git commit -m "feat: add certificate storage and server actions"
```

### Task 4: Certificate Admin UI

**Files:**

- Create: `src/app/admin/certificates/page.tsx`
- Create: `src/app/admin/certificates/CertificatesBoard.tsx`
- Create: `src/app/admin/certificates/SortableCertificateCard.tsx`
- Modify: `src/app/admin/AdminChrome.tsx`

**Interfaces:**

- Consumes: `CertificateData`, categories, and Task 3 server actions.
- Produces: protected list/create/edit/reorder/publish/delete interface at `/admin/certificates`.

- [ ] **Step 1: Create the server page and client board**

Query every certificate ordered ascending and pass serializable data to `CertificatesBoard`. The board owns local optimistic ordering, active toggle rollback, modal state, upload state, and save state. Add `{ label: "Certificates", href: "/admin/certificates" }` to Admin navigation.

The form contains exact fields `slug`, `title-th`, `title-en`, `title-ja`, `issuer`, `issuedAt`, `category`, `credentialUrl`, `imageUrl`, `pdfUrl`, and `active`. Upload buttons call the PDF/preview actions and write returned URLs into state before create/update.

- [ ] **Step 2: Create accessible sortable cards and modal behavior**

Reuse dnd-kit with `PointerSensor({ activationConstraint: { distance: 5 } })` and `rectSortingStrategy`. Each card exposes edit, active checkbox, PDF preview link, drag handle, and delete button. The modal closes on Escape or backdrop, stops propagation inside, uses `role="dialog"`, associates every label and field, and disables save while required values are missing or an upload/save is active.

- [ ] **Step 3: Verify UI compilation**

Run: `npm.cmd run typecheck`

Expected: exit 0 with no action serialization or React prop errors.

Run: `npm.cmd test`

Expected: PASS.

- [ ] **Step 4: Commit admin UI**

```powershell
git add -- src/app/admin/certificates src/app/admin/AdminChrome.tsx
git commit -m "feat: add certificate admin board"
```

### Task 5: Public Certificate Gallery and Localization

**Files:**

- Create: `src/app/certificate/page.tsx`
- Create: `src/app/certificate/CertificateContent.tsx`
- Create: `src/components/certificate/CertificateCard.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `locales/en.json`
- Modify: `locales/th.json`
- Modify: `locales/ja.json`
- Modify: `src/features/certificates/certificate.test.ts`
- Modify: `src/features/certificates/certificate.ts`

**Interfaces:**

- Consumes: active ordered `CertificateData[]`, locale JSON, title fallback and date formatter.
- Produces: responsive public gallery and localized primary navigation.

- [ ] **Step 1: Write failing date-format behavior tests**

```ts
test("formats the same UTC issue date for each supported locale", () => {
  const date = new Date("2025-08-13T00:00:00.000Z");
  assert.equal(formatCertificateDate(date, "en"), "August 13, 2025");
  assert.equal(formatCertificateDate(date, "th"), "13 สิงหาคม 2568");
  assert.equal(formatCertificateDate(date, "ja"), "2025年8月13日");
});

test("returns an empty label when no issue date exists", () => {
  assert.equal(formatCertificateDate(null, "en"), "");
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm.cmd test`

Expected: FAIL because date formatting is missing or does not match the explicit locale contract.

- [ ] **Step 3: Implement the public query and gallery**

The page queries:

```ts
prisma.certificate.findMany({
  where: { active: true },
  orderBy: { order: "asc" },
});
```

Render a compact hero and `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Each `CertificateCard` uses an aspect-ratio image, category accent/badge, localized title, issuer, localized date, `Open PDF`, `Download`, and conditional `Verify`. Use semantic links, focus-visible styling, `target="_blank"`, and `rel="noopener noreferrer"`. Add reduced-motion CSS for shine/lift animation.

- [ ] **Step 4: Add navigation and exact locale keys**

Add `header.nav.certificate` and a `certificate` object containing `title`, `subtitle`, `empty`, `unavailable`, `issued`, `openPdf`, `download`, `verify`, and category labels in all three locale files. Add the route to both Header menus between Projects and Contact and activate it with `pathname.startsWith("/certificate")`.

- [ ] **Step 5: Run tests and typecheck; verify GREEN**

Run: `npm.cmd test`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: exit 0.

- [ ] **Step 6: Commit public gallery**

```powershell
git add -- src/app/certificate src/components/certificate src/components/layout/Header.tsx src/features/certificates locales
git commit -m "feat: add public certificate gallery"
```

### Task 6: Inspect, Render, and Import the Four PDFs

**Files:**

- Create: `scripts/certificate-manifest.ts`
- Create: `scripts/import-certificates.ts`
- Modify: `package.json`
- Temporary: `tmp/pdfs/*`

**Interfaces:**

- Consumes: four exact PDF filenames in `%USERPROFILE%/Downloads`, Supabase environment variables, and Prisma database URL.
- Produces: public `certificate-assets` objects and four idempotently upserted certificate rows.

- [ ] **Step 1: Install isolated PDF inspection dependencies**

Install `pypdf` and `pymupdf` into a workspace-local temporary tool directory, not the project runtime dependencies:

```powershell
python -m pip install --target .codex-tmp/pdf-tools pypdf pymupdf
```

- [ ] **Step 2: Extract text and render first pages**

Use Python with the temporary module path to print page-one text and render page one at 2x scale into `tmp/pdfs/<slug>.png`. Inspect every PNG visually. Record issuer/title/date only when visible in the PDF.

- [ ] **Step 3: Create the manifest and import script**

The manifest exports four entries with exact source filename, stable slug, verified `title`, `issuer`, nullable ISO `issuedAt`, category, and preview path. The import script:

```ts
for (const item of CERTIFICATE_MANIFEST) {
  await ensurePublicCertificateBucket();
  const pdfUrl = await uploadBuffer(
    `${base}/${item.sourceFilename}`,
    buildCertificateAssetPath(item.slug, "pdf"),
    "application/pdf"
  );
  const imageUrl = await uploadBuffer(
    item.previewPath,
    buildCertificateAssetPath(item.slug, "preview"),
    "image/png"
  );
  await prisma.certificate.upsert({
    where: { slug: item.slug },
    update: { ...item.metadata, pdfUrl, imageUrl },
    create: {
      ...item.metadata,
      slug: item.slug,
      order: item.order,
      pdfUrl,
      imageUrl,
      active: true,
    },
  });
}
```

Add `"certificates:import": "tsx scripts/import-certificates.ts"` to `package.json`. Validate all four source files before the first upload so a missing file cannot cause a partial import.

- [ ] **Step 4: Apply migration and run the import**

Run: `npx.cmd prisma migrate deploy`

Expected: the additive certificate migration applies successfully.

Run: `npm.cmd run certificates:import`

Expected: four successful upserts and public URLs for four PDFs and four previews.

- [ ] **Step 5: Verify database records and remote assets**

Run a read-only `tsx` check that asserts count `4`, active count `4`, orders `[0,1,2,3]`, and non-empty HTTP image/PDF URLs. Fetch each public URL and require status 200 plus the expected content type.

- [ ] **Step 6: Remove temporary rendered files and commit reusable import code**

Delete only verified files under the exact workspace `tmp/pdfs` directory after the import. Do not delete Downloads sources. Commit the manifest, import script, and package command; do not commit PDF or thumbnail binaries.

```powershell
git add -- scripts/certificate-manifest.ts scripts/import-certificates.ts package.json
git commit -m "feat: import initial certificates"
```

### Task 7: Full Verification and Review

**Files:**

- Review: every file changed since spec commit `730f1b3`

**Interfaces:**

- Consumes: completed Tasks 1-6.
- Produces: fresh evidence that automated checks, routes, database records, and assets work together.

- [ ] **Step 1: Run the full automated verification suite**

Run each command independently and require exit 0:

```powershell
npm.cmd test
npm.cmd run typecheck
npx.cmd eslint .
npm.cmd run build
git diff --check 730f1b3..HEAD
```

- [ ] **Step 2: Run route smoke checks**

Start the production server, request `/certificate`, `/admin/certificates`, and all four PDF URLs, and verify successful statuses or the expected authentication behavior. Confirm the rendered certificate HTML contains all four verified titles.

- [ ] **Step 3: Perform visual QA**

Inspect `/certificate` in light/dark themes and mobile/desktop widths. Verify card image crops, readable metadata, keyboard focus, action visibility, responsive column counts, navigation active state, and reduced-motion behavior. Inspect the admin list and edit modal without changing unrelated records.

- [ ] **Step 4: Review requirements and diff**

Compare the implementation line by line with `docs/superpowers/specs/2026-09-07-certificate-management-design.md`. Confirm no credential secrets, Downloads paths, temporary renders, or unrelated analytics spec entered a commit. Review security of URLs, upload MIME/size checks, target rel attributes, and admin mutations.

- [ ] **Step 5: Resolve review findings with TDD**

For any behavior bug, first add a failing regression test that names the break, verify RED, implement the minimal fix, and verify GREEN. Re-run the complete suite after the final fix.

- [ ] **Step 6: Commit final integration fixes when the review changed code**

Use `git status --short` to list the exact changed certificate files, stage each of those literal paths with `git add --`, verify the cached diff excludes unrelated files, then run:

```powershell
git commit -m "fix: harden certificate management flow"
```
