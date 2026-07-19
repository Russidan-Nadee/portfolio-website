// src/app/about/page.tsx
import { prisma } from '@/lib/prisma'
import AboutContent from './AboutContent'
import type { CategoryItem } from '../../components/about/SkillsGrid'

export default async function About() {
   const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { where: { active: true }, orderBy: { order: 'asc' } } },
   })

   // ซ่อน category ที่ skill ทั้งหมดข้างในเป็น draft (active: false) หมด ไม่ให้เห็นหัวข้อว่างๆ
   const visibleCategories = categories.filter(category => category.skills.length > 0)

   return <AboutContent skillCategories={visibleCategories as unknown as CategoryItem[]} />
}
