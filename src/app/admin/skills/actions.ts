// src/app/admin/skills/actions.ts
'use server'

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
