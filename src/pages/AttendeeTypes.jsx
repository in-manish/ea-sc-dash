import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiUrl } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import {
    Loader2, Users, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X,
    ArrowLeft, UserCog, Settings, Mail, MessageSquare, ArrowRightLeft,
    Image as ImageIcon, ChevronRight, Save, Upload, Download, Copy,
    ChevronDown, ChevronUp, Printer
} from 'lucide-react';

const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${getApiUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ToggleSwitch = ({ name, checked, onChange }) => (
    <label className="relative inline-block w-11 h-6 cursor-pointer m-0">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="block absolute inset-0 rounded-full transition-all duration-300 bg-slate-300 peer-checked:bg-success"></span>
        <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full transition-all duration-300 peer-checked:translate-x-[20px]"></span>
    </label>
);

const Badge3DPreview = ({ front, back, isFlipped, onFlip, onExpand }) => {
    const frontUrl = getFullUrl(front);
    const backUrl = getFullUrl(back);

    return (
        <div className="relative group perspective-1000 w-full max-w-[300px] aspect-[3/4.2] mx-auto animate-float">
            <div
                className={`relative w-full h-full transition-transform duration-1000 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={onFlip}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-[2.5rem] border border-white/50 glass shadow-premium overflow-hidden paper-canvas">
                    <div className="absolute inset-0 glossy-overlay z-10 opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                    {frontUrl ? (
                        <img src={frontUrl} className="w-full h-full object-contain relative z-5" alt="Front" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-secondary/30 text-text-tertiary">
                            <ImageIcon size={48} className="mb-3 opacity-20" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Front Canvas</span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md p-3 text-[10px] text-center font-bold text-white uppercase tracking-widest z-20">Front Side</div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] border border-white/50 glass shadow-premium overflow-hidden paper-canvas">
                    <div className="absolute inset-0 glossy-overlay z-10 opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                    {backUrl ? (
                        <img src={backUrl} className="w-full h-full object-contain relative z-5" alt="Back" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-secondary/30 text-text-tertiary">
                            <ImageIcon size={48} className="mb-3 opacity-20" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Back Canvas</span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md p-3 text-[10px] text-center font-bold text-white uppercase tracking-widest z-20">Reverse Side</div>
                </div>
            </div>

            <div className="absolute -bottom-16 inset-x-0 flex justify-center gap-4">
                <button
                    onClick={onFlip}
                    className="p-3.5 glass hover:bg-white border-white/50 rounded-2xl shadow-premium hover:shadow-2xl hover:scale-110 transition-all text-text-secondary hover:text-accent group"
                    title="Flip Badge"
                >
                    <ArrowRightLeft size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <button
                    onClick={onExpand}
                    className="p-3.5 glass hover:bg-white border-white/50 rounded-2xl shadow-premium hover:shadow-2xl hover:scale-110 transition-all text-text-secondary hover:text-accent group"
                    title="View Fullscreen"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>
        </div>
    );
};

const AttendeeTypes = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
    const [editingAttendeeType, setEditingAttendeeType] = useState(null);
    const [attendeeTypeForm, setAttendeeTypeForm] = useState({ name: '', is_special: false });
    const [isAttendeeSaving, setIsAttendeeSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedType, setSelectedType] = useState(null); // Type currently being detailed
    const [activeTab, setActiveTab] = useState('general'); // general, badge, drafts, transfer

    // Sub-feature states
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [badgeDesign, setBadgeDesign] = useState({ badge_width: '', badge_height: '', displayFields: {} });
    const [emailDraft, setEmailDraft] = useState({ subject: '', email: '' });
    const [smsDraft, setSmsDraft] = useState({ sms_body: '' });
    const [transferTargetId, setTransferTargetId] = useState('');

    // Enhancement states
    const [isBadgeFlipped, setIsBadgeFlipped] = useState(false);
    const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState(false);
    const [fullscreenPreviewType, setFullscreenPreviewType] = useState('badge'); // 'badge' or 'email'
    const [isPreviewMode, setIsPreviewMode] = useState(false); // For email preview

    useEffect(() => {
        if (id && token) {
            fetchAttendeeTypes();
        }
    }, [id, token]);

    const fetchAttendeeTypes = async () => {
        setIsLoading(true);
        try {
            const data = await eventService.getAttendeeTypes(id, token);
            setAttendeeTypes(data.attendee_types || []);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load attendee types.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAttendeeModal = (type = null) => {
        if (type) {
            setEditingAttendeeType(type);
            setAttendeeTypeForm({ name: type.name, is_special: !!type.is_special });
        } else {
            setEditingAttendeeType(null);
            setAttendeeTypeForm({ name: '', is_special: false });
        }
        setIsAttendeeModalOpen(true);
    };

    const handleSaveAttendeeType = async () => {
        if (!attendeeTypeForm.name.trim()) return;
        setIsAttendeeSaving(true);
        try {
            let updatedTypes;
            if (editingAttendeeType) {
                updatedTypes = attendeeTypes.map(at =>
                    at.id === editingAttendeeType.id ? { ...at, ...attendeeTypeForm } : at
                );
            } else {
                updatedTypes = [...attendeeTypes, { id: null, ...attendeeTypeForm }];
            }

            const response = await eventService.updateAttendeeTypes(id, token, updatedTypes);
            setAttendeeTypes(response.attendee_types || []);
            setIsAttendeeModalOpen(false);
            setMessage({ type: 'success', text: `Attendee type ${editingAttendeeType ? 'updated' : 'added'} successfully.` });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save attendee type.' });
        } finally {
            setIsAttendeeSaving(false);
        }
    };

    const handleDeleteAttendeeType = async (typeId) => {
        if (!window.confirm('Are you sure you want to delete this attendee type? This might affect existing attendees of this type.')) return;
        try {
            await eventService.deleteAttendeeType(id, typeId, token);
            setAttendeeTypes(prev => prev.filter(at => at.id !== typeId));
            setMessage({ type: 'success', text: 'Attendee type deleted successfully.' });
            if (selectedType?.id === typeId) setSelectedType(null);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to delete attendee type.' });
        }
    };

    const handleSelectType = async (type) => {
        setSelectedType(type);
        setActiveTab('general');
        setIsLoading(true); // Loading sub-data
        try {
            // Load design
            const designData = await eventService.getBadgeDesign(id, type.id, token);
            setBadgeDesign({
                badge_width: designData.badge_width || '1000',
                badge_height: designData.badge_height || '1400',
                displayFields: designData.displayFields || {}
            });

            // Load drafts
            const emailData = await eventService.getEmailDrafts(id, token, type.id);
            const smsData = await eventService.getSMSDrafts(id, token, type.id);

            if (emailData.attendee_types?.length > 0) {
                setEmailDraft({
                    subject: emailData.attendee_types[0].subject || '',
                    email: emailData.attendee_types[0].email || ''
                });
            } else {
                setEmailDraft({ subject: '', email: '' });
            }

            if (smsData?.length > 0) {
                setSmsDraft({ sms_body: smsData[0].sms_body || '' });
            } else {
                setSmsDraft({ sms_body: '' });
            }

        } catch (err) {
            console.error(err);
            // Non-blocking errors
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadBadgeImage = async (field, file) => {
        if (!file) return;
        setIsActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append(field, file);
            const response = await eventService.uploadBadgeImages(id, selectedType.id, token, formData);
            setSelectedType(prev => ({ ...prev, [field]: response[field] || prev[field] }));
            setMessage({ type: 'success', text: `${field.replace('_', ' ')} uploaded successfully.` });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to upload image.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUploadEmailTemplate = async (file) => {
        if (!file) return;
        setIsActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await eventService.uploadEmailBadgeTemplate(id, selectedType.id, token, file);
            setSelectedType(prev => ({ ...prev, email_badge_template: response.badge }));
            setMessage({ type: 'success', text: 'Email badge template uploaded successfully.' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to upload email template.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateDesign = async () => {
        setIsActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new URLSearchParams();
            formData.append('badge_width', badgeDesign.badge_width);
            formData.append('badge_height', badgeDesign.badge_height);
            // displayFields is JSON string
            formData.append('displayFields', JSON.stringify(badgeDesign.displayFields));

            await eventService.updateBadgeDesign(id, selectedType.id, token, formData);
            setMessage({ type: 'success', text: 'Badge design updated successfully.' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update design.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSaveDrafts = async () => {
        setIsActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            // Save Email
            await eventService.saveEmailDraft(id, token, {
                attendee_types: [selectedType.id],
                email: emailDraft.email,
                subject: emailDraft.subject
            });

            // Save SMS
            await eventService.saveSMSDraft(id, token, {
                attendee_types: [selectedType.id],
                sms_body: smsDraft.sms_body
            });

            setMessage({ type: 'success', text: 'Email and SMS drafts saved successfully.' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save drafts.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleTransferAttendees = async () => {
        if (!transferTargetId) return;
        if (!window.confirm('Are you sure you want to transfer all attendees? This action is irreversible.')) return;
        setIsActionLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await eventService.transferAttendees(id, token, {
                id: selectedType.id,
                new_id: parseInt(transferTargetId)
            });
            setMessage({ type: 'success', text: 'Attendees transferred successfully.' });
            setTransferTargetId('');
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to transfer attendees.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const renderListView = () => (
        <div className="animate-fade-in w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Attendee Types</h1>
                    <p className="text-sm text-text-secondary">Manage attendee categories for this event</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => handleOpenAttendeeModal()}
                >
                    <Plus size={16} className="mr-2" /> Add Attendee Type
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-md mb-6 text-sm font-medium border animate-fade-in ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-bg-primary border border-border rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-accent mb-2" />
                        <span className="text-sm text-text-secondary">Loading attendee types...</span>
                    </div>
                ) : attendeeTypes.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary">
                            <Users size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No Attendee Types</h3>
                        <p className="text-text-secondary text-sm max-w-xs">You haven't added any attendee types yet. Create one to get started.</p>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => handleOpenAttendeeModal()}
                        >
                            <Plus size={16} className="mr-2" /> Create First Type
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {attendeeTypes.map(type => (
                            <div key={type.id} className="p-5 flex justify-between items-center hover:bg-bg-secondary transition-colors group cursor-pointer" onClick={() => handleSelectType(type)}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[15px] font-bold text-text-primary">{type.name}</span>
                                        {type.is_special && (
                                            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-tight">Special Category</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        {type.email_saved ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                <CheckCircle2 size={10} /> Email Template Saved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded border border-border">
                                                <AlertCircle size={10} /> No Email Template
                                            </span>
                                        )}
                                        {type.sms_saved && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                                <CheckCircle2 size={10} /> SMS Saved
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="p-2 text-text-secondary hover:text-accent hover:bg-bg-tertiary rounded-lg transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleOpenAttendeeModal(type); }}
                                            title="Quick Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteAttendeeType(type.id); }}
                                            title="Delete Type"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <ChevronRight size={20} className="text-text-tertiary" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderDetailView = () => (
        <div className="animate-fade-in w-full">
            <button
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors font-medium"
                onClick={() => setSelectedType(null)}
            >
                <ArrowLeft size={18} /> Back to Attendee Types
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex flex-col gap-1">
                    {[
                        { id: 'general', label: 'General Settings', icon: UserCog },
                        { id: 'badge', label: 'Badge Design', icon: ImageIcon },
                        { id: 'drafts', label: 'Email & SMS Drafts', icon: Mail },
                        { id: 'transfer', label: 'Transfer Attendees', icon: ArrowRightLeft },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                ? 'bg-accent text-white shadow-md shadow-accent/20'
                                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-bg-primary border border-border rounded-2xl shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/50">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">{selectedType.name}</h2>
                            <p className="text-sm text-text-tertiary mt-1">Configure settings for this category</p>
                        </div>
                        {isActionLoading && <Loader2 className="animate-spin text-accent" size={20} />}
                    </div>

                    <div className="p-6 flex-1 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <Loader2 className="animate-spin text-accent" />
                            </div>
                        )}

                        {message.text && (
                            <div className={`p-3 rounded-lg mb-4 text-xs font-bold border flex justify-between items-center animate-fade-in ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <span>{message.text}</span>
                                <button onClick={() => setMessage({ type: '', text: '' })}><X size={14} /></button>
                            </div>
                        )}

                        {activeTab === 'general' && renderGeneralTab()}
                        {activeTab === 'badge' && renderBadgeTab()}
                        {activeTab === 'drafts' && renderDraftsTab()}
                        {activeTab === 'transfer' && renderTransferTab()}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGeneralTab = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Type Name</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={selectedType.name}
                            readOnly
                            className="w-full p-3.5 bg-bg-secondary border border-border rounded-xl text-text-primary font-medium focus:outline-none opacity-80"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] bg-bg-tertiary px-2 py-1 rounded border border-border text-text-tertiary">Read-only here</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider block">Special Category</label>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${selectedType.is_special ? 'bg-amber-50 border-amber-100' : 'bg-bg-secondary border-border'
                        }`}>
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${selectedType.is_special ? 'text-amber-700' : 'text-text-primary'}`}>
                                {selectedType.is_special ? 'Enabled' : 'Disabled'}
                            </span>
                            <span className="text-[11px] text-text-tertiary mt-0.5">Custom logic and priority badge processing</span>
                        </div>
                        <CheckCircle2 className={selectedType.is_special ? 'text-amber-500' : 'text-text-tertiary'} size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">About this type</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        This attendee type is used to categorize participants. You can customize badge designs and email/SMS templates specifically for this group using the tabs on the left.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderBadgeTab = () => (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="flex flex-col items-center justify-center p-12 bg-bg-secondary/20 rounded-[3rem] border border-white/50 glass mesh-bg relative overflow-hidden group/canvas">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.3em] mb-12 relative z-10 opacity-60">Interactive 3D Engine</h4>
                    <Badge3DPreview
                        front={selectedType.badge_front}
                        back={selectedType.badge_back}
                        isFlipped={isBadgeFlipped}
                        onFlip={() => setIsBadgeFlipped(!isBadgeFlipped)}
                        onExpand={() => {
                            setFullscreenPreviewType('badge');
                            setIsFullscreenPreviewOpen(true);
                        }}
                    />
                    <div className="mt-20 flex items-center gap-2 px-4 py-2 rounded-full glass text-[9px] font-bold text-text-tertiary uppercase tracking-wider relative z-10">
                        <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                        Live Visualization Active
                    </div>
                </div>

                {/* Badge Uploads & Dimensions */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-[11px] font-bold text-text-tertiary mb-3 uppercase tracking-wider">Badge Front</h4>
                            <label className="aspect-[3/4.2] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary transition-all cursor-pointer group relative overflow-hidden">
                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadBadgeImage('badge_front', e.target.files[0])} disabled={isActionLoading} />
                                {selectedType.badge_front ? (
                                    <>
                                        <img src={selectedType.badge_front} className="w-full h-full object-contain p-2" alt="Badge Front" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload size={24} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[9px] font-bold text-text-tertiary uppercase">Upload</span>
                                    </>
                                )}
                            </label>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold text-text-tertiary mb-3 uppercase tracking-wider">Badge Back</h4>
                            <label className="aspect-[3/4.2] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary transition-all cursor-pointer group relative overflow-hidden">
                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadBadgeImage('badge_back', e.target.files[0])} disabled={isActionLoading} />
                                {selectedType.badge_back ? (
                                    <>
                                        <img src={selectedType.badge_back} className="w-full h-full object-contain p-2" alt="Badge Back" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload size={24} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[9px] font-bold text-text-tertiary uppercase">Upload</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                                <Settings size={18} className="text-accent" /> Dimensions & Layout
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Width (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_width}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_width: e.target.value })}
                                    className="w-full p-2.5 bg-bg-secondary border border-border rounded-lg text-sm"
                                    placeholder="1000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Height (px)</label>
                                <input
                                    type="number"
                                    value={badgeDesign.badge_height}
                                    onChange={(e) => setBadgeDesign({ ...badgeDesign, badge_height: e.target.value })}
                                    className="w-full p-2.5 bg-bg-secondary border border-border rounded-lg text-sm"
                                    placeholder="1400"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-bg-secondary border border-border rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-text-secondary">Layout Objects</span>
                                <button className="text-[10px] font-bold text-accent hover:underline">Edit JSON</button>
                            </div>
                            <div className="text-[11px] font-mono text-text-tertiary bg-bg-primary p-3 rounded border border-border overflow-x-auto h-32">
                                <pre>{JSON.stringify(badgeDesign.displayFields, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
                <button className="btn btn-secondary px-6 py-2.5 rounded-xl text-sm" onClick={() => handleSelectType(selectedType)}>Reset</button>
                <button
                    className="btn btn-primary px-8 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-accent/20"
                    onClick={handleUpdateDesign}
                    disabled={isActionLoading}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Update Design
                </button>
            </div>

            {/* Email Template Upload */}
            <div className="mt-12 p-8 glass rounded-[2.5rem] border border-white/50 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                <h4 className="text-sm font-bold text-text-primary mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent/10">
                        <Mail size={18} className="text-accent" />
                    </div>
                    Email Badge Template
                </h4>
                <div className="w-full h-64 glass-premium rounded-[3rem] p-4 relative overflow-hidden group/email mesh-bg animate-mesh">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <label className="w-full h-full border-2 border-dashed border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                        <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleUploadEmailTemplate(e.target.files[0])} disabled={isActionLoading} />
                        {selectedType.email_badge_template ? (
                            <>
                                <img src={getFullUrl(selectedType.email_badge_template)} className="w-full h-full object-contain p-8 relative z-5" alt="Email Badge" />
                                <div className="absolute inset-0 glossy-overlay opacity-20" />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl opacity-0 group-hover/email:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFullscreenPreviewType('email');
                                            setIsFullscreenPreviewOpen(true);
                                        }}
                                        className="p-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl backdrop-blur-md transition-all border border-white/20 shadow-2xl scale-90 group-hover/email:scale-100"
                                        title="Preview Fullscreen"
                                    >
                                        <Plus size={24} />
                                    </div>
                                    <div className="px-8 py-3.5 bg-white text-black rounded-full font-black text-xs shadow-2xl scale-90 group-hover/email:scale-100 transition-all tracking-widest uppercase">
                                        Replace Template
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-5 rounded-full bg-white/10 shadow-inner group-hover/email:scale-110 transition-transform border border-white/10">
                                    <Upload size={28} className="text-white/60" />
                                </div>
                                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mt-2">Initialize Template</span>
                            </>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );

    const renderDraftsTab = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Mail size={18} className="text-accent" /> Email Invitation Draft
                    </h4>
                    <div className="flex items-center gap-2">
                        <button
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${!isPreviewMode ? 'bg-accent text-white shadow-md' : 'bg-bg-secondary text-text-tertiary'}`}
                            onClick={() => setIsPreviewMode(false)}
                        >
                            Edit
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${isPreviewMode ? 'bg-accent text-white shadow-md' : 'bg-bg-secondary text-text-tertiary'}`}
                            onClick={() => setIsPreviewMode(true)}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {isPreviewMode ? (
                    <div className="border border-border rounded-2xl overflow-hidden bg-white min-h-[400px]">
                        <div className="p-4 border-b border-border bg-bg-secondary/50 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase">Subject</span>
                            <span className="text-sm font-medium">{emailDraft.subject || '(No subject)'}</span>
                        </div>
                        <div className="p-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: emailDraft.email || '<p class="text-text-tertiary italic">No content yet...</p>' }} />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Email Subject"
                            value={emailDraft.subject}
                            onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <textarea
                            rows={12}
                            placeholder="Email Content (HTML supported)"
                            value={emailDraft.email}
                            onChange={(e) => setEmailDraft({ ...emailDraft, email: e.target.value })}
                            className="w-full p-4 bg-bg-secondary border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <MessageSquare size={18} className="text-accent" /> SMS Template
                    </h4>
                    <p className="text-[10px] text-text-tertiary">Confirmation SMS</p>
                </div>
                <textarea
                    rows={4}
                    placeholder="SMS Content"
                    value={smsDraft.sms_body}
                    onChange={(e) => setSmsDraft({ ...smsDraft, sms_body: e.target.value })}
                    className="w-full p-4 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-3">
                <button
                    className="btn btn-primary px-8 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    onClick={handleSaveDrafts}
                    disabled={isActionLoading}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Drafts
                </button>
            </div>
        </div>
    );

    const renderTransferTab = () => (
        <div className="space-y-6 animate-fade-in flex flex-col items-center py-10">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                <ArrowRightLeft size={32} />
            </div>
            <div className="text-center max-w-sm mb-8">
                <h4 className="text-lg font-bold text-text-primary">Transfer Attendees</h4>
                <p className="text-sm text-text-tertiary mt-2">Move all attendees from <b>{selectedType.name}</b> to a different category.</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider block text-center">Select Target Category</label>
                    <select
                        className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        value={transferTargetId}
                        onChange={(e) => setTransferTargetId(e.target.value)}
                    >
                        <option value="">Choose a type...</option>
                        {attendeeTypes.filter(at => at.id !== selectedType.id).map(at => (
                            <option key={at.id} value={at.id}>{at.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="w-full btn btn-primary py-3 rounded-xl font-bold shadow-lg shadow-accent/20 mt-4 flex items-center justify-center gap-2"
                    onClick={handleTransferAttendees}
                    disabled={isActionLoading || !transferTargetId}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRightLeft size={18} />}
                    Confirm Transfer
                </button>
            </div>

            <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl max-w-md">
                <div className="flex gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h5 className="text-xs font-bold text-red-900 uppercase tracking-tight">Warning</h5>
                        <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                            This action will update all attendees currently assigned to this type. This cannot be easily undone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full">
            {selectedType ? renderDetailView() : renderListView()}

            {/* Fullscreen Preview Modal */}
            {isFullscreenPreviewOpen && (
                <div className="fixed inset-0 mesh-bg-cosmic animate-mesh z-[2000] flex flex-col animate-fade-in text-white">
                    <div className="p-8 flex justify-between items-center glass-dark m-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10">
                        <div className="flex items-center gap-8">
                            <div className="p-4 bg-accent/20 rounded-2xl border border-accent/30 shadow-inner">
                                <ImageIcon size={28} className="text-accent" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter uppercase mb-1">
                                    {fullscreenPreviewType === 'badge' ? selectedType.name : 'Master Template'}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                                        {fullscreenPreviewType === 'badge' ? 'Physical Badge Synchronization' : 'Digital Content Distribution'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.print()}
                                className="px-10 py-4 bg-white text-black hover:bg-slate-100 rounded-2xl transition-all flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95"
                            >
                                <Printer size={20} /> Print Selection
                            </button>
                            <button
                                onClick={() => setIsFullscreenPreviewOpen(false)}
                                className="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-2xl transition-all active:rotate-90 duration-500 hover:scale-110"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-16 flex items-center justify-center">
                        <div id="badge-print-area" className={`relative ${fullscreenPreviewType === 'badge' ? 'h-[85vh] aspect-[3/4.2]' : 'w-full max-w-5xl'} shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] rounded-[4rem] overflow-hidden paper-canvas group/full animate-slide-up`}>
                            <div className="absolute inset-0 glossy-overlay z-10 opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/5 pointer-events-none z-10" />
                            <img
                                src={getFullUrl(
                                    fullscreenPreviewType === 'badge'
                                        ? (isBadgeFlipped ? selectedType.badge_back : selectedType.badge_front)
                                        : selectedType.email_badge_template
                                )}
                                className="w-full h-full object-contain relative z-5 p-2"
                                alt="Full Preview"
                            />
                            {fullscreenPreviewType === 'badge' && (
                                <button
                                    onClick={() => setIsBadgeFlipped(!isBadgeFlipped)}
                                    className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-5 bg-black/80 backdrop-blur-2xl text-white rounded-full font-black text-xs uppercase tracking-[0.4em] border border-white/20 opacity-0 group-hover/full:opacity-100 transition-all duration-500 hover:bg-accent flex items-center gap-4 shadow-2xl translate-y-8 group-hover/full:translate-y-0 z-20"
                                >
                                    <ArrowRightLeft size={20} /> Flip Surface
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-10 bg-slate-950/60 backdrop-blur-2xl border-t border-white/5">
                        <div className="flex items-center justify-center gap-16">
                            <div className="text-center">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">Category Type</p>
                                <p className="text-sm font-black text-white/90 tracking-widest">
                                    {fullscreenPreviewType === 'badge' ? 'PHYSICAL_ASSET' : 'DIGITAL_TEMPLATE'}
                                </p>
                            </div>
                            <div className="w-px h-12 bg-white/5" />
                            <div className="text-center">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">Sync Status</p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                                    <p className="text-sm font-black text-success uppercase tracking-widest">Live Engine</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Add/Edit Modal */}
            {isAttendeeModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1000] animate-fade-in p-4">
                    <div className="bg-bg-primary rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">
                                    {editingAttendeeType ? 'Edit Attendee Type' : 'Add Attendee Type'}
                                </h3>
                                <p className="text-xs text-text-tertiary mt-0.5">Define name and category properties</p>
                            </div>
                            <button
                                className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                                onClick={() => setIsAttendeeModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2.5">Type Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-border rounded-xl bg-bg-primary text-[15px] focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                                    placeholder="e.g. Exhibitor, Visitor, VIP..."
                                    value={attendeeTypeForm.name}
                                    onChange={(e) => setAttendeeTypeForm({ ...attendeeTypeForm, name: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-text-primary font-mono">Special Category</span>
                                    <span className="text-[11px] text-text-tertiary mt-0.5 italic">Enhanced permissions or custom logic</span>
                                </div>
                                <ToggleSwitch
                                    name="is_special"
                                    checked={attendeeTypeForm.is_special}
                                    onChange={(e) => setAttendeeTypeForm({ ...attendeeTypeForm, is_special: e.target.checked })}
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-bg-secondary/50">
                            <button
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-text-secondary hover:bg-bg-tertiary transition-colors"
                                onClick={() => setIsAttendeeModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center min-w-[120px]"
                                disabled={isAttendeeSaving || !attendeeTypeForm.name.trim()}
                                onClick={handleSaveAttendeeType}
                            >
                                {isAttendeeSaving ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} className="mr-2" />
                                        {editingAttendeeType ? 'Save Changes' : 'Create Type'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendeeTypes;
