import { useCallback, useEffect, useRef, useState } from 'react';
import { previewSeekingMapper } from '../api/aiPresetsApi';
import { parseFiltersText } from '../domain/previewQuery';

export function useAiPresetPreview({ token, eventId, onUnauthorized }) {
  const [userQuery, setUserQuery] = useState('');
  const [filtersText, setFiltersText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const run = useCallback(
    async ({ query = '', filtersJson = '' } = {}) => {
      const parsed = parseFiltersText(filtersJson);
      if (parsed.error) {
        setError(parsed.error);
        setResult(null);
        return;
      }
      if (!eventId) {
        setError('event_id is required.');
        return;
      }
      const id = ++requestId.current;
      setLoading(true);
      setError('');
      try {
        const data = await previewSeekingMapper(token, {
          eventId,
          userQuery: query,
          filters: parsed.filters,
        });
        if (id !== requestId.current) return;
        setResult(data);
      } catch (err) {
        if (id !== requestId.current) return;
        if (err.status === 401) onUnauthorized?.();
        setError(err.message || 'Failed to load preview');
        setResult(null);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [token, eventId, onUnauthorized]
  );

  useEffect(() => {
    run({ query: '', filtersJson: '' });
  }, [run]);

  const submit = () => run({ query: userQuery, filtersJson: filtersText });

  return {
    userQuery,
    setUserQuery,
    filtersText,
    setFiltersText,
    result,
    error,
    loading,
    submit,
  };
}
