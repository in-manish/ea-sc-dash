import React, { useState, useEffect } from 'react';
import {
    X, Loader2, XCircle, Users, Mail, Phone, Building2, Shield, Hash, RefreshCw, Edit2, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getManageUser, updateManageUser, setManageUserPermissions } from '../api/manageUsersApi';
import { PERMISSION_LABEL_BY_VALUE } from '../domain/permissions';
import EditUserModal from './EditUserModal';
import EditPermissionsModal from './EditPermissionsModal';

const DetailRow = ({ label, value, mono = false, children }) => (
    <div className="py-3 border-b border-border last:border-0">
        <dt className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">{label}</dt>
        <dd className={`text-sm text-text-primary ${mono ? 'font-mono' : 'font-medium'}`}>
            {children ?? (value || <span className="text-text-tertiary italic">Not set</span>)}
        </dd>
    </div>
);

const formatPhone = (user) => {
    if (!user?.phone_number) return null;
    const cc = user.country_code ? `+${String(user.country_code).replace(/^\+/, '')} ` : '';
    return `${cc}${user.phone_number}`;
};

/**
 * Loads GET /manage/users/:id/ and shows detail + edit (PATCH profile/password).
 */
const UserDetailPanel = ({ userId, onClose, onUpdated }) => {
    const { token } = useAuth();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPermsOpen, setIsPermsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingPerms, setIsSavingPerms] = useState(false);
    const [editError, setEditError] = useState('');
    const [permsError, setPermsError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!userId || !token) return;
        let cancelled = false;

        (async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await getManageUser(token, userId);
                if (!cancelled) setUser(data);
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setUser(null);
                    setError(err.message || 'Failed to load user.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [userId, token, refreshKey]);

    useEffect(() => {
        if (!successMessage) return;
        const timer = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleUpdate = async (payload) => {
        setIsSaving(true);
        setEditError('');
        try {
            const updated = await updateManageUser(token, userId, payload);
            setUser(updated);
            setIsEditOpen(false);
            setSuccessMessage('User updated.');
            onUpdated?.(updated);
        } catch (err) {
            console.error(err);
            setEditError(err.message || 'Failed to update user.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePermissions = async (permissions) => {
        setIsSavingPerms(true);
        setPermsError('');
        try {
            const updated = await setManageUserPermissions(token, userId, permissions);
            setUser(updated);
            setIsPermsOpen(false);
            setSuccessMessage('Permissions updated.');
            onUpdated?.(updated);
        } catch (err) {
            console.error(err);
            setPermsError(err.message || 'Failed to update permissions.');
        } finally {
            setIsSavingPerms(false);
        }
    };

    if (!userId) return null;

    const phone = formatPhone(user);
    const altPhone = user?.alt_phone_number;

    return (
        <>
            <div className="bg-bg-primary border border-border rounded-2xl shadow-sm overflow-hidden animate-fade-in">
                <div className="p-5 border-b border-border bg-bg-secondary/30 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                            <Users size={22} />
                        </div>
                        <div className="min-w-0">
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-text-tertiary text-sm">
                                    <Loader2 size={16} className="animate-spin" />
                                    Loading user…
                                </div>
                            ) : user ? (
                                <>
                                    <h2 className="text-xl font-bold text-text-primary truncate">
                                        {user.name || user.username}
                                    </h2>
                                    <p className="text-sm text-text-tertiary font-mono mt-0.5">
                                        @{user.username}
                                        <span className="opacity-50 ml-2">#{user.id}</span>
                                    </p>
                                </>
                            ) : (
                                <h2 className="text-lg font-bold text-text-primary">User detail</h2>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {user && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => { setEditError(''); setIsEditOpen(true); }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10 rounded-lg transition-all"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setPermsError(''); setIsPermsOpen(true); }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                                >
                                    <Shield size={16} />
                                    Permissions
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => setRefreshKey((k) => k + 1)}
                            disabled={isLoading}
                            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all disabled:opacity-50"
                            title="Reload"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-all"
                            title="Close detail"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mx-5 mt-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
                        <XCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mx-5 mt-4 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0" />
                        {successMessage}
                    </div>
                )}

                {isLoading && !user ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-accent" size={28} />
                    </div>
                ) : user ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                        <div className="p-5">
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Hash size={14} />
                                Profile
                            </h3>
                            <dl>
                                <DetailRow label="ID" value={String(user.id)} mono />
                                <DetailRow label="UUID" value={user.uuid} mono />
                                <DetailRow label="Username" value={user.username} mono />
                                <DetailRow label="Name" value={user.name} />
                                <DetailRow label="Company">
                                    {user.company ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Building2 size={14} className="text-text-tertiary" />
                                            {user.company}
                                        </span>
                                    ) : null}
                                </DetailRow>
                                <DetailRow label="Status">
                                    {user.is_active ? (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-bg-tertiary text-text-tertiary">
                                            Inactive
                                        </span>
                                    )}
                                </DetailRow>
                            </dl>
                        </div>

                        <div className="p-5">
                            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Mail size={14} />
                                Contact & permissions
                            </h3>
                            <dl>
                                <DetailRow label="Email">
                                    {user.email ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail size={14} className="text-text-tertiary" />
                                            {user.email}
                                        </span>
                                    ) : null}
                                </DetailRow>
                                <DetailRow label="Alt email" value={user.alt_email} />
                                <DetailRow label="Phone">
                                    {phone ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone size={14} className="text-text-tertiary" />
                                            {phone}
                                        </span>
                                    ) : null}
                                </DetailRow>
                                <DetailRow label="Alt phone" value={altPhone} />
                                <DetailRow label="Permissions">
                                    {(user.permissions || []).length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                                            {user.permissions.map((perm) => (
                                                <span
                                                    key={perm}
                                                    title={perm}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent/5 text-accent border border-accent/15"
                                                >
                                                    <Shield size={10} />
                                                    {PERMISSION_LABEL_BY_VALUE[perm] || perm}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </DetailRow>
                            </dl>
                        </div>
                    </div>
                ) : null}
            </div>

            <EditUserModal
                isOpen={isEditOpen}
                user={user}
                onClose={() => { if (!isSaving) { setIsEditOpen(false); setEditError(''); } }}
                onSubmit={handleUpdate}
                isSaving={isSaving}
                serverError={editError}
            />

            <EditPermissionsModal
                isOpen={isPermsOpen}
                user={user}
                onClose={() => { if (!isSavingPerms) { setIsPermsOpen(false); setPermsError(''); } }}
                onSubmit={handleUpdatePermissions}
                isSaving={isSavingPerms}
                serverError={permsError}
            />
        </>
    );
};

export default UserDetailPanel;
