import { Bell, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  LimitStatField,
  SectionHeader,
  ToggleSwitch,
} from '../../../pages/event-settings/components/SharedComponents';
import { useUnreadReminderConfig } from '../hooks/useUnreadReminderConfig';

function onNumberChange(setField, key) {
  return (e) => {
    const { value } = e.target;
    if (value === '') {
      setField(key, '');
      return;
    }
    const n = Number(value);
    setField(key, Number.isFinite(n) ? Math.max(0, Math.round(n)) : '');
  };
}

export default function ChatReminderSettings() {
  const { token } = useAuth();
  const {
    config,
    setField,
    loading,
    saving,
    error,
    saveMsg,
    save,
    isModified,
  } = useUnreadReminderConfig({ token });

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await save();
    } catch {
      /* error text is set in the hook */
    }
  };

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
      <SectionHeader icon={Bell} title="Chat Reminder" colorClass="text-rose-500" borderClass="bg-rose-500" />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-text-tertiary">
          <Loader2 className="animate-spin text-accent" size={22} />
          Loading chat reminder…
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-text-tertiary m-0 -mt-2">
            Remind people about unread meeting chats. Use Save chat reminder, or Save Changes at the top.
          </p>

          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex justify-between items-start gap-4 text-sm">
              <div>
                <p className="font-semibold text-text-primary m-0">Activate reminders</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Send a reminder when a meeting chat has unread messages.
                </p>
              </div>
              <div className="shrink-0 pt-0.5">
                <ToggleSwitch
                  name="activate"
                  checked={!!config.activate}
                  isModified={isModified('activate')}
                  onChange={(e) => setField('activate', e.target.checked)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LimitStatField
              label="Cooldown"
              description="Minutes between reminders"
              name="cooldown_minutes"
              value={config.cooldown_minutes}
              onChange={onNumberChange(setField, 'cooldown_minutes')}
              isModified={isModified('cooldown_minutes')}
              placeholder="20"
              min={0}
            />
            <LimitStatField
              label="Cutoff"
              description="Skip messages older than this (min)"
              name="cutoff_minutes"
              value={config.cutoff_minutes}
              onChange={onNumberChange(setField, 'cutoff_minutes')}
              isModified={isModified('cutoff_minutes')}
              placeholder="90"
              min={0}
            />
            <LimitStatField
              label="Days window"
              description="Look back this many days"
              name="days_window"
              value={config.days_window}
              onChange={onNumberChange(setField, 'days_window')}
              isModified={isModified('days_window')}
              placeholder="200"
              min={0}
            />
          </div>

          {error ? (
            <p className="text-sm text-[#991b1b] m-0 whitespace-pre-wrap">{error}</p>
          ) : null}
          {saveMsg ? (
            <p className="text-sm text-[#166534] m-0">{saveMsg}</p>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="mr-2" />}
              {saving ? 'Saving…' : 'Save chat reminder'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
