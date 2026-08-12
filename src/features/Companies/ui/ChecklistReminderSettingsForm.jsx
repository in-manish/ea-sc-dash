import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useChecklistReminderSettings } from '../hooks/useChecklistReminderSettings';
import {
  formatOffsetDays,
  parseOffsetDaysInput,
} from '../domain/checklistReminderHelpers';

export default function ChecklistReminderSettingsForm({
  eventId,
  token,
  enabled = true,
}) {
  const { settings, setField, loading, saving, error, saveMsg, save } =
    useChecklistReminderSettings({ eventId, token, enabled });

  const [offsetsText, setOffsetsText] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setOffsetsText(formatOffsetDays(settings.reminder_offsets_days));
  }, [settings.reminder_offsets_days]);

  const submit = async (e) => {
    e.preventDefault();
    setLocalError('');
    let days;
    try {
      days = parseOffsetDaysInput(offsetsText);
    } catch (err) {
      setLocalError(err.message);
      return;
    }
    setField('reminder_offsets_days', days);
    await save({ reminder_offsets_days: days });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-text-tertiary">
        <Loader2 className="animate-spin text-accent" size={24} />
        Loading settings…
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm max-w-xl"
    >
      <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-1 m-0">
        Reminder settings
      </h3>
      <p className="text-sm text-text-secondary mb-5">
        Enable checklist reminders, portal base URL for CTAs, and auto-reminder day
        offsets. Does not manage checklist steps.
      </p>

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => setField('enabled', e.target.checked)}
        />
        <span className="text-sm text-text-primary">
          Enable checklist / reminders for this event
        </span>
      </label>

      <label className="flex flex-col gap-1 mb-4">
        <span className="text-xs font-medium text-text-secondary">Portal base URL</span>
        <input
          type="url"
          className="input w-full"
          placeholder="https://exhibitors.example.com"
          value={settings.portal_base_url}
          onChange={(e) => setField('portal_base_url', e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 mb-4">
        <span className="text-xs font-medium text-text-secondary">
          Reminder offsets (days before deadline)
        </span>
        <input
          type="text"
          className="input w-full"
          placeholder="7, 1"
          value={offsetsText}
          onChange={(e) => setOffsetsText(e.target.value)}
        />
        <span className="text-xs text-text-tertiary">
          Unique positive integers. Empty = no auto reminders.
        </span>
      </label>

      <p className="text-xs text-text-tertiary mb-4">Config version: {settings.version}</p>

      {(localError || error) && (
        <p className="text-sm text-red-600 mb-3 whitespace-pre-wrap">
          {localError || error}
        </p>
      )}
      {saveMsg && <p className="text-sm text-green-700 mb-3">{saveMsg}</p>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
