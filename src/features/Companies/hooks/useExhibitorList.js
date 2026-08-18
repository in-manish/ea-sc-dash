import { useEffect, useRef, useState } from 'react';
import { companyApi } from '../api/companyApi';
import {
  DEFAULT_COMPANY_SORT_BY,
  DEFAULT_COMPANY_SORT_ORDER,
  companyListSortOverride,
  parseCompanySortBy,
  parseCompanySortOrder,
} from '../domain/companyListSort';
import {
  applyExhibitorListFilters,
  parseExhibitorListFilters,
} from '../domain/exhibitorListFilters';

function initialPage(searchParams) {
  const n = Number(searchParams.get('page'));
  return Number.isFinite(n) && n > 1 ? n : 1;
}

export default function useExhibitorList({
  selectedEvent,
  token,
  searchParams,
  setSearchParams,
  activeTab,
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(() => initialPage(searchParams));
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [filters, setFilters] = useState(() => parseExhibitorListFilters(searchParams));
  const [sortBy, setSortBy] = useState(() => parseCompanySortBy(searchParams.get('sort_by')));
  const [sortOrder, setSortOrder] = useState(() =>
    parseCompanySortOrder(searchParams.get('sort_order')),
  );
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const skipSearchPageReset = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (skipSearchPageReset.current) {
      skipSearchPageReset.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (activeTab !== 'exhibitors') return;
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    if (debouncedSearch) params.set('q', debouncedSearch);
    else params.delete('q');
    applyExhibitorListFilters(params, filters);
    if (sortBy !== DEFAULT_COMPANY_SORT_BY) params.set('sort_by', sortBy);
    else params.delete('sort_by');
    if (sortOrder !== DEFAULT_COMPANY_SORT_ORDER) params.set('sort_order', sortOrder);
    else params.delete('sort_order');
    setSearchParams(params, { replace: true });
    // searchParams omitted: clone current URL so tab/view keys stay put.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, filters, sortBy, sortOrder, activeTab, setSearchParams]);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!selectedEvent || activeTab !== 'exhibitors') return;
      setLoading(true);
      setError(null);
      try {
        const data = await companyApi.getCompanyList(selectedEvent.id, token, {
          page,
          size: 20,
          sortBy,
          sortOrder,
          search: debouncedSearch,
          filters,
        });
        setCompanies(data.results || []);
        setTotal(data.exhibitor_count || 0);
      } catch (err) {
        setError(err.message || 'Failed to load companies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedEvent && token) fetchCompanies();
  }, [
    selectedEvent,
    page,
    debouncedSearch,
    activeTab,
    filters,
    token,
    sortBy,
    sortOrder,
    listRefreshKey,
  ]);

  const setSort = (nextBy, nextOrder) => {
    setSortBy(parseCompanySortBy(nextBy));
    setSortOrder(parseCompanySortOrder(nextOrder));
    setPage(1);
  };

  return {
    companies,
    loading,
    error,
    total,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilters,
    sortBy,
    sortOrder,
    setSort,
    overrideMessage: companyListSortOverride({
      search: debouncedSearch,
      isFeatured: filters.is_featured,
    }),
    refresh: () => setListRefreshKey((k) => k + 1),
  };
}
