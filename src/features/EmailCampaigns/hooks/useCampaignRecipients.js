import { useCallback, useEffect, useRef, useState } from 'react';
import { listCampaignRecipients } from '../api/emailCampaignApi';
import { mergeUniqueById } from '../domain/campaignHelpers';

export default function useCampaignRecipients({ token, campaignId }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const fetchPage = useCallback(async (nextPage, append) => {
    if (!token || !campaignId) return;
    const id = ++requestId.current;
    if (append) setLoadingMore(true);
    else {
      setLoading(true);
      setItems([]);
    }
    setError('');
    try {
      const data = await listCampaignRecipients(campaignId, token, nextPage);
      if (id !== requestId.current) return;
      setItems((prev) => (append ? mergeUniqueById(prev, data.results) : data.results));
      setPage(nextPage);
      setHasNext(Boolean(data.next));
      setCount(data.count);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || 'Failed to load recipients');
      if (!append) setItems([]);
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [campaignId, token]);

  useEffect(() => {
    if (!campaignId) {
      setItems([]);
      setCount(0);
      setHasNext(false);
      return;
    }
    fetchPage(1, false);
  }, [campaignId, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasNext) return;
    fetchPage(page + 1, true);
  }, [fetchPage, hasNext, loading, loadingMore, page]);

  return { items, count, loading, loadingMore, error, hasNext, loadMore };
}
