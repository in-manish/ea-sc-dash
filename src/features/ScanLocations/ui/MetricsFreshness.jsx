import { Loader2, RefreshCw } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDateTime';

/** When the numbers were built, whether they came from the 10 minute cache, and a rebuild button. */
export default function MetricsFreshness({ generatedAt, cached, loading, onRefresh }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-text-tertiary">
      {generatedAt ? <span>Updated {formatDateTime(generatedAt)}</span> : null}
      {generatedAt ? (
        <span
          className={`px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide text-[10px] ${
            cached ? 'bg-bg-secondary text-text-secondary' : 'bg-success/10 text-success'
          }`}
          title={cached ? 'Served from the 10 minute cache.' : 'Freshly calculated.'}
        >
          {cached ? 'Cached' : 'Live'}
        </span>
      ) : null}
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary disabled:opacity-50"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        Refresh data
      </button>
    </div>
  );
}
