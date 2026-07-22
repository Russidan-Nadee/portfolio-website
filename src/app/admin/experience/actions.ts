// src/app/admin/experience/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ExperienceData } from "./types";

type ExperienceInput = Omit<ExperienceData, "id">;

export async function createExperience(data: ExperienceInput) {
  await prisma.experience.create({
    data: {
      type: data.type,
      title: { ...data.title },
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      isCurrent: data.isCurrent,
      description: { ...data.description },
      skills: data.skills,
      icon: data.icon,
    },
  });
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}

export async function updateExperience(id: string, data: ExperienceInput) {
  await prisma.experience.update({
    where: { id },
    data: {
      type: data.type,
      title: { ...data.title },
      company: data.company,
      startDate: data.startDate,
      endDate: data.endDate,
      isCurrent: data.isCurrent,
      description: { ...data.description },
      skills: data.skills,
      icon: data.icon,
    },
  });
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}
