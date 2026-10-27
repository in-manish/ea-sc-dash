import { Search } from 'lucide-react';
import { inputClass } from './inputClass';

const MODES = [
  { id: 'badge_uuid', label: 'Badge UUID', placeholder: 'e.g. 3f2b8c1e-…' },
  { id: 'evc_id', label: 'SnapCard ID', placeholder: 'e.g. 12345' },
];

/** Who to look up: a badge UUID (one event) or a SnapCard (EVC) ID (all their events). */
export default function RatingLookupForm({ lookup, onChange, onSearch, error, loading }) {
  const mode = MODES.find((m) => m.id === lookup.mode) || MODES[0];
  const submit = (event) => {
    event.preventDefault();
    onSearch();
  };
  return (
    <form onSubmit={submit} className="bg-bg-secondary/60 border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div role="tablist" aria-label="Look up by" className="inline-flex rounded-md border border-border bg-bg-primary p-0.5">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === lookup.mode}
              onClick={() => onChange({ ...lookup, mode: item.id, value: '' })}
              className={`px-3 h-9 rounded text-sm font-medium transition-colors ${
                item.id === lookup.mode ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          value={lookup.value}
          onChange={(e) => onChange({ ...lookup, value: e.target.value })}
          placeholder={mode.placeholder}
          aria-label={mode.label}
          aria-invalid={Boolean(error)}
          className={`${inputClass(error)} flex-1 min-w-[14rem] max-w-md`}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-5 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <Search size={16} /> Search
        </button>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-text-secondary w-fit">
        <input
          type="checkbox"
          checked={lookup.thisEventOnly}
          onChange={(e) => onChange({ ...lookup, thisEventOnly: e.target.checked })}
        />
        Only ratings from this event
      </label>
      {error ? <p className="text-sm text-red-600 m-0">{error}</p> : null}
    </form>
  );
}
