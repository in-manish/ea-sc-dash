import { useCallback, useMemo } from 'react';
import {
  createOption,
  createScale,
  deleteOption,
  deleteScale,
  listOptionsForScale,
  listScales,
  updateOption,
  updateScale,
} from '../api/ratingConfigApi';
import { parseOptionGroups, parseScale, sortOptions, sortScales } from '../domain/ratingParsers';
import { useAsyncData } from './useAsyncData';

async function loadScales(token, typeId) {
  const result = await listScales(token, typeId);
  const scales = sortScales((result.data || []).map(parseScale));
  const options = await Promise.all(scales.map((scale) => listOptionsForScale(token, scale.id)));
  return scales.map((scale, index) => ({ ...scale, options: sortOptions(parseOptionGroups(options[index])) }));
}

/** The scale values of one rating type, each with its feedback options, plus the write calls. */
export function useRatingScale({ token, typeId, onUnauthorized }) {
  const fetcher = useCallback(() => loadScales(token, typeId), [token, typeId]);
  const list = useAsyncData(token && typeId ? `scale:${typeId}` : '', fetcher, onUnauthorized);
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
      createScale: (body) => run(() => createScale(token, { ...body, rating_type_id: typeId })),
      updateScale: (id, body) => run(() => updateScale(token, id, body)),
      removeScale: (id) => run(() => deleteScale(token, id)),
      createOption: (scaleId, body) => run(() => createOption(token, { ...body, applicable_rating_id: scaleId })),
      updateOption: (id, body) => run(() => updateOption(token, id, body)),
      removeOption: (id) => run(() => deleteOption(token, id)),
    }),
    [run, token, typeId],
  );

  return { scales: list.data || [], loading: list.loading, error: list.error, reload, ...actions };
}
