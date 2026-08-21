export default function ExhibitorEngagementSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="h-6 w-52 rounded bg-bg-tertiary" />
          <div className="h-4 w-72 rounded bg-bg-tertiary mt-2" />
        </div>
        <div className="h-[4.5rem] w-40 rounded-xl bg-bg-tertiary" />
      </div>
      <div className="bg-bg-primary border border-border rounded-xl p-6 shadow-sm">
        <div className="h-5 w-40 rounded bg-bg-tertiary mb-2" />
        <div className="h-4 w-80 rounded bg-bg-tertiary mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className="rounded-xl border border-border p-4 h-36 bg-bg-tertiary/40" />
          ))}
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((key) => (
            <div key={key}>
              <div className="h-4 w-48 rounded bg-bg-tertiary mb-2" />
              <div className="h-3.5 w-full rounded-full bg-bg-tertiary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
