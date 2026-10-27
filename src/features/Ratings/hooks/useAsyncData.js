import { useCallback, useEffect, useState } from 'react';

const EMPTY = { key: '', version: -1, data: null, error: '', status: 0 };

/**
 * Loads `fetcher()` whenever `key` changes (an empty key loads nothing) and again on `reload()`.
 * The last good data stays on screen during a reload of the same key. 401 calls `onUnauthorized`.
 */
export function useAsyncData(key, fetcher, onUnauthorized) {
  const [loaded, setLoaded] = useState(EMPTY);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!key) return undefined;
    let active = true;
    fetcher()
      .then((data) => active && setLoaded({ key, version, data, error: '', status: 200 }))
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) onUnauthorized?.();
        setLoaded((prev) => ({
          key,
          version,
          data: prev.key === key ? prev.data : null,
          error: err.message,
          status: err.status || 0,
        }));
      });
    return () => {
      active = false;
    };
    // The fetcher is rebuilt every render; `key` and `version` identify the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version, onUnauthorized]);

  const sameKey = loaded.key === key;
  const ready = sameKey && loaded.version === version;
  return {
    data: sameKey ? loaded.data : null,
    loading: Boolean(key) && !ready,
    error: ready ? loaded.error : '',
    denied: ready && loaded.status === 403,
    reload,
  };
}
