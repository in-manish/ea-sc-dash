import { useCallback, useRef, useState } from 'react';
import { previewRun, sendNow } from '../api/chatReminderApi';

/** Dry run and send-now. The last result stays on screen until the next run. */
export function useChatReminderRun(token, onUnauthorized, onSent) {
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState('');
  const [error, setError] = useState('');
  const callbacks = useRef({ onUnauthorized, onSent });
  callbacks.current = { onUnauthorized, onSent };

  const run = useCallback(async (mode, options) => {
    setRunning(mode);
    setError('');
    try {
      const body = { limit: options.limit };
      if (options.receiverIds.length) body.receiver_evc_ids = options.receiverIds;
      if (options.cutoffMinutes) body.cutoff_minutes = options.cutoffMinutes;
      const data = mode === 'send' ? await sendNow(token, body) : await previewRun(token, body);
      setResult(data);
      if (mode === 'send') callbacks.current.onSent?.();
    } catch (err) {
      if (err.status === 401) callbacks.current.onUnauthorized?.();
      setError(err.message || 'Request failed.');
    } finally {
      setRunning('');
    }
  }, [token]);

  return {
    result,
    running,
    error,
    preview: (options) => run('preview', options),
    send: (options) => run('send', options),
  };
}
