import { createSupabaseServerClient } from "@/lib/supabase-server";
import { MAX_RESUME_SIZE_BYTES } from "./resume";

const RESUME_BUCKET = "resume-assets";

export async function uploadResumeFile(storagePath: string, file: File) {
  const supabase = createSupabaseServerClient();
  const { data: bucket, error: bucketError } =
    await supabase.storage.getBucket(RESUME_BUCKET);
  if (bucket?.public) {
    throw new Error("Resume storage must be a private bucket.");
  }
  if (!bucket) {
    if (
      bucketError &&
      !["404", "400"].includes(String(bucketError.statusCode))
    ) {
      throw new Error("Unable to access resume storage.");
    }
    const { error } = await supabase.storage.createBucket(RESUME_BUCKET, {
      public: false,
      fileSizeLimit: MAX_RESUME_SIZE_BYTES,
      allowedMimeTypes: ["application/pdf"],
    });
    if (error) throw new Error("Unable to create resume storage.");
  }

  const { error } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(storagePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });
  if (error) throw new Error("Unable to upload the resume. Please try again.");
}

export async function removeResumeFile(storagePath: string) {
  const { error } = await createSupabaseServerClient()
    .storage.from(RESUME_BUCKET)
    .remove([storagePath]);
  if (error) throw new Error("Unable to remove the unpublished resume.");
}

export async function downloadResumeFile(storagePath: string) {
  const { data, error } = await createSupabaseServerClient()
    .storage.from(RESUME_BUCKET)
    .download(storagePath);
  if (error || !data) throw new Error("Unable to download the resume.");
  return data;
}
