import { useCallback, useEffect, useRef, useState } from 'react';
import { listImports } from '../api/importApi';
import { isImportActive } from '../domain/importStatus';

const POLL_MS = 3000;

export function useImportList({ token, onUnauthorized, refreshKey = 0 }) {
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(
    async ({ mode = 'full' } = {}) => {
      const id = ++requestId.current;
      if (!token) {
        setResults([]);
        setCount(0);
        setHasNext(false);
        setLoading(false);
        setRefreshing(false);
        setError('');
        return;
      }
      if (mode === 'full') {
        setLoading(true);
        setResults([]);
      } else if (mode === 'manual') {
        setRefreshing(true);
      }
      setError('');
      try {
        const data = await listImports(token, { page });
        if (id !== requestId.current) return;
        setResults(data.results);
        setCount(data.count);
        setHasNext(Boolean(data.next));
      } catch (err) {
        if (id !== requestId.current) return;
        if (err.status === 401) onUnauthorized?.();
        setError(err.message || 'Failed to load imports');
        if (mode === 'full') {
          setResults([]);
          setCount(0);
          setHasNext(false);
        }
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [token, page, onUnauthorized]
  );

  useEffect(() => {
    load({ mode: 'full' });
  }, [load, refreshKey]);

  const hasActive = results.some((row) => isImportActive(row.status));

  useEffect(() => {
    if (!token || !hasActive) return undefined;
    const timer = setInterval(() => {
      load({ mode: 'poll' });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [token, hasActive, load]);

  const refresh = useCallback(() => load({ mode: 'manual' }), [load]);

  return {
    page,
    setPage,
    results,
    count,
    hasNext,
    loading,
    refreshing,
    hasActive,
    error,
    reload: load,
    refresh,
  };
}
