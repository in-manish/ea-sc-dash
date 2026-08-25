import { useCallback, useEffect, useRef, useState } from 'react';
import { getImport } from '../api/importApi';
import { isImportActive } from '../domain/importStatus';

const POLL_MS = 2500;

export function useImportDetail({ token, importId, onUnauthorized }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    if (!token || !importId) {
      setJob(null);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getImport(token, importId);
      if (id !== requestId.current) return;
      setJob(data);
    } catch (err) {
      if (id !== requestId.current) return;
      if (err.status === 401) onUnauthorized?.();
      setError(err.message || 'Failed to load import');
      setJob(null);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [token, importId, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!token || !importId || !job || !isImportActive(job.status)) return undefined;
    const timer = setInterval(async () => {
      try {
        const data = await getImport(token, importId);
        setJob(data);
        setError('');
      } catch (err) {
        if (err.status === 401) onUnauthorized?.();
        setError(err.message || 'Failed to refresh import');
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [token, importId, job?.status, onUnauthorized]);

  return { job, loading, error, reload: load };
}
