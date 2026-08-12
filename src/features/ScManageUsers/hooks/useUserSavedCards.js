import { useEffect, useState } from 'react';
import { fetchUserSavedCards } from '../api/userCardsApi';

/** Loads admin saved-cards list (active or archived) when panel opens. */
export default function useUserSavedCards({ userId, token, enabled, archived = false }) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled || !userId || !token) {
      setCards([]);
      setError('');
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const list = await fetchUserSavedCards(token, userId, { archived });
        if (!cancelled) setCards(list);
      } catch (err) {
        if (!cancelled) {
          setCards([]);
          setError(err.message || 'Failed to load saved cards.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, userId, token, archived, reloadKey]);

  const removeLocal = (cardId) => {
    setCards((prev) => prev.filter((c) => c.card_id !== cardId));
  };

  return {
    cards,
    isLoading,
    error,
    reload: () => setReloadKey((k) => k + 1),
    removeLocal,
  };
}
