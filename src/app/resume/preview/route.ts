import { createResumeDownload } from "@/features/resume/resume";
import { loadCurrentResume } from "@/features/resume/repository";
import { downloadResumeFile } from "@/features/resume/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  return createResumeDownload(
    { loadCurrent: loadCurrentResume, download: downloadResumeFile },
    { preview: true }
  );
}
