# Database Schema — Portfolio CMS

> ส่วนขยายของ [2026-07-19-cms-design.md](2026-07-19-cms-design.md) เก็บ Prisma schema แยกไว้ต่างหากเพราะรายละเอียดเยอะและแก้บ่อยกว่าส่วน overview

## Project.content — โครงสร้าง JSON

> **Built 2026-08-08** — ด้านล่างคือ schema จริงที่ implement แล้ว (เดิมร่างจาก assumption ก่อนเปิดโค้ดจริงเทียบ มีจุดที่ไม่ตรงหลายอย่าง แก้ไว้ที่นี่แล้ว) ดู [2026-07-23-cms-project-build-plan.md](2026-07-23-cms-project-build-plan.md) สำหรับ finding ทั้งหมดที่เจอระหว่างสร้างจริง

`navigation` (project number, prev/next slug) **ไม่เก็บใน DB** เพราะคำนวณได้จาก `order` ตอน query ส่วน `content` (overview/features/gallery/technical/results/futureGoals) เก็บเป็น JSON blob ก้อนเดียว แทนที่จะแยก table ต่อ Feature/Challenge/Result เพราะไม่มี use case ต้อง query ข้าม project

**สำคัญ**: โครงสร้างภายใน `content` เป็น **1 array ต่อ feature/challenge/result ที่มีทั้ง 3 ภาษาอยู่ในตัวเดียวกัน** (ไม่ใช่ 3 array แยกตามภาษา) เพราะเรียงลำดับด้วย drag-and-drop — ถ้าแยก array ตามภาษา ลากสลับตอนดูภาษาหนึ่งจะทำให้ลำดับ th/en/ja ไม่ตรงกันทันที

**Gallery เป็นรูปจริง** — ของเดิม (`src/data/projects` static data) เป็นแค่ caption ไม่มีรูป ตอน build จริงเปลี่ยนเป็น real image upload (Supabase Storage) ตั้งแต่ต้น

โครงสร้างจริง:

```json
{
  "overview": {
    "about": { "paragraphs": { "th": [], "en": [], "ja": [] } },
    "objectives": { "content": { "th": "", "en": "", "ja": "" } }
  },
  "features": [
    {
      "title": { "th": "", "en": "", "ja": "" },
      "description": { "th": "", "en": "", "ja": "" }
    }
  ],
  "gallery": [
    {
      "url": "https://...supabase.../project-images/projects/{slug}/gallery/xxx.jpg",
      "alt": { "th": "", "en": "", "ja": "" }
    }
  ],
  "technical": {
    "details": [
      { "key": "Framework", "value": { "th": "", "en": "", "ja": "" } }
    ],
    "challenges": [
      {
        "title": { "th": "", "en": "", "ja": "" },
        "description": { "th": "", "en": "", "ja": "" }
      }
    ]
  },
  "results": [
    {
      "title": { "th": "", "en": "", "ja": "" },
      "description": { "th": "", "en": "", "ja": "" }
    }
  ],
  "futureGoals": [{ "description": { "th": "", "en": "", "ja": "" } }]
}
```

หมายเหตุ: `about.title`/`objectives.title`/`features.title`/ฯลฯ (label หัวข้อ เช่น "About the Project", "Key Features") **ไม่ได้เก็บใน DB** — เป็น UI chrome คงที่ hardcode ไว้ใน `ProjectTabsContent.tsx` ต่อ locale เพราะข้อความเดิมเหมือนกันทุกโปรเจกต์อยู่แล้ว (ไม่ใช่ content ที่ admin ต้องแก้บ่อย)

## Prisma Schema

**ทุก model ต้องมี `createdAt`/`updatedAt` เสมอ** (กฎตายตัว ไม่ใช่แค่ Project)

**ทุก model ต้องมี `@@map` เป็นชื่อ table แบบ lowercase/snake_case พหูพจน์เสมอ** (เช่น `Category` → `@@map("categories")`) — ชื่อ model ใน schema ยังเป็น PascalCase ตามปกติของ Prisma (`prisma.category.findMany()` เหมือนเดิม) แต่ table จริงใน Postgres เป็น lowercase ตามธรรมเนียม SQL ทั่วไป ไม่ต้อง quote ตอนเขียน raw SQL ใน Supabase SQL Editor

```prisma
model Project {
  id               String   @id @default(cuid())
  slug             String   @unique
  order            Int      // manual/curated, ไม่ auto-sort ตามวันที่ (ต่างจาก Experience — portfolio ไม่มี natural sort key)
  title            Json     // { th, en, ja }
  description      Json     // { th, en, ja } — header description
  tags             Json     // { th: string[], en: string[], ja: string[] } — badge หน้า detail header, แปลจริงต่างกันต่อภาษา
  filterTags       String[] // controlled vocabulary: web | crossplatform | mobile | desktop | backend — filter หน้า /portfolio list
  techSummary      String   // one-liner บนการ์ด list/showcase (คนละ field กับ technologies จริงๆ ในข้อมูลเดิม)
  thumbnailUrl     String   // การ์ดหน้า /portfolio list
  overviewImageUrl String   // hero image ใน tab Overview
  overviewImageAlt Json     // { th, en, ja }
  repoUrl          String?
  demoUrl          String?
  liveUrl          String?
  duration         Json     // { th, en, ja } — infoBar, แปลจริง เช่น "6 months"/"6 เดือน"/"6ヶ月"
  status           Json     // { th, en, ja } — infoBar, แปลจริง
  company          String   // infoBar, ไม่แปล (ชื่อบริษัท)
  technologies     String[] // infoBar, ไม่แปล
  content          Json     // { overview, features, gallery, technical, results, futureGoals }
                             // แต่ละ text field ข้างในเป็น {th,en,ja} — ดูตัวอย่างเต็มด้านบน
                             // (ไม่ใช่ 3 ก้อนแยกตามภาษา เพื่อให้ลำดับ drag-and-drop ตรงกันทุกภาษา)
  featured         Boolean  @default(false) // ติ๊กแล้วโชว์ใน "Recommended Projects" หน้า home
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@map("projects")
}

model Category {
  id        String   @id @default(cuid())
  name      Json     // { th, en, ja } — เช่น "Frontend"
  order     Int      // ลำดับ section ในหน้า About
  skills    Skill[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("categories")
}

model Skill {
  id          String   @id @default(cuid())
  name        String
  icon        String   // icon identifier/URL
  url         String?
  description Json     // { th, en, ja }
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  order       Int      // ลำดับภายใน section
  featured    Boolean  @default(false) // ติ๊กแล้วโชว์ใน "Technologies I Work With" marquee หน้า home
  active      Boolean  @default(true) // false = แสดงในหน้า admin เท่านั้น ยังไม่โชว์หน้า public (ระหว่างศึกษา/ยังไม่มั่นใจ)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("skills")
}

model Experience {
  id          String   @id @default(cuid())
  type        String   // "work" | "education"
  title       Json     // { th, en, ja } — ตำแหน่ง/วุฒิ
  company     String
  startDate   String   // "yyyy-MM"
  endDate     String?  // "yyyy-MM", null = Present
  isCurrent   Boolean  @default(false)
  description Json     // { th, en, ja }
  skills      String[]
  icon        String   // icon identifier (เช่น "FaBriefcase")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("experiences")
}
```

**หมายเหตุ (rev)**: Experience เดิมมี `period: String` เดียว + `order: Int` (manual drag-and-drop) — ตอน build จริงเปลี่ยนเป็น `startDate`/`endDate` แยก (ใช้ native `<input type="month">`) และ**ตัด `order` ออก** เปลี่ยนเป็น auto-sort ตาม `startDate` desc แทน เพราะ resume/CV มี natural sort key (วันที่) อยู่แล้ว ต่างจาก Project ที่ไม่มี natural key เลยยังคง manual order ไว้
