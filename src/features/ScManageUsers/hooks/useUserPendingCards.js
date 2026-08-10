import { useEffect, useState } from 'react';
import { fetchUserPendingByDirection } from '../api/userCardsApi';

/** Paginated pending sent OR received for a user (API page size = 3). */
export default function useUserPendingCards({
  userId,
  token,
  enabled,
  direction = 'sent',
}) {
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [userId, direction]);

  useEffect(() => {
    if (!enabled || !userId || !token) {
      setCards([]);
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
        const data = await fetchUserPendingByDirection(token, userId, direction, { page });
        if (!cancelled) {
          setCards(data.cards);
          setCount(data.count);
          setNext(data.next);
        }
      } catch (err) {
        if (!cancelled) {
          setCards([]);
          setCount(0);
          setNext(0);
          setError(err.message || 'Failed to load pending requests.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, token, direction, page, reloadKey]);

  return {
    cards,
    count,
    page,
    hasNext: next > 0,
    hasPrev: page > 1,
    isLoading,
    error,
    goNext: () => { if (next > 0) setPage(next); },
    goPrev: () => { if (page > 1) setPage((p) => p - 1); },
    reload: () => setReloadKey((k) => k + 1),
  };
}
