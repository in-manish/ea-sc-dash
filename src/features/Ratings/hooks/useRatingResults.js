import { useCallback, useState } from 'react';
import { getRatingDetail, getRatingSummary } from '../api/ratingResultsApi';
import { parseDetail, parseSummary } from '../domain/ratingParsers';
import {
  EMPTY_LOOKUP,
  EMPTY_RESULT_FILTERS,
  buildDetailQuery,
  buildSummaryQuery,
  validateLookup,
} from '../domain/resultsQuery';
import { useAsyncData } from './useAsyncData';

/** Look up one person's ratings. `lookup` is edited freely; Search copies it to `applied`. */
export function useRatingResults({ token, eventId, onUnauthorized }) {
  const [lookup, setLookup] = useState(EMPTY_LOOKUP);
  const [applied, setApplied] = useState(null);
  const [filters, setFilters] = useState(EMPTY_RESULT_FILTERS);
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState('');

  const base = applied && token ? JSON.stringify(applied) : '';
  const summary = useAsyncData(
    base ? `summary:${base}` : '',
    () => getRatingSummary(token, buildSummaryQuery(applied, eventId)).then(parseSummary),
    onUnauthorized,
  );
  const detail = useAsyncData(
    base ? `detail:${base}:${JSON.stringify(filters)}:${page}` : '',
    () => getRatingDetail(token, buildDetailQuery(applied, filters, page, eventId)).then(parseDetail),
    onUnauthorized,
  );

  const search = useCallback(() => {
    const problem = validateLookup(lookup);
    setFormError(problem);
    if (problem) return;
    setPage(1);
    setApplied({ ...lookup, value: lookup.value.trim() });
  }, [lookup]);

  const patchFilters = useCallback((patch) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const refresh = useCallback(() => {
    summary.reload();
    detail.reload();
  }, [summary, detail]);

  return {
    lookup,
    setLookup,
    applied,
    search,
    filters,
    patchFilters,
    page,
    setPage,
    summary,
    detail,
    refresh,
    formError,
  };
}
