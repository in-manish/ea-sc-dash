import { useEffect, useState } from 'react';
import { matchmakingApi } from '../../Matchmaking/api/matchmakingApi';
import { isMatchmakingFormNotFound } from '../../Matchmaking/domain/isMatchmakingFormNotFound';
import {
  extractMatchmakingProductOptions,
  getMatchmakingProductQuestions,
  hasMatchmakingProductQuestion,
} from '../domain/extractMatchmakingProductOptions';

export function useMatchmakingProductOptions(eventId, token, enabled = true) {
  const [options, setOptions] = useState([]);
  const [productQuestions, setProductQuestions] = useState([]);
  const [hasProductQuestion, setHasProductQuestion] = useState(false);
  const [loading, setLoading] = useState(Boolean(enabled && eventId && token));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled || !eventId || !token) {
      setOptions([]);
      setProductQuestions([]);
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
        setProductQuestions(getMatchmakingProductQuestions(data));
        setOptions(extractMatchmakingProductOptions(data));
      })
      .catch((err) => {
        if (!active) return;
        setOptions([]);
        setProductQuestions([]);
        setHasProductQuestion(false);
        setError(isMatchmakingFormNotFound(err) ? '' : (err.message || 'Failed to load product options.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, token, enabled]);

  return { options, productQuestions, hasProductQuestion, loading, error };
}
