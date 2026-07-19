# Experience — Dashboard Management Detail

> ส่วนขยายของ [2026-07-19-cms-design.md](2026-07-19-cms-design.md) เจาะจงว่า admin จะจัดการ `Experience` ยังไงในหน้า dashboard

## ยืนยันจากโค้ดจริง

Work กับ Education ใช้ field ชุดเดียวกันทุกตัว ([locales/en.json:71-178](../../../locales/en.json#L71-L178)) ไม่มี field พิเศษเฉพาะฝั่งใดฝั่งหนึ่ง — table เดียวพอ แยกด้วย `type` ("work" | "education")

## Management

- **แยก UI เป็น 2 tab** (Work / Education) ตรงกับหน้า public แต่ query จาก table `Experience` เดียวกัน กรอง `where: type = ...`
- **title, description**: 3 คอลัมน์ภาษา
- **company**: text ปกติ (ไม่แปล — ใช้เป็นทั้งชื่อบริษัทและชื่อสถาบันการศึกษา)
- **period**: text ปกติ เช่น "May 2026 - Present"
- **isCurrent**: checkbox
- **icon**: dropdown จากชุด icon คงที่ (ตรงกับ `iconMap` ใน [Timeline.tsx:84-92](../../../src/components/about/Timeline.tsx#L84-L92) — FaBriefcase, FaLaptopCode, FaGraduationCap, MdWork, MdRestaurant, MdFastfood, MdSchool)
- **skills**: tag input เพิ่ม/ลบได้อิสระ (ปัจจุบันเป็น string ธรรมดา ไม่ใช่ multi-language)

## การเรียงลำดับ

- ลำดับ Experience ภายในแต่ละ tab (Work/Education) ใช้ **drag-and-drop** เหมือนกับทุก list ใน [Project management](2026-07-19-cms-project-management.md) — reuse reorder component ตัวเดียวกันทั้งระบบ
