import { useCallback, useEffect, useRef, useState } from 'react';
import { listEmailCampaigns } from '../api/emailCampaignApi';
import { CAMPAIGN_SCOPE, MIN_VISIBLE_ROWS } from '../constants';
import { filterCampaignsByScope, mergeUniqueById } from '../domain/campaignHelpers';

export default function useEmailCampaignList({ eventId, token, scope }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(null);
  const requestId = useRef(0);

  const visible = filterCampaignsByScope(items, scope || CAMPAIGN_SCOPE.ALL);

  const fetchPage = useCallback(async (nextPage, append) => {
    if (!eventId || !token) return;
    const id = ++requestId.current;
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setItems([]);
    }
    setError('');
    try {
      const data = await listEmailCampaigns(eventId, token, nextPage);
      if (id !== requestId.current) return;
      setItems((prev) => (append ? mergeUniqueById(prev, data.results) : data.results));
      setPage(nextPage);
      setHasNext(Boolean(data.next));
      setTotalCount(data.count);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || 'Failed to load campaigns');
      if (!append) setItems([]);
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [eventId, token]);

  const reload = useCallback(() => fetchPage(1, false), [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNext) return;
    fetchPage(page + 1, true);
  }, [fetchPage, hasNext, loading, loadingMore, page]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (scope === CAMPAIGN_SCOPE.ALL) return;
    if (loading || loadingMore || !hasNext || error) return;
    if (visible.length >= MIN_VISIBLE_ROWS) return;
    loadMore();
  }, [error, hasNext, loadMore, loading, loadingMore, scope, visible.length]);

  return {
    visible,
    totalCount,
    loading,
    loadingMore,
    error,
    hasNext,
    loadMore,
    reload,
  };
}
