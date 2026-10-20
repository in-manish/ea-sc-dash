import { useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { LOOKUP_FILTERS, SEARCH_KEY } from '../constants';

const inputClass =
  'w-full p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10';

function filledCount(draft) {
  return LOOKUP_FILTERS.filter(({ key }) => String(draft[key] || '').trim()).length;
}

function SearchBox({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, company, reg ID, UID or ID…"
        aria-label="Search attendees"
        className="w-full h-12 pl-11 pr-10 border border-border rounded-lg text-sm bg-bg-primary outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
          onClick={() => onChange('')}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/** One search box for quick lookups, plus exact fields (ID, UID, reg ID, email, company) behind a toggle. */
export default function AttendeeSearchFilters({ draft, onPatch }) {
  const filled = filledCount(draft);
  const [open, setOpen] = useState(filled > 0);

  return (
    <div className="flex flex-col gap-2.5">
      <SearchBox value={draft[SEARCH_KEY] || ''} onChange={(value) => onPatch({ [SEARCH_KEY]: value })} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronDown size={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          Search by a specific field
          {filled > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-accent text-white text-xs leading-none">{filled}</span>
          )}
        </button>
        {filled > 0 && (
          <button
            type="button"
            className="text-xs text-text-tertiary hover:text-text-primary underline"
            onClick={() => onPatch(Object.fromEntries(LOOKUP_FILTERS.map(({ key }) => [key, ''])))}
          >
            Clear these
          </button>
        )}
      </div>
      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOOKUP_FILTERS.map(({ key, label, placeholder, numbers }) => (
            <label key={key} className="flex flex-col gap-1 text-xs text-text-tertiary">
              {label}
              <input
                type="text"
                inputMode={numbers ? 'numeric' : 'text'}
                value={draft[key] || ''}
                onChange={(e) => onPatch({ [key]: e.target.value })}
                placeholder={placeholder}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
