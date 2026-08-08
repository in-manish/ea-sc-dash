import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Shield, Check } from 'lucide-react';
import {
    MANAGE_USER_PERMISSIONS,
    ALL_PERMISSION_VALUES,
    isAllPermissionsSelected,
} from '../domain/permissions';

/**
 * Replace user permissions via PUT /manage/users/:id/permissions/
 * Inline checklist (no nested dropdown) so the modal stays clean.
 */
const EditPermissionsModal = ({ isOpen, onClose, user, onSubmit, isSaving, serverError }) => {
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (isOpen && user) {
            setPermissions([...(user.permissions || [])]);
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const allSelected = isAllPermissionsSelected(permissions);
    const noneSelected = permissions.length === 0;

    const toggle = (value) => {
        setPermissions((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(permissions);
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-lg max-h-[min(90vh,640px)] flex flex-col rounded-2xl shadow-2xl border border-border animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-bg-secondary/40 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Shield size={18} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg font-bold text-text-primary">Edit Permissions</h3>
                            <p className="text-xs text-text-tertiary mt-0.5 truncate">
                                @{user.username}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    <div className="px-5 pt-4 pb-2 shrink-0 space-y-3">
                        {serverError && (
                            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                                {serverError}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                    Permissions
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg-secondary text-text-secondary border border-border">
                                    {permissions.length} / {ALL_PERMISSION_VALUES.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setPermissions([...ALL_PERMISSION_VALUES])}
                                    disabled={isSaving || allSelected}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-40"
                                >
                                    Select all
                                </button>
                                <span className="text-border">·</span>
                                <button
                                    type="button"
                                    onClick={() => setPermissions([])}
                                    disabled={isSaving || noneSelected}
                                    className="px-2.5 py-1 text-[11px] font-semibold text-text-secondary hover:bg-bg-secondary rounded-lg transition-colors disabled:opacity-40"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable checklist only */}
                    <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-2">
                        <ul className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-bg-secondary/20">
                            {MANAGE_USER_PERMISSIONS.map(({ value, label }) => {
                                const checked = permissions.includes(value);
                                return (
                                    <li key={value}>
                                        <button
                                            type="button"
                                            onClick={() => toggle(value)}
                                            disabled={isSaving}
                                            className={`w-full flex items-center gap-3 px-3.5 py-3 text-left transition-colors disabled:opacity-50 ${
                                                checked
                                                    ? 'bg-accent/[0.06] hover:bg-accent/10'
                                                    : 'hover:bg-bg-secondary/80'
                                            }`}
                                        >
                                            <span
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                                    checked
                                                        ? 'bg-accent border-accent text-white'
                                                        : 'border-border bg-bg-primary'
                                                }`}
                                            >
                                                {checked && <Check size={12} strokeWidth={3} />}
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className={`block text-sm font-semibold ${checked ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                    {label}
                                                </span>
                                                <span className="block text-[10px] font-mono text-text-tertiary mt-0.5">
                                                    {value}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-border bg-bg-secondary/20 shrink-0 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-text-secondary border border-border hover:bg-bg-primary transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-[1.5] py-2.5 px-4 rounded-xl text-sm font-semibold bg-accent text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Saving…' : 'Save permissions'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPermissionsModal;
