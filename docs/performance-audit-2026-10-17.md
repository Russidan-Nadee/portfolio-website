# Performance audit — 17 October 2026

ผลการแก้ไขและตัวเลขก่อน–หลังอยู่ใน [performance results](performance-results-2026-10-17.md)

เอกสารนี้รวบรวมผลสำรวจ performance ของ portfolio website เพื่อใช้เลือกงานและวัดผลก่อน–หลังแก้ไข การสำรวจรอบนี้ **ไม่ได้เปลี่ยนโค้ด** และตัวเลขที่วัดในเครื่องไม่ใช่ Core Web Vitals ของเว็บไซต์ที่ deploy

## วิธีอ่านหลักฐาน

- **วัดแล้ว**: มีตัวเลขจาก production build ในเครื่อง, Prisma read-only query, ขนาดไฟล์จริง หรือ build manifest
- **ยืนยันจากโค้ด**: ลำดับการทำงานพิสูจน์ได้จาก source แต่ยังไม่มี browser Performance trace
- **ต้องวัดเพิ่ม**: เป็นโอกาสที่มีเหตุผลรองรับ แต่ยังสรุปผลกระทบต่อผู้ใช้หรือปริมาณ network ไม่ได้
- เวลา response ด้านล่างวัดแบบเรียงลำดับทีละ request บน Windows ด้วย `next start` และ `curl --compressed`; ใช้ 1 request แรกและ 5 request หลังอุ่นต่อหน้า ฐานข้อมูลและเครือข่ายยังทำให้ตัวเลขแกว่งได้

## Baseline: เวลาเปิดหน้าและข้อมูลที่ส่ง

| หน้า               | ครั้งแรก | หลังอุ่น: มัธยฐาน | หลังอุ่น: ช่วงที่พบ | HTML บีบอัด |
| ------------------ | -------: | ----------------: | ------------------: | ----------: |
| `/en/`             |   891 ms |            140 ms |           95–180 ms |    19.3 KiB |
| `/en/about/`       |   429 ms |            308 ms |          266–538 ms |    23.3 KiB |
| `/en/portfolio/`   |   383 ms |            295 ms |          176–324 ms |    32.2 KiB |
| `/en/certificate/` |   240 ms |            100 ms |           79–469 ms |     9.2 KiB |
| `/en/contact/`     |    17 ms |              8 ms |             8–16 ms |     5.5 KiB |

ตัวเลข dev ที่ผู้ใช้พบ (`GET /en/ 200 in 1409ms`, compile 281 ms, proxy 8 ms, render 1121 ms) เป็น request ช่วงเริ่มต้น ในการวัดแยกอีกครั้ง dev request แรกใช้ 2.6 s (compile 1044 ms, proxy 149 ms, render 1399 ms) และ 6 request ถัดมาใช้ 174–326 ms จึงไม่ควรใช้เวลา dev ครั้งแรกแทนความเร็ว production ที่ผู้ใช้พบจริง

คำสั่งทำซ้ำ baseline:

```powershell
npm run build
npm run start -- -p 3101

# อีก terminal; วัดหลายครั้งโดยไม่นับรอบแรกเป็น warm sample
curl.exe -sS --compressed -o NUL -w '%{http_code} %{time_starttransfer} %{time_total} %{size_download}' http://localhost:3101/en/portfolio/
```

ยังไม่ได้เก็บ Lighthouse/Core Web Vitals, Chrome Performance trace, จำนวน request จริงของ browser, ผลบนมือถือ หรือผลจากเว็บไซต์ที่ deploy ตัวเลข `curl` แสดง server response และ HTML เท่านั้น

## ลำดับงานที่แนะนำ

| ลำดับ  | งาน                                              | หลักฐาน                                                               | ผลที่คาด                                            | ความเสี่ยง / วิธีตัดสิน                                            |
| ------ | ------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| **P1** | หยุด timer/render loop ใน Portfolio              | ยืนยันจากโค้ด: state update ทำให้ effect ตั้ง timer รอบใหม่ตลอด       | ลดงาน CPU และ React commits ระหว่างปล่อยหน้าทิ้งไว้ | ต่ำ–กลาง; ตรวจ animation/filter/locale และ idle commits            |
| **P1** | ปรับภาพ Portfolio listing และ Project Detail     | รูปต้นฉบับมีขนาดหลาย MiB และ listing ใช้ `<img>` โหลดทันที            | ลด bytes และเวลาแสดงภาพ                             | กลาง; วัด Network/LCP บนมือถือและ desktop, ตรวจภาพ remote/fallback |
| **P1** | จำกัดฟิลด์ query การ์ด Portfolio                 | วัดแล้ว: 101,320 → 2,389 JSON bytes สำหรับ 8 แถว                      | ลด DB transfer และ RSC serialization                | ต่ำ; เวลา query ยังแกว่ง ต้องวัด end-to-end หลังแก้                |
| **P2** | ให้ Portfolio/Contact มีเนื้อหาใน HTML แรก       | ยืนยันจาก `if (!mounted) return null`                                 | แสดงเนื้อหาได้ก่อน hydration                        | กลาง; ตรวจ hydration, animation และ no-JS HTML                     |
| **P2** | Lazy/optimize ภาพ About และไอคอนใต้จอ            | รูปโปรไฟล์ 633.7 KiB; skill icons หลายรายการ; Home tech icons eager   | ลด initial transfer และงาน decode                   | ต่ำ–กลาง; อย่า lazy ภาพที่เป็น LCP                                 |
| **P2** | ลด preload ฟอนต์ที่ไม่จำเป็น                     | วัดแล้ว: 4 preload รวม 181.8 KiB ทุกหน้า                              | ลด first-visit font transfer                        | กลาง; ตรวจ EN/TH/JA และ font shift                                 |
| **P2** | วัดและลดงาน animation/scroll/mousemove           | หลาย component อัปเดต state หรือ CSS position ทุก frame               | ลด main-thread work                                 | ต้องมี browser trace ก่อนสรุปว่าจุดไหนหนักสุด                      |
| **P3** | Cache ข้อมูล public ที่เปลี่ยนไม่บ่อย            | Home/About/Portfolio ดึง DB ทุก request; warm About/Portfolio ~300 ms | ลด DB round trips บน request ที่ cache hit          | กลาง–สูง; ต้องแก้ invalidation และทดสอบทุก locale ก่อน             |
| **P3** | ตรวจ iframe, Link prefetch, admin, unused assets | พบโครงสร้างที่อาจมีงานซ้ำ แต่ยังไม่มี trace                           | ลด network/งานที่ไม่จำเป็นเฉพาะจุด                  | เปลี่ยนหลังมีหลักฐานเท่านั้น                                       |

## รายละเอียดตามจุด

### 1. Portfolio: timer และ state update ไม่หยุด — ยืนยันจากโค้ด

- [`src/app/portfolio/PortfolioContent.tsx:69-88`](../src/app/portfolio/PortfolioContent.tsx#L69) สร้าง `filteredProjects` ด้วย `projects.filter(...)` ใหม่ทุก render แล้วใส่ array นี้ใน dependency ของ effect
- Effect ตั้ง timeout ชั้นนอก 100 ms แล้วตั้ง timeout ชั้นในตามจำนวนการ์ด; แต่ละ callback เรียก `setVisibleItems((prev) => new Set([...prev, index]))` แม้ index นั้นมีอยู่แล้ว จึงได้ Set ใหม่และเกิด render อีก
- Render ใหม่ทำให้ `filteredProjects` เปลี่ยน identity, effect cleanup แล้วเริ่มรอบใหม่; cleanup ล้างเฉพาะ timer ชั้นนอก ไม่ล้าง timer ของการ์ดรอบก่อน วงจรนี้เกิดได้เมื่อมีโปรเจกต์อย่างน้อย 1 รายการ
- [`PortfolioContent.tsx:90-105`](../src/app/portfolio/PortfolioContent.tsx#L90) อัปเดต `mousePosition` ทุก `mousemove` ที่ระดับหน้า ทำให้ render การ์ดทั้งชุดและกระตุ้น effect ข้างต้นเพิ่ม

**แนวแก้:** ใช้ `useMemo` กับผล filter ตาม `projects`/`activeFilter`; เก็บและล้าง timer ทุกตัว; ไม่สร้าง Set ใหม่หาก index แสดงอยู่แล้ว หรือเปลี่ยนเป็น CSS stagger ที่ใช้ state เพียงครั้งเดียว จากนั้นแยก parallax/เมาส์ออกจาก subtree การ์ดหรืออัปเดต CSS variable ผ่าน `requestAnimationFrame`

**เกณฑ์ตรวจ:** หลังการ์ดแสดงครบและไม่ขยับเมาส์ React Profiler ต้องไม่มี commits ต่อเนื่องที่เกิดจากการ reveal การ์ด สลับ filter/locale แล้วยังได้พฤติกรรมภาพตามที่ตกลงกับผู้ใช้ และ unmount แล้วไม่มี callback ของการ์ดค้างอยู่

### 2. ภาพใหญ่และการโหลดภาพ — วัดขนาดไฟล์ต้นฉบับแล้ว

- [`PortfolioContent.tsx:205-226`](../src/app/portfolio/PortfolioContent.tsx#L205) render `<img>` สำหรับทุกการ์ดหลัง hydration โดยไม่มี responsive `sizes` หรือ lazy loading ภาพ thumbnail ใน seed 7 รูปรวม **4.55 MiB**; `money-tracker-app.png` รูปเดียว **2.99 MiB** ตัวเลขนี้เป็นไฟล์ต้นฉบับใน repo ไม่ใช่ bytes ที่ browser ดาวน์โหลดจริงจาก CMS
- [`src/components/portfolio/ProjectTabsContent.tsx:139-170`](../src/components/portfolio/ProjectTabsContent.tsx#L139) แสดง Overview ด้วย `<img>`; ภาพต้นฉบับตัวอย่างมีขนาด **1.77–3.61 MiB**: investfam 3.61, tp-rfid 2.41, portfolio 2.05, kinrai 1.85 MiB Gallery ที่ [`:318-330`](../src/components/portfolio/ProjectTabsContent.tsx#L318) ใช้ `<img>` เช่นกัน แต่ mount เมื่อเลือกแท็บ Gallery
- [`src/components/about/PersonalIntro.tsx:427-430`](../src/components/about/PersonalIntro.tsx#L427) ใช้ `<img>` สำหรับรูปโปรไฟล์ต้นหน้า About ขนาด **633.7 KiB**
- [`src/components/about/SkillsGrid.tsx:188-203`](../src/components/about/SkillsGrid.tsx#L188) สร้างรูปไอคอน skill โดยไม่มี lazy loading; seed มี 46 skills และไอคอนจากหลายโดเมน
- [`src/components/home/Technologies.tsx:177-197`](../src/components/home/Technologies.tsx#L177) ตั้ง `loading="eager"` ให้ไอคอน featured ใต้ Hero ทั้งหมด
- CertificateCard ตั้ง lazy loading อยู่แล้ว ไม่ต้องเปลี่ยนเพียงเพื่อให้เหมือนส่วนอื่น

**แนวแก้:** ใช้ [`OptimizedImage`](../src/components/ui/OptimizedImage.tsx) ที่มี fallback สำหรับ URL ที่ optimize ไม่ได้ กำหนด `width`/`height` หรือ `fill` พร้อม container ที่ขนาดคงที่ และ `sizes` ตามขนาดการ์ดจริง; ภาพ Overview ที่สัดส่วนต่างกันต้องตรวจ layout เป็นพิเศษ ใช้ lazy loading เฉพาะภาพนอกจอ ภาพที่เป็น LCP ต้องไม่ถูกเลื่อนโหลด ตรวจ remotePatterns/ไฟล์ PDF และการแสดงทุก locale ก่อนสรุป

**เกณฑ์ตรวจ:** เปรียบเทียบ Network transferred bytes, จำนวนคำขอภาพ, LCP และภาพที่แสดงครบที่ viewport มือถือ/desktop โดยใช้ cache setting และเครือข่ายเดียวกันก่อน–หลัง

### 3. Portfolio query ส่งข้อมูลเกินที่การ์ดใช้ — วัดแล้ว

- [`src/app/portfolio/page.tsx:7-11`](../src/app/portfolio/page.tsx#L7) ใช้ `prisma.project.findMany` โดยไม่ `select` จึงดึงทุกคอลัมน์รวม JSON `content`; [`PortfolioContent.tsx:207-254`](../src/app/portfolio/PortfolioContent.tsx#L207) ใช้เพียง `id`, `slug`, `title`, `thumbnailUrl`, `techSummary`, `filterTags`
- อ่าน 8 แถวจากฐานข้อมูลเดียวกัน: full row serialize เป็น **101,320 bytes**; เลือก 6 ฟิลด์เหลือ **2,389 bytes** (ลด 97.6% หรือประมาณ 42 เท่าใน JSON ก่อนบีบอัด)
- เวลา query หลังอุ่น 5 รอบ: full **90–158 ms** (มัธยฐาน ~142 ms), selected **66–137 ms** (มัธยฐาน ~88 ms) ช่วงทับกันและมี network noise จึงเป็นเพียงสัญญาณ ยังไม่ใช่ speedup ที่ยืนยันได้

**แนวแก้:** เพิ่ม Prisma `select` และ type สำหรับ public project card โดยเฉพาะ แทนการ cast เป็น admin `ProjectData[]`; คงลำดับ/จำนวน/ข้อความทุก locale แล้ววัด HTML/RSC bytes และ warm route latency เทียบ workload เดิม

**About:** [`src/app/about/page.tsx:8-16`](../src/app/about/page.tsx#L8) ดึง Category/Skill และ Experience แบบเต็มแถว การทดลอง select ฟิลด์ที่ใช้ลด Category JSON **30,861 → 22,902 bytes** (7 หมวด), Experience **5,221 → 4,909 bytes** (4 รายการ) ผลด้าน bytes น้อยกว่า Portfolio มาก จัดเป็นงานรอง

### 4. เนื้อหาต้องรอ hydration — ยืนยันจากโค้ด

- [`PortfolioContent.tsx:108`](../src/app/portfolio/PortfolioContent.tsx#L108) และ [`src/app/contact/page.tsx:216`](../src/app/contact/page.tsx#L216) คืน `null` จน `mounted` ถูกตั้งใน client effect ทำให้เนื้อหาหลักไม่อยู่ใน server HTML แรก แม้ฝั่ง server จะอ่านข้อมูลมาแล้ว

**แนวแก้:** render โครงและข้อความที่เสถียรตั้งแต่ server pass แล้วเปิดเฉพาะ animation/ค่าที่อาศัย `window` หลัง mount ต้องระวัง locale และ hydration mismatch

**เกณฑ์ตรวจ:** ดู HTML โดยปิด JavaScript หรือใช้ `curl`, ตรวจ hydration warning, animation และการเปลี่ยนภาษา

### 5. ฟอนต์และ route bundle — วัดจาก build manifest

- [`src/app/layout.tsx:14-28`](../src/app/layout.tsx#L14) ประกาศ Geist Sans, Geist Mono และ Inter ที่ root layout; manifest ระบุ 4 preload ในทุก route รวม **181.8 KiB raw**: Geist Sans 28.6, Geist Mono 22.6, Inter Latin Extended 83.3, Inter Latin 47.3 KiB
- Geist Sans ใช้กับแบรนด์ Header/Footer เป็นหลัก; Geist Mono ใช้ส่วน terminal/research; Inter ใช้ข้อความทั่วไป ตรวจ usage จริงก่อนตัด subset หรือ preload
- [`layout.tsx:125-130`](../src/app/layout.tsx#L125) เพิ่ม stylesheet จาก Google Fonts สำหรับไทย/ญี่ปุ่นในทุก locale รวม EN เป็น external CSS ที่ browser ต้องโหลดก่อน render ที่เกี่ยวข้อง; ค่า transfer และเวลาที่กระทบ critical path ของเว็บนี้ยังไม่ได้วัด
- Home client-reference manifest: 8 JS entry files **305.6 KiB raw (~99.6 KiB gzip)** และ 2 CSS **130.3 KiB raw (~23.3 KiB gzip)**; About 279.3 KiB JS/64.4 KiB CSS raw; Portfolio 123.7 KiB JS/62.1 KiB CSS raw ตัวเลขนี้ไม่รวม RSC/remote assets และไม่เท่ากับ browser transfer จริง

**แนวทดลอง:** ตรวจว่าต้องใช้ Inter Latin Extended หรือไม่, ตั้ง `preload: false` ให้ฟอนต์ที่อยู่ส่วนล่างและไม่ใช่ LCP, พิจารณา self-host ฟอนต์ไทย/ญี่ปุ่นผ่าน `next/font` พร้อมทดสอบ EN/TH/JA และการนำทางข้ามภาษา อย่าตัดฟอนต์โดยดูจากชื่อไฟล์อย่างเดียว

### 6. งานต่อเนื่องใน client — ยืนยันจากโค้ด, ต้องวัด CPU

- [`src/components/home/Technologies.module.css:36-75`](../src/components/home/Technologies.module.css#L36) และ [`:141-175`](../src/components/home/Technologies.module.css#L141) animate `top`/`left`/transform ของหลายโลโก้ตลอดเวลา; ภาพมี drop-shadow แบบคงที่ [`Technologies.tsx:80-162`](../src/components/home/Technologies.tsx#L80) ยังไม่มีการพักเมื่อส่วนนี้พ้น viewport การขยับ position อาจกระตุ้น layout ทุก frame ควรวัด trace ก่อนประเมินผล
- [`src/components/home/ProjectsShowcase.tsx:177-199`](../src/components/home/ProjectsShowcase.tsx#L177) เริ่ม interval เมื่อ section เคยเข้าจอแล้ว แต่ยังหมุน carousel ต่อเมื่อออกนอกจอ; dependency ของ sequence ทำให้ตั้ง interval ใหม่เมื่อหมุน
- [`src/components/home/AiStoryPanel.tsx:337-399`](../src/components/home/AiStoryPanel.tsx#L337) ใช้ ScrollTrigger อ่านขนาด viewport แล้วเขียน CSS `--frame-*` ที่ใช้กับ `inset` ระหว่าง scroll; [`ProjectsShowcase.tsx:91-135`](../src/components/home/ProjectsShowcase.tsx#L91) อ่าน `getBoundingClientRect()` แล้วเขียน padding/inset/radius ใน scroll animation ทั้งสองเป็นเป้าหมายเก็บ layout/paint trace ยังไม่ยืนยันว่าช้า โดย AiStoryPanel path นี้ทำงานเฉพาะ desktop ที่กว้างอย่างน้อย 1024 px สูงอย่างน้อย 620 px และไม่ได้ขอลด motion
- [`src/app/portfolio/[slug]/ProjectDetailContent.tsx:70-80`](../src/app/portfolio/%5Bslug%5D/ProjectDetailContent.tsx#L70) อัปเดต progress state ระดับหน้าทุก scroll event; subtree เนื้อหาโปรเจกต์ได้รับ render ตามด้วย ควรแยก progress bar หรืออัปเดต ref/CSS variable ผ่าน `requestAnimationFrame`
- [`src/components/about/Timeline.tsx:218-305`](../src/components/about/Timeline.tsx#L218) จัดการ scroll/progress/visible items โดยไม่มี rAF throttle หรือการข้ามค่าที่เท่าเดิม
- [`src/components/about/PersonalIntro.tsx:209-225`](../src/components/about/PersonalIntro.tsx#L209) และ [`SkillsGrid.tsx:101-117`](../src/components/about/SkillsGrid.tsx#L101) อัปเดต React state ทุก mousemove; ควรแยกของตกแต่งออกหรือใช้ ref/CSS variable ตาม frame
- [`src/components/contact/ContactCard.tsx:48-70`](../src/components/contact/ContactCard.tsx#L48) สร้าง MutationObserver สำหรับ theme ต่อการ์ด เป็นงานซ้ำขนาดเล็ก; ควรจัดการ theme ที่ parent/CSS หาก trace ชี้ว่ามีนัยสำคัญ

**เกณฑ์ตรวจรวม:** เก็บ Chrome Performance trace / React Profiler ใน scene และ viewport เดียวกัน ดู scripting/layout/paint time, idle CPU และจำนวน React commits; ตรวจ `prefers-reduced-motion` และผลการแสดงหลัง pause/แยก state

### 7. งานซ้ำและ lifecycle — ต้องวัด network หรือทดสอบ behavior

- [`src/components/home/AiStoryPanel.tsx:477-533`](../src/components/home/AiStoryPanel.tsx#L477) mount เนื้อหา sticky และ static list ทั้งสองชุด แล้วใช้ CSS ซ่อนอีกชุด; อาจมี DOM/effects/ResizeObserver และ iframe สอง node เมื่อ scene ที่เกี่ยวข้องทำงาน แต่ `loading="lazy"` อาจป้องกันการดาวน์โหลดซ้ำ ต้องดู Network ก่อนเปลี่ยน
- Home Fastwork iframe ที่ [`src/app/HomeContent.tsx:149-156`](../src/app/HomeContent.tsx#L149) และ Fastship iframe ใน AiStoryPanel ใช้ lazy loading อยู่แล้ว ไม่ควรสรุปว่าเป็นต้นเหตุ initial LCP โดยไม่มี trace
- Header/Footer และ CTA ใช้ `Link` ที่ค่า prefetch เริ่มต้น การ prefetch ใน production อาจเพิ่ม `_rsc` requests และ DB work แต่ก็ทำให้การคลิกเร็วขึ้น ต้องวัดก่อนเลือก `prefetch={false}` เฉพาะปลายทางที่ไม่คุ้ม
- [`src/app/about/AboutContent.tsx:109-112`](../src/app/about/AboutContent.tsx#L109) กับ [`SkillsGrid.tsx:69-99`](../src/components/about/SkillsGrid.tsx#L69) cleanup ด้วย `ScrollTrigger.getAll().forEach(kill)` แบบ global อาจปิด trigger ของ component อื่น; ควรใช้ cleanup ตาม GSAP context ที่ตนสร้าง การแก้จุดนี้ต้องตรวจ animation ไม่ใช่คาดว่าจะทำให้เร็วขึ้นทันที

### 8. Server cache, locale และ admin — จัดเป็นงานหลังการแก้ที่เสี่ยงต่ำ

- [`src/app/page.tsx:9-65`](../src/app/page.tsx#L9) ตั้ง `force-dynamic` และรัน Prisma 4 query ขนานกันทุก request; [`src/app/layout.tsx:88-120`](../src/app/layout.tsx#L88) อ่าน `headers()` ทั้ง metadata และ layout ทำให้ public routes ยังขึ้นกับ request แม้เอา `force-dynamic` ออกจาก Home; prerender manifest มีเพียง `/_global-error`
- ก่อน cache Home/About ต้องเติม invalidation: [`src/app/admin/skills/actions.ts:95-150`](../src/app/admin/skills/actions.ts#L95) เปลี่ยนข้อมูล featured/active ที่ Home ใช้แต่ไม่ invalidate Home และ `updateCategory` ที่ [`skills/actions.ts:58-61`](../src/app/admin/skills/actions.ts#L58) เปลี่ยนชื่อหมวดที่ About แสดงแต่ invalidate เพียงหน้า admin; [`src/app/admin/certificates/actions.ts:19-21`](../src/app/admin/certificates/actions.ts#L19) invalidate Certificate แต่ Home ก็ใช้ข้อมูลนี้; Project actions เรียก invalidate path ภายในของ Home/Portfolio แล้ว แต่ต้องพิสูจน์ว่าครอบคลุม URL ทั้งสามภาษาที่ proxy rewrite และ path ของ slug เก่าเมื่อแก้ slug
- Public proxy เน้น locale rewrite และ warm overhead ที่วัดจาก dev log ประมาณ 4–8 ms จึงไม่ใช่ตัวเลือกแรก การเพิ่ม DB index ยังไม่มี `EXPLAIN` หรือจำนวนแถวที่ชี้ว่าจำเป็น
- [`src/app/admin/page.tsx:4-6`](../src/app/admin/page.tsx#L4) รอ Analytics; [`src/lib/vercel-analytics.ts:183-235`](../src/lib/vercel-analytics.ts#L183) ส่ง external no-store requests 6 รายการเมื่อกำหนด Vercel credentials แล้ว และมี timeout ร่วมสูงสุด 8 s เป็นโอกาสเฉพาะ admin หาก dashboard ช้า
- [`src/proxy.ts:59-61`](../src/proxy.ts#L59) และ [`src/app/admin/layout.tsx:10-15`](../src/app/admin/layout.tsx#L10) เรียก Supabase `getUser()` ซ้ำใน admin; ต้องวัดก่อนและรักษาการตรวจสิทธิ์ไว้ครบ ห้ามตัดโดยอาศัยสมมติฐานเรื่อง cache
- `public/` รวมราว 22.2 MiB; `profile-main.png` 2.28 MiB, `logo-light.png` 1.30 MiB และ `logo-dark.png` 1.29 MiB ไม่พบ reference ใน source/seed ที่สำรวจ เป็นเรื่องขนาด deploy ไม่ใช่ browser runtime หากไม่ได้ร้องขอไฟล์เหล่านี้ ต้องค้น reference ทั้ง repo ก่อนลบ

## แผนลงมือแบบวัดก่อน–หลัง

1. **แก้ timer loop Portfolio ก่อน:** เก็บ React Profiler/idle commits ใน `/en/portfolio/`, แก้เฉพาะ effect, ตรวจ filter/locale/unmount แล้ววัดซ้ำ
2. **แก้ภาพหน้า Portfolio:** เก็บ Network bytes และ LCP มือถือ/desktop ใน build เดียวกัน แล้วเปลี่ยน listing และ Overview ทีละส่วน วัดซ้ำก่อนขยายไป About/Skills
3. **ลดข้อมูล query Portfolio:** บันทึก query/HTML/RSC size กับ route latency ก่อนแก้, ใส่ `select` + type ที่ตรง UI, ตรวจทั้ง 3 locale และวัดซ้ำ โดยไม่อ้างความเร็วจากตัวเลข query ที่ช่วงทับกัน
4. **แก้ HTML แรกและภาพนอกจอ:** ตรวจ HTML/no-JS/hydration; หลังจากนั้นค่อยทดลองลด font preload พร้อม visual check
5. **เก็บ browser trace:** ใช้ตัดสินว่าจะตามด้วย CSS animation, scroll/mousemove, iframe, prefetch หรือ server cache งาน cache ต้องเตรียม invalidation จาก admin ให้ครบก่อน

ข้อจำกัด: ยังไม่มี field data/Lighthouse/INP/LCP จริง และไม่ได้วัดบน production deployment ผลของการปรับแต่ละข้อจึงต้องยืนยันด้วย workload, viewport, network profile และ cache state เดิมก่อนเก็บไว้

## กรณีทดสอบที่จะชวนผู้ใช้ทบทวนก่อนเขียน unit tests

ตาม AGENTS.md ต้องให้ผู้ใช้ร่วมกำหนดกรณีและผลที่ถูกต้องก่อนเขียนหรือเปลี่ยน unit tests ข้างล่างเป็นเพียง **ร่างเพื่อรีวิว** ยังไม่มี test code:

| งาน                        | กรณีที่ควรคุยและผลที่คาด                                                                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio timer            | เมื่อแสดงการ์ดครบแล้ว idle ต้องไม่มี reveal timer หรือ React commit ที่เกิดจาก grid ต่อเนื่อง; สลับ filter/locale ต้องได้ animation ตามที่ตกลง; unmount ต้องล้าง timer ของ grid |
| Portfolio data projection  | จำนวน/ลำดับ/ข้อความ/รูป/ตัวกรองเหมือนเดิมทุก locale; ข้อมูลรายละเอียดที่การ์ดไม่ใช้ไม่ถูกส่งไป listing                                                                          |
| Image optimization         | รูป local/Supabase แสดงขนาดเหมาะสม; URL ที่ optimize ไม่ได้หรือ optimizer ล้มเหลวใช้ภาพต้นฉบับ; ภาพเสียจริงแสดง fallback ที่ตกลงกัน                                             |
| Cache/invalidation (ถ้าทำ) | แก้ Skill/Project/Certificate แล้วทุก locale เห็นข้อมูลใหม่ตามเวลาที่ตกลง; slug เก่า/ใหม่ทำงานตามกฎที่ผู้ใช้ยืนยัน                                                              |

## เอกสารอ้างอิง

- [Next.js Image และ `sizes`](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Font preload/subsets](https://nextjs.org/docs/app/api-reference/components/font)
- [Next.js `Link` prefetch](https://nextjs.org/docs/app/guides/prefetching)
- [Next.js dynamic rendering/cache](https://nextjs.org/docs/app/guides/caching-without-cache-components)

## สถานะ workspace ตอนสำรวจ

มี `src/app/about/AboutContent.tsx` แก้ค้างจากงาน `next/link` ก่อนหน้า การสำรวจนี้ไม่แตะไฟล์นั้นและยังไม่มี commit ใหม่
