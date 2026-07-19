# Project — Dashboard Management Detail

> ส่วนขยายของ [2026-07-19-cms-design.md](2026-07-19-cms-design.md) เจาะจงว่า admin จะจัดการ entity `Project` ยังไงในหน้า dashboard

## ภาพรวม

- **Multi-language input**: แสดง 3 คอลัมน์ (th/en/ja) เทียบกันในหน้าเดียว ไม่ใช้ tab สลับภาษา
- **Layout หน้าแก้ไข**: แบ่งเป็น tab ตาม section เดียวกับหน้า public — Overview / Features / Gallery / Technical / Results (แทนที่จะเป็นฟอร์มยาวหน้าเดียวหรือ wizard) เพราะแก้ไขซ้ำๆ บ่อยกว่าสร้างใหม่ อยากกระโดดไปแก้ทีละ section ได้
- **Featured toggle**: มี checkbox `featured` ในหน้า list (ไม่ต้องเปิดเข้าไปแก้ไข) เพื่อ toggle เข้า/ออกจาก "Recommended Projects" หน้า home

## Create Flow

- กด "สร้างใหม่" ต้องกรอก **header ให้ครบก่อน** (title, description, tags, poster ทั้ง 3 ภาษา) ถึงจะกดสร้าง record ได้
- ส่วนเนื้อหา tab อื่น (Overview/Features/Gallery/Technical/Results) กรอกทีหลังได้ในหน้าแก้ไข

## Tab: Overview

- **About → paragraphs**: textarea เดียว พิมพ์รวมกัน ขึ้นบรรทัดใหม่ = ย่อหน้าใหม่ (parse เป็น array ตอน save)
- **Objectives**: text ธรรมดา field เดียว ไม่มี list ให้จัดการ

## Tab: Features

- แต่ละ feature เป็น card: **title** (1 บรรทัดสั้นๆ) + **description** (string เดียว จำกัดความยาว ไม่ใช่หลายย่อหน้า)
- เพิ่ม/ลบ/เรียงลำดับด้วย **drag-and-drop**

## Tab: Gallery

- อัปโหลดได้หลายรูปพร้อมกัน (multi-select)
- **ไม่มี caption** — โชว์รูปเฉยๆ ตามโครงสร้างเดิม
- ลากสลับลำดับได้ (drag-and-drop)
- เก็บใน Supabase Storage แยกโฟลเดอร์ตาม slug กันปนกันข้าม project:
  ```
  posters/{slug}/poster.jpg
  posters/{slug}/gallery/1.jpg
  posters/{slug}/gallery/2.jpg
  ```

## Tab: Technical

- **details** (key-value): **key อิสระ** พิมพ์เองทั้งคู่ เพิ่ม/ลบแถวได้ไม่จำกัด (โปรเจคมีหลายประเภท เช่น web/mobile/RFID คนละชุด key ไม่พอดีกับ key ตายตัว)
- **challenges**: pattern เดียวกับ Features (card, title+description, drag-and-drop)

## Tab: Results

- **results**: pattern เดียวกับ Features (card, title+description, drag-and-drop)
- **futureGoals**: pattern เดียวกัน แต่มีแค่ field เดียว (description อย่างเดียว ไม่มี title ตามโครงสร้างเดิมใน [types.ts:55-57](../../../src/data/projects/types.ts#L55-L57))
