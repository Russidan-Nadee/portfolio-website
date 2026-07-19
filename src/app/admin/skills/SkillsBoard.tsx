// src/app/admin/skills/SkillsBoard.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { MdEdit, MdDeleteOutline, MdDriveFileRenameOutline, MdClose, MdUpload } from 'react-icons/md'
import {
   uploadSkillIcon,
   createCategory,
   updateCategory,
   deleteCategory,
   createSkill,
   updateSkill,
   deleteSkill,
   toggleSkillFeatured,
   toggleSkillActive,
} from './actions'
import type { CategoryData, SkillData, LocalizedText } from './types'

const blankSkill: SkillData = {
   id: '',
   name: '',
   icon: '',
   url: '',
   description: { th: '', en: '', ja: '' },
   categoryId: '',
   featured: false,
   active: true,
}
const blankCategoryName: LocalizedText = { th: '', en: '', ja: '' }

export default function SkillsBoard({ categories }: { categories: CategoryData[] }) {
   const [editingSkill, setEditingSkill] = useState<SkillData | null>(null)
   const [iconValue, setIconValue] = useState('')
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [editingCategory, setEditingCategory] = useState<{ id: string; name: LocalizedText } | null>(null)
   const [uploading, setUploading] = useState(false)

   const openEditSkill = (skill: SkillData) => {
      setEditingSkill(skill)
      setIconValue(skill.icon)
   }

   const openCreateSkill = (categoryId: string) => {
      setEditingSkill({ ...blankSkill, categoryId })
      setIconValue('')
   }

   const openRenameCategory = (category: CategoryData) => setEditingCategory({ id: category.id, name: category.name })
   const openCreateCategory = () => setEditingCategory({ id: '', name: blankCategoryName })

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

   const handleIconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      try {
         const formData = new FormData()
         formData.set('file', file)
         const publicUrl = await uploadSkillIcon(formData)
         setIconValue(publicUrl)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Upload failed')
      } finally {
         setUploading(false)
      }
   }

   const handleSkillSubmit = async (formData: FormData) => {
      if (!editingSkill) return
      formData.set('icon', iconValue)
      try {
         if (editingSkill.id) {
            await updateSkill(editingSkill.id, formData)
         } else {
            await createSkill(formData)
         }
         setEditingSkill(null)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Save failed')
      }
   }

   const handleCategorySubmit = async (formData: FormData) => {
      if (!editingCategory) return
      try {
         if (editingCategory.id) {
            await updateCategory(editingCategory.id, formData)
         } else {
            await createCategory(formData)
         }
         setEditingCategory(null)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Save failed')
      }
   }

   const handleDeleteSkill = async (id: string) => {
      if (!confirm('ลบ skill นี้ใช่ไหม?')) return
      await deleteSkill(id)
   }

   const handleDeleteCategory = async (id: string) => {
      if (!confirm('ลบ category นี้ใช่ไหม?')) return
      try {
         await deleteCategory(id)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Delete failed')
      }
   }

   const handleToggleFeatured = async (id: string, featured: boolean) => {
      try {
         await toggleSkillFeatured(id, featured)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Update failed')
      }
   }

   const handleToggleActive = async (id: string, active: boolean) => {
      try {
         await toggleSkillActive(id, active)
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Update failed')
      }
   }

   return (
      <div>
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
               Skills
            </h1>
            <button
               onClick={openCreateCategory}
               className="rounded-lg px-4 py-2 text-sm font-medium border"
               style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
               + New Category
            </button>
         </div>

         <div className="flex flex-col gap-8">
            {categories.map(category => (
               <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="cursor-grab select-none" style={{ color: 'var(--muted-foreground)' }}>⠿</span>
                     <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                        {category.name.en || category.name.th}
                     </h2>
                     <button
                        className="hover:opacity-70"
                        style={{ color: 'var(--muted-foreground)' }}
                        title="Rename"
                        onClick={() => openRenameCategory(category)}
                     >
                        <MdDriveFileRenameOutline size={18} />
                     </button>
                     <button
                        className="hover:opacity-70"
                        style={{ color: '#dc2626' }}
                        title="Delete Category"
                        onClick={() => handleDeleteCategory(category.id)}
                     >
                        <MdDeleteOutline size={18} />
                     </button>
                     <button
                        onClick={() => openCreateSkill(category.id)}
                        className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                     >
                        + New Skill
                     </button>
                  </div>

                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                     {category.skills.map(skill => (
                        <div
                           key={skill.id}
                           className="relative rounded-xl border p-4 flex flex-col items-center gap-3"
                           style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              opacity: skill.active ? 1 : 0.5,
                           }}
                        >
                           <span
                              className="absolute top-2 left-2 cursor-grab select-none text-sm"
                              style={{ color: 'var(--muted-foreground)' }}
                           >
                              ⠿
                           </span>

                           <div className="absolute top-2 right-2 flex flex-col items-end gap-1 text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
                              <label className="flex items-center gap-1">
                                 <span>Featured</span>
                                 <input
                                    type="checkbox"
                                    checked={skill.featured}
                                    onChange={e => handleToggleFeatured(skill.id, e.target.checked)}
                                    title="Featured"
                                 />
                              </label>
                              <label className="flex items-center gap-1">
                                 <span>Active</span>
                                 <input
                                    type="checkbox"
                                    checked={skill.active}
                                    onChange={e => handleToggleActive(skill.id, e.target.checked)}
                                    title="Active"
                                 />
                              </label>
                           </div>

                           {!skill.active && (
                              <span
                                 className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                 style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                              >
                                 Draft
                              </span>
                           )}

                           {skill.icon && (
                              <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain mt-2" />
                           )}

                           <div className="font-medium text-sm text-center" style={{ color: 'var(--foreground)' }}>
                              {skill.name}
                           </div>

                           <div className="flex gap-3">
                              <button
                                 className="hover:opacity-70"
                                 style={{ color: 'var(--foreground)' }}
                                 title="Edit"
                                 onClick={() => openEditSkill(skill)}
                              >
                                 <MdEdit size={16} />
                              </button>
                              <button
                                 className="hover:opacity-70"
                                 style={{ color: '#dc2626' }}
                                 title="Delete"
                                 onClick={() => handleDeleteSkill(skill.id)}
                              >
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
               <form
                  action={handleSkillSubmit}
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
                     <button type="button" onClick={() => setEditingSkill(null)} style={{ color: 'var(--muted-foreground)' }}>
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
                           name="name"
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
                                 disabled={uploading}
                                 onClick={() => fileInputRef.current?.click()}
                                 title="Upload icon file"
                                 className="shrink-0 rounded-lg border px-3 flex items-center disabled:opacity-50"
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
                           {uploading && (
                              <div className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Uploading...</div>
                           )}
                           {!uploading && iconValue && (
                              <img src={iconValue} alt="" className="w-8 h-8 object-contain mt-2" />
                           )}
                        </div>
                        <div>
                           <label htmlFor="skill-url" className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                              Link (optional)
                           </label>
                           <input
                              id="skill-url"
                              name="url"
                              defaultValue={editingSkill.url ?? ''}
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
                                    name={`description-${locale}`}
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
                              name="categoryId"
                              defaultValue={editingSkill.categoryId}
                              className="w-full rounded-lg border px-3 py-2"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                           >
                              {categories.map(c => (
                                 <option key={c.id} value={c.id}>{c.name.en || c.name.th}</option>
                              ))}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2 mb-2">
                           <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              <input type="checkbox" name="featured" defaultChecked={editingSkill.featured} />
                              <span>Featured</span>
                           </label>
                           <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              <input type="checkbox" name="active" defaultChecked={editingSkill.active} />
                              <span>Active (แสดงในหน้า public)</span>
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button
                        type="button"
                        onClick={() => setEditingSkill(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium border"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        className="rounded-lg px-4 py-2 text-sm font-medium"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                     >
                        Save
                     </button>
                  </div>
               </form>
            </div>
         )}

         {editingCategory && (
            <div
               aria-hidden="true"
               className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
               onClick={() => setEditingCategory(null)}
            >
               <form
                  action={handleCategorySubmit}
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
                     <button type="button" onClick={() => setEditingCategory(null)} style={{ color: 'var(--muted-foreground)' }}>
                        <MdClose size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {(['th', 'en', 'ja'] as const).map(locale => (
                        <div key={locale}>
                           <label htmlFor={`category-name-${locale}`} className="text-xs mb-1 uppercase block" style={{ color: 'var(--muted-foreground)' }}>{locale}</label>
                           <input
                              id={`category-name-${locale}`}
                              name={`category-name-${locale}`}
                              defaultValue={editingCategory.name[locale]}
                              className="w-full rounded-lg border px-3 py-2 text-sm"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                           />
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                     <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium border"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        className="rounded-lg px-4 py-2 text-sm font-medium"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                     >
                        Save
                     </button>
                  </div>
               </form>
            </div>
         )}
      </div>
   )
}
