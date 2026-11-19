import { useCallback, useEffect, useRef, useState } from 'react';
import { saveExhibitorReportBlob } from '../domain/exhibitorReportDownload';
import { companyReportsApi } from '../api/companyReportsApi';

const EMAIL_SUCCESS = 'Report will be emailed shortly';

/**
 * Runs one report request at a time and tracks busy / success / error.
 * `download(fn)`: fn resolves { blob, filename } → file is saved.
 * `email(fn)`: fn resolves the API JSON → its message is shown (queued, not delivered).
 * 401 calls onUnauthorized (sign out) instead of showing an error.
 */
export function useCompanyReportAction({ onUnauthorized }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inFlight = useRef(false);

  const run = useCallback(
    async (kind, fn, onDone) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setError('');
      setSuccess('');
      setBusy(kind);
      try {
        onDone(await fn());
      } catch (err) {
        if (err.status === 401) onUnauthorized?.();
        else setError(err.message || 'Failed to request the report.');
      } finally {
        inFlight.current = false;
        setBusy('');
      }
    },
    [onUnauthorized],
  );

  const download = useCallback(
    (fn) => run('download', fn, ({ blob, filename }) => {
      saveExhibitorReportBlob(blob, filename);
      setSuccess(`Downloaded ${filename}`);
    }),
    [run],
  );

  const email = useCallback(
    (fn) => run('email', fn, (data) => setSuccess(data?.message || EMAIL_SUCCESS)),
    [run],
  );

  return {
    busy: Boolean(busy),
    downloading: busy === 'download',
    sending: busy === 'email',
    error,
    success,
    download,
    email,
  };
}

const untickedKey = (eventId) => `invitee_report_unticked:${eventId}`;

function loadUnticked(eventId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(untickedKey(eventId)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUnticked(eventId, keys) {
  try {
    localStorage.setItem(untickedKey(eventId), JSON.stringify(keys));
  } catch {
    /* storage blocked: the choice just isn't remembered */
  }
}

/**
 * Invitee report column checkboxes. Loads ?list_columns=true when `enabled`; every column starts ticked.
 * The browser remembers the *unticked* keys per event, so columns added later (new invite forms) start ticked.
 * If the server can't list columns (older EA), `supported` is false and the report is sent without `columns`.
 */
export function useInviteeReportColumns({ eventId, token, enabled, onUnauthorized }) {
  const [columns, setColumns] = useState([]);
  const [unticked, setUnticked] = useState(() => loadUnticked(eventId));
  const [loadedFor, setLoadedFor] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!enabled || !eventId || !token) return undefined;
    let cancelled = false;
    companyReportsApi
      .getInviteeReportColumns(eventId, token)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.columns) ? data.columns : [];
        setColumns(list);
        setSupported(list.length > 0);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) onUnauthorized?.();
        setSupported(false);
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(eventId);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, eventId, token, onUnauthorized]);

  const update = (keys) => {
    setUnticked(keys);
    saveUnticked(eventId, keys);
  };
  const selected = columns.map((c) => c.key).filter((key) => !unticked.includes(key));

  return {
    columns,
    selected,
    supported,
    loading: Boolean(enabled && eventId && token) && loadedFor !== eventId,
    toggle: (key) => update(unticked.includes(key) ? unticked.filter((k) => k !== key) : [...unticked, key]),
    selectAll: () => update([]),
    clear: () => update(columns.map((c) => c.key)),
  };
}
