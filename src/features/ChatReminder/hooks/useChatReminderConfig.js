import { useCallback, useEffect, useRef, useState } from 'react';
import { getConfig, patchConfig } from '../api/chatReminderApi';
import { DEFAULT_CONFIG, changedFields, normalizeConfig, validateConfig } from '../domain/chatReminderConfig';

/** Load, edit and save the tenant's reminder settings. Saves only the fields that changed. */
export function useChatReminderConfig(token, onUnauthorized, onSaved) {
  const [saved, setSaved] = useState(DEFAULT_CONFIG);
  const [draft, setDraft] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');
  const callbacks = useRef({ onUnauthorized, onSaved });
  callbacks.current = { onUnauthorized, onSaved };

  const fail = useCallback((err) => {
    if (err.status === 401) callbacks.current.onUnauthorized?.();
    setError(err.message || 'Request failed.');
    setFieldErrors(err.fields || {});
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const next = normalizeConfig(await getConfig(token));
      setSaved(next);
      setDraft(next);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }, [token, fail]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = useCallback((key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setNotice('');
  }, []);

  /** PATCH `body` (default: the changed fields). Returns true when saved. */
  const save = useCallback(async (body, successText = 'Settings saved.') => {
    const payload = body || changedFields(draft, saved);
    if (!body) {
      const errors = validateConfig(draft);
      if (Object.keys(errors).length) {
        setFieldErrors(errors);
        setError('Fix the highlighted fields.');
        return false;
      }
    }
    if (!Object.keys(payload).length) {
      setNotice('Nothing changed.');
      return false;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const next = normalizeConfig(await patchConfig(token, payload));
      // Keep edits that were not part of this save (e.g. toggling "on" while a number is half-edited).
      setDraft((prev) => {
        const pending = changedFields(prev, saved);
        Object.keys(payload).forEach((key) => delete pending[key]);
        return { ...next, ...pending };
      });
      setSaved(next);
      setFieldErrors({});
      setNotice(successText);
      callbacks.current.onSaved?.();
      return true;
    } catch (err) {
      fail(err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [token, draft, saved, fail]);

  const dirty = Object.keys(changedFields(draft, saved)).length > 0;
  return { saved, draft, setField, save, load, loading, saving, error, fieldErrors, notice, dirty, setNotice };
}
