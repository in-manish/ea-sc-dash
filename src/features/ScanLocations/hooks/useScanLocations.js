import { useCallback, useEffect, useRef, useState } from 'react';
import { getScanLocations } from '../api/scanLocationsApi';
import { parseScanLocations } from '../domain/parseScanLocations';

export default function useScanLocations(eventId, token, onUnauthorized) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  const load = useCallback(async () => {
    if (!eventId || !token) {
      setLocations([]);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getScanLocations(token, eventId);
      setLocations(parseScanLocations(data));
    } catch (err) {
      setLocations([]);
      setError(err.message || 'Failed to load scan locations.');
      if (err.status === 401) onUnauthorizedRef.current?.();
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    load();
  }, [load]);

  return { locations, loading, error, clearError: () => setError(''), refresh: load };
}
