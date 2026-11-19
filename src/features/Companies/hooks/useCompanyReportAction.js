import { useCallback, useRef, useState } from 'react';
import { saveExhibitorReportBlob } from '../domain/exhibitorReportDownload';

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
