# Resume Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the agreed secondary resume download link beneath the Hero actions and allow the admin to replace its PDF without redeploying.

**Architecture:** Store immutable lowercase PDF paths in a private Supabase bucket and keep one current-file pointer in Prisma. A public, uncached download handler reads the pointer and returns an attachment named `russidan-resume.pdf`. Upload validation completes before storage writes, and the pointer changes only after an upload succeeds.

**Tech Stack:** Next.js App Router, Prisma/Postgres, Supabase Storage/Auth, Vitest.

**Spec:** Conversation approved on 2026-10-19: Hero only, below Projects/Contact; lowercase filenames; update through Admin; latest successful file remains downloadable. User approved the test matrix in chat.

## Global Constraints

- Work in the current shared checkout; preserve unrelated Header and CertificateCard edits.
- PDF uploads must be nonempty, have a PDF MIME type/extension and `%PDF-` signature, and be no larger than 10 MiB.
- Only the authenticated account matching `ADMIN_EMAIL` may upload.
- Use `resume-assets` as a private bucket and `resumes/russidan-resume-{uuid}.pdf` as an immutable path.
- Download filename is always `russidan-resume.pdf`; do not cache the current-file response.
- Keep existing Hero intro/scroll animations and support en/th/ja.
- Do not commit or push without a separate user instruction.

### Task 1: Validated publication and download behavior

**Files:** `src/features/resume/resume.ts`, `test/features/resume/resume.test.ts`.

**Interfaces:**

```ts
type ResumeRecord = { storagePath: string; sizeBytes: number; updatedAt: Date };
async function validateResume(file: File): Promise<void>;
function buildResumeStoragePath(): string;
function assertResumeAdmin(
  email: string | undefined,
  allowedEmail: string | undefined
): void;
async function publishResume(
  file: File,
  dependencies: ResumePublisher
): Promise<ResumeRecord>;
async function createResumeDownload(
  dependencies: ResumeReader
): Promise<Response>;
```

- [x] Write the approved test matrix before implementing behavior. Verify it fails against explicit unimplemented function stubs.
- [x] Implement PDF validation, unique lowercase names, and allowed-account checks.
- [x] Upload before updating the current pointer. If a save fails, remove only the new uploaded object; preserve the prior pointer and file.
- [x] Return 404 when no current file exists, 502 on storage failure, or a PDF attachment with `Cache-Control: no-store` on success.
- [x] Run `npm.cmd test -- test/features/resume/resume.test.ts` and confirm all agreed cases pass.

### Task 2: Persistent metadata and admin replacement

**Files:** `prisma/schema.prisma`, additive migration in `prisma/migrations`, `src/features/resume/repository.ts`, `src/features/resume/storage.ts`, `src/app/admin/resume/{page.tsx,ResumeForm.tsx,actions.ts}`, `src/app/admin/AdminChrome.tsx`.

**Database shape:**

```prisma
model Resume {
  id          String   @id @default("current")
  storagePath String
  sizeBytes   Int
  updatedAt   DateTime @updatedAt
  @@map("resumes")
}
```

- [x] Add the singleton table and generate the Prisma client.
- [x] Add repository read/upsert operations with `where: { id: "current" }`.
- [x] Add private bucket creation, PDF upload/download, and cleanup adapters.
- [x] Check the session with `getUser()` and validate its email before calling the publisher in the server action.
- [x] Build the Admin Resume form with PDF selection, current update date, pending/error/success feedback, and a current-file download link.
- [x] Revalidate the home cache and admin page after successful replacement; add Resume to Admin navigation.
- [x] Check migration status before applying the additive migration. Seed only the supplied PDF after the application paths are implemented and verified.

### Task 3: Hero download and verification

**Files:** `src/app/resume/download/route.ts`, `src/app/{page.tsx,HomeContent.tsx}`, `src/components/home/CreativeHero.{tsx,module.css}`, `locales/{en,th,ja}.json`, `scripts/import-resume.ts`.

**UI shape:**

```tsx
{
  resumeAvailable && (
    <a
      href={localizedPath("/resume/download", activeLocale)}
      download="russidan-resume.pdf"
    >
      <Download aria-hidden="true" /> {translations.home.buttons.resume} · PDF
    </a>
  );
}
```

- [x] Add the download handler using uncached current metadata and the storage adapter.
- [x] Include current-resume availability in home data and pass it to the Hero; hide the link until a file exists.
- [x] Translate the link and style it as a secondary text action with an 18px gap below the existing buttons, visible keyboard focus, and mobile sizing.
- [x] Add a local import command that uses the same validated publishing workflow for the supplied PDF, without copying the PDF into git/public.
- [x] Run typecheck, project-source lint, relevant formatting checks, and the full test suite.
- [x] Review the implementation for auth, upload failure handling, cache updates, and download behavior.
- [x] Verify public download bytes match the supplied file, check unauthenticated admin access, and inspect desktop/mobile Hero layout in all three locales.

## Verification result

- Applied the additive resume migration and imported the supplied 175607-byte PDF into private Supabase Storage.
- Public download returned 200 with no-store attachment headers; SHA-256 matched the local source.
- Anonymous Admin requests redirected to login.
- Typecheck, source lint, formatting, and 64 tests passed, including 18 new resume behavior tests.
- Checked Hero placement and translations at 320, 390, 768, 1440, and 1920px. No resume/card overlaps after accommodating short mobile screens.
- Independent focused review found no blocking correctness or security issues.
- User requested stronger visual treatment during implementation; the link now uses a secondary capsule, red PDF icon, and visible focus/hover states.
- Hovering any part of the download button renders a first-page thumbnail above it, using lazy-loaded PDF.js and its bundled worker. The preview has no visible labels, toolbar, or scrollbar; Escape and pointer leave dismiss it. Reopening after dismissal was verified in the browser.
