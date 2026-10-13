import { COUNT_FILTERS } from '../constants';

const inputClass =
  'p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent w-24';

function Bound({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-text-tertiary">
      {label}
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Any"
        className={inputClass}
      />
    </label>
  );
}

/** At least / at most boxes for each meeting count. */
export default function MeetingCountFilters({ draft, onPatch }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COUNT_FILTERS.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          <div className="flex gap-2">
            <Bound label="At least" value={draft[`${key}Min`]} onChange={(v) => onPatch({ [`${key}Min`]: v })} />
            <Bound label="At most" value={draft[`${key}Max`]} onChange={(v) => onPatch({ [`${key}Max`]: v })} />
          </div>
        </div>
      ))}
    </div>
  );
}
