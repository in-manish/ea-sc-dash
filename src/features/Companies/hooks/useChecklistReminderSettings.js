import { useCallback, useEffect, useState } from 'react';
import { checklistReminderApi } from '../api/checklistReminderApi';
import {
  DEFAULT_CHECKLIST_REMINDER_SETTINGS,
  normalizeChecklistSettings,
} from '../domain/checklistReminderHelpers';

export function useChecklistReminderSettings({ eventId, token, enabled = true }) {
  const [settings, setSettings] = useState(DEFAULT_CHECKLIST_REMINDER_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const load = useCallback(async () => {
    if (!eventId || !token || !enabled) return;
    setLoading(true);
    setError('');
    try {
      const data = await checklistReminderApi.getSettings(eventId, token);
      setSettings(normalizeChecklistSettings(data));
    } catch (err) {
      setError(err.message || 'Failed to load reminder settings.');
      setSettings(DEFAULT_CHECKLIST_REMINDER_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, [eventId, token, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveMsg('');
  }, []);

  const save = useCallback(
    async (overrides = null) => {
      if (!eventId || !token) return false;
      const payload = {
        enabled: overrides?.enabled ?? settings.enabled,
        version: overrides?.version ?? settings.version,
        portal_base_url: overrides?.portal_base_url ?? settings.portal_base_url,
        reminder_offsets_days:
          overrides?.reminder_offsets_days ?? settings.reminder_offsets_days,
      };
      setSaving(true);
      setError('');
      setSaveMsg('');
      try {
        const updated = await checklistReminderApi.updateSettings(
          eventId,
          token,
          payload
        );
        setSettings(normalizeChecklistSettings(updated));
        setSaveMsg('Reminder settings saved.');
        return true;
      } catch (err) {
        setError(err.message || 'Failed to save reminder settings.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [eventId, token, settings]
  );

  return { settings, setField, loading, saving, error, saveMsg, save, reload: load };
}
