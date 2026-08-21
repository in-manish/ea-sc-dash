import { useCallback, useEffect, useRef, useState } from 'react';
import { getExhibitorEngagement } from '../api/exhibitorEngagementApi';
import { normalizeExhibitorEngagement } from '../domain/exhibitorEngagement';

export function useExhibitorEngagement({ eventId, token, enabled = true, onUnauthorized }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(
    async (refresh = false) => {
      const id = ++requestId.current;
      if (!enabled || !eventId || !token) {
        setData(null);
        setLoading(false);
        setRefreshing(false);
        setError('');
        return;
      }

      if (refresh) setRefreshing(true);
      else {
        setLoading(true);
        setData(null);
      }
      setError('');

      try {
        const payload = await getExhibitorEngagement(eventId, token, { refresh });
        if (id !== requestId.current) return;
        setData(normalizeExhibitorEngagement(payload));
      } catch (err) {
        if (id !== requestId.current) return;
        if (err.status === 401) {
          onUnauthorized?.();
          return;
        }
        setError(err.message || 'Failed to load exhibitor engagement.');
        if (!refresh) setData(null);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [enabled, eventId, token, onUnauthorized],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  return {
    data,
    loading,
    refreshing,
    error,
    reload: () => load(false),
    refresh: () => load(true),
  };
}
