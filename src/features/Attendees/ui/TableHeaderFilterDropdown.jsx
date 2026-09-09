import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Clickable column header that opens a dropdown of selectable options.
 * Supports multi-select (checkboxes, Select all/Clear) or single-select
 * (picking an option immediately applies it and closes the dropdown).
 */
const TableHeaderFilterDropdown = ({
    label,
    options = [],
    selected = [],
    onChange,
    multiSelect = true,
    loading = false,
}) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    const hasActive = selected.length > 0;

    const toggleOption = (value) => {
        if (multiSelect) {
            const next = selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value];
            onChange(next);
        } else {
            onChange(selected.includes(value) ? [] : [value]);
            setOpen(false);
        }
    };

    return (
        <div className="relative inline-block" ref={rootRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((v) => !v);
                }}
                className={`flex items-center gap-1 bg-transparent border-none p-0 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${hasActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
            >
                {label}
                <ChevronDown size={12} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                {hasActive && (
                    <span className="inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full bg-accent text-white text-[9px] font-bold normal-case">
                        {selected.length}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute z-30 mt-2 left-0 min-w-[200px] bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden normal-case font-normal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {multiSelect && options.length > 0 && (
                        <div className="flex items-center gap-2 p-2 border-b border-border bg-bg-secondary/50">
                            <button
                                type="button"
                                onClick={() => onChange(options.map((o) => o.value))}
                                className="flex-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-accent/10 text-accent hover:bg-accent/15 transition-colors"
                            >
                                Select all
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="flex-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-bg-tertiary text-text-secondary hover:bg-border transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                    <ul className="max-h-64 overflow-y-auto py-1">
                        {loading && <li className="px-3 py-2 text-xs text-text-tertiary">Loading…</li>}
                        {!loading && options.length === 0 && (
                            <li className="px-3 py-2 text-xs text-text-tertiary">No options available</li>
                        )}
                        {!loading &&
                            options.map(({ value, label: optLabel }) => {
                                const checked = selected.includes(value);
                                return (
                                    <li key={value}>
                                        <button
                                            type="button"
                                            onClick={() => toggleOption(value)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                                                checked ? 'bg-accent/5 text-text-primary' : 'text-text-secondary hover:bg-bg-secondary'
                                            }`}
                                        >
                                            <span
                                                className={`w-4 h-4 shrink-0 flex items-center justify-center border transition-colors ${multiSelect ? 'rounded' : 'rounded-full'} ${
                                                    checked ? 'bg-accent border-accent text-white' : 'border-border bg-bg-primary'
                                                }`}
                                            >
                                                {checked && <Check size={11} strokeWidth={3} />}
                                            </span>
                                            <span className="flex-1 font-medium">{optLabel}</span>
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                    {!multiSelect && hasActive && (
                        <div className="p-2 border-t border-border bg-bg-secondary/50">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange([]);
                                    setOpen(false);
                                }}
                                className="w-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-bg-tertiary text-text-secondary hover:bg-border transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TableHeaderFilterDropdown;
