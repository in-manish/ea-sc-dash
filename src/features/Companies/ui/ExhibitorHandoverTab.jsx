import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw, Search, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHandoverList } from '../hooks/useHandoverList';
import HandoverTable from './HandoverTable';

const SEARCH_PARAM = 'hq';

/**
 * Companies → Handover tab (`?tab=handover&hq=<search>`).
 * Shareable: the URL carries the tab and the search, any logged-in organizer sees the same list.
 */
export default function ExhibitorHandoverTab({ eventId, token }) {
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get(SEARCH_PARAM) || '';
  const { rows, filtered, loading, error, loadedAt, refresh } = useHandoverList({
    eventId,
    token,
    search,
    onUnauthorized: logout,
  });

  const setSearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(SEARCH_PARAM, value);
    else next.delete(SEARCH_PARAM);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center" role="search">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="search"
            placeholder="Search by company, OBF, stall, handover person or phone…"
            aria-label="Search handover details"
            className="h-12 w-full rounded-md border border-border bg-bg-primary py-0 pl-11 pr-9 text-sm outline-none transition-colors duration-200 placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary"
              onClick={() => setSearch('')}
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          className="btn btn-secondary h-12"
          onClick={refresh}
          disabled={loading}
          title="Reload handover details"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '0.5rem' }} />
          Refresh
        </button>
      </div>

      <p className="m-0 text-xs text-text-tertiary">
        {loading && !rows.length
          ? 'Loading handover details…'
          : `${filtered.length} of ${rows.length} companies with a signed handover`}
        {loadedAt && !loading ? ` · updated ${loadedAt.toLocaleTimeString()}` : ''}
      </p>

      {error && (
        <div className="py-2 flex items-start gap-2 text-red-700 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !rows.length ? (
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-accent" />
        </div>
      ) : filtered.length > 0 ? (
        <HandoverTable rows={filtered} eventId={eventId} />
      ) : !error ? (
        <p className="text-sm text-text-tertiary py-8 text-center m-0">
          {search ? 'No handover matches your search.' : 'No company has a signed handover yet.'}
        </p>
      ) : null}
    </div>
  );
}
