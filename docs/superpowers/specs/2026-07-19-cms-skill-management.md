# Skill & Category — Dashboard Management Detail

> ส่วนขยายของ [2026-07-19-cms-design.md](2026-07-19-cms-design.md) เจาะจงว่า admin จะจัดการ `Skill` และ `Category` (section ที่กลุ่ม skill) ยังไงในหน้า dashboard

## Category (section)

- เพิ่ม/ลบ/แก้ชื่อ section ได้อิสระ (ไม่ใช่ dropdown ตายตัวอีกต่อไป)
- ชื่อ section เป็น 3 ภาษา (th/en/ja) แสดง 3 คอลัมน์เทียบกันแบบเดียวกับ field อื่นที่แปลได้
- หน้า list ของ Category แสดง checklist ของ Skill ทั้งหมด — ติ๊กว่า skill ไหนอยู่ใน section นี้บ้าง (reassign `Skill.categoryId` แบบ bulk) โดยไม่ต้องเปิดเข้าไปแก้ทีละ skill

## Skill

- ฟอร์มเดียว ไม่มี tab (field น้อยกว่า Project มาก)
- **name**: text ปกติ (ไม่แปลภาษา — ชื่อเทคโนโลยีเหมือนกันทุกภาษาอยู่แล้ว เช่น "TypeScript")
- **icon**: ช่อง URL (ของเดิมใช้ CDN URL เช่น devicon โดยตรง ไม่ใช่ไฟล์อัปโหลด)
- **url**: ช่อง URL (optional, ลิงก์ไปหน้า official docs)
- **description**: 3 คอลัมน์ภาษา
- **category**: dropdown เลือกจาก Category ที่มีอยู่ (แก้ผ่านหน้า Skill ก็ได้ หรือผ่าน checklist ในหน้า Category ก็ได้ — คนละ UI แต่แก้ field เดียวกัน คือ `categoryId`)
- **featured**: checkbox ในหน้า list (toggle เข้า/ออกจาก "Technologies I Work With" marquee หน้า home)
- **active**: checkbox ในหน้า list (toggle เข้า/ออกจากหน้า public About) — ใช้ตอนเพิ่ม skill ที่กำลังศึกษาอยู่ ยังไม่มั่นใจจะเผยแพร่ (draft) การ์ดที่ `active=false` จะจางลงและมี badge "Draft" ในหน้า admin ส่วนหน้า public จะไม่โชว์เลย (Category ที่ skill ข้างในเป็น draft หมดก็จะไม่โชว์หัวข้อ section ว่างๆ ด้วย)

## การเรียงลำดับ

- ลำดับ Skill ภายใน Category และลำดับ Category เอง ใช้ **drag-and-drop** เหมือนกับทุก list ใน [Project management](2026-07-19-cms-project-management.md) — reuse reorder component ตัวเดียวกันทั้งระบบ
