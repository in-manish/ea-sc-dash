import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, UserPlus } from 'lucide-react';
import PermissionMultiSelect from './PermissionMultiSelect';

const emptyForm = () => ({
    username: '',
    password: '',
    name: '',
    email: '',
    phone_number: '',
    country_code: '91',
    company: '',
    permissions: [],
});

const CreateUserModal = ({ isOpen, onClose, onSubmit, isSaving, serverError }) => {
    const [form, setForm] = useState(emptyForm());
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setForm(emptyForm());
            setLocalError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        const username = form.username.trim();
        const password = form.password;
        const email = form.email.trim();
        const phone_number = form.phone_number.trim();

        if (!username) {
            setLocalError('Username is required.');
            return;
        }
        if (!password) {
            setLocalError('Password is required.');
            return;
        }
        if (!email && !phone_number) {
            setLocalError('Email or phone number is required.');
            return;
        }

        const payload = {
            username,
            password,
            permissions: form.permissions,
        };
        if (form.name.trim()) payload.name = form.name.trim();
        if (email) payload.email = email;
        if (phone_number) payload.phone_number = phone_number;
        if (form.country_code.trim()) payload.country_code = form.country_code.trim().replace(/^\+/, '');
        if (form.company.trim()) payload.company = form.company.trim();

        onSubmit(payload);
    };

    const displayError = localError || serverError;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border animate-slide-up">
                <div className="p-5 border-b border-border flex justify-between items-center bg-bg-secondary/30 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                            <UserPlus size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">Create User</h3>
                            <p className="text-xs text-text-tertiary mt-0.5">Username, password, and email or phone required</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className="p-5 space-y-4" onSubmit={handleSubmit}>
                    {displayError && (
                        <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                            {displayError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                Username <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                autoComplete="off"
                                value={form.username}
                                onChange={(e) => setField('username', e.target.value)}
                                placeholder="jane.org"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={(e) => setField('password', e.target.value)}
                                placeholder="••••••••"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Display name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                placeholder="Jane Doe"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setField('email', e.target.value)}
                                placeholder="jane@example.com"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Company</label>
                            <input
                                type="text"
                                value={form.company}
                                onChange={(e) => setField('company', e.target.value)}
                                placeholder="Acme"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Country code</label>
                            <input
                                type="text"
                                value={form.country_code}
                                onChange={(e) => setField('country_code', e.target.value)}
                                placeholder="91"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Phone number</label>
                            <input
                                type="text"
                                value={form.phone_number}
                                onChange={(e) => setField('phone_number', e.target.value)}
                                placeholder="9876543210"
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                Initial permissions
                            </label>
                            <PermissionMultiSelect
                                selected={form.permissions}
                                onChange={(permissions) => setField('permissions', permissions)}
                            />
                            <p className="text-[10px] text-text-tertiary">Optional. Leave empty for none, or pick one or more.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-text-secondary border border-border hover:bg-bg-secondary transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-[2] py-3 px-4 rounded-xl text-sm font-semibold bg-accent text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Creating…' : 'Create user'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
