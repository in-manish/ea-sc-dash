import { useCallback, useEffect, useState } from 'react';
import { fetchEmailTemplates } from '../api/emailTemplateApi';
import { DEFAULT_EMAIL_TEMPLATE_FILTERS } from '../domain/buildEmailTemplateQuery';
import { emptyEmailTemplateList } from '../domain/parseEmailTemplateList';

export default function useEmailTemplateList(token) {
  const [filters, setFilters] = useState(DEFAULT_EMAIL_TEMPLATE_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_EMAIL_TEMPLATE_FILTERS);
  const [data, setData] = useState(emptyEmailTemplateList());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (query) => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const payload = await fetchEmailTemplates(token, query);
      setData(payload);
    } catch (err) {
      setData((prev) => ({ ...prev, count: 0, results: [] }));
      setError(err.message || 'Failed to load email templates.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load(applied);
  }, [load, applied]);

  const applyFilters = () => {
    setApplied({ ...filters, offset: 0 });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_EMAIL_TEMPLATE_FILTERS);
    setApplied(DEFAULT_EMAIL_TEMPLATE_FILTERS);
  };

  const setPageOffset = (offset) => {
    setApplied((prev) => ({ ...prev, offset }));
    setFilters((prev) => ({ ...prev, offset }));
  };

  const setLimit = (limit) => {
    const next = { ...applied, limit, offset: 0 };
    setApplied(next);
    setFilters(next);
  };

  return {
    filters,
    setFilters,
    applied,
    results: data.results,
    totalCount: data.count,
    dropdowns: data.filters,
    isLoading,
    error,
    applyFilters,
    clearFilters,
    reload: () => load(applied),
    setPageOffset,
    setLimit,
  };
}
