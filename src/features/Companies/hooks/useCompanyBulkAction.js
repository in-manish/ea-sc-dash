import { useCallback, useState } from 'react';
import { companyApi } from '../api/companyApi';

export function useCompanyBulkAction({ eventId, token }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const clearMessages = useCallback(() => {
    setSuccess('');
    setError('');
  }, []);

  const run = useCallback(
    async (payload, successMessage) => {
      if (!eventId || !token || !payload?.operation_type || !payload?.selection) {
        return null;
      }
      clearMessages();
      setSubmitting(true);
      try {
        const data = await companyApi.bulkAction(eventId, token, payload);
        const count = data?.updated_count ?? 0;
        setSuccess(
          typeof successMessage === 'function'
            ? successMessage(data)
            : successMessage || `Updated ${count} compan${count === 1 ? 'y' : 'ies'}.`,
        );
        return data;
      } catch (err) {
        setError(err.message || 'Failed to update companies.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [eventId, token, clearMessages],
  );

  return { submitting, success, error, run, clearMessages };
}
