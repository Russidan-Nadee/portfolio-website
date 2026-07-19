// src/app/page.tsx
import { prisma } from '@/lib/prisma'
import HomeContent from './HomeContent'

export default async function Home() {
  const skills = await prisma.skill.findMany({
    where: { featured: true, active: true },
    orderBy: { order: 'asc' },
    select: { name: true, icon: true },
  })

  return <HomeContent technologies={skills} />
}
