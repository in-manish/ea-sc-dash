/** Compact skeleton matching collapsed Exhibitor portal checklist strip. */
export default function SetupProgressSkeleton() {
  return (
    <div className="bg-bg-primary border border-border rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-4 w-4 rounded bg-bg-tertiary shrink-0" />
        <div className="h-3.5 w-32 rounded bg-bg-tertiary" />
        <div className="h-3.5 w-20 rounded bg-bg-tertiary" />
        <div className="h-3.5 w-10 rounded bg-bg-tertiary ml-auto" />
      </div>
      <div className="h-1.5 w-full rounded-full bg-bg-tertiary" />
    </div>
  );
}
