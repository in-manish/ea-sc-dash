import { useCallback, useEffect, useState } from 'react';
import { getMeetingAttendees } from '../api/meetingAttendeesApi';
import { validateFilters } from '../domain/attendeeFilters';
import { EMPTY_FILTERS } from '../constants';

/** Draft filters are edited freely; Apply copies them to `applied` and loads page 1. */
export function useMeetingAttendees({ eventId, token, onUnauthorized, initialFilters = null }) {
  const [draft, setDraft] = useState(initialFilters ? { ...EMPTY_FILTERS, ...initialFilters } : EMPTY_FILTERS);
  const [applied, setApplied] = useState(initialFilters ? { ...EMPTY_FILTERS, ...initialFilters } : null);
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState('');
  const [loaded, setLoaded] = useState({ key: '', result: null, error: '' });

  const requestKey = applied && token && eventId ? `${eventId}|${page}|${JSON.stringify(applied)}` : '';

  const patchDraft = useCallback((patch) => setDraft((prev) => ({ ...prev, ...patch })), []);

  const apply = useCallback(() => {
    const problem = validateFilters(draft);
    setFormError(problem);
    if (problem) return;
    setPage(1);
    setApplied(draft);
  }, [draft]);

  const reset = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setApplied(null);
    setFormError('');
    setPage(1);
  }, []);

  useEffect(() => {
    if (!requestKey) return undefined;
    let active = true;
    getMeetingAttendees(token, eventId, applied, page)
      .then((result) => active && setLoaded({ key: requestKey, result, error: '' }))
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) onUnauthorized?.();
        setLoaded({ key: requestKey, result: null, error: err.message });
      });
    return () => {
      active = false;
    };
    // `applied` and `page` are already part of requestKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, token, eventId, onUnauthorized]);

  const ready = loaded.key === requestKey;
  return {
    draft,
    applied,
    patchDraft,
    apply,
    reset,
    page,
    setPage,
    data: applied ? loaded.result : null,
    loading: Boolean(requestKey) && !ready,
    error: formError || (ready ? loaded.error : ''),
  };
}
