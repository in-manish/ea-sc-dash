import { useEffect, useState } from 'react';
import { fetchUserCardRequests } from '../api/userCardsApi';

const PAGE_SIZE = 10;

/** Paginated admin card-request activity for a user. */
export default function useUserCardRequests({ userId, token, enabled, status = '' }) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [userId, status]);

  useEffect(() => {
    if (!enabled || !userId || !token) {
      setItems([]);
      setCount(0);
      setNext(0);
      setError('');
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchUserCardRequests(token, userId, {
          page,
          size: PAGE_SIZE,
          status,
        });
        if (!cancelled) {
          setItems(data.cards);
          setCount(data.count);
          setNext(data.next);
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setCount(0);
          setNext(0);
          setError(err.message || 'Failed to load card activity.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, token, page, status, reloadKey]);

  return {
    items,
    count,
    page,
    pageSize: PAGE_SIZE,
    hasNext: next > 0,
    hasPrev: page > 1,
    isLoading,
    error,
    setPage,
    goNext: () => { if (next > 0) setPage(next); },
    goPrev: () => { if (page > 1) setPage((p) => p - 1); },
    reload: () => setReloadKey((k) => k + 1),
  };
}
