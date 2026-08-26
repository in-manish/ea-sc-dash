import { useCallback, useState } from 'react';
import { getEmailCampaign } from '../api/emailCampaignApi';

export default function useCampaignDetail({ eventId, token }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = useCallback(() => {
    setCampaign(null);
    setError('');
  }, []);

  const open = useCallback(async (campaignId) => {
    if (!eventId || !token || !campaignId) return;
    setLoading(true);
    setError('');
    setCampaign({ id: campaignId });
    try {
      const detail = await getEmailCampaign(eventId, campaignId, token);
      setCampaign(detail);
    } catch (err) {
      setError(err.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  return { campaign, loading, error, open, close };
}
