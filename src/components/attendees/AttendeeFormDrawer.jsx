import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2, User, Search, Trash2, Save, Contact, CheckCircle2 } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

const defaultFormState = {
    name: '',
    email: '',
    country_code: '91',
    phone_number: '',
    designation: '',
    company: '',
    company_address: '',
    city: '',
    state: '',
    country: '',
    website: '',
    attendee_type: '',
    reg_type: 'ON_SPOT',
    override_name: '',
    evc_id: null,
    is_verified_email: false,
    is_verified_phone_number: false,
    updated_at_from_snapcard: null,
};

const AttendeeFormDrawer = ({ isOpen, onClose, attendee, onSubmit, isSubmitting, attendeeTypes }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState(defaultFormState);
    const [errors, setErrors] = useState({});
    
    // Snapcard specific states
    const [isSnapcardLinked, setIsSnapcardLinked] = useState(false);
    const [snapcardSearchResults, setSnapcardSearchResults] = useState([]);
    const [isSearchingSnapcard, setIsSearchingSnapcard] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (attendee) {
                let typeName = '';
                if (typeof attendee.attendee_type === 'string') {
                    typeName = attendee.attendee_type;
                } else if (attendee.attendee_type?.name) {
                    typeName = attendee.attendee_type.name;
                }

                setFormData({
                    name: attendee.name || '',
                    email: attendee.email || '',
                    country_code: attendee.country_code || '91',
                    phone_number: attendee.phone_number || '',
                    designation: attendee.designation || '',
                    company: attendee.company || '',
                    company_address: attendee.company_address || '',
                    city: attendee.city || '',
                    state: attendee.state || '',
                    country: attendee.country || '',
                    website: attendee.website || '',
                    attendee_type: typeName || '',
                    reg_type: attendee.reg_type || 'ON_SPOT',
                    override_name: attendee.override_name || '',
                    evc_id: attendee.evc_id || null,
                    is_verified_email: attendee.is_verified_email || false,
                    is_verified_phone_number: attendee.is_verified_phone_number || false,
                    updated_at_from_snapcard: attendee.updated_at_from_snapcard || null,
                });
                
                // Assume linked if there is an email and evc_id or just email
                if (attendee.email || attendee.evc_id) {
                    setIsSnapcardLinked(true);
                } else {
                    setIsSnapcardLinked(false);
                }
            } else {
                setFormData(defaultFormState);
                setIsSnapcardLinked(false);
            }
            setErrors({});
            setSnapcardSearchResults([]);
            setSyncError('');
            setIsSyncing(false);
        }
    }, [isOpen, attendee]);

    // Auto-search for SnapCard users when email or phone number is fully entered
    useEffect(() => {
        if (!isOpen || isSnapcardLinked) return;

        const emailVal = formData.email;
        const phoneVal = formData.phone_number;
        const isEmailComplete = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
        const isPhoneComplete = phoneVal && phoneVal.toString().length >= 10;

        if (isEmailComplete || isPhoneComplete) {
            const searchParams = {};
            if (isEmailComplete) searchParams.email = emailVal;
            if (isPhoneComplete) searchParams.phone_number = phoneVal.toString();
            
            const fetchSnapcardUsers = async () => {
                setIsSearchingSnapcard(true);
                try {
                    const response = await eventService.searchSnapcardUsers(token, searchParams);
                    setSnapcardSearchResults(response.results || []);
                } catch (err) {
                    console.error("Failed to search Snapcard users", err);
                } finally {
                    setIsSearchingSnapcard(false);
                }
            };

            const timerId = setTimeout(() => {
                fetchSnapcardUsers();
            }, 300);

            return () => clearTimeout(timerId);
        } else {
            setSnapcardSearchResults([]);
        }
    }, [formData.email, formData.phone_number, token, isOpen, isSnapcardLinked]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleLinkSnapcard = (user) => {
        setFormData(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone_number: user.phone_number || prev.phone_number,
            country_code: user.country_code || prev.country_code,
            evc_id: user.evc_id || user.id,
            is_verified_email: user.is_verified_email || false,
            is_verified_phone_number: user.is_verified_phone_number || false,
            updated_at_from_snapcard: user.updated_at_from_snapcard || null,
        }));
        setIsSnapcardLinked(true);
        setSnapcardSearchResults([]);
    };

    const handleDelinkSnapcard = () => {
        setFormData(prev => ({
            ...prev,
            email: '',
            phone_number: '',
            country_code: '91',
            evc_id: null,
            is_verified_email: false,
            is_verified_phone_number: false,
            updated_at_from_snapcard: null,
        }));
        setIsSnapcardLinked(false);
    };

    const validateForm = () => {
        const newErrors = {};
        if (isSnapcardLinked) {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        } else {
            if (!formData.name) newErrors.name = 'Name is required';
        }
        if (!formData.attendee_type) newErrors.attendee_type = 'Attendee Type is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveSnapcardAccount = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone_number) newErrors.phone_number = 'Phone Number is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSyncing(true);
        setSyncError('');

        try {
            const resolveData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number.toString(),
                country_code: formData.country_code || '91'
            };

            const response = await eventService.resolveSnapcardUser(token, resolveData);
            
            if (response.synced) {
                const proj = response.projection || {};
                setFormData(prev => ({
                    ...prev,
                    name: proj.name || prev.name,
                    email: proj.email || prev.email,
                    phone_number: proj.phone_number || prev.phone_number,
                    country_code: proj.country_code || prev.country_code,
                    evc_id: proj.evc_id || proj.id,
                    is_verified_email: proj.is_verified_email || false,
                    is_verified_phone_number: proj.is_verified_phone_number || false,
                    updated_at_from_snapcard: proj.updated_at_from_snapcard || null,
                }));
                setIsSnapcardLinked(true);
                setIsSyncing(false);
            } else {
                const evcId = response.projection?.evc_id || response.projection?.id;
                if (!evcId) {
                    throw new Error("No evc_id returned from resolve API");
                }

                setFormData(prev => ({ ...prev, evc_id: evcId }));

                let pollCount = 0;
                const maxPolls = 10;
                const pollInterval = 150;

                const poll = async () => {
                    if (pollCount >= maxPolls) {
                        setIsSyncing(false);
                        setSyncError('Failed to sync');
                        return;
                    }

                    pollCount++;
                    try {
                        const pollResponse = await eventService.pollSnapcardUser(token, evcId);
                        const results = pollResponse.results || [];
                        const matchedUser = results.find(u => (u.evc_id || u.id) === evcId);

                        if (matchedUser && matchedUser.synced) {
                            setFormData(prev => ({
                                ...prev,
                                name: matchedUser.name || prev.name,
                                email: matchedUser.email || prev.email,
                                phone_number: matchedUser.phone_number || prev.phone_number,
                                country_code: matchedUser.country_code || prev.country_code,
                                evc_id: matchedUser.evc_id || matchedUser.id,
                                is_verified_email: matchedUser.is_verified_email || false,
                                is_verified_phone_number: matchedUser.is_verified_phone_number || false,
                                updated_at_from_snapcard: matchedUser.updated_at_from_snapcard || null,
                            }));
                            setIsSnapcardLinked(true);
                            setIsSyncing(false);
                        } else {
                            setTimeout(poll, pollInterval);
                        }
                    } catch (err) {
                        console.error("Polling error:", err);
                        setTimeout(poll, pollInterval);
                    }
                };

                setTimeout(poll, pollInterval);
            }
        } catch (err) {
            console.error("Resolve error:", err);
            setIsSyncing(false);
            setSyncError('Failed to resolve SnapCard user');
        }
    };

    const handleSaveBadge = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
             // Scroll to first error
             const formElement = document.getElementById('attendee-form');
             if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
             return;
        }

        const payload = {
            ...formData,
            country_code: formData.country_code ? parseInt(formData.country_code, 10) : null,
            phone_number: formData.phone_number ? parseInt(formData.phone_number, 10) : null,
        };

        if (isSnapcardLinked) {
            delete payload.email;
            delete payload.phone_number;
            delete payload.country_code;
        }

        if (!payload.override_name) {
            delete payload.override_name;
        }

        // Depending on backend logic, we send the whole payload
        onSubmit(payload);
    };

    return (
        <div className={`fixed inset-0 z-[1100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={!isSubmitting ? onClose : undefined}>
            <div
                className={`absolute top-0 right-0 w-full max-w-[800px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-border overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-bg-secondary/30">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            Attendee Details
                        </h2>
                    </div>
                    <button
                        className="p-2 hover:bg-bg-tertiary rounded-md transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="attendee-form" className="space-y-6">
                        
                        {/* Section 1: SnapCard Account */}
                        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                            {!isSnapcardLinked ? (
                                <div>
                                    <div className="flex items-start mb-6">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-4 shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">Edit SnapCard Account</h3>
                                            <p className="text-sm text-text-secondary mt-0.5">Update the attendee's personal contact information.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary">Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-transparent ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'}`}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary">Email <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-transparent ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'}`}
                                            />
                                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary">Phone Number <span className="text-red-500">*</span></label>
                                            <div className="flex gap-2">
                                                <div className="relative w-[100px] shrink-0">
                                                    <select 
                                                        name="country_code" 
                                                        value={formData.country_code} 
                                                        onChange={handleChange}
                                                        className="w-full pl-8 pr-2 py-2 border border-border rounded-md text-sm outline-none appearance-none bg-transparent focus:border-accent"
                                                    >
                                                        <option value="91">+91</option>
                                                        <option value="1">+1</option>
                                                        <option value="44">+44</option>
                                                    </select>
                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px]">🇮🇳</div>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none text-xs">▼</div>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.phone_number ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'}`}
                                                />
                                            </div>
                                            {errors.phone_number && <p className="text-xs text-red-500 mt-1">{errors.phone_number}</p>}
                                        </div>
                                    </div>

                                    {isSearchingSnapcard && (
                                        <div className="flex items-center justify-center py-4 text-text-secondary">
                                            <Loader2 size={16} className="animate-spin mr-2" /> Searching...
                                        </div>
                                    )}

                                    {snapcardSearchResults.length > 0 && (
                                        <div className="mt-4 border border-border rounded-md max-h-[200px] overflow-y-auto bg-bg-primary shadow-sm text-left">
                                            <div className="p-2 bg-bg-secondary text-xs font-semibold text-text-secondary border-b border-border">Matching Profiles (Select to link):</div>
                                            {snapcardSearchResults.map(user => (
                                                <div 
                                                    key={user.id} 
                                                    className="p-3 border-b border-border hover:bg-bg-secondary cursor-pointer flex justify-between items-center last:border-b-0"
                                                    onClick={() => handleLinkSnapcard(user)}
                                                >
                                                    <div>
                                                        <div className="font-medium text-sm text-text-primary">{user.name}</div>
                                                        <div className="text-xs text-text-secondary flex flex-wrap gap-2 items-center">
                                                            <span className="flex items-center gap-1">
                                                                {user.email}
                                                                {user.is_verified_email && (
                                                                    <CheckCircle2 size={12} className="text-green-500" title="Verified Email" />
                                                                )}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                +{user.country_code} {user.phone_number}
                                                                {user.is_verified_phone_number && (
                                                                    <CheckCircle2 size={12} className="text-green-500" title="Verified Phone Number" />
                                                                )}
                                                            </span>
                                                        </div>
                                                        {user.updated_at_from_snapcard && (
                                                            <div className="text-[10px] text-text-tertiary mt-1">
                                                                Last updated: {new Date(user.updated_at_from_snapcard).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button type="button" className="text-xs font-medium text-accent hover:text-accent-hover">
                                                        Select
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {syncError && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-left">
                                            {syncError}
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end items-center gap-3 border-t border-border pt-5">
                                        {isSyncing ? (
                                            <div className="flex items-center text-sm font-medium text-text-secondary">
                                                <Loader2 size={18} className="animate-spin mr-2 text-accent" />
                                                Syncing with SnapCard...
                                            </div>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={handleSaveSnapcardAccount}
                                                className="px-4 py-2 border border-accent text-accent hover:bg-accent/10 font-medium rounded-md text-sm transition-colors flex items-center"
                                                disabled={isSubmitting}
                                            >
                                                <Save size={16} className="mr-2" /> Save SnapCard Account
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start mb-6">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-4 shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary">Edit SnapCard Account</h3>
                                            <p className="text-sm text-text-secondary mt-0.5">Update the attendee's personal contact information.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-left">
                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary">Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-bg-secondary cursor-not-allowed text-text-secondary ${errors.name ? 'border-red-500' : 'border-border'}`}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                                                Email <span className="text-red-500">*</span>
                                                {formData.is_verified_email && (
                                                    <span className="flex items-center text-xs text-green-600 font-normal">
                                                        <CheckCircle2 size={12} className="text-green-500 inline" /> (Verified)
                                                    </span>
                                                )}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    readOnly
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-bg-secondary cursor-not-allowed text-text-secondary ${formData.is_verified_email ? 'pr-8' : ''} ${errors.email ? 'border-red-500' : 'border-border'}`}
                                                />
                                                {formData.is_verified_email && (
                                                    <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                                                )}
                                            </div>
                                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                                                Phone Number <span className="text-red-500">*</span>
                                                {formData.is_verified_phone_number && (
                                                    <span className="flex items-center text-xs text-green-600 font-normal">
                                                        <CheckCircle2 size={12} className="text-green-500 inline" /> (Verified)
                                                    </span>
                                                )}
                                            </label>
                                            <div className="flex gap-2">
                                                <div className="relative w-[100px] shrink-0">
                                                    <select 
                                                        name="country_code" 
                                                        value={formData.country_code} 
                                                        disabled
                                                        className="w-full pl-8 pr-2 py-2 border border-border rounded-md text-sm outline-none appearance-none bg-bg-secondary cursor-not-allowed text-text-secondary"
                                                    >
                                                        <option value="91">+91</option>
                                                        <option value="1">+1</option>
                                                        <option value="44">+44</option>
                                                    </select>
                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px]">🇮🇳</div>
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none text-xs">▼</div>
                                                </div>
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        name="phone_number"
                                                        value={formData.phone_number}
                                                        readOnly
                                                        className={`w-full px-3 py-2 border border-border rounded-md text-sm outline-none bg-bg-secondary cursor-not-allowed text-text-secondary ${formData.is_verified_phone_number ? 'pr-8' : ''}`}
                                                    />
                                                    {formData.is_verified_phone_number && (
                                                        <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {formData.updated_at_from_snapcard && (
                                        <div className="text-xs text-text-tertiary mt-4 text-left">
                                            Last updated: {new Date(formData.updated_at_from_snapcard).toLocaleString()}
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end items-center gap-3 border-t border-border pt-5">
                                        <button 
                                            type="button" 
                                            onClick={handleDelinkSnapcard}
                                            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 font-medium rounded-md text-sm transition-colors flex items-center"
                                        >
                                            <Trash2 size={16} className="mr-2" /> Remove SnapCard Account
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleSaveSnapcardAccount}
                                            className="px-4 py-2 border border-accent text-accent hover:bg-accent/10 font-medium rounded-md text-sm transition-colors flex items-center"
                                            disabled={isSubmitting}
                                        >
                                            <Save size={16} className="mr-2" /> Save SnapCard Account
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 2: Edit Badge */}
                        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                            <div className="flex items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-4 shrink-0">
                                    <Contact size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">Edit Badge</h3>
                                    <p className="text-sm text-text-secondary mt-0.5">Update the attendee's badge and company information.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-5">
                                <div className="space-y-1 col-span-1">
                                    <label className="text-sm font-medium text-text-secondary flex items-center">
                                        {!isSnapcardLinked ? (
                                            <>Name <span className="text-red-500 ml-1">*</span></>
                                        ) : (
                                            <>Name override <span className="ml-1 text-text-tertiary text-[10px] border border-border rounded-full w-3.5 h-3.5 flex items-center justify-center" title="Override the display name on the badge">i</span></>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        name={!isSnapcardLinked ? "name" : "override_name"}
                                        value={!isSnapcardLinked ? formData.name : formData.override_name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-accent ${(!isSnapcardLinked && errors.name) ? 'border-red-500' : 'border-border bg-bg-secondary'}`}
                                    />
                                    {(!isSnapcardLinked && errors.name) && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>
                                
                                <div className="space-y-1 col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.company ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    />
                                </div>

                                <div className="space-y-1 col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.designation ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    />
                                </div>

                                <div className="space-y-1 col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Attendee Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="attendee_type"
                                        value={formData.attendee_type}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.attendee_type ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    >
                                        <option value="">Select...</option>
                                        {attendeeTypes.map(type => (
                                            <option key={type.id} value={type.name}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1 col-span-4 md:col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-accent bg-transparent"
                                    />
                                </div>

                                <div className="space-y-1 col-span-4 md:col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Reg Type</label>
                                    <select
                                        name="reg_type"
                                        value={formData.reg_type}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none bg-transparent focus:border-accent"
                                    >
                                        <option value="ON_SPOT">ON_SPOT</option>
                                        <option value="PRE_REG">PRE_REG</option>
                                    </select>
                                </div>

                                {/* Placeholder empty columns to match grid if needed, or adjust sizes */}
                                <div className="col-span-2 hidden md:block"></div>

                                <div className="space-y-1 col-span-4 md:col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.country ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                    </select>
                                </div>

                                <div className="space-y-1 col-span-4 md:col-span-1">
                                    <label className="text-sm font-medium text-text-secondary">State</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.state ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Delhi">Delhi</option>
                                    </select>
                                </div>

                                <div className="space-y-1 col-span-4 md:col-span-2">
                                    <label className="text-sm font-medium text-text-secondary">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.city ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    />
                                </div>

                                <div className="space-y-1 col-span-4">
                                    <label className="text-sm font-medium text-text-secondary">Address</label>
                                    <input
                                        type="text"
                                        name="company_address"
                                        value={formData.company_address}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-transparent ${errors.company_address ? 'border-red-500' : 'border-border focus:border-accent'}`}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-5 flex justify-end border-t border-border pt-5">
                                <button 
                                    type="button" 
                                    onClick={handleSaveBadge}
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    <Save size={16} className="mr-2" /> Save Badge
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-bg-primary flex justify-center">
                    <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary font-medium text-sm transition-colors border-b border-transparent hover:border-text-primary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendeeFormDrawer;
