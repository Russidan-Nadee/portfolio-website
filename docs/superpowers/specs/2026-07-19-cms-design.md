# Design: Portfolio CMS

> อ้างอิงแผนคร่าวๆ เดิมที่ [docs/cms-plan.md](../../cms-plan.md) — เอกสารนี้คือ spec ที่ตัดสินใจแล้ว พร้อมไปทำ implementation plan ต่อ

## เป้าหมาย

ทำ CMS หลังบ้านสำหรับจัดการเนื้อหา Project / Skill / Category (section ของ Skill) / Experience ของพอร์ตนี้ผ่าน dashboard แทนการแก้ไฟล์โค้ดตรงๆ พร้อมโชว์เป็นผลงาน full-stack ใน resume (Next.js, TypeScript, PostgreSQL, Prisma, Auth, File Upload, Dashboard/Server Actions)

Repo ยังคงเป็น **public** ต่อไปแม้ CMS เสร็จแล้ว (ดูเหตุผลด้าน Security ท้ายเอกสาร)

## เกณฑ์เลือก scope

เอาเข้า CMS เฉพาะ content ที่เป็น **"list ที่เพิ่ม/ลบ/แก้บ่อย"** เท่านั้น ส่วน static copy ของหน้าเว็บ (bio แบบ paragraph เดียว, หัวข้อ section เช่น "Technologies I Work With") ยังคงอยู่ใน `locales/*.json` เหมือนเดิม — ไม่คุ้มที่จะทำ DB-driven เพราะเปลี่ยนนานๆครั้งและจะเสีย type-safety ของระบบ i18n เดิมไปเปล่าๆ

## Stack ที่ตัดสินใจแล้ว

| หัวข้อ | เลือก | เหตุผลย่อ |
|---|---|---|
| Hosting เว็บ | Vercel | ใช้อยู่แล้ว |
| Database | Supabase (Postgres) | managed, free tier, ไม่ต้อง self-host |
| ORM | Prisma | type-safe, migration tooling ครบ |
| File storage | Supabase Storage | อยู่ใน ecosystem เดียวกับ DB ไม่ต้องเปิด service เพิ่ม, มี free tier |
| Multi-language | JSON column ต่อ entity (ไม่แยก translation table) | ภาษาตายตัวแค่ 3 (th/en/ja), ไม่ต้องยืดหยุ่นระดับเพิ่มภาษาใหม่ได้เอง |
| Auth | Single admin เท่านั้น ไม่มี RBAC | มีผู้ดูแลคนเดียว ไม่มี use case จริงสำหรับหลาย role — YAGNI |

## Home Page Sections (ไม่มี entity ใหม่)

- **"Technologies I Work With"** marquee ([Technologies.tsx](../../../src/components/home/Technologies.tsx)) — ปัจจุบัน hardcode array {name, icon} แยกต่างหาก ซึ่งซ้ำกับข้อมูล Skill เปลี่ยนมาดึงจาก `Skill where featured=true` แทน ไม่ต้องดูแลข้อมูลสองที่
- **"Recommended Projects"** carousel ([ProjectsShowcase.tsx](../../../src/components/home/ProjectsShowcase.tsx)) — ปัจจุบัน hardcode คัด 4 project จาก 7 เปลี่ยนมาดึงจาก `Project where featured=true` แทน
- Dashboard: หน้า list ของ Project/Skill มี checkbox คอลัมน์ `featured` ต่อแถว ติ๊กแล้ว save เพื่อ toggle เข้า/ออกจาก homepage

## Data Model

ดู schema เต็มที่ [2026-07-19-cms-schema.md](2026-07-19-cms-schema.md) (แยกไฟล์ต่างหากเพราะรายละเอียดเยอะและแก้บ่อย)

## Auth

- Admin login เดี่ยว ไม่มี role table
- ใช้ library auth ที่พิสูจน์แล้ว (เช่น Auth.js/NextAuth หรือ Lucia) — **ห้ามเขียน hashing/token เอง** เพราะ repo เป็น public แหล่ง source เปิดให้อ่านได้ ถ้า auth เขียนเองแล้วมีช่องโหว่ = เท่ากับแจก exploit guide
- Session-based, admin route อยู่ใต้ `/admin/*` ป้องกันด้วย middleware ตรวจ session

## File Upload

- อัปโหลดผ่าน Supabase Storage SDK จาก Server Action ในหน้า dashboard
- โครงสร้าง bucket: `posters/` (รูป project)
- เก็บเฉพาะ URL ที่ return มาไว้ใน DB (`posterUrl`)

## Data Flow (ตัวอย่าง: แก้ Project)

1. Admin login ผ่าน `/admin/login` → ได้ session
2. เข้า `/admin/projects` → dashboard ดึงข้อมูลผ่าน Prisma
3. แก้ฟอร์ม (title/description ทั้ง 3 ภาษาในหน้าเดียว, upload poster ใหม่ถ้ามี) → Server Action
4. Server Action: ถ้ามีไฟล์ใหม่ → upload Supabase Storage ก่อน ได้ URL → เขียนทับ DB ผ่าน Prisma
5. Public route `/portfolio/[slug]` ดึงข้อมูลจาก DB แทนไฟล์ ts เดิม

## Migration จากของเดิม

- ย้ายข้อมูลเข้า DB ด้วย seed script ครั้งเดียว (Prisma seed) จากแหล่งเดิม:
  - Project: [src/data/projects/translations/{th,en,ja}](../../../src/data/projects/translations)
  - Skill: [SkillsGrid.tsx](../../../src/components/about/SkillsGrid.tsx)
  - Experience: `about.timeline.work` / `about.timeline.education` ใน `locales/{th,en,ja}.json` (อ่านผ่าน [Timeline.tsx](../../../src/components/about/Timeline.tsx))
- หลัง migrate เสร็จค่อยลบไฟล์ ts เดิมและ route แยกรายโปรเจกต์ทิ้ง

## Testing

- Unit test: Server Actions หลัก (create/update/delete ต่อ entity) mock Prisma client
- Manual: ทดสอบ login/logout, upload ไฟล์จริงผ่าน Supabase Storage, ตรวจว่า public page แสดงข้อมูลจาก DB ถูกต้องทั้ง 3 ภาษา

## Security Note (Public Repo)

Repo เปิด public ต่อไป — เงื่อนไขที่ต้องรักษา:
- Secret ทั้งหมด (DB connection string, Supabase service key, session secret) อยู่ใน env vars เท่านั้น ห้าม commit
- ใช้ auth library มาตรฐาน ไม่เขียน crypto/token เอง

## Out of Scope (ตอนนี้)

- RBAC หลายระดับ (เพิ่มทีหลังได้ถ้าอยากโชว์ตอนสัมภาษณ์ — เพิ่ม field `role` ใน admin model)
- แยก translation table (ถ้าวันหนึ่งต้องรองรับภาษาที่ 4+ แบบ dynamic ค่อยย้ายจาก JSON column)
- **Contact ทั้งหมด** — ตัดสินใจว่าไม่คุ้มทำ CMS (แม้แค่ value เดียว) เพราะเปลี่ยนนานๆครั้ง คงอยู่ hardcode ใน [src/app/contact/page.tsx](../../../src/app/contact/page.tsx) เหมือนเดิม
- **Certificate** — ยังไม่มีหน้าจริงในเว็บตอนนี้ (ตาม [docs/cms-plan.md](../../cms-plan.md) เดิม) และมี certificate จริงน้อย เลื่อนไปออกแบบตอนมี certificate จริงให้จัดการ ไม่ต้องเดา schema ล่วงหน้า
