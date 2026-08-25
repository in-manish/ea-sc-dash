import { BadgeCheck, BadgePlus, Loader2 } from 'lucide-react';

/**
 * Always-visible active-badge controls: preview all eligible, then create.
 * Selection-specific actions stay on AttendeeSelectionBar.
 */
const ActiveBadgeToolbar = ({
  checking = false,
  creating = false,
  onPreviewAll,
  onCreateAll,
}) => {
  const busy = checking || creating;

  return (
    <div className="mb-6 bg-bg-secondary/60 border border-border rounded-lg px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-text-primary">
          Active badges
        </div>
        <p className="text-xs text-text-secondary mt-0.5">
          Preview who needs an active badge, then create. Or select rows for a subset.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          className="btn btn-secondary inline-flex items-center"
          onClick={onPreviewAll}
          disabled={busy}
        >
          {checking ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <BadgeCheck size={16} className="mr-2" />
          )}
          {checking ? 'Active Badge Previewing…' : 'Active Badge Preview eligible'}
        </button>
        <button
          type="button"
          className="btn btn-primary inline-flex items-center"
          onClick={onCreateAll}
          disabled={busy}
          title="First click previews eligible badges; after preview, creates them"
        >
          {creating ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : (
            <BadgePlus size={16} className="mr-2" />
          )}
          {creating ? 'Active Badge Creating…' : 'Active Badge Create all eligible'}
        </button>
      </div>
    </div>
  );
};

export default ActiveBadgeToolbar;
