# Project — Build Plan

> ลำดับการ implement `Project` entity ต่อจาก [2026-07-19-cms-project-management.md](2026-07-19-cms-project-management.md) / [2026-07-19-cms-schema.md](2026-07-19-cms-schema.md) — pattern เดียวกับที่ทำ Skill/Experience มาแล้ว
>
> **Rev 2 (2026-07-23)**: เปิดโค้ดจริงเทียบกับ spec เดิมแล้วเจอจุดที่ spec เขียนจาก assumption ไม่ตรงกับของจริง — แก้ไขและบันทึกไว้ในหัวข้อ "สิ่งที่เจอจากโค้ดจริง" ด้านล่าง

**Scope**: 7 โปรเจกต์เดิม (`kinrai-d-project`, `tp-rfid`, `asset-management`, `calculator`, `portfolio-website`, `invest-fam`, `money-tracker-app`) · 5 content tab · content เป็น JSON blob ก้อนเดียว · 6 phase

## สิ่งที่เจอจากโค้ดจริง (สำคัญ — อ่านก่อนเริ่ม phase 1)

1. **Gallery ของจริงไม่มีรูปเลย** — `gallery.items` เป็น array ของ caption string ล้วนๆ, render เป็นกล่อง dashed border ว่าง (`ProjectTabsContent.tsx`) **→ ตัดสินใจแล้ว: สร้าง real image upload ใหม่** (ไม่ใช่แค่ migrate caption เดิม) ขอบเขต phase 4/5 ใหญ่กว่าที่ร่างไว้แรก
2. **รูปจริงมี 2 จุดแยกกัน ไม่ใช่ `posterUrl` เดียว**:
   - Thumbnail การ์ดหน้า `/portfolio` list — `/images/projects/{slug}.jpg`
   - Overview tab hero image + `imageAlt` (มี fallback ถ้าโหลดรูปไม่ได้) — `/images/projects/{slug}/xxx-overview.png`
3. **ข้อมูล portfolio list มาจาก 3 แหล่งแยกกันตอนนี้** (มีโอกาส drift อยู่แล้ว ต้อง reconcile ตอน seed ไม่ใช่แค่เปลี่ยน query source):
   - `src/data/projects/translations/{lang}/{slug}.ts` — detail page content เต็ม
   - `locales/{lang}.json` → `portfolio.projects.*.title` — title การ์ดใน list
   - `src/app/portfolio/page.tsx` — array ฮาร์ดโค้ด image/tech/**category**/tags/slug/projectNumber
4. **field `category`** (`web` / `crossplatform`) ใช้ filter หน้า `/portfolio` จริง — หายไปจาก schema ร่างเดิมทั้งหมด ต้องเพิ่ม
5. **UI ต้องเป็นหน้าแยก ไม่ใช่ modal** — Skill/Experience ใช้ modal ได้เพราะ field น้อย แต่ Project มี 5 tab + header หลาย field ต้องมี route `/admin/projects/[id]` ของตัวเอง
6. **Prisma Json ซ้อนลึก** — trick `{ ...data.field }` ที่ใช้ผ่านกับ Experience (Json แบน) อาจไม่พอกับ `content` ที่ซ้อนหลายชั้น มีโอกาสต้อง cast `as Prisma.InputJsonValue` แทน
7. **Order คงเป็น manual/curated** (ตัดสินใจแล้ว) — ไม่ auto-sort ตามวันที่เหมือน Experience เพราะ portfolio อยากเรียงตามที่อยากโชว์ ไม่ใช่ตามเวลา

## Phase 1 — Schema & Migrate

- [ ] เพิ่ม model `Project`: `slug` (unique), `order`, `category`, `title`/`description` (3 ภาษา), `tags`, `thumbnailUrl`, `overviewImageUrl`, `overviewImageAlt` (3 ภาษา), `repoUrl`/`demoUrl`/`liveUrl`, `duration`/`status`/`company`/`technologies`, `content: Json`, `featured`
- [ ] prev/next nav คำนวณจาก `order` ตอน query — ไม่เก็บเป็น field
- [ ] `npx prisma migrate dev` + regenerate client
- [ ] ตรวจ field ให้ครบก่อน seed จริง — schema เปลี่ยนหลัง seed แล้วจะเจอปัญหาเดิมที่เจอกับ Experience (`migrate dev` confirm data-loss prompt ใน non-interactive ไม่ได้ ต้องเขียน migration SQL มือ)

## Phase 2 — Seed ข้อมูลจริง

- [ ] script เดียวกับแพทเทิร์น `seed-experience.ts`
- [ ] **reconcile 3 แหล่งข้อมูล** ก่อน map เข้า schema: เทียบ title/tech ระหว่าง `locales/*.json` กับ `src/data/projects` — ถ้าไม่ตรงกัน ต้องเลือกว่าอันไหนถูก (ไม่ใช่ copy มาตรงๆ ทั้งคู่)
- [ ] อ่าน `src/data/projects` (th/en/ja) แปลงเป็น `content` JSON แบบ 1 array/item รวม 3 ภาษา
- [ ] `category`/`tags`/`image` เอาจาก `portfolio/page.tsx` array
- [ ] Gallery: ไม่มีรูปมาก่อน — seed เป็น array ว่าง ค่อยอัปโหลดจริงทีหลังผ่าน admin
- [ ] guard ไม่ seed ซ้ำถ้ามีข้อมูลอยู่แล้ว

## Phase 3 — Server Actions

- [ ] `createProject` / `updateProject` / `deleteProject`
- [ ] `toggleFeatured`
- [ ] `reorderProjects` (list order, manual/curated)
- [ ] `reorderFeatures` / `reorderChallenges` / `reorderResults` / `reorderGallery` (scope อยู่ใน `content` ของ project เดียว)
- [ ] เช็ค Json nested type ตอนเขียน — อาจต้อง `as Prisma.InputJsonValue` แทน spread trick
- [ ] `revalidatePath` ทุก action — ครอบ `/admin/projects`, `/portfolio`, `/portfolio/[slug]`, `/` (home Recommended Projects)

## Phase 4 — Admin UI

- [ ] **หน้าแยก** `/admin/projects/[id]` (ไม่ใช่ modal) — list page มี featured toggle + drag-and-drop reorder inline
- [ ] Create flow: กรอก header ครบ (title/description/tags/thumbnail ทั้ง 3 ภาษา) ก่อนถึงจะสร้าง record ได้
- [ ] slug: กรอกเองแบบ manual (ของเดิมเป็น short code ไม่ใช่ auto-slugify จาก title) validate unique + format
- [ ] Tab **Overview**: hero image upload + `imageAlt` (3 ภาษา), about (textarea เดียว, บรรทัดว่าง = ย่อหน้าใหม่), objectives (text เดียว)
- [ ] Tab **Features**: card title+description, drag-and-drop
- [ ] Tab **Gallery**: real multi-image upload, drag-and-drop reorder, alt text ต่อรูป (ของใหม่ทั้งหมด ไม่ใช่ migrate)
- [ ] Tab **Technical**: details (key-value อิสระ) + challenges (แพทเทิร์นเดียวกับ Features)
- [ ] Tab **Results**: results (แพทเทิร์นเดียวกับ Features) + futureGoals (description อย่างเดียว)

## Phase 5 — Storage

- [ ] `projects/{slug}/thumbnail.jpg`
- [ ] `projects/{slug}/overview.jpg`
- [ ] `projects/{slug}/gallery/1.jpg`, `2.jpg`, ...

## Phase 6 — Public Wiring

- [ ] หน้า portfolio list (`/portfolio`): query เรียงตาม `order`, เลิกใช้ array ฮาร์ดโค้ด + `locales/*.json portfolio.projects.*`
- [ ] รวม 7 static route (`src/app/portfolio/{slug}/page.tsx`) เป็น **1 dynamic route** `src/app/portfolio/[slug]/page.tsx` — URL เดิมต้อง resolve เหมือนเดิมทุกอัน (SEO/ลิงก์เก่า)
- [ ] prev/next จาก `order` ข้างเคียง
- [ ] Home "Recommended Projects": `where featured = true`

## Locked-in Decisions

- **Content shape**: 1 array ต่อ feature/challenge/result ที่มีครบ 3 ภาษาในตัวเดียว — ห้ามแยก 3 array ตามภาษา (จะทำให้ drag-and-drop order ไม่ตรงกันข้ามภาษา)
- **ไม่แยก table ต่อ item**: features/challenges/results/gallery อยู่ใน `content` JSON — ไม่มี use case ต้อง query ข้าม project
- **Navigation**: prev/next คำนวณจาก `order` ตอน query ไม่เก็บเป็น field
- **Project list order**: manual/curated ด้วย drag-and-drop — ไม่ auto-sort ตามวันที่ (ต่างจาก Experience ที่มี `startDate` เป็น natural key, Project ไม่มี)
- **Gallery**: สร้าง real image upload ใหม่ (ของเดิมเป็น caption placeholder ไม่มีรูปจริง) — มี alt text ต่อรูป
- **Thumbnail vs Overview image**: แยก 2 field ชัดเจน ไม่รวมเป็น `posterUrl` เดียว เพราะใช้คนละจุด (การ์ด list vs hero ใน tab)

## Schema ร่าง (rev 2)

```prisma
model Project {
  id                String   @id @default(cuid())
  slug              String   @unique
  order             Int
  category          String   // "web" | "crossplatform" — ใช้ filter หน้า /portfolio
  title             Json     // { th, en, ja }
  description       Json     // { th, en, ja }
  tags              String[]
  thumbnailUrl      String   // การ์ดหน้า /portfolio list
  overviewImageUrl  String   // hero image ใน tab Overview
  overviewImageAlt  Json     // { th, en, ja }
  repoUrl           String?
  demoUrl           String?
  liveUrl           String?
  duration          String
  status            String
  company           String
  technologies      String[]
  content           Json     // overview(about/objectives) / features / gallery / technical / results / futureGoals
  featured          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("projects")
}
```

**ลำดับ**: phase เรียงตามนี้เท่านั้น — 02 ต้องรอ table จาก 01, 03 ต้องรอ client types จาก 01, 06 ต้องรอ 03+04 เสร็จ ในระหว่าง phase 04 ทำ 5 tab สลับลำดับกันได้เมื่อ shell หลักพร้อมแล้ว
