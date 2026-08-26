import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  COMPANY_LIST_SORT_FIELDS,
  defaultOrderForSortBy,
} from '../domain/companyListSort';

/**
 * One sort control: "Sort: Stall ↓". Field pick + direction in the same menu.
 */
export default function ExhibitorListSortControls({
  sortBy,
  sortOrder,
  onChange,
  overrideMessage,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = COMPANY_LIST_SORT_FIELDS.find((field) => field.value === sortBy);
  const arrow = sortOrder === 'asc' ? '↑' : '↓';

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (fieldValue) => {
    if (fieldValue === sortBy) {
      onChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onChange(fieldValue, defaultOrderForSortBy(fieldValue));
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef} title={overrideMessage || 'Sort exhibitors'}>
      <button
        type="button"
        className="btn btn-secondary h-12"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Sort by ${current?.label || 'field'}, ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
        onClick={() => setOpen((v) => !v)}
      >
        Sort: {current?.label || 'Stall'} {arrow}
        <ChevronDown
          size={14}
          className={`ml-1.5 text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-1.5 right-0 w-[240px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
        >
          {COMPANY_LIST_SORT_FIELDS.map((field) => {
            const active = field.value === sortBy;
            return (
              <button
                key={field.value}
                type="button"
                role="menuitem"
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-md ${
                  active
                    ? 'bg-accent/5 text-accent font-medium'
                    : 'text-text-primary hover:bg-bg-secondary'
                }`}
                onClick={() => pick(field.value)}
              >
                <span>{field.label}</span>
                {active && <span aria-hidden="true">{arrow}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
