// src/app/admin/skills/page.tsx
import { prisma } from '@/lib/prisma'
import SkillsBoard from './SkillsBoard'
import type { CategoryData } from './types'

export default async function AdminSkillsPage() {
   const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { orderBy: { order: 'asc' } } },
   })

   return <SkillsBoard categories={categories as unknown as CategoryData[]} />
}
