// src/app/admin/skills/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function uploadSkillIcon(formData: FormData) {
   const file = formData.get('file') as File | null
   if (!file) {
      throw new Error('No file provided')
   }

   const supabase = createSupabaseServerClient()
   const ext = file.name.split('.').pop()
   const path = `${crypto.randomUUID()}.${ext}`

   const { error } = await supabase.storage
      .from('skill-icons')
      .upload(path, file, { contentType: file.type })

   if (error) {
      throw new Error(`Upload failed: ${error.message}`)
   }

   const { data } = supabase.storage.from('skill-icons').getPublicUrl(path)
   return data.publicUrl
}

function getString(formData: FormData, key: string, fallback = '') {
   const value = formData.get(key)
   return typeof value === 'string' ? value : fallback
}

function getOptionalString(formData: FormData, key: string) {
   const value = formData.get(key)
   return typeof value === 'string' && value.length > 0 ? value : null
}

function readLocaleField(formData: FormData, prefix: string) {
   return {
      th: getString(formData, `${prefix}-th`),
      en: getString(formData, `${prefix}-en`),
      ja: getString(formData, `${prefix}-ja`),
   }
}

export async function createCategory(formData: FormData) {
   const name = readLocaleField(formData, 'category-name')

   const last = await prisma.category.findFirst({ orderBy: { order: 'desc' } })
   const order = (last?.order ?? -1) + 1

   await prisma.category.create({ data: { name, order } })
   revalidatePath('/admin/skills')
}

export async function updateCategory(id: string, formData: FormData) {
   const name = readLocaleField(formData, 'category-name')
   await prisma.category.update({ where: { id }, data: { name } })
   revalidatePath('/admin/skills')
}

export async function deleteCategory(id: string) {
   const skillCount = await prisma.skill.count({ where: { categoryId: id } })
   if (skillCount > 0) {
      throw new Error('ลบ Category นี้ไม่ได้ เพราะยังมี Skill อยู่ในนี้ ย้าย Skill ออกก่อน')
   }
   await prisma.category.delete({ where: { id } })
   revalidatePath('/admin/skills')
}

export async function createSkill(formData: FormData) {
   const categoryId = getString(formData, 'categoryId')
   const last = await prisma.skill.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
   })
   const order = (last?.order ?? -1) + 1

   await prisma.skill.create({
      data: {
         name: getString(formData, 'name'),
         icon: getString(formData, 'icon'),
         url: getOptionalString(formData, 'url'),
         description: readLocaleField(formData, 'description'),
         categoryId,
         order,
         featured: formData.get('featured') === 'on',
      },
   })
   revalidatePath('/admin/skills')
}

export async function updateSkill(id: string, formData: FormData) {
   await prisma.skill.update({
      where: { id },
      data: {
         name: getString(formData, 'name'),
         icon: getString(formData, 'icon'),
         url: getOptionalString(formData, 'url'),
         description: readLocaleField(formData, 'description'),
         categoryId: getString(formData, 'categoryId'),
         featured: formData.get('featured') === 'on',
      },
   })
   revalidatePath('/admin/skills')
}

export async function deleteSkill(id: string) {
   await prisma.skill.delete({ where: { id } })
   revalidatePath('/admin/skills')
}
