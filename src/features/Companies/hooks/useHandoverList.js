import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAllEventCompanies } from '../api/companyHandoverApi';
import { buildHandoverRows, filterHandoverRows } from '../domain/handoverRows';

/** Loads every company once, keeps the signed-handover rows, filters them by `search` locally. */
export function useHandoverList({ eventId, token, search, onUnauthorized }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedAt, setLoadedAt] = useState(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    if (!eventId || !token) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const companies = await getAllEventCompanies(eventId, token);
      if (id !== requestId.current) return;
      setRows(buildHandoverRows(companies));
      setLoadedAt(new Date());
    } catch (err) {
      if (id !== requestId.current) return;
      if (err.status === 401) {
        onUnauthorized?.();
        return;
      }
      setRows([]);
      setError(
        err.status === 403
          ? 'You do not have permission to view handover details.'
          : err.message || 'Failed to load handover details.',
      );
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [eventId, token, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => filterHandoverRows(rows, search), [rows, search]);

  return { rows, filtered, loading, error, loadedAt, refresh: load };
}
