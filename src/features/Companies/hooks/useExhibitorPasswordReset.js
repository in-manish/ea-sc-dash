import { useCallback, useState } from 'react';
import { companyApi } from '../api/companyApi';
import { hasExhibitorPasswordResetTarget } from '../domain/exhibitorPasswordResetPayload';

export function useExhibitorPasswordReset({ eventId, token }) {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const clearMessages = useCallback(() => {
    setSuccess('');
    setError('');
  }, []);

  const resetPassword = useCallback(
    async (payload) => {
      if (!eventId || !token || !hasExhibitorPasswordResetTarget(payload)) {
        return false;
      }
      clearMessages();
      setResetting(true);
      try {
        const data = await companyApi.resetExhibitorPassword(
          eventId,
          token,
          payload,
        );
        setSuccess(data?.msg || 'Password reset done!');
        return true;
      } catch (err) {
        setError(err.message || 'Failed to reset exhibitor POC password.');
        return false;
      } finally {
        setResetting(false);
      }
    },
    [eventId, token, clearMessages],
  );

  return { resetting, success, error, resetPassword, clearMessages };
}
