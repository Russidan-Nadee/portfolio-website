// src/app/portfolio/asset-management/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function AssetManagementPage() {
   const [activeTab, setActiveTab] = useState('overview')
   const [scrollProgress, setScrollProgress] = useState(0)

   // Progress bar update
   useEffect(() => {
      const updateProgressBar = () => {
         const winScroll = document.body.scrollTop || document.documentElement.scrollTop
         const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
         const scrolled = (winScroll / height) * 100
         setScrollProgress(scrolled)
      }

      window.addEventListener('scroll', updateProgressBar)
      return () => window.removeEventListener('scroll', updateProgressBar)
   }, [])

   // Scroll to top function
   const scrollToTop = () => {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      })
   }

   // Tab switching function
   const showTab = (tabName: string) => {
      setActiveTab(tabName)
   }

   return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         {/* Progress Bar */}
         <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50" style={{ backgroundColor: 'var(--muted)' }}>
            <div
               className="h-full transition-all duration-300"
               style={{
                  width: `${scrollProgress}%`,
                  backgroundColor: 'var(--foreground)'
               }}
            />
         </div>

         <div className="max-w-6xl mx-auto p-5">
            {/* Navigation Header */}
            <div
               className="rounded-2xl p-4 mb-5 backdrop-blur-sm border flex justify-between items-center shadow-lg"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  backdropFilter: 'blur(10px)'
               }}
            >
               <Link
                  href="/portfolio"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-70"
                  style={{ color: 'var(--foreground)' }}
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  กลับไปหน้าผลงาน
               </Link>

               <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <span
                     className="px-3 py-1 rounded-full font-medium"
                     style={{ backgroundColor: 'var(--muted)' }}
                  >
                     โปรเจคที่ 1 จาก 4
                  </span>
                  <div className="flex gap-2">
                     <button
                        className="w-9 h-9 border-2 rounded-full flex items-center justify-center cursor-not-allowed opacity-50 transition-all duration-300"
                        style={{
                           borderColor: 'var(--border)',
                           backgroundColor: 'var(--card)',
                           color: 'var(--muted-foreground)'
                        }}
                        disabled
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>
                     <Link
                        href="/portfolio/calculator"
                        className="w-9 h-9 border-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                           borderColor: 'var(--border)',
                           backgroundColor: 'var(--card)',
                           color: 'var(--foreground)'
                        }}
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </Link>
                  </div>
               </div>
            </div>

            {/* Project Header */}
            <div
               className="rounded-2xl p-6 mb-5 border shadow-lg backdrop-blur-sm"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
               }}
            >
               <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  ระบบจัดการทรัพย์สินด้วย RFID
               </h1>
               <p className="text-lg mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  ระบบจัดการทรัพย์สินแบบครบวงจรด้วยเทคโนโลยี RFID สำหรับลดค่าใช้จ่ายและเพิ่มประสิทธิภาพ
               </p>

               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                     <span
                        className="px-3 py-1 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        Cross-Platform
                     </span>
                     <span
                        className="px-3 py-1 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        RFID Technology
                     </span>
                     <span
                        className="px-3 py-1 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        2025
                     </span>
                     <span
                        className="px-3 py-1 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                        style={{
                           backgroundColor: 'var(--foreground)',
                           color: 'var(--background)'
                        }}
                     >
                        กำลังพัฒนา
                     </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     <a
                        href="https://github.com/Russidan-Nadee/intern-project-rfid"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-white bg-gray-600 hover:bg-gray-700"
                     >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                     </a>
                  </div>
               </div>
            </div>

            {/* Key Info Bar */}
            <div
               className="rounded-2xl p-5 mb-5 border shadow-lg backdrop-blur-sm"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
               }}
            >
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="text-center">
                     <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>ระยะเวลาพัฒนา</div>
                     <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>6 เดือน</div>
                  </div>
                  <div className="text-center">
                     <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>สถานะ</div>
                     <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Developer Intern</div>
                  </div>
                  <div className="text-center">
                     <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>บริษัท</div>
                     <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Thai Parkerizing</div>
                  </div>
                  <div className="text-center">
                     <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>เทคโนโลยีหลัก</div>
                     <div className="flex flex-wrap justify-center gap-2">
                        <span
                           className="px-3 py-1 rounded-full text-xs font-medium"
                           style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                        >
                           Flutter
                        </span>
                        <span
                           className="px-3 py-1 rounded-full text-xs font-medium"
                           style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                        >
                           Node.js
                        </span>
                        <span
                           className="px-3 py-1 rounded-full text-xs font-medium"
                           style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                        >
                           MySQL
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Main Content with Tabs */}
            <div
               className="rounded-2xl p-8 mb-5 border shadow-lg backdrop-blur-sm"
               style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
               }}
            >
               <div className="flex gap-0 mb-6 border-b-2" style={{ borderColor: 'var(--border)' }}>
                  {[
                     { id: 'overview', label: 'ภาพรวม' },
                     { id: 'features', label: 'ฟีเจอร์' },
                     { id: 'gallery', label: 'ภาพหน้าจอ' },
                     { id: 'technical', label: 'รายละเอียดเทคนิค' },
                     { id: 'results', label: 'ผลลัพธ์' }
                  ].map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => showTab(tab.id)}
                        className={`px-5 py-3 border-b-2 transition-all duration-300 ${activeTab === tab.id
                              ? 'font-semibold'
                              : 'hover:opacity-70'
                           }`}
                        style={{
                           color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                           borderBottomColor: activeTab === tab.id ? 'var(--foreground)' : 'transparent'
                        }}
                     >
                        {tab.label}
                     </button>
                  ))}
               </div>

               {/* Overview Tab */}
               {activeTab === 'overview' && (
                  <div>
                     <div className="mb-8">
                        <div
                           className="w-full h-70 rounded-2xl flex items-center justify-center text-lg font-semibold border-2 border-dashed mb-5"
                           style={{
                              backgroundColor: 'var(--muted)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              height: '280px'
                           }}
                        >
                           รูปภาพหลักของระบบ RFID Asset Management
                        </div>
                        <div className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                           ระบบจัดการทรัพย์สินด้วยเทคโนโลยี RFID แบบครบวงจร
                        </div>
                     </div>

                     <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                           <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           เกี่ยวกับโปรเจค
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                           ระบบจัดการทรัพย์สินด้วยเทคโนโลยี RFID ที่พัฒนาขึ้นเพื่อลดค่าใช้จ่ายของบริษัทที่จะต้องไปซื้อซอฟต์แวร์ราคาแพงจากภายนอก โดยการพัฒนาระบบเองให้ตรงตามความต้องการ
                        </p>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                           ระบบนี้ถูกออกแบบให้เป็น Cross-platform รองรับทั้ง Mobile App, Web Application และ Windows Desktop App เพื่อให้สามารถใช้งานได้ในทุกสถานการณ์
                        </p>
                     </div>

                     <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                           <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           วัตถุประสงค์
                        </h3>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                           <strong>Phase 1:</strong> นำไปใช้งานภายใน Department เพื่อทดสอบประสิทธิภาพและปรับปรุงระบบ<br />
                           <strong>อนาคต:</strong> หากระบบทำงานได้ดี จะขยายการใช้งานไปยังทั้งบริษัทเพื่อเพิ่มประสิทธิภาพในการจัดการทรัพย์สินโดยรวม
                        </p>
                     </div>
                  </div>
               )}

               {/* Features Tab */}
               {activeTab === 'features' && (
                  <div>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                        <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        ฟีเจอร์หลัก
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                           {
                              title: "Dashboard",
                              description: "แดชบอร์ดแสดงสถิติและข้อมูลทรัพย์สินแบบ Real-time"
                           },
                           {
                              title: "Scan",
                              description: "สแกน RFID Tag เพื่อดูข้อมูลและอัพเดทสถานะทรัพย์สิน"
                           },
                           {
                              title: "Search",
                              description: "ค้นหาทรัพย์สินด้วยเลขครุภัณฑ์, ชื่อ, หรือหมวดหมู่"
                           },
                           {
                              title: "Export",
                              description: "ส่งออกรายงานเป็นไฟล์ Excel, PDF หรือ CSV"
                           },
                           {
                              title: "Setting",
                              description: "ตั้งค่าระบบ, จัดการผู้ใช้งาน และกำหนดสิทธิ์การเข้าถึง"
                           },
                           {
                              title: "Sync",
                              description: "ซิงค์ข้อมูลระหว่าง Mobile, Web และ Desktop App"
                           }
                        ].map((feature, index) => (
                           <div
                              key={index}
                              className="p-4 rounded-xl border-l-4 flex items-start gap-3"
                              style={{
                                 backgroundColor: 'var(--muted)',
                                 borderLeftColor: 'var(--foreground)'
                              }}
                           >
                              <div>
                                 <strong style={{ color: 'var(--foreground)' }}>{feature.title}</strong><br />
                                 <span style={{ color: 'var(--muted-foreground)' }}>{feature.description}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Gallery Tab */}
               {activeTab === 'gallery' && (
                  <div>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                        <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ภาพหน้าจอ
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                           "Dashboard Overview",
                           "RFID Scanning Interface",
                           "Asset Search & Filter",
                           "Asset Details View",
                           "Export Reports",
                           "Settings Panel"
                        ].map((title, index) => (
                           <div
                              key={index}
                              className="h-45 rounded-xl border-2 border-dashed flex items-center justify-center font-semibold cursor-pointer transition-transform duration-300 hover:scale-105"
                              style={{
                                 backgroundColor: 'var(--muted)',
                                 borderColor: 'var(--border)',
                                 color: 'var(--muted-foreground)',
                                 height: '180px'
                              }}
                           >
                              {title}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Technical Tab */}
               {activeTab === 'technical' && (
                  <div>
                     <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                           <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                           </svg>
                           รายละเอียดเทคนิค
                        </h3>
                        <div className="space-y-3" style={{ color: 'var(--muted-foreground)' }}>
                           <p><strong style={{ color: 'var(--foreground)' }}>Frontend (Mobile):</strong> Flutter, Dart</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>Frontend (Web):</strong> Flutter Web</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>Frontend (Desktop):</strong> Flutter Desktop (Windows)</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>Backend:</strong> Node.js, Express.js</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>Database:</strong> MySQL, Prisma ORM</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>RFID Integration:</strong> NFC/RFID Reader API</p>
                           <p><strong style={{ color: 'var(--foreground)' }}>Authentication:</strong> JWT Token-based</p>
                        </div>
                     </div>

                     <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                           <svg className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                           </svg>
                           ความท้าทาย
                        </h3>
                        <div className="space-y-3">
                           {[
                              {
                                 title: "Cross-platform Compatibility",
                                 description: "การทำให้ระบบทำงานได้สม่ำเสมอบนทุกแพลตฟอร์ม (Mobile, Web, Desktop)"
                              },
                              {
                                 title: "RFID Integration",
                                 description: "การเชื่อมต่อกับอุปกรณ์ RFID Reader และการประมวลผลข้อมูล Tag"
                              },
                              {
                                 title: "Real-time Synchronization",
                                 description: "การซิงค์ข้อมูลแบบ Real-time ระหว่างหลายอุปกรณ์"
                              },
                              {
                                 title: "Database Performance",
                                 description: "การปรับปรุงประสิทธิภาพฐานข้อมูลเมื่อข้อมูลทรัพย์สินมีจำนวนมาก"
                              }
                           ].map((challenge, index) => (
                              <div
                                 key={index}
                                 className="p-4 rounded-lg border-l-4"
                                 style={{
                                    backgroundColor: 'var(--muted)',
                                    borderLeftColor: 'var(--muted-foreground)'
                                 }}
                              >
                                 <strong style={{ color: 'var(--foreground)' }}>{challenge.title}:</strong>
                                 <span style={{ color: 'var(--muted-foreground)' }} className="ml-2">{challenge.description}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* Results Tab */}
               {activeTab === 'results' && (
                  <div>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                        <svg className="w-5 h-5" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ผลลัพธ์
                     </h3>
                     <div className="space-y-3">
                        {[
                           {
                              title: "สถานะการพัฒนา",
                              description: "โปรเจคอยู่ระหว่างการพัฒนา (Phase 1) คาดว่าจะเสร็จสมบูรณ์ในไตรมาส 4/2025"
                           },
                           {
                              title: "การประหยัดค่าใช้จ่าย",
                              description: "คาดการณ์ว่าจะประหยัดค่าซื้อซอฟต์แวร์ภายนอกได้มากกว่า 80%"
                           },
                           {
                              title: "ประสิทธิภาพการทำงาน",
                              description: "ลดเวลาในการตรวจนับทรัพย์สินจาก 2-3 วัน เหลือเพียง 2-3 ชั่วโมง"
                           },
                           {
                              title: "ความพร้อมใช้งาน",
                              description: "ระบบจะรองรับการใช้งานทั้ง Online และ Offline Mode"
                           }
                        ].map((result, index) => (
                           <div
                              key={index}
                              className="p-4 rounded-lg border-l-4"
                              style={{
                                 backgroundColor: 'var(--muted)',
                                 borderLeftColor: 'var(--foreground)'
                              }}
                           >
                              <strong style={{ color: 'var(--foreground)' }}>{result.title}:</strong>
                              <span style={{ color: 'var(--muted-foreground)' }} className="ml-2">{result.description}</span>
                           </div>
                        ))}
                     </div>

                     <div className="mt-8 p-6 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                        <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                           เป้าหมายในอนาคต
                        </h4>
                        <ul className="space-y-2" style={{ color: 'var(--muted-foreground)' }}>
                           <li>• ขยายการใช้งานไปยังทั้งบริษัทหากผลการทดสอบใน Department เป็นไปตามเป้าหมาย</li>
                           <li>• เพิ่มฟีเจอร์ AI สำหรับการพยากรณ์การบำรุงรักษาทรัพย์สิน</li>
                           <li>• พัฒนา Mobile App สำหรับการใช้งานภาคสนาม</li>
                           <li>• เชื่อมต่อกับระบบ ERP ของบริษัทเพื่อการจัดการแบบรวมศูนย์</li>
                        </ul>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Floating Action Buttons */}
         <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
            <button
               className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
               style={{ backgroundColor: 'var(--muted-foreground)', color: 'var(--background)' }}
               title="แชร์โปรเจค"
               onClick={() => {
                  if (navigator.share) {
                     navigator.share({
                        title: 'RFID Asset Management System',
                        text: 'ระบบจัดการทรัพย์สินด้วย RFID',
                        url: window.location.href
                     });
                  } else {
                     navigator.clipboard.writeText(window.location.href);
                     alert('คัดลอกลิงก์แล้ว!');
                  }
               }}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
               </svg>
            </button>
            <button
               className="w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
               style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
               title="กลับขึ้นด้านบน"
               onClick={scrollToTop}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
               </svg>
            </button>
         </div>

         {/* Animation Styles */}
         <style jsx>{`
            @keyframes fadeInUp {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            .container > div {
               animation: fadeInUp 0.6s ease-out;
            }

            .container > div:nth-child(1) { animation-delay: 0.1s; }
            .container > div:nth-child(2) { animation-delay: 0.2s; }
            .container > div:nth-child(3) { animation-delay: 0.3s; }
            .container > div:nth-child(4) { animation-delay: 0.4s; }
         `}</style>
      </div>
   )
}