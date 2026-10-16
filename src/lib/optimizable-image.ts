const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  return Boolean(
    storageUrl && src.startsWith(`${storageUrl}/storage/v1/object/public/`)
  );
}
