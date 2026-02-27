import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import {
    Loader2, Users, Plus, Trash2, Edit2, AlertCircle, X,
    UserCog, Search, Filter, Shield, ShieldCheck, Mail, Phone,
    Save, Key, UserCheck, ShieldAlert, ShieldAlert as OrganizerIcon,
    Printer, QrCode, Monitor, Eye, FileEdit, Crown
} from 'lucide-react';

const UserManagement = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();

    // States
    const [staffUsers, setStaffUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone_number: '',
        country_code: '',
        org_type: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const orgTypes = useMemo(() => [
        { id: 'print', label: 'Printing', icon: Printer, description: 'Manage print booth staff' },
        { id: 'scan', label: 'Scanning', icon: QrCode, description: 'Manage entry/gate scanning staff' },
        { id: 'kiosk', label: 'Kiosk', icon: Monitor, description: 'Manage self-service kiosk staff' },
        { id: 'staff-readonly', label: 'Read Only', icon: Eye, description: 'Global read-only staff access' },
        { id: 'staff-writereadonly', label: 'Write Read-Only', icon: FileEdit, description: 'Event-scoped write & read-only staff' },
        { id: 'organizer', label: 'Organizer', icon: Crown, description: 'Full administrative access' },
    ], []);

    const fetchStaffUsers = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const promises = orgTypes.map(type =>
                userService.getStaffUsers(eventId, type.id, token)
                    .then(data => ({ [type.id]: data || [] }))
                    .catch(err => {
                        console.error(`Failed to load ${type.label} users`, err);
                        return { [type.id]: [] };
                    })
            );

            const results = await Promise.all(promises);
            const newStaffUsers = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setStaffUsers(newStaffUsers);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load staff users.' });
        } finally {
            setIsLoading(false);
        }
    }, [eventId, token, orgTypes]);

    useEffect(() => {
        if (eventId && token) {
            fetchStaffUsers();
        }
    }, [eventId, token, fetchStaffUsers]);

    // Auto-clear message
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleOpenModal = (user = null, orgType = 'print') => {
        if (user) {
            setEditingUser(user);
            setUserForm({
                username: user.username || '',
                password: '',
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                country_code: user.country_code || '',
                org_type: orgType
            });
        } else {
            setEditingUser(null);
            setUserForm({
                username: '',
                password: '',
                name: '',
                email: '',
                phone_number: '',
                country_code: '',
                org_type: orgType
            });
        }
        setIsEditModalOpen(true);
        setMessage({ type: '', text: '' });
    };

    const handleSaveUser = async () => {
        if (!userForm.username.trim()) {
            setMessage({ type: 'error', text: 'Username is required.' });
            return;
        }
        if (!editingUser && !userForm.password.trim()) {
            setMessage({ type: 'error', text: 'Password is required for new users.' });
            return;
        }

        setIsSaving(true);
        try {
            const { org_type: _orgType, ...payload } = userForm;
            const targetOrgType = userForm.org_type;

            if (editingUser) {
                // For updates, password is optional
                if (!payload.password.trim()) {
                    delete payload.password;
                }
                await userService.updateStaffUser(eventId, targetOrgType, editingUser.id, token, payload);
                setMessage({ type: 'success', text: 'Staff user updated successfully.' });
            } else {
                await userService.createStaffUser(eventId, targetOrgType, token, payload);
                setMessage({ type: 'success', text: 'Staff user created successfully.' });
            }
            setIsEditModalOpen(false);
            fetchStaffUsers();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to save staff user.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = async (userId, orgType) => {
        if (!window.confirm('Are you sure you want to delete this staff user?')) return;
        try {
            await userService.deleteStaffUser(eventId, orgType, userId, token);
            setStaffUsers(prev => ({
                ...prev,
                [orgType]: prev[orgType].filter(u => u.id !== userId)
            }));
            setMessage({ type: 'success', text: 'Staff user deleted successfully.' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to delete staff user.' });
        }
    };

    return (
        <div className="animate-fade-in w-full space-y-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Staff Management</h1>
                    <p className="text-text-secondary font-medium">Create and manage access for event staff members</p>
                </div>
            </div>

            {/* Message Area */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 min-w-[320px] max-w-[420px]">
                {message.text && (
                    <div className={`p-4 rounded-2xl border animate-slide-up flex justify-between items-center glass-premium shadow-2xl ${message.type === 'success'
                        ? 'bg-green-50/90 text-green-800 border-green-200/50'
                        : 'bg-red-50/90 text-red-800 border-red-200/50'
                        }`}>
                        <div className="flex items-center gap-3 font-bold text-sm">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {message.type === 'success' ? <UserCog size={16} /> : <AlertCircle size={16} />}
                            </div>
                            {message.text}
                        </div>
                        <button onClick={() => setMessage({ type: '', text: '' })} className="hover:bg-black/5 p-2 rounded-xl transition-colors shrink-0">
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area - Stacked Sections */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="bg-bg-primary border border-border rounded-[2rem] shadow-premium p-12 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="animate-spin text-accent" size={40} />
                        <p className="text-text-tertiary font-black text-xs uppercase tracking-[0.2em]">Synchronizing Staff Data...</p>
                    </div>
                ) : (
                    orgTypes.map((orgType) => {
                        const users = staffUsers[orgType.id] || [];
                        return (
                            <div key={orgType.id} className="bg-bg-primary border border-border rounded-[2rem] shadow-premium overflow-hidden mesh-bg relative">
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />

                                <div className="relative z-10 p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-accent/5 rounded-2xl text-accent">
                                                <orgType.icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-text-primary">{orgType.label}</h3>
                                                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wide">{orgType.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenModal(null, orgType.id)}
                                            className="btn btn-secondary px-4 py-2 rounded-xl font-bold text-xs border-2 border-border/50 hover:border-accent transition-all flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Add {orgType.label} User
                                        </button>
                                    </div>

                                    {users.length === 0 ? (
                                        <div className="py-8 text-center border-2 border-dashed border-border rounded-2xl bg-bg-secondary/30">
                                            <p className="text-text-tertiary text-sm font-medium">No users found for {orgType.label}</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                                            {users.map((user) => (
                                                <div key={user.id} className="glass-premium hover:bg-white transition-all duration-300 rounded-2xl border border-white/50 p-4 flex flex-col justify-between group shadow-sm hover:shadow-md">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                                                <UserCog size={20} />
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleOpenModal(user, orgType.id)}
                                                                    className="p-1.5 text-text-tertiary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                                                                    title="Edit User"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id, orgType.id)}
                                                                    className="p-1.5 text-text-tertiary hover:text-danger hover:bg-red-50 rounded-lg transition-all"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-0.5">
                                                            <h4 className="text-sm font-black text-text-primary tracking-tight">{user.name || user.username}</h4>
                                                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{user.username}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                                                            ID: {user.id}
                                                        </span>
                                                        <span className="text-[9px] font-black text-success uppercase tracking-widest flex items-center gap-1">
                                                            <Shield size={8} /> Active
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal - Create/Edit Staff User */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-md animate-fade-in" onClick={() => !isSaving && setIsEditModalOpen(false)} />

                    <div className="relative bg-bg-primary rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-float-slow mesh-bg border border-white/50 my-auto">
                        <div className="p-8 space-y-8 relative z-10">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-text-primary tracking-tight">
                                        {editingUser ? 'Update Staff Member' : 'New Staff Access'}
                                    </h3>
                                    <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Shield size={12} className="text-accent" /> Authentication Portal
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-bg-tertiary rounded-2xl transition-all text-text-tertiary hover:text-text-primary"
                                    disabled={isSaving}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Access Permission (Role) <span className="text-danger">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <select
                                            value={userForm.org_type}
                                            onChange={(e) => setUserForm({ ...userForm, org_type: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                                            disabled={isSaving || editingUser}
                                        >
                                            {orgTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                            <Filter size={14} />
                                        </div>
                                    </div>
                                    {editingUser && (
                                        <p className="text-[10px] text-text-tertiary font-bold px-1 italic">Role cannot be changed while editing. Please delete and recreate for a new role.</p>
                                    )}
                                </div>

                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Login Username <span className="text-danger">*</span></label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors">
                                            <Users size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={userForm.username}
                                            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                            placeholder="e.g. staff_print_01"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">
                                        {editingUser ? 'New Password (Optional)' : 'Secret Password'} <span className="text-danger">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors">
                                            <Key size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={userForm.password}
                                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                            placeholder="••••••••"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    {editingUser && (
                                        <p className="text-[10px] text-text-tertiary font-bold px-1 italic">Leave blank to keep current password</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                        placeholder="Full Name"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                        placeholder="email@example.com"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Country Code</label>
                                    <input
                                        type="text"
                                        value={userForm.country_code}
                                        onChange={(e) => setUserForm({ ...userForm, country_code: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                        placeholder="+91"
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={userForm.phone_number}
                                        onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-secondary/50 border-2 border-border/50 rounded-2xl text-sm font-bold focus:outline-none focus:border-accent focus:bg-white transition-all shadow-inner"
                                        placeholder="1234567890"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-widest text-text-secondary hover:bg-bg-tertiary transition-all border border-border"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="flex-[2] py-4 px-6 bg-accent text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-premium shadow-accent/20"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    {editingUser ? 'Apply Changes' : 'Initialize Access'}
                                </button>
                            </div>
                        </div>

                        {/* Interactive bar at bottom */}
                        <div className="h-2 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
                    </div>
                </div>
            )}

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                @keyframes float-slow {
                    0% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-10px) scale(1.01); }
                    100% { transform: translateY(0px) scale(1); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default UserManagement;
