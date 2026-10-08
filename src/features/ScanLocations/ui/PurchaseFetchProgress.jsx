/** Live status while badge-permissions is walked page by page. */
export default function PurchaseFetchProgress({ progress }) {
  const page = progress?.page || 1;
  const totalPages = Math.max(1, progress?.totalPages || 1);
  const loaded = progress?.loaded || 0;
  const total = progress?.total || 0;
  const ratio = total > 0 ? loaded / total : Math.max(0, page - 1) / totalPages;
  const percent = Math.min(100, Math.round(ratio * 100));
  const attendees = total > 0 ? `${loaded} of ${total} attendees` : `${loaded} attendees`;

  return (
    <div className="flex min-w-56 flex-1 flex-col gap-1">
      <div className="flex flex-wrap justify-between gap-x-3 text-xs text-text-secondary">
        <span>Page {page} of {totalPages}</span>
        <span>{attendees} · {percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border" role="progressbar"
        aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
        aria-label={`Fetching page ${page} of ${totalPages}`}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
