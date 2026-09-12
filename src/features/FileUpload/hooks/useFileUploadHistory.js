import { useEffect, useState } from 'react';
import { HISTORY_LIMIT } from '../constants';

export function useFileUploadHistory(historyKey) {
  const [history, setHistory] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rawHistory = localStorage.getItem(historyKey);
    if (!rawHistory) {
      setHistory([]);
    } else {
      try {
        const parsed = JSON.parse(rawHistory);
        setHistory(Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : []);
      } catch {
        setHistory([]);
      }
    }
    setHydrated(true);
  }, [historyKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(historyKey, JSON.stringify(history));
  }, [history, historyKey, hydrated]);

  const pushEntry = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT));
  };

  return { history, pushEntry };
}
