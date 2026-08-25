import { RefreshCw, Search } from 'lucide-react';
import { SUBSCRIBER_STATUSES } from '../domain/subscriberStatus';

export default function SubscriberToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  count,
  loading,
  refreshing = false,
  onRefresh,
}) {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search email, name, or tag…"
            className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-border bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-text-tertiary tabular-nums whitespace-nowrap">
            {loading && !refreshing ? '…' : `${count.toLocaleString()} contacts`}
          </span>
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh"
              aria-label="Refresh subscribers"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status filter">
        {SUBSCRIBER_STATUSES.map((s) => {
          const active = status === s.value;
          return (
            <button
              key={s.value || 'all'}
              type="button"
              onClick={() => onStatusChange(s.value)}
              className={`h-7 px-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                active
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-bg-primary border-border text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
