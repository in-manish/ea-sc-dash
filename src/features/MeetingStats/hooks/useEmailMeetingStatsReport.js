import { useCallback, useEffect, useRef, useState } from 'react';
import { emailMeetingStatsReport } from '../api/meetingStatsReportApi';
import { EMAIL_COOLDOWN_MS, EMAIL_SENT_MSG } from '../constants';

export function useEmailMeetingStatsReport({ eventId, token, filters, onUnauthorized }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const inFlight = useRef(false);
  const cooldownUntil = useRef(0);
  const tickRef = useRef(null);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const startCooldown = useCallback(() => {
    cooldownUntil.current = Date.now() + EMAIL_COOLDOWN_MS;
    setCooldownLeft(Math.ceil(EMAIL_COOLDOWN_MS / 1000));
    stopTick();
    tickRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((cooldownUntil.current - Date.now()) / 1000));
      setCooldownLeft(left);
      if (left <= 0) stopTick();
    }, 250);
  }, [stopTick]);

  useEffect(() => () => stopTick(), [stopTick]);

  const sendEmail = useCallback(
    async (emails) => {
      if (!eventId || !token || inFlight.current || !emails?.length) {
        return { ok: false };
      }
      if (Date.now() < cooldownUntil.current) {
        return { ok: false, cooledDown: true };
      }
      inFlight.current = true;
      clearMessages();
      setSending(true);
      try {
        const data = await emailMeetingStatsReport(token, eventId, filters, emails);
        const message = data.msg || EMAIL_SENT_MSG;
        setSuccess(message);
        startCooldown();
        return { ok: true, message };
      } catch (err) {
        if (err.status === 401) {
          onUnauthorized?.();
          return { ok: false };
        }
        const message = err.message || 'Failed to email meeting stats report.';
        setError(message);
        return { ok: false, message };
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [eventId, token, filters, onUnauthorized, clearMessages, startCooldown],
  );

  return { sending, cooldownLeft, error, success, sendEmail, clearMessages };
}
