import { useCallback, useRef, useState } from 'react';
import {
  downloadExhibitorEngagementCsv,
  emailExhibitorEngagementCsv,
} from '../api/exhibitorEngagementApi';
import { saveExhibitorReportBlob } from '../domain/exhibitorReportDownload';

const EMAIL_SUCCESS = 'Exhibitor portal matchmaking report has been sent to the provided email address(es)';

function emailSuccessMessage(data) {
  const message = data?.message || EMAIL_SUCCESS;
  const count = Number(data?.record_count);
  if (!Number.isFinite(count)) return message;
  return `${message} (${count} ${count === 1 ? 'company' : 'companies'})`;
}

export function useExhibitorEngagementReport({ eventId, token, onUnauthorized }) {
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inFlight = useRef(false);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const fail = useCallback(
    (err) => {
      if (err.status === 401) {
        onUnauthorized?.();
        return;
      }
      setError(err.message || 'Failed to request matchmaking report.');
    },
    [onUnauthorized],
  );

  const download = useCallback(
    async (completed) => {
      if (!eventId || !token || inFlight.current) return;
      inFlight.current = true;
      clearMessages();
      setDownloading(true);
      try {
        const { blob, filename } = await downloadExhibitorEngagementCsv(eventId, token, {
          completed,
        });
        saveExhibitorReportBlob(blob, filename);
      } catch (err) {
        fail(err);
      } finally {
        inFlight.current = false;
        setDownloading(false);
      }
    },
    [eventId, token, clearMessages, fail],
  );

  const sendEmail = useCallback(
    async ({ emails, completed } = {}) => {
      if (!eventId || !token || inFlight.current || !emails?.length) return;
      inFlight.current = true;
      clearMessages();
      setSending(true);
      try {
        const data = await emailExhibitorEngagementCsv(eventId, token, {
          emails,
          completed,
        });
        setSuccess(emailSuccessMessage(data));
      } catch (err) {
        fail(err);
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [eventId, token, clearMessages, fail],
  );

  return { downloading, sending, error, success, download, sendEmail, clearMessages };
}
