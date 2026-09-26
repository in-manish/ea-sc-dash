import { useCallback, useEffect, useState } from 'react';
import { unreadReminderApi } from '../api/unreadReminderApi';
import { setChatReminderSave } from '../domain/chatReminderSaveBridge';
import {
  DEFAULT_UNREAD_REMINDER_CONFIG,
  buildUnreadReminderPayload,
  isUnreadReminderDirty,
  normalizeUnreadReminderConfig,
} from '../domain/unreadReminderConfig';

export function useUnreadReminderConfig({ token, enabled = true }) {
  const [config, setConfig] = useState(DEFAULT_UNREAD_REMINDER_CONFIG);
  const [original, setOriginal] = useState(DEFAULT_UNREAD_REMINDER_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const load = useCallback(async () => {
    if (!token || !enabled) return;
    setLoading(true);
    setError('');
    try {
      const data = await unreadReminderApi.getUnreadReminderConfig(token);
      const next = normalizeUnreadReminderConfig(data);
      setConfig(next);
      setOriginal(next);
    } catch (err) {
      setError(err.message || 'Failed to load chat reminder config.');
      setConfig(DEFAULT_UNREAD_REMINDER_CONFIG);
      setOriginal(DEFAULT_UNREAD_REMINDER_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaveMsg('');
  }, []);

  const save = useCallback(async () => {
    if (!token) {
      const msg = 'Authentication required. Please sign in again.';
      setError(msg);
      throw new Error(msg);
    }
    const payload = buildUnreadReminderPayload(config);
    setSaving(true);
    setError('');
    setSaveMsg('');
    try {
      const updated = await unreadReminderApi.saveUnreadReminderConfig(token, payload);
      const next = normalizeUnreadReminderConfig(updated);
      setConfig(next);
      setOriginal(next);
      setSaveMsg('Chat reminder config saved.');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save chat reminder config.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [token, config]);

  useEffect(() => {
    return setChatReminderSave(async () => {
      if (!isUnreadReminderDirty(config, original)) return;
      await save();
    });
  }, [config, original, save]);

  return {
    config,
    setField,
    loading,
    saving,
    error,
    saveMsg,
    save,
    isDirty: isUnreadReminderDirty(config, original),
    isModified: (field) => config[field] !== original[field],
    reload: load,
  };
}
