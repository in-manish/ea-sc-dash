import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Loader2, Plus, Search, Star, X } from 'lucide-react';
import { companyApi } from '../api/companyApi';
import {
  buildFeaturedOrderPayload,
  featuredOrderSuccessMessage,
} from '../domain/companyBulkActionPayload';
import { useCompanyBulkAction } from '../hooks/useCompanyBulkAction';

function toRow(company) {
  return {
    id: company.id,
    company_name: company.company_name || `#${company.id}`,
    obf_number: (company.obf_number || '').trim(),
  };
}

/**
 * Search-to-add, drag-free up/down reorder, save-as-rank manager for featured
 * companies. Only parent exhibitors can be featured (co-exhibitors excluded
 * from search, matching the existing per-row Feature/rank action).
 */
export default function ManageFeaturedCompaniesModal({ eventId, token, onSaved, onCancel }) {
  const { submitting, error: saveError, run, clearMessages } = useCompanyBulkAction({
    eventId,
    token,
  });

  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState('');
  const [rows, setRows] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setInitializing(true);
      setInitError('');
      try {
        const data = await companyApi.getCompanyList(eventId, token, {
          size: 200,
          sortBy: 'featured_rank',
          sortOrder: 'asc',
          filters: { is_featured: 'true', parent_exhibitor_only: 'true' },
        });
        if (!active) return;
        const featured = (data.results || [])
          .filter((c) => Number(c.featured_rank) > 0)
          .map(toRow);
        setRows(featured);
        setOriginalOrder(featured.map((r) => r.id));
      } catch (err) {
        if (active) setInitError(err.message || 'Failed to load featured companies.');
      } finally {
        if (active) setInitializing(false);
      }
    }
    if (eventId && token) load();
    return () => {
      active = false;
    };
  }, [eventId, token]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    let active = true;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await companyApi.getCompanyList(eventId, token, {
          size: 8,
          search: q,
          filters: { parent_exhibitor_only: 'true' },
        });
        if (active) setResults(data.results || []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, eventId, token]);

  useEffect(() => {
    if (!dropdownOpen) return undefined;
    const onDoc = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [dropdownOpen]);

  const visibleResults = results.filter((c) => !rows.some((r) => r.id === c.id));

  const addCompany = (company) => {
    setRows((prev) => (prev.some((r) => r.id === company.id) ? prev : [...prev, toRow(company)]));
    setQuery('');
    setResults([]);
    setDropdownOpen(false);
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const move = (index, direction) => {
    setRows((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reorderTo = (fromIndex, toIndex) => {
    setRows((prev) => {
      if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const endDrag = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const hasChanges = rows.map((r) => r.id).join(',') !== originalOrder.join(',');

  const handleSave = async () => {
    const keptIds = new Set(rows.map((r) => r.id));
    const removedIds = originalOrder.filter((id) => !keptIds.has(id));
    const payload = buildFeaturedOrderPayload(rows, removedIds);
    const data = await run(payload, featuredOrderSuccessMessage);
    if (!data) return;
    onSaved?.();
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={submitting ? undefined : onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-featured-title"
        className="bg-bg-primary rounded-lg border border-border shadow-xl w-full max-w-[640px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center gap-3">
          <div className="min-w-0">
            <h3 id="manage-featured-title" className="text-base font-bold text-text-primary m-0 flex items-center gap-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
              Manage featured companies
            </h3>
            <p className="m-0 mt-0.5 text-xs text-text-secondary">
              Search to add a company, then drag or use the arrows to set display order. Position sets the featured rank.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer p-1 disabled:opacity-50 shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="relative" ref={searchBoxRef}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input
                type="text"
                className="w-full py-2.5 pl-9 pr-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10 disabled:opacity-50"
                placeholder="Search companies to add..."
                value={query}
                disabled={initializing}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
              />
            </div>
            {dropdownOpen && query.trim() && (
              <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-bg-primary border border-border rounded-md shadow-lg">
                {searching && (
                  <li className="px-3 py-2 text-sm text-text-tertiary flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Searching…
                  </li>
                )}
                {!searching && visibleResults.length === 0 && (
                  <li className="px-3 py-2 text-sm text-text-tertiary">No matching companies.</li>
                )}
                {!searching &&
                  visibleResults.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-bg-secondary flex items-center justify-between gap-2"
                        onClick={() => addCompany(c)}
                      >
                        <span className="min-w-0 truncate">
                          <span className="font-medium text-text-primary">{c.company_name}</span>
                          <span className="text-text-tertiary text-xs ml-2">
                            {(c.obf_number || '').trim() ? `OBF ${c.obf_number} · ` : ''}#{c.id}
                          </span>
                        </span>
                        <Plus size={14} className="text-accent shrink-0" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="space-y-2 max-h-[45vh] overflow-y-auto">
            {initializing && (
              <p className="m-0 text-sm text-text-secondary flex items-center gap-2 py-4 justify-center">
                <Loader2 size={14} className="animate-spin" /> Loading featured companies…
              </p>
            )}
            {!initializing && initError && (
              <p className="m-0 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {initError}
              </p>
            )}
            {!initializing && !initError && rows.length === 0 && (
              <p className="m-0 text-sm text-text-tertiary text-center py-4">
                No featured companies yet. Search above to add one.
              </p>
            )}
            {!initializing &&
              !initError &&
              rows.map((row, index) => (
                <div
                  key={row.id}
                  draggable={!submitting}
                  onDragStart={(e) => {
                    setDragIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(index));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverIndex !== index) setDragOverIndex(index);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) reorderTo(dragIndex, index);
                    endDrag();
                  }}
                  onDragEnd={endDrag}
                  className={`flex items-center gap-3 border rounded-md px-3 py-2.5 bg-bg-secondary transition-colors ${
                    dragOverIndex === index && dragIndex !== null && dragIndex !== index
                      ? 'border-accent'
                      : 'border-border'
                  } ${dragIndex === index ? 'opacity-40' : ''}`}
                >
                  <span
                    className="text-text-tertiary shrink-0 cursor-grab active:cursor-grabbing"
                    aria-hidden="true"
                  >
                    <GripVertical size={16} />
                  </span>
                  <span className="flex flex-col items-center shrink-0 w-9 leading-none">
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-text-tertiary">
                      Rank
                    </span>
                    <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold">
                      {index + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-medium text-text-primary truncate">{row.company_name}</p>
                    {row.obf_number && (
                      <p className="m-0 text-xs text-text-tertiary">
                        OBF {row.obf_number} · #{row.id}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      draggable={false}
                      className="p-1.5 rounded-md border border-border bg-bg-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={index === 0 || submitting}
                      onClick={() => move(index, -1)}
                      aria-label={`Move ${row.company_name} up`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      draggable={false}
                      className="p-1.5 rounded-md border border-border bg-bg-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={index === rows.length - 1 || submitting}
                      onClick={() => move(index, 1)}
                      aria-label={`Move ${row.company_name} down`}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      draggable={false}
                      className="p-1.5 rounded-md border border-transparent text-text-tertiary hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={submitting}
                      onClick={() => removeRow(row.id)}
                      aria-label={`Remove ${row.company_name} from featured`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {saveError && (
            <p className="m-0 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {saveError}
            </p>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary flex justify-between items-center gap-2">
          <span className="text-xs text-text-secondary">
            {rows.length} featured compan{rows.length === 1 ? 'y' : 'ies'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
              onClick={() => {
                clearMessages();
                handleSave();
              }}
              disabled={submitting || initializing || !!initError || !hasChanges}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Save order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
