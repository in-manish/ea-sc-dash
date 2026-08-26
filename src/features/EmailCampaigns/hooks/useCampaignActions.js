import { useCallback, useState } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { cancelEmailCampaign, rescheduleEmailCampaign } from '../api/emailCampaignApi';
import { formatReschedulePayload } from '../domain/campaignHelpers';

export default function useCampaignActions({ eventId, token, onChanged }) {
  const { showAlert, showConfirm } = useAlert();
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const reschedule = useCallback(async (datetimeLocal) => {
    const payload = formatReschedulePayload(datetimeLocal);
    if (!payload || !rescheduleTarget) {
      showAlert('Please select a valid date and time.', 'warning');
      return false;
    }
    setSaving(true);
    try {
      await rescheduleEmailCampaign(eventId, rescheduleTarget.id, token, payload);
      showAlert('Campaign rescheduled.', 'success');
      setRescheduleTarget(null);
      onChanged?.();
      return true;
    } catch (err) {
      showAlert(err.message || 'Failed to reschedule campaign.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [eventId, onChanged, rescheduleTarget, showAlert, token]);

  const cancel = useCallback(async (campaign) => {
    const ok = await showConfirm(
      `Cancel “${campaign.name || 'this campaign'}”? This cannot be undone.`,
      { title: 'Cancel campaign', confirmText: 'Cancel campaign', variant: 'danger' },
    );
    if (!ok) return;
    try {
      await cancelEmailCampaign(eventId, campaign.id, token);
      showAlert('Campaign canceled.', 'success');
      onChanged?.();
    } catch (err) {
      showAlert(err.message || 'Failed to cancel campaign.', 'error');
    }
  }, [eventId, onChanged, showAlert, showConfirm, token]);

  return {
    rescheduleTarget,
    setRescheduleTarget,
    saving,
    reschedule,
    cancel,
  };
}
