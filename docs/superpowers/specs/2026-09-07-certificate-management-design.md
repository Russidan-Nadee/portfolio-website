# Certificate Showcase and CMS Design

## Summary

Add a public, card-first certificate showcase at `/certificate` and a protected certificate management area at `/admin/certificates`. Certificate metadata lives in PostgreSQL through Prisma. Original PDF files and card preview images can live in a dedicated public Supabase Storage bucket after the admin uploads them. Four local PDFs stored outside the repository provide the initial metadata, seeded as drafts without uploading their binary files.

The feature follows the portfolio's existing multilingual, theme, responsive, animation, Prisma, Supabase, and admin interaction patterns. It does not introduce a certificate detail page; the original PDF is the detailed artifact.

## Goals

- Add `Certificate` to the desktop and mobile primary navigation.
- Present certificates as visually prominent, responsive cards.
- Allow an authenticated admin to create, edit, publish, reorder, and delete certificates without editing source code.
- Preserve and expose each original PDF for viewing and downloading.
- Support Thai, English, and Japanese UI text and certificate titles.
- Import the four supplied certificates without inventing issuer or date metadata.

## Non-goals

- OCR, automatic translation, or automatic metadata extraction during normal admin uploads.
- A public certificate detail route.
- Private or signed certificate access; these portfolio artifacts are public.
- Certificate verification with issuing institutions unless an optional external credential URL is provided.
- New unit-test code before the user reviews and approves the proposed test matrix.

## Initial Certificates

The implementation reads these files from the local folder configured by `CERTIFICATE_SOURCE_DIR`:

1. `certificates_futureskill_growth-mindset.pdf`
2. `certificates_set_เงินทองต้องวางแผน.pdf`
3. `certificates_พระนครเหนือ-มจพ_การเขียนภาษาไพธอน-ระดับเบื้องต้น.pdf`
4. `certificates_พระนครเหนือ-มจพ_การเขียนโปรแกรมควบคุมแขนกลอุตสาหกรรมด้วยเทคโนโลยีคู่เสมือนดิจิทัลทางไกล-แขนกลระดับสูง.pdf`

During implementation, each PDF's first page is rendered and inspected locally. The visible certificate title, issuer, and issue date are transcribed exactly when present. Missing fields remain absent rather than being guessed. The initial records are inactive drafts with null asset URLs; the admin can upload the PDF and preview later. Storage object names use stable ASCII slugs; the original filenames do not become public URL paths.

## Architecture and Data Flow

```text
Authenticated admin
  -> selects a PDF and preview image
  -> server action validates both files
  -> uploads assets to Supabase Storage
  -> writes asset URLs and metadata through Prisma
  -> revalidates /admin/certificates and /certificate

Public visitor
  -> opens /certificate
  -> server component queries active certificates ordered by order
  -> client presentation component renders localized cards
  -> visitor opens the PDF or downloads it
```

The database is the source of truth for visibility, order, and metadata. Supabase Storage is the source of truth for binary files. Public pages never scan Storage to discover records.

## Prisma Model

Add a `Certificate` model mapped to `certificates`:

| Field           | Type                          | Purpose                                        |
| --------------- | ----------------------------- | ---------------------------------------------- |
| `id`            | `String @id @default(cuid())` | Stable database identity                       |
| `slug`          | `String @unique`              | Stable ASCII key for storage paths and UI keys |
| `order`         | `Int`                         | Admin-controlled display order                 |
| `title`         | `Json`                        | `{ th, en, ja }` localized title               |
| `issuer`        | `String`                      | Official issuer name as printed                |
| `issuedAt`      | `DateTime?`                   | Exact issue date when printed; otherwise null  |
| `category`      | `String`                      | Controlled key used for the card badge         |
| `imageUrl`      | `String?`                     | Public preview image URL; null while drafting  |
| `pdfUrl`        | `String?`                     | Public original PDF URL; null while drafting   |
| `credentialUrl` | `String?`                     | Optional external verification page            |
| `active`        | `Boolean @default(true)`      | Public visibility flag                         |
| `createdAt`     | `DateTime @default(now())`    | Audit timestamp                                |
| `updatedAt`     | `DateTime @updatedAt`         | Audit timestamp                                |

Supported category keys initially are `development`, `technology`, `finance`, and `professional`. Category labels are translated in locale JSON files. Adding a new key is a code/configuration change; it is not a separate database entity in this scope.

`title` requires all three language properties in the admin form. The initial import may use the official printed title for multiple locales when a meaningful translation is not available; it must not claim a translated official title that the issuer did not provide.

## Asset Storage

- Use a dedicated public Supabase Storage bucket named `certificate-assets`.
- Store PDFs under `certificates/<slug>/certificate.pdf`.
- Store preview images under `certificates/<slug>/preview.<ext>`.
- Admin uploads accept PDF for the document and PNG, JPEG, or WebP for the preview.
- File names and MIME types are validated on the server, not only in the browser.
- Maximum sizes are 15 MB for PDF and 5 MB for preview image.
- Re-uploading a fixed slot uses upsert so the public URL remains stable.
- The initial preview for each supplied PDF is rendered from page one and inspected locally, but it is not uploaded automatically. The admin attaches the approved preview later.

PDF-to-image conversion is an initial-import tool, not a runtime dependency. Future admin entries require a manually selected preview image, which keeps the deployed application lightweight and gives the admin control over the crop.

## Public Experience

### Navigation

Add the localized Certificate link between Projects and Contact in both desktop and mobile navigation. `/certificate` and any future child path under it activate the menu state.

Labels:

- English: `Certificates`
- Thai: `ใบรับรอง`
- Japanese: `認定資格`

### Page layout

The page uses a compact centered hero followed immediately by the card grid. The hero contains a localized title and a one-line description. The grid is one column on small screens, two on medium screens, and three on large screens.

Each card contains:

- a large aspect-ratio preview of the certificate;
- a translated category badge;
- localized certificate title;
- official issuer name;
- localized issue date when available;
- an `Open PDF` action;
- a separate `Download` action;
- an optional `Verify` action only when `credentialUrl` exists.

Cards use the existing CSS theme variables and visual language from the portfolio cards. Creative treatment includes an issuer/category accent, subtle shine, lift, and shadow on hover. Motion respects keyboard interaction and `prefers-reduced-motion`. Controls remain visible without hover on touch devices. Images have localized alternative text and use lazy loading below the fold.

The entire card is not one large link because it contains multiple distinct actions. Card actions are semantic links with visible focus states. Opening and verification use a new tab with safe `rel` attributes.

### Empty state

If no active certificates exist, `/certificate` still renders the hero and a localized neutral message. It does not expose draft records or an application error.

## Admin Experience

Add `Certificates` to the existing protected admin navigation and create `/admin/certificates` following the Skills and Projects board conventions.

The board provides:

- create and edit form;
- three side-by-side localized title fields;
- issuer, issue date, category, and optional credential URL fields;
- PDF upload with filename/status feedback;
- preview-image upload with image preview;
- active/draft toggle;
- drag-and-drop ordering;
- delete confirmation;
- card preview that resembles the public result.

A draft can be saved with slug, three title values, issuer, and category before its assets are uploaded. Issue date and credential URL are optional. Publishing remains unavailable until both the PDF URL and image URL exist. Slugs are normalized and checked for uniqueness.

## Server Actions and Consistency

Certificate server actions handle upload, create, update, reorder, visibility, and delete. They revalidate `/certificate` and `/admin/certificates` after successful writes.

Upload and create are not a cross-service transaction, so consistency is handled explicitly:

1. Validate all metadata and files before uploading.
2. Upload PDF and preview.
3. Create or update the database record.
4. If the database write fails after a new upload, attempt best-effort cleanup of the newly uploaded objects and return a useful admin error.

On record deletion, delete the database record first, then attempt Storage cleanup. A cleanup failure leaves an unreferenced object rather than a broken public database record and is reported to the admin/log. Replacing an asset uses the stable fixed path and does not create an orphan.

Public queries catch database failures at the page boundary and render a localized unavailable state. Admin actions return clear validation or service errors and do not report success until the database write completes.

## Localization

Extend `locales/en.json`, `locales/th.json`, and `locales/ja.json` with:

- header navigation label;
- page title and subtitle;
- category labels;
- field labels and public actions;
- empty and unavailable states;
- date display text where needed.

Dates use `Intl.DateTimeFormat` for the selected locale. Issuer names remain the official source spelling.

## Expected Code Areas

- `prisma/schema.prisma` and a generated migration
- `src/components/layout/Header.tsx`
- `src/app/certificate/page.tsx`
- `src/app/certificate/CertificateContent.tsx`
- `src/components/certificate/CertificateCard.tsx`
- `src/app/admin/certificates/*`
- `src/app/admin/AdminChrome.tsx`
- `locales/en.json`, `locales/th.json`, `locales/ja.json`
- an initial import script and generated preview assets used by that script

Exact component splits may be adjusted during implementation to match the existing admin abstractions, but the public route, admin route, data model, behavior, and validation rules above remain fixed.

## Verification Strategy

Before completion:

- run TypeScript type checking;
- run the repository's available lint checks;
- run a production build;
- verify desktop and mobile navigation active states;
- inspect light and dark themes at small, medium, and large viewport widths;
- verify locale switching updates navigation, hero, categories, actions, and titles;
- verify all four local previews render; after the admin uploads the assets, verify all four PDFs open and download;
- verify drafts are excluded and active records follow admin order;
- verify admin create, edit, reorder, visibility, asset replacement, and deletion flows;
- verify invalid types, oversize files, duplicate slugs, and failed uploads produce actionable errors.

Before any new unit-test files are written, present the user with a proposed test matrix covering validation failures, filtering/order regressions, localization fallbacks, and upload/database partial failures. Each case must state the expected behavior and assertions for user review.

## Migration and Rollout

1. Add the Prisma model and migration without modifying existing tables.
2. Create and configure the public `certificate-assets` bucket.
3. Deploy the application code and migration together.
4. Render and inspect previews for the four supplied PDFs locally.
5. Seed the four verified metadata records as inactive drafts without uploading assets.
6. Confirm all four records in Admin.
7. Let the admin upload each PDF and preview, then publish only records whose two assets are present.

The rollout is additive. Existing projects, skills, experience, and public routes continue unchanged.
