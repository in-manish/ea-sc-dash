import { useCallback, useEffect, useRef, useState } from 'react';
import { getServiceLedger } from '../api/permissionSourcesApi';
import { parseLedger } from '../domain/parsePermissionSources';

export const EMPTY_LEDGER_FILTERS = { badge_uuid: '', source_option_id: '', action: '', via: '' };

/** The ledger of every service sync, filtered and paged by EA. */
export default function useServiceLedger(eventId, token, onUnauthorized) {
  const [filters, setFilters] = useState(EMPTY_LEDGER_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;
  const key = JSON.stringify(filters);

  const load = useCallback(async () => {
    if (!eventId || !token) return;
    setLoading(true);
    setError('');
    try {
      setData(parseLedger(await getServiceLedger(token, eventId, { ...JSON.parse(key), page, page_size: 25 })));
    } catch (err) {
      setError(err.message || 'Failed to load the ledger.');
      if (err.status === 401) onUnauthorizedRef.current?.();
    } finally {
      setLoading(false);
    }
  }, [eventId, token, key, page]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFilters = (next) => {
    setFilters(next);
    setPage(1);
  };

  return { filters, changeFilters, page, setPage, data, loading, error, refresh: load, clearError: () => setError('') };
}
