import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

const TableHeaderFilterDropdown = ({
    label,
    options = [],
    selected = [],
    onChange,
    multiSelect = true,
    loading = false,
}) => {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const selectedValues = useMemo(
        () => (Array.isArray(selected) ? selected : selected ? [selected] : []).map(String),
        [selected],
    );

    useEffect(() => {
        if (!open) return undefined;
        const onDoc = (e) => {
            const t = e.target;
            if (buttonRef.current?.contains(t) || menuRef.current?.contains(t)) return;
            setOpen(false);
        };
        document.addEventListener('pointerdown', onDoc);
        return () => document.removeEventListener('pointerdown', onDoc);
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const place = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;
            const width = 288;
            const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
            setMenuStyle({ top: rect.bottom + 8, left, width });
        };
        place();
        const onScroll = (e) => {
            if (menuRef.current?.contains(e.target)) return;
            place();
        };
        window.addEventListener('resize', place);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, [open]);

    const hasActive = selectedValues.length > 0;

    const toggleOption = (value) => {
        const id = String(value);
        if (multiSelect) {
            const next = selectedValues.includes(id)
                ? selectedValues.filter((item) => item !== id)
                : [...selectedValues, id];
            onChange(next);
            return;
        }
        onChange(selectedValues.includes(id) ? [] : [id]);
        setOpen(false);
    };

    const menu = open && menuStyle
        ? createPortal(
            <div
                ref={menuRef}
                className="fixed z-[200] bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden normal-case font-normal"
                style={menuStyle}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {multiSelect && options.length > 0 && (
                    <div className="flex items-center gap-2 p-2 border-b border-border bg-bg-secondary/50">
                        <button
                            type="button"
                            onClick={() => onChange(options.map((o) => String(o.value)))}
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
                            const id = String(value);
                            const checked = selectedValues.includes(id);
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleOption(id)}
                                        className={`w-full flex items-start gap-3 px-3 py-2 text-sm text-left transition-colors ${
                                            checked ? 'bg-accent/5 text-text-primary' : 'text-text-secondary hover:bg-bg-secondary'
                                        }`}
                                    >
                                        <span
                                            className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border transition-colors ${multiSelect ? 'rounded' : 'rounded-full'} ${
                                                checked ? 'bg-accent border-accent text-white' : 'border-border bg-bg-primary'
                                            }`}
                                        >
                                            {checked && <Check size={11} strokeWidth={3} />}
                                        </span>
                                        <span className="flex-1 font-medium whitespace-normal leading-snug">{optLabel}</span>
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
            </div>,
            document.body,
        )
        : null;

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
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
                        {selectedValues.length}
                    </span>
                )}
            </button>
            {menu}
        </div>
    );
};

export default TableHeaderFilterDropdown;
