import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { eventService } from '../../../services/eventService';
import { formatCompanySearchLabel } from '../domain/formatCompanySearchLabel';

/**
 * Typeahead to pick a parent exhibitor for co-exhibitor create.
 * Locks when parentId is pre-set from company details.
 */
const ParentCompanySearch = ({
  eventId,
  token,
  value,
  label,
  locked = false,
  onSelect,
  onClear,
}) => {
  const [query, setQuery] = useState(label || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(label || '');
  }, [label]);

  useEffect(() => {
    if (locked || !open) return undefined;
    const q = query.trim();
    if (q.length < 1) {
      setResults([]);
      return undefined;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await eventService.getCompanies(
          eventId,
          token,
          1,
          8,
          'obf_number',
          'desc',
          q,
          { parent_exhibitor_only: 'true' }
        );
        if (active) setResults(data.results || []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, eventId, token, locked, open]);

  if (locked && value) {
    return (
      <div className="py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary text-text-primary">
        {label || `#${value}`}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
        placeholder="Search parent exhibitor..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onClear?.();
        }}
        onFocus={() => setOpen(true)}
      />
      {open && (loading || results.length > 0) && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-bg-primary border border-border rounded-md shadow-lg">
          {loading && (
            <li className="px-3 py-2 text-sm text-text-tertiary flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Searching…
            </li>
          )}
          {!loading &&
            results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-bg-secondary"
                  onClick={() => {
                    onSelect(c);
                    setQuery(formatCompanySearchLabel(c));
                    setOpen(false);
                  }}
                >
                  <span className="font-medium text-text-primary">{c.company_name}</span>
                  <span className="text-text-tertiary text-xs ml-2">
                    {(c.obf_number || '').trim()
                      ? `OBF ${c.obf_number} · `
                      : ''}
                    #{c.id}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ParentCompanySearch;
