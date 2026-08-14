export default function ChecklistReminderFilters({ draft, onChange, onApply, onClear }) {
  const set = (key, value) => onChange({ ...draft, [key]: value });

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-4 shadow-sm mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="Step ID">
          <input
            type="text"
            className="input w-full"
            placeholder="e.g. edit_company"
            value={draft.step_id}
            onChange={(e) => set('step_id', e.target.value)}
          />
        </Field>
        <Field label="Trigger">
          <select
            className="input w-full"
            value={draft.trigger}
            onChange={(e) => set('trigger', e.target.value)}
          >
            <option value="">All</option>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            className="input w-full"
            value={draft.sent_status}
            onChange={(e) => set('sent_status', e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Queued</option>
            <option value="in_progress">Running</option>
            <option value="completed">Done</option>
            <option value="failed">Failed</option>
          </select>
        </Field>
        <Field label="Reminder date (auto)">
          <input
            type="date"
            className="input w-full"
            value={draft.reminder_date}
            onChange={(e) => set('reminder_date', e.target.value)}
          />
        </Field>
        <Field label="Sent from">
          <input
            type="date"
            className="input w-full"
            value={draft.sent_at_from}
            onChange={(e) => set('sent_at_from', e.target.value)}
          />
        </Field>
        <Field label="Sent to">
          <input
            type="date"
            className="input w-full"
            value={draft.sent_at_to}
            onChange={(e) => set('sent_at_to', e.target.value)}
          />
        </Field>
        <Field label="Exact sent date">
          <input
            type="date"
            className="input w-full"
            value={draft.sent_at}
            onChange={(e) => set('sent_at', e.target.value)}
          />
        </Field>
      </div>
      <div className="flex items-center gap-2 mt-4 justify-end">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={onApply}>
          Apply filters
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      {children}
    </label>
  );
}
