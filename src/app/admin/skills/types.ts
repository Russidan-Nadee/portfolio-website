// src/app/admin/skills/types.ts
export type LocalizedText = { th: string; en: string; ja: string }

export type SkillData = {
   id: string
   name: string
   icon: string
   url: string | null
   description: LocalizedText
   categoryId: string
   featured: boolean
   active: boolean
}

export type CategoryData = {
   id: string
   name: LocalizedText
   skills: SkillData[]
}
