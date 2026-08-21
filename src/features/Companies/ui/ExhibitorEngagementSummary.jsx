import { Clock, RefreshCw } from 'lucide-react';
import { formatApiDateTime } from '../../../utils/formatApiDateTime';
import { formatCount } from '../domain/exhibitorEngagement';

export default function ExhibitorEngagementSummary({ data, refreshing, onRefresh }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary m-0">{data.title}</h2>
        <p className="m-0 mt-1 text-sm text-text-secondary">
          How many parent exhibitors completed each activation action.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
              data.fromCache
                ? 'bg-bg-tertiary text-text-secondary'
                : 'bg-accent/10 text-accent'
            }`}
          >
            {data.fromCache ? 'Cached (5 min)' : 'Live'}
          </span>
          {data.generatedAt && (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {formatApiDateTime(data.generatedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn btn-secondary inline-flex items-center gap-2"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
        <div className="bg-bg-primary border border-border rounded-xl px-5 py-3 shadow-sm min-w-[9rem]">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Total exhibitors
          </p>
          <p className="m-0 mt-1 text-3xl font-bold tabular-nums text-text-primary">
            {formatCount(data.totalExhibitors)}
          </p>
        </div>
      </div>
    </div>
  );
}
