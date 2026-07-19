# Database Schema — Portfolio CMS

> ส่วนขยายของ [2026-07-19-cms-design.md](2026-07-19-cms-design.md) เก็บ Prisma schema แยกไว้ต่างหากเพราะรายละเอียดเยอะและแก้บ่อยกว่าส่วน overview

## Project.content — โครงสร้าง JSON

Project ซับซ้อนกว่าที่ร่างไว้ตอนแรก — จริงๆ มีทั้ง header/infoBar/navigation/tabsContent (ดู [types.ts](../../../src/data/projects/types.ts)) `navigation` (project number, prev/next slug) **ไม่เก็บใน DB** เพราะคำนวณได้จาก `order` ตอน query ส่วน tabsContent (overview/features/gallery/technical/results/futureGoals) เก็บเป็น JSON blob ก้อนเดียว แทนที่จะแยก table ต่อ Feature/Challenge/Result เพราะไม่มี use case ต้อง query ข้าม project — ทำ table แยกจะเพิ่ม CRUD/form โดยไม่ได้ประโยชน์อะไร

**สำคัญ**: โครงสร้างภายใน `content` ต้องเป็น **1 array ต่อ feature/challenge/result ที่มีทั้ง 3 ภาษาอยู่ในตัวเดียวกัน** (ไม่ใช่ 3 array แยกตามภาษา) เพราะ Project management ตัดสินใจให้เรียงลำดับด้วย drag-and-drop — ถ้าแยก array ตามภาษา ลากสลับตอนดูภาษาหนึ่งจะทำให้ลำดับ th/en/ja ไม่ตรงกันทันที ตัวอย่างโครงสร้างที่ถูกต้อง:

```json
{
  "overview": {
    "about": { "title": {"th":"","en":"","ja":""}, "paragraphs": {"th":[],"en":[],"ja":[]} },
    "objectives": { "title": {"th":"","en":"","ja":""}, "content": {"th":"","en":"","ja":""} }
  },
  "features": [
    { "title": {"th":"","en":"","ja":""}, "description": {"th":"","en":"","ja":""} }
  ],
  "gallery": ["url1", "url2"],
  "technical": {
    "details": [ { "key": "Frontend", "value": {"th":"","en":"","ja":""} } ],
    "challenges": [ { "title": {"th":"","en":"","ja":""}, "description": {"th":"","en":"","ja":""} } ]
  },
  "results": [ { "title": {"th":"","en":"","ja":""}, "description": {"th":"","en":"","ja":""} } ],
  "futureGoals": [ { "description": {"th":"","en":"","ja":""} } ]
}
```

## Prisma Schema

```prisma
model Project {
  id           String   @id @default(cuid())
  slug         String   @unique
  order        Int      // ใช้คำนวณ prev/next navigation ตอน query ไม่เก็บ field navigation ตรงๆ
  title        Json     // { th, en, ja }
  description  Json     // { th, en, ja } — header description
  tags         String[]
  posterUrl    String   // Supabase Storage public URL
  repoUrl      String?
  demoUrl      String?
  liveUrl      String?
  duration     String   // infoBar
  status       String   // infoBar
  company      String   // infoBar
  technologies String[] // infoBar
  content      Json     // { overview, features, gallery, technical, results, futureGoals }
                         // แต่ละ text field ข้างในเป็น {th,en,ja} — ดูตัวอย่างเต็มด้านบน
                         // (ไม่ใช่ 3 ก้อนแยกตามภาษา เพื่อให้ลำดับ drag-and-drop ตรงกันทุกภาษา)
  featured     Boolean  @default(false) // ติ๊กแล้วโชว์ใน "Recommended Projects" หน้า home
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Category {
  id    String @id @default(cuid())
  name  Json   // { th, en, ja } — เช่น "Frontend"
  order Int    // ลำดับ section ในหน้า About
  skills Skill[]
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
}

model Experience {
  id          String   @id @default(cuid())
  type        String   // "work" | "education"
  title       Json     // { th, en, ja } — ตำแหน่ง/วุฒิ
  company     String
  period      String   // เช่น "2023 - Present"
  isCurrent   Boolean  @default(false)
  description Json     // { th, en, ja }
  skills      String[]
  icon        String   // icon identifier (เช่น "FaBriefcase")
  order       Int      // ลำดับแสดงผลใน timeline
}
```
