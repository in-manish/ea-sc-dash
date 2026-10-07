const FIELD = 'rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary';

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-text-secondary">
      {label}
      {children}
      {error ? <span className="text-danger">{error}</span> : null}
    </label>
  );
}

export default function ScanMetricsFilters({ filters, errors, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  return (
    <div className="flex flex-wrap items-start gap-3">
      <Field label="Dates">
        <select className={FIELD} value={filters.mode} onChange={(event) => set({ mode: event.target.value })}>
          <option value="all">All dates</option>
          <option value="day">One day</option>
          <option value="range">Date range</option>
        </select>
      </Field>
      {filters.mode === 'day' ? (
        <Field label="Day" error={errors.date}>
          <input type="date" className={FIELD} value={filters.date} onChange={(event) => set({ date: event.target.value })} />
        </Field>
      ) : null}
      {filters.mode === 'range' ? (
        <>
          <Field label="From" error={errors.from}>
            <input type="date" className={FIELD} value={filters.from} onChange={(event) => set({ from: event.target.value })} />
          </Field>
          <Field label="To" error={errors.to}>
            <input type="date" className={FIELD} value={filters.to} onChange={(event) => set({ to: event.target.value })} />
          </Field>
        </>
      ) : null}
      <Field label="Direction">
        <select className={FIELD} value={filters.scannedIn} onChange={(event) => set({ scannedIn: event.target.value })}>
          <option value="">In and out</option>
          <option value="IN">In only</option>
          <option value="OUT">Out only</option>
        </select>
      </Field>
      <label className="inline-flex items-center gap-2 text-sm text-text-secondary self-end pb-2">
        <input type="checkbox" checked={filters.byDay} onChange={(event) => set({ byDay: event.target.checked })} />
        Show each day
      </label>
    </div>
  );
}
