import { prisma } from "@/lib/prisma";

export function loadCurrentResume() {
  return prisma.resume.findUnique({ where: { id: "current" } });
}

export function saveCurrentResume(data: {
  storagePath: string;
  sizeBytes: number;
}) {
  return prisma.resume.upsert({
    where: { id: "current" },
    create: { id: "current", ...data },
    update: data,
  });
}
