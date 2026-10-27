import { useCallback, useMemo } from 'react';
import {
  createRatingType,
  deleteRatingType,
  listRatingTypes,
  updateRatingType,
} from '../api/ratingConfigApi';
import { parseType } from '../domain/ratingParsers';
import { useAsyncData } from './useAsyncData';

/** Rating types plus create / update / delete; every write reloads the list. */
export function useRatingTypes({ token, onUnauthorized }) {
  const fetcher = useCallback(
    () => listRatingTypes(token).then((result) => (result.data || []).map(parseType)),
    [token],
  );
  const list = useAsyncData(token ? 'types' : '', fetcher, onUnauthorized);
  const { reload } = list;

  const run = useCallback(
    async (call) => {
      try {
        const result = await call();
        reload();
        return result;
      } catch (err) {
        if (err.status === 401) onUnauthorized?.();
        throw err;
      }
    },
    [reload, onUnauthorized],
  );

  const actions = useMemo(
    () => ({
      create: (body) => run(() => createRatingType(token, body)),
      update: (id, body) => run(() => updateRatingType(token, id, body)),
      remove: (id) => run(() => deleteRatingType(token, id)),
    }),
    [run, token],
  );

  return { types: list.data || [], loading: list.loading, error: list.error, denied: list.denied, reload, ...actions };
}
