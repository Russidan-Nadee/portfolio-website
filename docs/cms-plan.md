# แผนคร่าวๆ: Portfolio CMS

> ร่างไว้ก่อน ยังไม่เริ่มทำ — สำหรับตอนว่างแล้วมาต่อ

## เป้าหมาย

ทำ CMS ของตัวเองสำหรับจัดการเนื้อหา portfolio แทนการ hardcode ไฟล์โค้ด เพื่อ:
- เพิ่ม/แก้ Project, Skill, Certificate ได้ผ่าน dashboard โดยไม่ต้องแตะโค้ด
- ใช้เป็น personal project โชว์ทักษะ full-stack ใน resume ไปด้วย (Next.js, TypeScript, PostgreSQL, Prisma/Drizzle, Auth, File Upload, RBAC, Dashboard, Server Actions/API)

## สถานะปัจจุบัน (baseline ก่อนแก้)

- **Projects**: hardcode แยกไฟล์ต่อโปรเจกต์ที่ [src/data/projects/translations/{th,en,ja}](src/data/projects/translations) + route แยกที่ [src/app/portfolio/\<slug\>/page.tsx](src/app/portfolio) — เพิ่ม 1 โปรเจกต์ = สร้างไฟล์หลายไฟล์ทุกครั้ง
- **Skills**: hardcode เป็น object array ใน [src/components/about/SkillsGrid.tsx](src/components/about/SkillsGrid.tsx) (name, icon, url, description 3 ภาษา)
- **Certificates**: ยังไม่มี ต้องสร้างใหม่ทั้งหมด

## Entity ที่ CMS จะดูแล

1. **Project** — title, description (3 ภาษา), tech stack, poster image, links (repo/demo), slug
2. **Skill** — name, icon, url, description (3 ภาษา), category (frontend/backend/etc.)
3. **Certificate** — name, issuer, date, file/image, (option) link ไปยัง skill ที่เกี่ยวข้อง

## แนวทางสถาปัตยกรรม (คร่าวๆ)

- DB: PostgreSQL + Prisma หรือ Drizzle (เลือกทีหลัง)
- Dynamic routing: `portfolio/[slug]` แทนโฟลเดอร์แยกรายโปรเจกต์
- Multi-language content: เก็บใน DB (เช่น 1 record ต่อ entity + field แยกภาษา หรือ join table) แทนไฟล์ ts ต่อภาษา
- Auth: จำกัดเฉพาะเจ้าของเว็บ (single admin) — ไม่ต้องทำ RBAC หลายระดับถ้าไม่ได้อยากโชว์ฟีเจอร์นี้จริงจัง (แต่ถ้าอยากโชว์ในตอนสัมภาษณ์ ค่อยเพิ่ม role เช่น admin/viewer)
- File upload: poster ของ project + ไฟล์/รูป certificate (เก็บที่ไหน — local, S3-compatible, หรือ Cloudinary ยังไม่ตัดสินใจ)
- Dashboard: หน้า admin แยกจาก public site เช่น `/admin/*` ป้องกันด้วย auth

## Phase คร่าวๆ (ยังไม่ fix)

1. ออกแบบ DB schema (Project, Skill, Certificate + ภาษา)
2. ตั้ง Prisma/Drizzle + migration แรก
3. ทำ Auth (single admin login)
4. ทำ Dashboard CRUD สำหรับ Project ก่อน (ซับซ้อนสุด มี relation เยอะสุด)
5. Migrate ข้อมูล Project เดิมจากไฟล์ ts เข้า DB
6. ทำ CRUD Skill และ Certificate
7. ทำ File upload
8. (ถ้าอยากโชว์เพิ่ม) เพิ่ม role-based access

## คำถามที่ต้องตัดสินใจตอนเริ่มทำจริง

- Prisma หรือ Drizzle
- เก็บไฟล์รูป/เอกสารที่ไหน (local /public, S3, Cloudinary, Vercel Blob)
- Multi-language: 1 table + JSON column ต่อภาษา หรือแยก translation table
- RBAC จำเป็นจริงไหม หรือ auth เดี่ยวพอ (เพิ่ม role ทีหลังได้ถ้าอยากโชว์ฟีเจอร์นี้ตอนสัมภาษณ์)
