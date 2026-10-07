const FIELD = 'rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary';

/** The SurveyJS form whose options and purchases are used. Pick one from the list, or type its name. */
export default function ServiceFormPicker({ forms, loading, error, value, onChange }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
        SurveyJS form
        <select className={`${FIELD} min-w-64`} value={forms.includes(value) ? value : ''} disabled={loading}
          onChange={(event) => onChange(event.target.value)}>
          <option value="">{loading ? 'Loading forms…' : 'Choose a form'}</option>
          {forms.map((form) => <option key={form} value={form}>{form}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
        or type it
        <input className={`${FIELD} min-w-64`} value={value} placeholder="wtemiami2026-trade_visitor"
          onChange={(event) => onChange(event.target.value.trim())} />
      </label>
      {error ? <span className="text-xs text-danger pb-2">{error}</span> : null}
    </div>
  );
}
