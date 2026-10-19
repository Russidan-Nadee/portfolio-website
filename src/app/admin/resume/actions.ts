"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerAuthClient } from "@/lib/supabase-auth-server";
import { publicCacheTags } from "@/lib/public-cache-tags";
import { assertResumeAdmin, publishResume } from "@/features/resume/resume";
import { saveCurrentResume } from "@/features/resume/repository";
import { uploadResumeFile, removeResumeFile } from "@/features/resume/storage";

export async function updateResume(formData: FormData) {
  try {
    const auth = await createSupabaseServerAuthClient();
    const { data, error } = await auth.auth.getUser();
    if (error) throw new Error("Please sign in again before uploading.");
    assertResumeAdmin(data.user?.email, process.env.ADMIN_EMAIL);

    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Choose a PDF to upload.");
    await publishResume(file, {
      upload: uploadResumeFile,
      save: saveCurrentResume,
      remove: removeResumeFile,
    });

    revalidateTag(publicCacheTags.home, { expire: 0 });
    revalidatePath("/", "page");
    revalidatePath("/admin/resume");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Unable to update resume.",
    };
  }
}
