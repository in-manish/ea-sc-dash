import { useCallback, useRef, useState } from 'react';
import {
  downloadExhibitorReport,
  emailExhibitorReport,
} from '../api/exhibitorReportApi';
import { saveExhibitorReportBlob } from '../domain/exhibitorReportDownload';

const EMAIL_SUCCESS = 'Report will be emailed shortly';

export function useExhibitorReport({ eventId, token, onUnauthorized }) {
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
      setError(err.message || 'Failed to request exhibitor report.');
    },
    [onUnauthorized],
  );

  const download = useCallback(
    async (companyIds) => {
      if (!eventId || !token || inFlight.current) return;
      inFlight.current = true;
      clearMessages();
      setDownloading(true);
      try {
        const { blob, filename } = await downloadExhibitorReport(eventId, token, {
          companyIds,
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
    async ({ emails, companyIds } = {}) => {
      if (!eventId || !token || inFlight.current || !emails?.length) return;
      inFlight.current = true;
      clearMessages();
      setSending(true);
      try {
        const data = await emailExhibitorReport(eventId, token, {
          emails,
          companyIds,
        });
        setSuccess(data.message || EMAIL_SUCCESS);
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
