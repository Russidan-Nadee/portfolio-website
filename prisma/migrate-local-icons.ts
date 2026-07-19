// prisma/migrate-local-icons.ts
// One-off: uploads locally-hosted skill icons (public/icons/skills/*) to Supabase
// Storage and repoints each Skill.icon to the new public URL.
// Run with: npx tsx prisma/migrate-local-icons.ts
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const contentTypes: Record<string, string> = {
   '.svg': 'image/svg+xml',
   '.webp': 'image/webp',
   '.jpeg': 'image/jpeg',
   '.jpg': 'image/jpeg',
   '.png': 'image/png',
}

async function main() {
   const skills = await prisma.skill.findMany({
      where: { icon: { startsWith: '/icons/skills/' } },
   })

   if (skills.length === 0) {
      console.log('No skills with local icon paths found.')
      return
   }

   for (const skill of skills) {
      const filename = path.basename(skill.icon)
      const localPath = path.join(process.cwd(), 'public', skill.icon)
      const ext = path.extname(filename).toLowerCase()

      const fileBuffer = fs.readFileSync(localPath)
      const storagePath = `${crypto.randomUUID()}${ext}`

      const { error: uploadError } = await supabase.storage
         .from('skill-icons')
         .upload(storagePath, fileBuffer, { contentType: contentTypes[ext] ?? 'application/octet-stream' })

      if (uploadError) {
         console.error(`Failed to upload ${filename}:`, uploadError.message)
         continue
      }

      const { data } = supabase.storage.from('skill-icons').getPublicUrl(storagePath)

      await prisma.skill.update({
         where: { id: skill.id },
         data: { icon: data.publicUrl },
      })

      console.log(`${skill.name}: ${skill.icon} -> ${data.publicUrl}`)
   }
}

main()
   .then(() => prisma.$disconnect())
   .catch(async (err) => {
      console.error(err)
      await prisma.$disconnect()
      process.exit(1)
   })
