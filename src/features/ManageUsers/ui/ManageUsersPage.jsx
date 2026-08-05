import React, { useState, useEffect } from 'react';
import {
    Loader2, Users, Search, Filter, RefreshCw, X, XCircle, Plus,
    Mail, Phone, Building2, Shield, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useManageUsers } from '../hooks/useManageUsers';
import { createManageUser } from '../api/manageUsersApi';
import PermissionMultiSelect from './PermissionMultiSelect';
import CreateUserModal from './CreateUserModal';
import UserDetailPanel from './UserDetailPanel';
import { PERMISSION_LABEL_BY_VALUE, isAllPermissionsSelected } from '../domain/permissions';

const formatPhone = (user) => {
    if (!user.phone_number) return null;
    const cc = user.country_code ? `+${String(user.country_code).replace(/^\+/, '')} ` : '';
    return `${cc}${user.phone_number}`;
};

const ManageUsersPage = () => {
    const { token } = useAuth();
    const {
        users,
        total,
        totalPages,
        isLoading,
        error,
        setError,
        filters,
        searchInput,
        setSearchInput,
        setFilter,
        setPermissions,
        setPage,
        clearFilters,
        hasActiveFilters,
        refresh,
    } = useManageUsers();

    const [showAdvanced, setShowAdvanced] = useState(
        Boolean(filters.email || filters.phone_number || filters.username)
    );
    const [advDraft, setAdvDraft] = useState({
        email: filters.email,
        phone_number: filters.phone_number,
        username: filters.username,
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        setAdvDraft({
            email: filters.email,
            phone_number: filters.phone_number,
            username: filters.username,
        });
    }, [filters.email, filters.phone_number, filters.username]);

    useEffect(() => {
        const timer = setTimeout(() => {
            (['email', 'phone_number', 'username']).forEach((key) => {
                const next = (advDraft[key] || '').trim();
                const current = (filters[key] || '').trim();
                if (next !== current) setFilter(key, next);
            });
        }, 350);
        return () => clearTimeout(timer);
    }, [advDraft]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!successMessage) return;
        const timer = setTimeout(() => setSuccessMessage(''), 4000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleCreateUser = async (payload) => {
        setIsCreating(true);
        setCreateError('');
        try {
            const created = await createManageUser(token, payload);
            setIsCreateOpen(false);
            setSuccessMessage(`User ${created.username || payload.username} created.`);
            refresh();
        } catch (err) {
            console.error(err);
            setCreateError(err.message || 'Failed to create user.');
        } finally {
            setIsCreating(false);
        }
    };

    const removePermissionFilter = (value) => {
        setPermissions(filters.permissions.filter((p) => p !== value));
    };

    // Always show selected permission pills so filters are visible and individually removable
    const showPermissionChips = filters.permissions.length > 0;

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Manage Users</h1>
                    <p className="text-text-secondary text-sm">All user types for organizers</p>
                </div>
                <div className="flex items-center gap-3 self-start">
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-all disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => { setCreateError(''); setIsCreateOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/20"
                    >
                        <Plus size={16} />
                        Create User
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-3">
                    <XCircle size={18} className="shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button type="button" onClick={() => setError(null)} className="p-1 hover:bg-danger/20 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-3">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span className="flex-1">{successMessage}</span>
                    <button type="button" onClick={() => setSuccessMessage('')} className="p-1 hover:bg-success/20 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="bg-bg-primary border border-border rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search name, email, phone, username…"
                            className="w-full pl-10 pr-3 py-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div className="lg:w-[280px]">
                        <PermissionMultiSelect
                            selected={filters.permissions}
                            onChange={setPermissions}
                            emptyMeansAll
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAdvanced((v) => !v)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                            showAdvanced || filters.email || filters.phone_number || filters.username
                                ? 'bg-accent/5 border-accent text-accent'
                                : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'
                        }`}
                    >
                        <Filter size={16} />
                        More
                        <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-3 bg-bg-tertiary text-text-primary rounded-xl text-sm font-semibold hover:bg-border transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {showPermissionChips && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60 mt-1">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mr-0.5">
                            {isAllPermissionsSelected(filters.permissions) ? 'Permissions' : 'Filtering'}
                        </span>
                        {filters.permissions.map((perm) => (
                            <button
                                key={perm}
                                type="button"
                                onClick={() => removePermissionFilter(perm)}
                                title={`Remove ${PERMISSION_LABEL_BY_VALUE[perm] || perm}`}
                                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg text-xs font-semibold bg-accent/5 text-accent border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-colors group"
                            >
                                <Shield size={11} className="shrink-0 opacity-70" />
                                <span>{PERMISSION_LABEL_BY_VALUE[perm] || perm}</span>
                                <span className="p-0.5 rounded-md text-accent/70 group-hover:text-accent group-hover:bg-accent/15 transition-colors">
                                    <X size={12} strokeWidth={2.5} />
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {showAdvanced && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Email</span>
                            <input
                                type="text"
                                value={advDraft.email}
                                onChange={(e) => setAdvDraft((d) => ({ ...d, email: e.target.value }))}
                                placeholder="Match email or alt"
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Phone</span>
                            <input
                                type="text"
                                value={advDraft.phone_number}
                                onChange={(e) => setAdvDraft((d) => ({ ...d, phone_number: e.target.value }))}
                                placeholder="Match phone or alt"
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Username</span>
                            <input
                                type="text"
                                value={advDraft.username}
                                onChange={(e) => setAdvDraft((d) => ({ ...d, username: e.target.value }))}
                                placeholder="Exact username"
                                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </label>
                    </div>
                )}
            </div>

            {selectedUserId && (
                <UserDetailPanel
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onUpdated={() => refresh()}
                />
            )}

            <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary/50 border-b border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Phone</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Company</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Permissions</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-12 text-text-secondary">
                                        <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12">
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center text-text-tertiary">
                                                <Users size={20} />
                                            </div>
                                            <p className="text-sm font-semibold text-text-primary">No users found</p>
                                            <p className="text-xs text-text-tertiary">
                                                {hasActiveFilters
                                                    ? 'Try adjusting search or filters.'
                                                    : 'No users to display yet.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const phone = formatPhone(user);
                                    const isSelected = selectedUserId === user.id;
                                    return (
                                        <tr
                                            key={user.id}
                                            onClick={() => setSelectedUserId(user.id)}
                                            className={`cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-accent/5 hover:bg-accent/10'
                                                    : 'hover:bg-bg-secondary/40'
                                            }`}
                                        >
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-accent/5 text-accent flex items-center justify-center shrink-0">
                                                        <Users size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-sm text-text-primary truncate">
                                                            {user.name || user.username}
                                                        </div>
                                                        <div className="text-[11px] text-text-tertiary font-mono mt-0.5 truncate">
                                                            @{user.username}
                                                            <span className="opacity-40 ml-1.5">#{user.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                {user.email ? (
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                            <Mail size={13} className="text-text-tertiary shrink-0" />
                                                            <span className="truncate max-w-[200px]">{user.email}</span>
                                                        </div>
                                                        {user.alt_email && (
                                                            <div className="text-[11px] text-text-tertiary pl-5 truncate max-w-[200px]">
                                                                {user.alt_email}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                {phone ? (
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                            <Phone size={13} className="text-text-tertiary shrink-0" />
                                                            <span>{phone}</span>
                                                        </div>
                                                        {user.alt_phone_number && (
                                                            <div className="text-[11px] text-text-tertiary pl-5">
                                                                {user.alt_phone_number}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                {user.company ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                        <Building2 size={13} className="text-text-tertiary shrink-0" />
                                                        <span className="truncate max-w-[140px]">{user.company}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(user.permissions || []).length > 0 ? (
                                                        user.permissions.map((perm) => (
                                                            <span
                                                                key={perm}
                                                                title={perm}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent/5 text-accent border border-accent/15"
                                                            >
                                                                <Shield size={10} />
                                                                {PERMISSION_LABEL_BY_VALUE[perm] || perm}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider italic">None</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-bg-tertiary text-text-tertiary">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs text-text-tertiary">
                    {total > 0
                        ? `Showing ${((filters.page - 1) * filters.size) + 1}–${Math.min(filters.page * filters.size, total)} of ${total}`
                        : '0 users'}
                </p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={filters.page <= 1 || isLoading}
                        onClick={() => setPage(filters.page - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-text-secondary">
                        Page {filters.page} of {totalPages}
                    </span>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={filters.page >= totalPages || isLoading || total === 0}
                        onClick={() => setPage(filters.page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => { if (!isCreating) { setIsCreateOpen(false); setCreateError(''); } }}
                onSubmit={handleCreateUser}
                isSaving={isCreating}
                serverError={createError}
            />
        </div>
    );
};

export default ManageUsersPage;
