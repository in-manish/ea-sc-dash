import React, { useState, useEffect } from 'react';
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
    const [staffUsers, setStaffUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeOrgType, setActiveOrgType] = useState('print');
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

    const orgTypes = [
        { id: 'print', label: 'Printing', icon: Printer, description: 'Manage print booth staff' },
        { id: 'scan', label: 'Scanning', icon: QrCode, description: 'Manage entry/gate scanning staff' },
        { id: 'kiosk', label: 'Kiosk', icon: Monitor, description: 'Manage self-service kiosk staff' },
        { id: 'staff-readonly', label: 'Read Only', icon: Eye, description: 'Global read-only staff access' },
        { id: 'staff-writereadonly', label: 'Write Read-Only', icon: FileEdit, description: 'Event-scoped write & read-only staff' },
        { id: 'organizer', label: 'Organizer', icon: Crown, description: 'Full administrative access' },
    ];

    const fetchStaffUsers = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await userService.getStaffUsers(eventId, activeOrgType, token);
            setStaffUsers(data || []);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load staff users.' });
        } finally {
            setIsLoading(false);
        }
    }, [eventId, activeOrgType, token]);

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

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setUserForm({
                username: user.username || '',
                password: '',
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                country_code: user.country_code || '',
                org_type: activeOrgType
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
                org_type: activeOrgType
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
            const { org_type, ...payload } = userForm;
            const targetOrgType = editingUser ? activeOrgType : org_type;

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
                // If created under a different tab, switch to it
                if (targetOrgType !== activeOrgType) {
                    setActiveOrgType(targetOrgType);
                }
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

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this staff user?')) return;
        try {
            await userService.deleteStaffUser(eventId, activeOrgType, userId, token);
            setStaffUsers(prev => prev.filter(u => u.id !== userId));
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
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 btn btn-primary px-6 py-3 rounded-2xl shadow-premium hover:shadow-2xl transition-all duration-300 font-bold"
                >
                    <Plus size={18} />
                    Add Staff Member
                </button>
            </div>

            {/* Message Area - Fixed Toast Position to prevent jumping */}
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

            {/* Org Type Tabs - Premium Scrollable Container */}
            <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 scrollbar-hide no-scrollbar -mx-2 px-2">
                {orgTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setActiveOrgType(type.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 shrink-0 whitespace-nowrap group ${activeOrgType === type.id
                            ? 'bg-accent text-white border-accent shadow-premium shadow-accent/20'
                            : 'bg-bg-primary text-text-secondary border-border hover:border-accent/40 hover:bg-bg-tertiary'
                            }`}
                    >
                        <type.icon size={20} className={activeOrgType === type.id ? 'text-white' : 'text-text-tertiary group-hover:text-accent'} />
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-sm">{type.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-bg-primary border border-border rounded-[2rem] shadow-premium overflow-hidden mesh-bg relative min-h-[400px]">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />

                <div className="relative z-10 p-2 sm:p-4 md:p-6">
                    {/* List/Table view */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="animate-spin text-accent" size={40} />
                            <p className="text-text-tertiary font-black text-xs uppercase tracking-[0.2em]">Synchronizing Staff Data...</p>
                        </div>
                    ) : staffUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                            <div className="w-24 h-24 bg-bg-secondary/50 rounded-full flex items-center justify-center text-text-tertiary glass-premium">
                                <Search size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-text-primary">No Staff Users Found</h3>
                                <p className="text-text-secondary text-sm max-w-xs mx-auto">
                                    We couldn't find any staff members assigned to the <span className="text-accent font-bold">"{activeOrgType}"</span> category.
                                </p>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="btn btn-secondary px-8 py-3 rounded-xl font-bold text-sm border-2 border-border/50 hover:border-accent transition-all"
                            >
                                <Plus size={16} className="mr-2" /> Add First Member
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                            {staffUsers.map((user) => (
                                <div key={user.id} className="glass-premium hover:bg-white transition-all duration-500 rounded-[2rem] border border-white/50 p-6 flex flex-col justify-between group shadow-sm hover:shadow-premium hover:-translate-y-1">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 bg-accent/5 rounded-[1.5rem] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                                <UserCog size={28} />
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 text-text-tertiary hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-text-tertiary hover:text-danger hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-text-primary tracking-tight leading-none">{user.name || user.username}</h4>
                                            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{user.username}</p>
                                        </div>

                                        <div className="pt-4 space-y-2 border-t border-border/50">
                                            {user.email ? (
                                                <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                                                    <Mail size={14} className="text-text-tertiary" />
                                                    {user.email}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-text-tertiary italic flex items-center gap-1 opacity-50">
                                                    <Mail size={12} /> No email recorded
                                                </div>
                                            )}
                                            {(user.phone_number || user.country_code) ? (
                                                <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                                                    <Phone size={14} className="text-text-tertiary" />
                                                    {user.country_code ? `${user.country_code} ` : ''}{user.phone_number}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-text-tertiary italic flex items-center gap-1 opacity-50">
                                                    <Phone size={12} /> No phone recorded
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="px-3 py-1 rounded-full bg-accent/5 text-[10px] font-black text-accent uppercase tracking-[0.1em] border border-accent/10 w-fit">
                                                ID: {user.id}
                                            </span>
                                            <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest pl-1">
                                                Role: {orgTypes.find(t => t.id === activeOrgType)?.label}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                                            <Shield size={10} /> Active
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
