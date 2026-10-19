export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        Loading admin content…
      </p>
      <div aria-hidden="true" className="space-y-4 motion-safe:animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-[var(--muted)]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-52 rounded-xl border bg-[var(--card)]"
              style={{ borderColor: "var(--border)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
