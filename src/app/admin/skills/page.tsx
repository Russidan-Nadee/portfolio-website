// src/app/admin/skills/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { MdEdit, MdDeleteOutline, MdDriveFileRenameOutline, MdClose, MdUpload } from 'react-icons/md'

const mockCategories = [
   {
      id: 'c1',
      name: 'Frontend',
      skills: [
         { id: 's1', name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://www.typescriptlang.org', description: { th: 'ภาษาที่มีการกำหนดชนิดข้อมูล', en: 'Typed superset of JavaScript', ja: '型付きのJavaScript' }, featured: true },
         { id: 's2', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', url: 'https://nextjs.org', description: { th: 'เฟรมเวิร์ก React สำหรับ production', en: 'React framework for production', ja: '本番用Reactフレームワーク' }, featured: true },
         { id: 's3', name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', url: 'https://tailwindcss.com', description: { th: 'CSS แบบ utility-first', en: 'Utility-first CSS framework', ja: 'ユーティリティファーストCSS' }, featured: false },
      ],
   },
   {
      id: 'c2',
      name: 'Backend',
      skills: [
         { id: 's4', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', url: 'https://nodejs.org', description: { th: 'JavaScript runtime บนฝั่งเซิร์ฟเวอร์', en: 'Server-side JavaScript runtime', ja: 'サーバーサイドJavaScript' }, featured: true },
         { id: 's5', name: 'Prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', url: 'https://prisma.io', description: { th: 'ORM สำหรับ Node.js/TypeScript', en: 'Next-gen ORM for Node.js/TypeScript', ja: '次世代ORM' }, featured: false },
      ],
   },
]

type Skill = (typeof mockCategories)[number]['skills'][number]
type CategoryDraft = { id: string; name: string }

const blankSkill: Skill = { id: '', name: '', icon: '', url: '', description: { th: '', en: '', ja: '' }, featured: false }

export default function AdminSkillsPage() {
   const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
   const [iconValue, setIconValue] = useState('')
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [editingCategory, setEditingCategory] = useState<CategoryDraft | null>(null)

   const openEdit = (skill: Skill) => {
      setEditingSkill(skill)
      setIconValue(skill.icon)
   }

   const openCreateSkill = () => {
      setEditingSkill(blankSkill)
      setIconValue('')
   }

   const openRenameCategory = (category: CategoryDraft) => setEditingCategory(category)
   const openCreateCategory = () => setEditingCategory({ id: '', name: '' })

   useEffect(() => {
      if (!editingSkill && !editingCategory) return
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setEditingSkill(null)
            setEditingCategory(null)
         }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
   }, [editingSkill, editingCategory])

   const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) setIconValue(URL.createObjectURL(file))
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
               Skills
            </h1>
            <div className="flex gap-2">
               <button
                  onClick={openCreateCategory}
                  className="rounded-lg px-4 py-2 text-sm font-medium border"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
               >
                  + New Category
               </button>
               <button
                  onClick={openCreateSkill}
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
               >
                  + New Skill
               </button>
            </div>
         </div>

         <div className="flex flex-col gap-8">
            {mockCategories.map(category => (
               <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="cursor-grab select-none" style={{ color: 'var(--muted-foreground)' }}>⠿</span>
                     <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {category.name}
                     </h2>
                     <button
                        className="hover:opacity-70"
                        style={{ color: 'var(--muted-foreground)' }}
                        title="Rename"
                        onClick={() => openRenameCategory({ id: category.id, name: category.name })}
                     >
                        <MdDriveFileRenameOutline size={18} />
                     </button>
                  </div>

                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                     {category.skills.map(skill => (
                        <div
                           key={skill.id}
                           className="relative rounded-xl border p-4 flex flex-col items-center gap-3"
                           style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                        >
                           <span
                              className="absolute top-2 left-2 cursor-grab select-none text-sm"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              ⠿
                           </span>

                           <input
                              type="checkbox"
                              defaultChecked={skill.featured}
                              className="absolute top-3 right-3"
                              title="Featured"
                           />

                           <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain mt-2" />

                           <div className="font-medium text-sm text-center" style={{ color: 'var(--foreground)' }}>
                              {skill.name}
                           </div>

                           <div className="flex gap-3">
                              <button
                                 className="hover:opacity-70"
                                 style={{ color: 'var(--foreground)' }}
                                 title="Edit"
                                 onClick={() => openEdit(skill)}
                              >
                                 <MdEdit size={16} />
                              </button>
                              <button className="hover:opacity-70" style={{ color: '#dc2626' }} title="Delete">
                                 <MdDeleteOutline size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {editingSkill && (
            <div
               aria-hidden="true"
               className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
               onClick={() => setEditingSkill(null)}
            >
               <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Edit Skill"
                  className="w-full max-w-2xl rounded-xl border p-6 max-h-[90vh] overflow-y-auto"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  onClick={e => e.stopPropagation()}
               >
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                        {editingSkill.id ? 'Edit Skill' : 'Add Skill'}
                     </h2>
                     <button onClick={() => setEditingSkill(null)} style={{ color: 'var(--muted-foreground)' }}>
                        <MdClose size={20} />
                     </button>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div>
                        <label htmlFor="skill-name" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                           Name
                        </label>
                        <input
                           id="skill-name"
                           defaultValue={editingSkill.name}
                           className="w-full rounded-lg border px-3 py-2"
                           style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="skill-icon" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                              Icon URL
                           </label>
                           <div className="flex gap-2">
                              <input
                                 id="skill-icon"
                                 value={iconValue}
                                 onChange={e => setIconValue(e.target.value)}
                                 placeholder="https://... หรือกด Upload"
                                 className="flex-1 min-w-0 rounded-lg border px-3 py-2"
                                 style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                              />
                              <button
                                 type="button"
                                 onClick={() => fileInputRef.current?.click()}
                                 title="Upload icon file"
                                 className="shrink-0 rounded-lg border px-3 flex items-center"
                                 style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                              >
                                 <MdUpload size={18} />
                              </button>
                              <input
                                 ref={fileInputRef}
                                 type="file"
                                 accept="image/*,.svg"
                                 className="hidden"
                                 onChange={handleIconFileChange}
                              />
                           </div>
                           {iconValue && (
                              <img src={iconValue} alt="" className="w-8 h-8 object-contain mt-2" />
                           )}
                        </div>
                        <div>
                           <label htmlFor="skill-url" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                              Link (optional)
                           </label>
                           <input
                              id="skill-url"
                              defaultValue={editingSkill.url}
                              className="w-full rounded-lg border px-3 py-2"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                           />
                        </div>
                     </div>

                     <div>
                        <div className="block text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
                           Description
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           {(['th', 'en', 'ja'] as const).map(locale => (
                              <div key={locale}>
                                 <label htmlFor={`skill-description-${locale}`} className="text-xs mb-1 uppercase block" style={{ color: 'var(--muted-foreground)' }}>{locale}</label>
                                 <textarea
                                    id={`skill-description-${locale}`}
                                    defaultValue={editingSkill.description[locale]}
                                    rows={3}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                           <label htmlFor="skill-category" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                              Category
                           </label>
                           <select
                              id="skill-category"
                              className="w-full rounded-lg border px-3 py-2"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                           >
                              {mockCategories.map(c => (
                                 <option key={c.id}>{c.name}</option>
                              ))}
                           </select>
                        </div>
                        <label className="flex items-center gap-2 text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                           <input type="checkbox" defaultChecked={editingSkill.featured} />
                           Featured
                        </label>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button
                        onClick={() => setEditingSkill(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium border"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => setEditingSkill(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                     >
                        Save
                     </button>
                  </div>
               </div>
            </div>
         )}

         {editingCategory && (
            <div
               aria-hidden="true"
               className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
               onClick={() => setEditingCategory(null)}
            >
               <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={editingCategory.id ? 'Rename Category' : 'Add Category'}
                  className="w-full max-w-md rounded-xl border p-6"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  onClick={e => e.stopPropagation()}
               >
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                        {editingCategory.id ? 'Rename Category' : 'Add Category'}
                     </h2>
                     <button onClick={() => setEditingCategory(null)} style={{ color: 'var(--muted-foreground)' }}>
                        <MdClose size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {(['th', 'en', 'ja'] as const).map(locale => (
                        <div key={locale}>
                           <label htmlFor={`category-name-${locale}`} className="text-xs mb-1 uppercase block" style={{ color: 'var(--muted-foreground)' }}>{locale}</label>
                           <input
                              id={`category-name-${locale}`}
                              defaultValue={locale === 'en' ? editingCategory.name : ''}
                              className="w-full rounded-lg border px-3 py-2 text-sm"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                           />
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button
                        onClick={() => setEditingCategory(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium border"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                     >
                        Cancel
                     </button>
                     <button
                        onClick={() => setEditingCategory(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                     >
                        Save
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
