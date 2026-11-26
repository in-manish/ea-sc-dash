import { Clock, Loader2, Save, SlidersHorizontal } from 'lucide-react';
import { SectionHeader, ToggleSwitch, getInputClass } from '../../../pages/event-settings/components/SharedComponents';
import { CONFIG_FIELDS, describeRules, parseIntInput } from '../domain/chatReminderConfig';
import { formatTimestamp } from '../domain/chatReminderStatus';
import Banner from './Banner';

function NumberField({ field, value, savedValue, error, onChange }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider">{field.label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(field.key, parseIntInput(e.target.value))}
          className={`${getInputClass(field.key, value !== savedValue)} max-w-[120px]`}
        />
        <span className="text-xs text-text-tertiary">{field.unit}</span>
      </div>
      <span className={`block text-[11px] ${error ? 'text-red-700' : 'text-text-tertiary'}`}>{error || field.hint}</span>
    </label>
  );
}

/** Tenant reminder settings: master switch (saves at once) plus the rules (saved with the button). */
export default function ChatReminderSettingsCard({ config, events, scheduleOn }) {
  const { draft, saved, setField, save, saving, loading, error, fieldErrors, notice, dirty } = config;

  const toggleActivate = async (checked) => {
    if (checked) {
      const warning = scheduleOn
        ? 'Turn reminders ON? The schedule is running, so real people get emails from the next sweep.'
        : 'Turn reminders ON? Nothing sends automatically until the schedule is enabled.';
      if (!window.confirm(warning)) return;
    }
    await save({ activate: checked }, checked ? 'Reminders turned on.' : 'Reminders turned off.');
  };

  const setGoLiveNow = async () => {
    if (!window.confirm('Only messages sent after now will ever be reminded. Continue?')) return;
    await save({ set_go_live_now: true }, 'Go-live moved to now.');
  };

  const eventOptions = [...events];
  if (draft.event_id && !eventOptions.some((e) => e.id === draft.event_id)) {
    eventOptions.push({ id: draft.event_id, name: `Event #${draft.event_id}` });
  }

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-5">
      <SectionHeader icon={SlidersHorizontal} title="Settings" colorClass="text-rose-500" borderClass="bg-rose-500" />
      {loading ? <p className="text-sm text-text-tertiary m-0">Loading settings…</p> : (
        <>
          <div className="flex items-start justify-between gap-4 p-4 bg-bg-secondary rounded-lg border border-border">
            <div>
              <p className="font-semibold text-text-primary m-0 text-sm">Reminders on</p>
              <p className="text-xs text-text-tertiary mt-0.5 m-0">
                Master switch for this tenant. Off by default. Saves immediately.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin text-accent" /> : null}
              <ToggleSwitch name="activate" checked={!!saved.activate} isModified={false}
                onChange={(e) => toggleActivate(e.target.checked)} />
            </div>
          </div>

          <Banner tone="info">{describeRules(saved)}</Banner>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CONFIG_FIELDS.map((field) => (
              <NumberField key={field.key} field={field} value={draft[field.key]} savedValue={saved[field.key]}
                error={fieldErrors[field.key]} onChange={setField} />
            ))}
            <label className="block space-y-1.5">
              <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Time zone from event</span>
              <select
                value={draft.event_id}
                onChange={(e) => setField('event_id', Number(e.target.value))}
                className={getInputClass('event_id', draft.event_id !== saved.event_id)}
              >
                <option value={0}>None (IST)</option>
                {eventOptions.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
              </select>
              <span className={`block text-[11px] ${fieldErrors.event_id ? 'text-red-700' : 'text-text-tertiary'}`}>
                {fieldErrors.event_id || 'Only changes how times are shown in emails and reports.'}
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-bg-secondary rounded-lg border border-border">
            <div className="flex items-start gap-2 text-sm">
              <Clock size={16} className="text-text-tertiary mt-0.5" />
              <div>
                <p className="m-0 font-semibold text-text-primary">Go-live: {saved.go_live_at ? formatTimestamp(saved.go_live_at) : 'not set'}</p>
                <p className="m-0 text-xs text-text-tertiary">
                  Messages sent before this are never reminded. Set automatically when reminders are first turned on.
                </p>
              </div>
            </div>
            <button type="button" className="btn btn-secondary" onClick={setGoLiveNow} disabled={saving}>Set to now</button>
          </div>

          {saved.extra_settings_rows?.length ? (
            <Banner tone="warning">
              {`Extra settings rows exist (${saved.extra_settings_rows.join(', ')}). Only row ${saved.settings_row_id} is used; delete the others.`}
            </Banner>
          ) : null}
          <Banner tone="danger">{error}</Banner>
          <Banner tone="success">{notice}</Banner>

          <div className="flex justify-end">
            <button type="button" className="btn btn-primary disabled:opacity-50" disabled={saving || !dirty} onClick={() => save()}>
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="mr-2" />}
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
