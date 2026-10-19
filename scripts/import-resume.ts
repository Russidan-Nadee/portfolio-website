// Import the owner's initial PDF through the same validated workflow as Admin.
// Usage: npx tsx --env-file=.env scripts/import-resume.ts <path-to-pdf>
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { publishResume } from "../src/features/resume/resume";
import { saveCurrentResume } from "../src/features/resume/repository";
import {
  uploadResumeFile,
  removeResumeFile,
} from "../src/features/resume/storage";
import { prisma } from "../src/lib/prisma";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) throw new Error("Provide a path to the resume PDF.");
  const bytes = await readFile(filePath);
  const file = new File([bytes], basename(filePath), {
    type: "application/pdf",
  });
  const resume = await publishResume(file, {
    upload: uploadResumeFile,
    save: saveCurrentResume,
    remove: removeResumeFile,
  });
  console.log(
    `Resume published: ${resume.sizeBytes} bytes, ${resume.updatedAt.toISOString()}`
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Resume import failed."
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
