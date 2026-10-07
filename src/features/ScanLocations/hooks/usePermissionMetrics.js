import { useCallback, useEffect, useRef, useState } from 'react';
import { getPermissionHolderMetrics, getPermissionScanMetrics } from '../api/permissionMetricsApi';
import { parseHolderMetrics, parseScanMetrics } from '../domain/parsePermissionMetrics';

/**
 * Loads one metrics call and keeps the last good result on screen while a refresh runs.
 * refresh(true) asks the server to rebuild its 10 minute cache (refresh_cache=true).
 */
function useMetricsCall(fetcher, parser, enabled, onUnauthorized) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState('');
  const [denied, setDenied] = useState(false);
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  const load = useCallback(async (force = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setData(parser(await fetcher(force)));
      setDenied(false);
    } catch (err) {
      setError(err.message || 'Failed to load metrics.');
      if (err.status === 403) setDenied(true);
      if (err.status === 401) onUnauthorizedRef.current?.();
    } finally {
      setLoading(false);
    }
  }, [enabled, fetcher, parser]);

  useEffect(() => {
    load(false);
  }, [load]);

  return { data, loading, error, denied, clearError: () => setError(''), refresh: load };
}

/** Who holds each permission. groupBy '' or 'attendee_type'. */
export function usePermissionHolderMetrics(eventId, token, onUnauthorized, { groupBy = '', enabled = true } = {}) {
  const fetcher = useCallback(
    (force) => getPermissionHolderMetrics(token, eventId, { groupBy, refresh: force }),
    [token, eventId, groupBy],
  );
  return useMetricsCall(fetcher, parseHolderMetrics, enabled && Boolean(eventId && token), onUnauthorized);
}

/** Scans per location and permission. params come from scanFilterParams. */
export function usePermissionScanMetrics(eventId, token, onUnauthorized, { params = {}, enabled = true } = {}) {
  const key = JSON.stringify(params);
  const fetcher = useCallback(
    (force) => getPermissionScanMetrics(token, eventId, { params: JSON.parse(key), refresh: force }),
    [token, eventId, key],
  );
  return useMetricsCall(fetcher, parseScanMetrics, enabled && Boolean(eventId && token), onUnauthorized);
}
