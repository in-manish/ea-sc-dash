export default function ExhibitorEngagementSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="h-8 w-56 rounded bg-bg-tertiary" />
        <div className="flex items-center gap-3">
          <div className="h-[4.5rem] w-40 rounded-xl bg-bg-tertiary" />
          <div className="h-[4.5rem] w-44 rounded-xl bg-bg-tertiary" />
        </div>
      </div>
      <div className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
        <div className="h-5 w-40 rounded bg-bg-tertiary mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((key) => (
            <div key={key}>
              <div className="h-3 w-14 rounded bg-bg-tertiary" />
              <div className="h-4 w-28 rounded bg-bg-tertiary mt-2" />
              <div className="h-7 w-24 rounded bg-bg-tertiary mt-3" />
              <div className="h-44 rounded-xl bg-bg-tertiary mt-4" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((key) => (
          <div key={key} className="h-28 rounded-xl border border-border bg-bg-tertiary/40" />
        ))}
      </div>
    </div>
  );
}
