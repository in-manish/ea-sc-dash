const inputClass = (invalid) =>
  `w-full h-10 px-3 border rounded-md text-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-danger focus:ring-danger/20 focus:border-danger'
      : 'border-border focus:ring-accent/20 focus:border-accent'
  }`;

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <span className="text-xs text-danger mt-1 block">{error}</span> : null}
    </label>
  );
}

export default function PermissionWindowFields({ value, onChange, errors = {} }) {
  const set = (key, next) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="From date" error={errors.from_date}>
          <input
            type="date"
            value={value.from_date || ''}
            onChange={(e) => set('from_date', e.target.value)}
            className={inputClass(errors.from_date)}
          />
        </Field>
        <Field label="End date" error={errors.end_date}>
          <input
            type="date"
            value={value.end_date || ''}
            onChange={(e) => set('end_date', e.target.value)}
            className={inputClass(errors.end_date)}
          />
        </Field>
        <Field label="From time" error={errors.from_time}>
          <input
            type="time"
            step="60"
            value={value.from_time || ''}
            onChange={(e) => set('from_time', e.target.value)}
            className={inputClass(errors.from_time)}
          />
        </Field>
        <Field label="End time" error={errors.end_time}>
          <input
            type="time"
            step="60"
            value={value.end_time || ''}
            onChange={(e) => set('end_time', e.target.value)}
            className={inputClass(errors.end_time)}
          />
        </Field>
      </div>
      <p className="text-xs text-text-tertiary m-0">
        Leave a date empty for no limit on that side. Leave both times empty for all day.
        An earlier end time runs past midnight.
      </p>
      <label className="inline-flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          checked={value.is_active !== false}
          onChange={(e) => set('is_active', e.target.checked)}
        />
        Active
      </label>
      {errors.is_active ? <p className="text-xs text-danger m-0">{errors.is_active}</p> : null}
    </div>
  );
}
