import { useEffect, useRef, useState } from 'react';
import { Check, Columns3 } from 'lucide-react';
import { EXTRA_COLUMN_GROUPS } from '../domain/tableColumns';

function FieldChip({ label, checked, onToggle }) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={onToggle}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs text-left transition-colors ${
                checked
                    ? 'border-accent bg-bg-secondary text-text-primary font-medium'
                    : 'border-border text-text-secondary hover:border-text-tertiary'
            }`}
        >
            <span
                className={`w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center ${
                    checked ? 'bg-accent border-accent text-accent-text' : 'border-border'
                }`}
            >
                {checked && <Check size={10} strokeWidth={3} />}
            </span>
            {label}
        </button>
    );
}

/** Pick extra row fields. Built-in columns are not in this list. */
export default function AttendeeColumnPicker({
    selected,
    onChange,
    groups = EXTRA_COLUMN_GROUPS,
    hint = 'Name, contact, company, permissions, type, and status stay. Choose more fields to add as their own cells.',
}) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const close = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const toggle = (key) => {
        onChange(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]);
    };

    return (
        <div className="relative" ref={boxRef}>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm font-medium transition-colors ${
                    selected.length
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border bg-bg-primary text-text-primary hover:bg-bg-secondary'
                }`}
            >
                <Columns3 size={15} />
                Columns{selected.length ? ` (${selected.length})` : ''}
            </button>
            {open && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-40 w-[22rem] max-h-[28rem] overflow-y-auto bg-bg-primary border border-border rounded-lg shadow-lg p-3">
                    <p className="m-0 mb-3 text-xs text-text-tertiary">
                        {hint}
                    </p>
                    <div className="flex flex-col gap-3">
                        {groups.map((group) => (
                            <div key={group.title}>
                                <span className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                                    {group.title}
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {group.fields.map((field) => (
                                        <FieldChip
                                            key={field.key}
                                            label={field.label}
                                            checked={selected.includes(field.key)}
                                            onToggle={() => toggle(field.key)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {selected.length > 0 && (
                        <button
                            type="button"
                            className="mt-3 text-xs font-medium text-text-secondary bg-transparent border-none p-0 cursor-pointer hover:text-text-primary"
                            onClick={() => onChange([])}
                        >
                            Clear extra columns
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
