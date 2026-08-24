import { useCallback, useEffect, useRef, useState } from 'react';
import { getMeetingStatsReport } from '../api/meetingStatsReportApi';
import { emptyMeetingStatsFilters } from '../domain/meetingStatsQuery';
import { normalizeMeetingStats } from '../domain/meetingStatsRows';

export function useMeetingStatsFilters(eventId) {
  const [draft, setDraft] = useState(() => emptyMeetingStatsFilters(eventId));
  const [applied, setApplied] = useState(() => emptyMeetingStatsFilters(eventId));
  const prevEventId = useRef(eventId);

  useEffect(() => {
    if (prevEventId.current === eventId) return;
    prevEventId.current = eventId;
    const next = emptyMeetingStatsFilters(eventId);
    setDraft(next);
    setApplied(next);
  }, [eventId]);

  const patchDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const apply = useCallback(() => {
    setApplied({ ...draft });
  }, [draft]);

  const reset = useCallback(() => {
    const empty = emptyMeetingStatsFilters(eventId);
    setDraft(empty);
    setApplied(empty);
  }, [eventId]);

  return { draft, applied, patchDraft, apply, reset };
}

export function useMeetingStatsReport({ eventId, token, filters, onUnauthorized }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(
    async (refresh = false) => {
      const id = ++requestId.current;
      if (!eventId || !token) {
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
        const payload = await getMeetingStatsReport(token, eventId, filters, { refresh });
        if (id !== requestId.current) return;
        setData(normalizeMeetingStats(payload));
      } catch (err) {
        if (id !== requestId.current) return;
        if (err.status === 401) {
          onUnauthorized?.();
          return;
        }
        setError(err.message || 'Failed to load meeting stats.');
        if (!refresh) setData(null);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [eventId, token, filters, onUnauthorized],
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
