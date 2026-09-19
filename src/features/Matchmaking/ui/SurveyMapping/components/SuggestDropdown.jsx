import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Search, X } from 'lucide-react';

function matchesQuery(option, query) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [option.name, option.id, option.group]
        .filter((v) => v != null)
        .some((v) => String(v).toLowerCase().includes(q));
}

function rankOption(option, preferredName) {
    const name = String(option.name || '').toLowerCase();
    const preferred = String(preferredName || '').toLowerCase().trim();
    if (!preferred) return 2;
    if (name === preferred) return 0;
    if (name.includes(preferred) || preferred.includes(name)) return 1;
    return 2;
}

const SuggestDropdown = ({ options = [], value, onChange, placeholder = 'Type to find a value...', preferredName }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const rootRef = useRef(null);
    const selected = options.find((opt) => opt.id === value || String(opt.id) === String(value));

    const filtered = useMemo(
        () => options
            .filter((opt) => matchesQuery(opt, query))
            .sort((a, b) => rankOption(a, preferredName) - rankOption(b, preferredName)),
        [options, query, preferredName],
    );

    useEffect(() => {
        const onDoc = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const pick = (id) => {
        onChange(id);
        setQuery('');
        setOpen(false);
    };

    return (
        <div className="relative" ref={rootRef}>
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
                type="text"
                className="w-full bg-white border border-border rounded-xl pl-8 pr-8 py-2 text-[12px] font-medium outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                placeholder={selected ? selected.name : placeholder}
                value={open ? query : (selected?.name || '')}
                onFocus={() => {
                    setQuery('');
                    setOpen(true);
                }}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && filtered[0]) {
                        e.preventDefault();
                        pick(filtered[0].id);
                    }
                    if (e.key === 'Escape') setOpen(false);
                }}
            />
            {selected && !open && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                    onClick={() => onChange('')}
                    title="Clear"
                >
                    <X size={13} />
                </button>
            )}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border shadow-lg rounded-xl overflow-hidden z-[100] max-h-[220px] overflow-y-auto custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-3 text-[11px] text-text-tertiary italic">No matching values</div>
                    ) : filtered.map((option) => {
                        const active = String(option.id) === String(value);
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => pick(option.id)}
                                className={`w-full px-3 py-2 text-left text-[12px] font-semibold flex items-center justify-between hover:bg-accent/5 ${
                                    active ? 'bg-accent/10 text-accent' : 'text-text-primary'
                                }`}
                            >
                                <span className="leading-snug pr-2">{option.name}</span>
                                {active && <CheckCircle2 size={14} className="text-accent shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SuggestDropdown;
