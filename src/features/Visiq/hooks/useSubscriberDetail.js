import { useCallback, useEffect, useState } from 'react';
import { getSubscriber } from '../api/subscriberApi';

export function useSubscriberDetail({ token, subscriberId, onUnauthorized }) {
  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!token || !subscriberId) {
      setSubscriber(null);
      setLoading(false);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getSubscriber(token, subscriberId);
      setSubscriber(data);
    } catch (err) {
      if (err.status === 401) onUnauthorized?.();
      setError(err.message || 'Failed to load subscriber');
      setSubscriber(null);
    } finally {
      setLoading(false);
    }
  }, [token, subscriberId, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  return { subscriber, loading, error, reload: load };
}
