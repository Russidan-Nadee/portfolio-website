import { loadCurrentResume } from "@/features/resume/repository";
import ResumeForm from "./ResumeForm";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const resume = await loadCurrentResume();
  return (
    <ResumeForm
      current={
        resume
          ? {
              sizeBytes: resume.sizeBytes,
              updatedAt: resume.updatedAt.toISOString(),
            }
          : null
      }
    />
  );
}
