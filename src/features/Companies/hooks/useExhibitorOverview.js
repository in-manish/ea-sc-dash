import { useCallback, useEffect, useState } from 'react';
import { companyApi } from '../api/companyApi';

/**
 * Soft-fails: overview errors do not block Company Detail.
 * Organizer always passes companyId.
 */
export function useExhibitorOverview({ eventId, companyId, token }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!eventId || !companyId || !token) {
      setOverview(null);
      setLoading(false);
      setError('');
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    companyApi
      .getExhibitorOverview(eventId, companyId, token)
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((err) => {
        if (active) {
          setOverview(null);
          setError(err.message || "Couldn't load exhibitor portal checklist");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, companyId, token, reloadKey]);

  return { overview, loading, error, reload };
}
