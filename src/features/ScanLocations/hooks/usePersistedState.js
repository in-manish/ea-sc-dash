import { useCallback, useState } from 'react';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * useState that is kept in localStorage under ``key``, so a choice survives leaving the screen and coming back.
 * Reading and writing never throw (private mode, blocked storage): the value then just lives in memory.
 */
export default function usePersistedState(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback));
  const update = useCallback((next) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* keep the value in memory only */
    }
  }, [key]);
  return [value, update];
}
