import { useCallback, useEffect, useState } from 'react';
import { checklistReminderApi } from '../api/checklistReminderApi';

const EMPTY = { count: 0, next: null, previous: null, results: [] };

export function useChecklistReminderList({ eventId, token, filters, enabled = true }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const filtersKey = JSON.stringify(filters || {});

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled || !eventId || !token) {
      setData(EMPTY);
      setLoading(false);
      setError('');
      return undefined;
    }

    const parsedFilters = JSON.parse(filtersKey);
    let active = true;
    setLoading(true);
    setError('');

    checklistReminderApi
      .listReminders(eventId, token, parsedFilters)
      .then((payload) => {
        if (!active) return;
        setData({
          count: payload.count ?? 0,
          next: payload.next ?? null,
          previous: payload.previous ?? null,
          results: Array.isArray(payload.results) ? payload.results : [],
        });
      })
      .catch((err) => {
        if (!active) return;
        setData(EMPTY);
        setError(err.message || 'Failed to load reminder log.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, eventId, token, filtersKey, reloadKey]);

  return { ...data, loading, error, reload };
}
