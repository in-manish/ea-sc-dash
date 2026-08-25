import { useCallback, useEffect, useRef, useState } from 'react';
import { listSubscribers } from '../api/subscriberApi';

export function useSubscriberList({ token, onUnauthorized }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const load = useCallback(
    async ({ soft = false } = {}) => {
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
      if (soft) setRefreshing(true);
      else {
        setLoading(true);
        setResults([]);
      }
      setError('');
      try {
        const data = await listSubscribers(token, {
          page,
          size: 10,
          search: debouncedSearch,
          status,
        });
        if (id !== requestId.current) return;
        setResults(data.results);
        setCount(data.count);
        setHasNext(Boolean(data.next));
      } catch (err) {
        if (id !== requestId.current) return;
        if (err.status === 401) onUnauthorized?.();
        setError(err.message || 'Failed to load subscribers');
        if (!soft) {
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
    [token, page, debouncedSearch, status, onUnauthorized]
  );

  useEffect(() => {
    load({ soft: false });
  }, [load]);

  const refresh = useCallback(() => load({ soft: true }), [load]);

  return {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    results,
    count,
    hasNext,
    loading,
    refreshing,
    error,
    reload: load,
    refresh,
  };
}
