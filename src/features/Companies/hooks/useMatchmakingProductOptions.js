import { useEffect, useState } from 'react';
import { matchmakingApi } from '../../Matchmaking/api/matchmakingApi';
import {
  extractMatchmakingProductOptions,
  hasMatchmakingProductQuestion,
} from '../domain/extractMatchmakingProductOptions';

export function useMatchmakingProductOptions(eventId, token, enabled = true) {
  const [options, setOptions] = useState([]);
  const [hasProductQuestion, setHasProductQuestion] = useState(false);
  const [loading, setLoading] = useState(Boolean(enabled && eventId && token));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled || !eventId || !token) {
      setOptions([]);
      setHasProductQuestion(false);
      setLoading(false);
      setError('');
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');

    matchmakingApi
      .getMatchmakingQuestions(eventId, token)
      .then((data) => {
        if (!active) return;
        setHasProductQuestion(hasMatchmakingProductQuestion(data));
        setOptions(extractMatchmakingProductOptions(data));
      })
      .catch((err) => {
        if (!active) return;
        setOptions([]);
        setHasProductQuestion(false);
        setError(err.message || 'Failed to load product options.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, token, enabled]);

  return { options, hasProductQuestion, loading, error };
}
