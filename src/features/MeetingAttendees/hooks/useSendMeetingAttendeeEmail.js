import { useCallback, useRef, useState } from 'react';
import { sendMeetingAttendeeEmail } from '../api/meetingAttendeesApi';

export function useSendMeetingAttendeeEmail({ eventId, token, filters, onUnauthorized }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);

  const send = useCallback(
    async (options) => {
      if (!eventId || !token || !filters || inFlight.current) return { ok: false };
      inFlight.current = true;
      setSending(true);
      setError('');
      try {
        const result = await sendMeetingAttendeeEmail(token, eventId, filters, options);
        return { ok: true, result };
      } catch (err) {
        if (err.status === 401) onUnauthorized?.();
        setError(err.message);
        return { ok: false };
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [eventId, token, filters, onUnauthorized],
  );

  return { sending, error, send, clearError: () => setError('') };
}
