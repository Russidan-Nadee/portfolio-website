// src/app/admin/experience/actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { publicCacheTags } from "@/lib/public-cache-tags";
import type { ExperienceData } from "./types";

type ExperienceInput = Omit<ExperienceData, "id">;

function revalidateExperiencePages() {
  revalidatePath("/admin/experience");
  revalidatePath("/about");
  revalidateTag(publicCacheTags.about, { expire: 0 });
}

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
  revalidateExperiencePages();
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
  revalidateExperiencePages();
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidateExperiencePages();
}
