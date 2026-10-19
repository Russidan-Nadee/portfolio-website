"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload } from "lucide-react";
import { updateResume } from "./actions";

export default function ResumeForm({
  current,
}: {
  current: { sizeBytes: number; updatedAt: string } | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    setError("");
    try {
      const result = await updateResume(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setMessage("Resume updated. The Hero download now uses this PDF.");
      formRef.current?.reset();
      router.refresh();
    } catch {
      setError(
        "Upload could not be confirmed. Refresh the page before trying again."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl text-foreground">
      <h1 className="text-3xl font-bold">Resume</h1>
      <p className="mt-3 text-muted-foreground">
        Update the PDF visitors download from your home page.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Current resume</h2>
        {current ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              russidan-resume.pdf · {Math.ceil(current.sizeBytes / 1024)} KB
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Updated{" "}
              {new Date(current.updatedAt).toLocaleString("en-GB", {
                timeZone: "Asia/Bangkok",
              })}
            </p>
            <a
              href="/en/resume/download/"
              download="russidan-resume.pdf"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <Download size={17} aria-hidden="true" /> Download current PDF
            </a>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No resume yet. Upload a PDF to show the download link in the Hero.
          </p>
        )}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-border bg-card p-6"
      >
        <label htmlFor="resume-file" className="block text-lg font-semibold">
          Upload a new PDF
        </label>
        <p id="resume-file-help" className="mt-2 text-sm text-muted-foreground">
          PDF only, up to 10 MB. The current resume stays available until the
          new file is saved.
        </p>
        <input
          id="resume-file"
          name="file"
          type="file"
          accept=".pdf,application/pdf"
          aria-describedby="resume-file-help"
          required
          disabled={pending}
          className="mt-5 block w-full rounded-lg border border-border p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:cursor-wait disabled:opacity-60"
        >
          <Upload size={17} aria-hidden="true" />
          {pending ? "Uploading…" : "Update resume"}
        </button>
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
