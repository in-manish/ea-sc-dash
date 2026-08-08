import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Shield } from 'lucide-react';
import {
    MANAGE_USER_PERMISSIONS,
    ALL_PERMISSION_VALUES,
    isAllPermissionsSelected,
} from '../domain/permissions';

/**
 * Multi-select for manage-user permissions.
 * @param {boolean} [emptyMeansAll=false] When true (list filter), empty selection shows "All permissions".
 */
const PermissionMultiSelect = ({ selected, onChange, emptyMeansAll = false }) => {
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

    const allSelected = isAllPermissionsSelected(selected);
    const noneSelected = selected.length === 0;

    const summary = (() => {
        if (allSelected) return 'All permissions';
        if (noneSelected) return emptyMeansAll ? 'All permissions' : 'None selected';
        if (selected.length === 1) {
            const found = MANAGE_USER_PERMISSIONS.find((p) => p.value === selected[0]);
            return found?.label || selected[0];
        }
        return `${selected.length} selected`;
    })();

    const toggle = (value) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            >
                <span className="flex items-center gap-2 min-w-0">
                    <Shield size={14} className="text-accent shrink-0" />
                    <span className={`truncate font-medium ${noneSelected && !emptyMeansAll ? 'text-text-tertiary' : 'text-text-primary'}`}>
                        {summary}
                    </span>
                </span>
                <ChevronDown size={14} className={`text-text-tertiary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-30 mt-1.5 left-0 right-0 sm:right-auto sm:min-w-[280px] bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in">
                    <div className="flex items-center gap-2 p-2 border-b border-border bg-bg-secondary/50">
                        <button
                            type="button"
                            onClick={() => onChange([...ALL_PERMISSION_VALUES])}
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
                    <ul className="max-h-64 overflow-y-auto py-1">
                        {MANAGE_USER_PERMISSIONS.map(({ value, label }) => {
                            const checked = selected.includes(value);
                            return (
                                <li key={value}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(value)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                                            checked ? 'bg-accent/5 text-text-primary' : 'text-text-secondary hover:bg-bg-secondary'
                                        }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                                checked ? 'bg-accent border-accent text-white' : 'border-border bg-bg-primary'
                                            }`}
                                        >
                                            {checked && <Check size={11} strokeWidth={3} />}
                                        </span>
                                        <span className="flex-1 font-medium">{label}</span>
                                        <span className="text-[10px] font-mono text-text-tertiary">{value}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PermissionMultiSelect;
