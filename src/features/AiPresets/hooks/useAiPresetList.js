import { useCallback, useEffect, useRef, useState } from 'react';
import { listPresets } from '../api/aiPresetsApi';

export function useAiPresetList({ token, onUnauthorized }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    if (!token) {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await listPresets(token);
      if (id !== requestId.current) return;
      setResults(data);
    } catch (err) {
      if (id !== requestId.current) return;
      if (err.status === 401) onUnauthorized?.();
      setError(err.message || 'Failed to load presets');
      setResults([]);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [token, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  return { results, loading, error, reload: load };
}
