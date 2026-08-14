import { useState, useCallback, useRef, useEffect } from 'react';
import { companyApi } from '../api/companyApi';
import { checklistReminderApi } from '../api/checklistReminderApi';
import {
  REMIND_POLL_MS,
  isRemindInFlight,
  remindSuccessMessage,
} from '../domain/checklistReminderHelpers';

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

/**
 * POST remind → if async + log_id, poll progress until completed|failed.
 * Sync 200 uses POST counts as final.
 */
export function useSetupChecklistRemind({ eventId, token, onSuccess }) {
  const [remindingKey, setRemindingKey] = useState(null);
  const [remindSuccess, setRemindSuccess] = useState('');
  const [remindError, setRemindError] = useState('');
  const [progress, setProgress] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const clearMessages = useCallback(() => {
    setRemindSuccess('');
    setRemindError('');
  }, []);

  const pollProgress = useCallback(
    async (logId, signal) => {
      let latest = null;
      while (!signal.aborted) {
        latest = await checklistReminderApi.getReminderProgress(
          eventId,
          logId,
          token,
        );
        if (signal.aborted) break;
        setProgress(latest);
        if (!isRemindInFlight(latest.sent_status)) return latest;
        await sleep(REMIND_POLL_MS, signal);
      }
      return latest;
    },
    [eventId, token],
  );

  const sendRemind = useCallback(
    async ({ stepId, companyIds, key, successMessage }) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      clearMessages();
      setProgress(null);
      setRemindingKey(key || 'send');

      try {
        const start = await companyApi.sendSetupChecklistReminder(
          eventId,
          token,
          { stepId, companyIds },
        );

        let final = start;
        if (start.async && start.log_id != null) {
          setProgress({
            id: start.log_id,
            sent_status: start.sent_status || 'pending',
            total: start.total ?? 0,
            processed: start.processed ?? 0,
            sent: start.sent ?? 0,
            skipped: start.skipped ?? 0,
            errors: start.errors ?? 0,
            percentage: 0,
          });
          final = await pollProgress(start.log_id, ac.signal);
        } else {
          setProgress(
            start.log_id != null || (start.total ?? 0) > 0 ? start : null,
          );
        }

        if (ac.signal.aborted) return false;

        if (final?.sent_status === 'failed') {
          setRemindError(remindSuccessMessage(final));
          return false;
        }

        setRemindSuccess(remindSuccessMessage(final, successMessage));
        onSuccess?.();
        return true;
      } catch (err) {
        if (err?.name === 'AbortError') return false;
        setRemindError(err.message || 'Failed to send reminder. Please try again.');
        return false;
      } finally {
        if (!ac.signal.aborted) setRemindingKey(null);
      }
    },
    [eventId, token, onSuccess, clearMessages, pollProgress],
  );

  return {
    remindingKey,
    remindSuccess,
    remindError,
    progress,
    clearMessages,
    sendRemind,
    isReminding: Boolean(remindingKey),
  };
}
