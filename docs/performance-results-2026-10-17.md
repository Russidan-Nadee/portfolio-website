# ผลปรับปรุง performance — 17 ตุลาคม 2026

ผลนี้ต่อจาก [performance audit](performance-audit-2026-10-17.md) และ [แผนลงมือ](superpowers/plans/2026-10-17-performance-optimization.md) โดยวัดบนเครื่อง Windows ใน `next start` ของ Next.js 16.1.6 ไม่ใช่เวลา `next dev` หรือ Core Web Vitals จากผู้ใช้จริง

## กดเมนูจาก Home แล้วเร็วขึ้นเท่าไร

ใช้ Chrome headless ขนาด 1100 × 800, DPR 1, กดลิงก์ใน Header จาก `/en/`, รอจน URL, เมนูที่ active และเนื้อหาหน้าใหม่ตรงกัน แล้วรออีก 2 animation frames วัด 5 ครั้งต่อเมนูและใช้ค่ามัธยฐาน (median) หลังเปิด Home ให้พร้อมและรอ hydration/prefetch ตามปกติ 500 ms คำสั่งวัดซ้ำ: `node scripts/measure-navigation.mjs --port=9232 --origin=http://localhost:3101 --runs=5 --verify-ui=true`

| ปุ่มใน Header |   ก่อน |   หลัง |              ผลต่าง | จุดที่เกี่ยวข้อง                                                                                     |
| ------------- | -----: | -----: | ------------------: | ---------------------------------------------------------------------------------------------------- |
| About         | 616 ms | 302 ms | **เร็วขึ้น 314 ms** | cache ข้อมูล About, เลือกเฉพาะฟิลด์ที่ใช้, ภาพโปรไฟล์ responsive, ลดงาน client                       |
| Projects      | 326 ms | 179 ms | **เร็วขึ้น 147 ms** | cache ข้อมูล Portfolio, ลดข้อมูลที่ query/ส่งใน HTML, render การ์ดตั้งแต่ SSR, ลดงานภาพและ animation |
| Certificates  | 221 ms | 184 ms |  **เร็วขึ้น 37 ms** | cache ข้อมูลใบรับรอง และลด preload ฟอนต์ร่วมทุกหน้า                                                  |
| Contact       | 155 ms | 149 ms |       เร็วขึ้น 6 ms | render เนื้อหาใน HTML แรกและลด observer/timer; **6 ms เล็กเกินกว่าจะสรุปว่าผู้ใช้จะรู้สึกเร็วขึ้น**  |

ปุ่ม Home ที่กดจากหน้าอื่น และปุ่มเข้า Project Detail ไม่มีค่าก่อนแก้แบบ click-to-content จึงไม่ระบุผลต่างของการกดปุ่มเหล่านั้น; มีเพียงเวลา server ตอบ Home โดยตรงในตารางถัดไป

ตัวอย่างดิบก่อน → หลังตามลำดับการรัน:

- About: `[782,616,747,455,422]` → `[354,351,285,302,248]` ms
- Projects: `[2189,240,249,326,500]` → `[179,177,142,249,233]` ms; รอบแรกก่อนแก้มี outlier 2,189 ms
- Certificates: `[338,219,221,209,239]` → `[181,184,195,159,258]` ms
- Contact: `[180,150,155,156,151]` → `[170,138,149,148,173]` ms

**ตัวเลข ms ข้างต้นเป็นผลรวมของการแก้ใน build เดียว** จึงแยกไม่ได้ว่า cache, รูปภาพ, ฟอนต์ หรือ animation ช่วยคนละกี่ ms โดยไม่สร้าง build ที่เปิด/ปิดแต่ละรายการแล้ววัดซ้ำ อีกทั้งสคริปต์รอบหลังเพิ่มการตรวจว่า Home hero พร้อมก่อนกด จึงควรตีความผลต่างเล็กอย่าง Contact เป็นความแปรปรวน ไม่ใช่ผลที่พิสูจน์ได้

## เวลาตอบ HTML จาก server

`curl.exe --compressed` เรียง request ทีละหน้า หลัง cache อุ่นแล้ว 5 ครั้งต่อหน้า ใช้ `time_starttransfer` เป็น TTFB ไม่รวมเวลาวาดหน้าใน browser และไม่ใช่เวลาเมื่อกดปุ่ม

| หน้า         | ก่อน (median) | หลัง (median) |                     ผลต่าง |                  HTML บีบอัดก่อน → หลัง |
| ------------ | ------------: | ------------: | -------------------------: | --------------------------------------: |
| Home `/en/`  |    145.214 ms |     11.732 ms |    **เร็วขึ้น 133.482 ms** |                       19,790 → 19,012 B |
| About        |    273.584 ms |     11.648 ms |    **เร็วขึ้น 261.936 ms** |                       23,892 → 22,220 B |
| Projects     |    178.196 ms |      8.447 ms |    **เร็วขึ้น 169.749 ms** |                        32,989 → 8,538 B |
| Certificates |    126.600 ms |      8.727 ms |    **เร็วขึ้น 117.873 ms** |                         9,391 → 8,923 B |
| Contact      |      7.108 ms |      7.600 ms | ช้าลง 0.492 ms (ความแกว่ง) | 5,589 → 8,202 B เพราะเพิ่มเนื้อหาใน SSR |

ค่าหลังแก้ตามลำดับ request (ms): Home `[13.642,11.732,12.256,9.785,11.254]`; About `[13.018,12.011,9.902,11.648,11.150]`; Projects `[7.145,8.474,7.697,8.447,9.448]`; Certificates `[8.727,10.160,7.547,10.208,8.081]`; Contact `[7.600,6.934,9.314,6.940,7.717]`. ตัวเลข cache hit นี้ไม่รับประกัน request แรกหลัง deploy หรือผลบน production network

## งานที่แก้และผลที่ยืนยันได้

| จุด                          | สิ่งที่เปลี่ยน                                                                                                                                                                 | ผลที่วัด / ปุ่มที่ได้รับผล                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public data                  | cache query ของ Home, About, Projects, Project Detail และ Certificates 1 ชั่วโมง พร้อม tag invalidation หลัง admin แก้ข้อมูล/slug; URL ภาพ fixed slot เติม version หลังอัปโหลด | TTFB หลัง cache อุ่นลดตามตารางเมื่อเปิดหรือกดไปหน้านั้น; ยังไม่ได้วัดการแก้ผ่าน admin ที่ต้องล็อกอิน                                               |
| Projects query               | listing เลือกเฉพาะ 6 ฟิลด์ที่การ์ดใช้; About เลือกฟิลด์ที่ UI ใช้                                                                                                              | ข้อมูล 8 แถวจาก Prisma **101,320 → 2,389 JSON B**; HTML หน้า Projects **32,989 → 8,538 B**; รวมอยู่ในเวลาเมื่อกด Projects                          |
| Projects/Detail image        | ใช้ responsive `next/image` พร้อม `sizes`, lazy loading และ fallback                                                                                                           | ตัวอย่าง Money Tracker ภาพต้นฉบับ ~2.99 MiB → variant 384 px **62,377 B**; ภาพอื่นที่วัด 11–56 KB; ไม่มี benchmark LCP จึงไม่ระบุ ms เฉพาะภาพ      |
| About image และ icons        | ภาพโปรไฟล์ responsive และ priority; icons ใต้จอ lazy                                                                                                                           | ภาพโปรไฟล์ต้นฉบับ ~633.7 KiB → variant 384 px **35,511 B**; รวมอยู่ใน About click แต่ยังไม่มี ms เฉพาะรูป                                          |
| ฟอนต์                        | EN ไม่โหลด stylesheet ภาษา TH/JA, จำกัด Inter subset, ไม่ preload Geist Mono                                                                                                   | preload จาก 4 ไฟล์ ~181.8 KiB เหลือ **2 ไฟล์ 77,720 B** (~75.9 KiB) ทุกหน้า; ช่วย first visit และทุกปุ่มเมนูที่ยังไม่มี font cache แต่ไม่มี ms แยก |
| SSR                          | Projects และ Contact แสดง heading/การ์ดใน HTML แรก แทนรอ mounted state                                                                                                         | ตรวจ HTML ที่ server ส่งจริง; Contact HTML โตเพราะเนื้อหามาถึงก่อน hydration; ผล click Contact ใกล้เคียงเดิม                                       |
| Client animations            | หยุด loop นอก viewport/แท็บที่ซ่อน, ลด state update ต่อ scroll/pointer, เอา reveal timer loop ของ Projects ออก, ใช้ rAF/DOM สำหรับ Timeline/Project Detail                     | ลดงานหลังเข้าหน้าหรือขณะเลื่อน/ขยับเมาส์ ไม่ได้วัด CPU trace ก่อน–หลัง จึงยังไม่มี ms ที่อ้างได้สำหรับปุ่มกรอง, scroll หรือ hover                  |
| Theme ใน Contact             | ใช้ ThemeProvider ร่วมแทน MutationObserver ซ้ำ 6 ตัว                                                                                                                           | ตรวจสลับ dark/light และ refresh แล้วยังคงธีม; ไม่อ้าง ms ของปุ่มสลับธีม                                                                            |
| ไฟล์ public ที่ไม่ถูกอ้างอิง | ลบ `profile-main.png`, `logo-light.png`, `logo-dark.png` ที่ไม่ถูกใช้                                                                                                          | ขนาดไฟล์ใน repo/deploy ลด **5,110,428 B** (~4.87 MiB); ไม่ใช่เวลาโหลดหน้า เพราะ browser ไม่ได้ขอไฟล์เหล่านี้                                       |

ขนาดภาพ variant วัดด้วย Node fetch ที่ส่ง `Accept: */*`; Chrome อาจเลือกรูปแบบ/ขนาดอื่นตาม viewport และการรองรับของ browser

## จุดที่ตรวจแล้วและข้อจำกัด

- Home มี Fastship iframe สอง node ตาม responsive layout (แสดงหนึ่ง ซ่อนหนึ่ง) และ Fastwork หนึ่ง node; ที่ viewport 1100 px เมื่อเลื่อนมาถึง CTA พบคำขอ Fastship **หนึ่ง** และ Fastwork **หนึ่ง** ไม่พบการดาวน์โหลด Fastship ซ้ำ จึงไม่ได้ถอด iframe ที่ใช้อยู่
- Home มี Next `Link` prefetch สำหรับปลายทางที่มองเห็นประมาณ 15–16 `_rsc` entries ตามจุดที่เลื่อน; คงไว้เพราะการปิดอาจทำให้ตอนกดเมนูช้าลง ไม่สามารถแปลงคำขอเหล่านี้เป็น ms ที่ประหยัดได้
- Admin Analytics ส่ง 6 คำขอแบบขนานอยู่แล้ว; การตรวจสิทธิ์และข้อมูลผู้ใช้ซ้ำยังไม่ได้วัดใน session ที่ล็อกอิน จึงไม่แก้แบบคาดเดา
- Animation orbit ที่อยู่บนจอยังขยับตำแหน่งด้วย `top/left`; การเปลี่ยนเป็น `transform` ต้องเทียบ trace/ตำแหน่งจริงก่อน เพื่อไม่ให้ responsive layout เปลี่ยน
- ภาพ Overview ที่อัปโหลดใหม่ด้วยสัดส่วนอื่นอาจมีพื้นที่ว่างในกรอบ 4:3 แม้ภาพไม่ถูกครอป; ถ้าต้องการกรอบตามสัดส่วนจริง ควรเก็บ width/height ใน CMS ตอนอัปโหลด
- ไม่ได้วัด LCP/INP, mobile, CPU trace, production deployment หรือ cache miss ครั้งแรก จึงไม่อ้างว่าตัวเลข local ข้างต้นเป็นความเร็วทุกเครื่อง

## ตรวจความถูกต้อง

- `npm run typecheck`, `npm run lint`, `npm test` (46 existing tests), `npm run build` และ `git diff --check` ผ่าน; ไม่มีการเพิ่ม unit test ใหม่
- Browser production ตรวจ `/th/legal/privacy-policy/` และ `/ja/legal/privacy-policy/` แสดงภาษาให้ตรง locale; ตรวจสลับ dark → light ใน Contact และ reload แล้วยังคง light; ตรวจ SSR ของ privacy/terms EN/TH/JA เพิ่ม
- กรณี unit test ที่ควรเพิ่มอยู่ในหัวข้อ “กรณีทดสอบที่จะชวนผู้ใช้ทบทวนก่อนเขียน unit tests” ของ audit; ตาม AGENTS.md ต้องให้ผู้ใช้ทบทวน failure/edge cases และ expected results ก่อนเขียน test code

โปรดรัน benchmark ใน production build และพอร์ตเดียวกันหากวัดซ้ำ: `npm run build`, `npm run start -- -p 3101`, เปิด Chrome remote debugging แล้วใช้ `scripts/measure-navigation.mjs` และ `scripts/measure-assets.mjs`
