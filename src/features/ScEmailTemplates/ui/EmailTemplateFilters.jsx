import { eventFilterId } from '../domain/emailTemplateLabels';

export default function EmailTemplateFilters({
  filters,
  dropdowns,
  isLoading,
  onChange,
  onApply,
  onClear,
  onRefresh,
}) {
  const set = (name, value) => onChange({ ...filters, [name]: value });

  return (
    <div className="bg-bg-primary rounded-lg border border-border shadow-sm mb-6 p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onApply();
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <SelectField label="Type" value={filters.template_type} onChange={(v) => set('template_type', v)} empty="All types" options={dropdowns.template_type} />
        <SelectField label="Audience" value={filters.audience} onChange={(v) => set('audience', v)} empty="All audiences" options={dropdowns.audience} />
        <Field label="Event">
          <select className="input-field py-2.5" value={filters.event_id} onChange={(e) => set('event_id', e.target.value)}>
            <option value="">All events</option>
            {(dropdowns.event || []).map((ev) => {
              const id = eventFilterId(ev);
              return <option key={id} value={id}>#{id}</option>;
            })}
          </select>
        </Field>
        <SelectField label="Title" value={filters.title} onChange={(v) => set('title', v)} empty="All titles" options={dropdowns.titles} />
        <SelectField
          label="From name"
          value={filters.from_sender_name}
          onChange={(v) => set('from_sender_name', v)}
          empty="All from names"
          options={dropdowns.from_sender_name}
        />
        <Field label="Active / Archived">
          <select className="input-field py-2.5" value={filters.is_active} onChange={(e) => set('is_active', e.target.value)}>
            <option value="true">Active</option>
            <option value="false">Archived</option>
          </select>
        </Field>
        <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-end gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClear}>Clear</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh} disabled={isLoading}>Refresh</button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>Apply filters</button>
        </div>
      </form>
    </div>
  );
}

function SelectField({ label, value, onChange, empty, options }) {
  return (
    <Field label={label}>
      <select className="input-field py-2.5" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{empty}</option>
        {(options || []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </Field>
  );
}

function Field({ label, children }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      {children}
    </div>
  );
}
