import { RefreshCw } from 'lucide-react';

export default function ImportHistoryHeader({
  count,
  loading,
  refreshing,
  hasActive,
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-text-primary m-0">Import history</h3>
        {hasActive ? (
          <p className="text-[11px] text-text-tertiary m-0 mt-0.5">
            Auto-refreshing while jobs are processing…
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-text-tertiary">
          {loading && !refreshing ? 'Loading…' : `${count.toLocaleString()} jobs`}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-border bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Refresh import status"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
