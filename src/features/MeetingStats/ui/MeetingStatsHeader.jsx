import { Clock, Mail, RefreshCw } from 'lucide-react';
import { formatApiDateTime } from '../../../utils/formatApiDateTime';

export default function MeetingStatsHeader({
  data,
  refreshing,
  onRefresh,
  onEmail,
  disableEmail,
  emailLabel = 'Email report',
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary m-0">Meeting Stats</h2>
        {data && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                data.fromCache ? 'bg-bg-tertiary text-text-secondary' : 'bg-accent/10 text-accent'
              }`}
            >
              {data.fromCache ? 'Cached (10 min)' : 'Live'}
            </span>
            {data.generatedAt && (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                Last refreshed {formatApiDateTime(data.generatedAt)}
              </span>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors disabled:opacity-50"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
        onClick={onEmail}
        disabled={disableEmail}
      >
        <Mail size={15} />
        {emailLabel}
      </button>
    </div>
  );
}
