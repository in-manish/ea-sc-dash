import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Save, Loader2, Calendar, MapPin, Globe, Building2, Users, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';
import PaymentConfig from '../components/PaymentConfig';




const ToggleSwitch = ({ name, checked, isModified, onChange }) => (
    <label className="relative inline-block w-11 h-6 cursor-pointer m-0">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
        <span className={`block absolute inset-0 rounded-full transition-all duration-300 ${isModified ? 'bg-amber-500 peer-checked:bg-amber-500' : 'bg-slate-300 peer-checked:bg-success'}`}></span>
        <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full transition-all duration-300 peer-checked:translate-x-[20px]"></span>
    </label>
);

const Settings = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [eventData, setEventData] = useState(null);
    const [originalEventData, setOriginalEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewStates, setPreviewStates] = useState({});




    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        setIsLoading(true);
        try {
            const data = await eventService.getEventDetails(id, token);
            setEventData(data);
            setOriginalEventData(JSON.parse(JSON.stringify(data)));

        } catch (err) {

            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load event details.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchEventDetails();
        }
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const addInviteeInfo = () => {
        setEventData(prev => ({
            ...prev,
            company_complimentary_invitee_info: [
                ...(prev.company_complimentary_invitee_info || []),
                { title: '', description: '' }
            ]
        }));
    };

    const removeInviteeInfo = (index) => {
        setEventData(prev => ({
            ...prev,
            company_complimentary_invitee_info: prev.company_complimentary_invitee_info.filter((_, i) => i !== index)
        }));
    };

    const handleInviteeInfoChange = (index, field, value) => {
        setEventData(prev => {
            const updatedInfo = [...(prev.company_complimentary_invitee_info || [])];
            updatedInfo[index] = { ...updatedInfo[index], [field]: value };
            return { ...prev, company_complimentary_invitee_info: updatedInfo };
        });
    };

    const togglePreview = (index) => {
        setPreviewStates(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const moveInviteeInfo = (index, direction) => {
        setEventData(prev => {
            const updatedInfo = [...(prev.company_complimentary_invitee_info || [])];
            if (direction === -1 && index > 0) {
                [updatedInfo[index], updatedInfo[index - 1]] = [updatedInfo[index - 1], updatedInfo[index]];
            } else if (direction === 1 && index < updatedInfo.length - 1) {
                [updatedInfo[index], updatedInfo[index + 1]] = [updatedInfo[index + 1], updatedInfo[index]];
            }
            return { ...prev, company_complimentary_invitee_info: updatedInfo };
        });

        setPreviewStates(prev => {
            const newState = { ...prev };
            const targetIndex = index + direction;
            if (newState[index] !== undefined || newState[targetIndex] !== undefined) {
                const temp = newState[index];
                newState[index] = newState[targetIndex];
                newState[targetIndex] = temp;
            }
            return newState;
        });
    };

    const isFieldModified = (fieldName) => {
        if (!originalEventData) return false;
        if (typeof eventData[fieldName] === 'boolean' || typeof originalEventData[fieldName] === 'boolean') {
            return !!eventData[fieldName] !== !!originalEventData[fieldName];
        }
        return eventData[fieldName] !== originalEventData[fieldName];
    };



    const isInviteeInfoModified = (index, field) => {
        if (!originalEventData || !originalEventData.company_complimentary_invitee_info) return true;
        if (!originalEventData.company_complimentary_invitee_info[index]) return true;
        return eventData.company_complimentary_invitee_info[index][field] !== originalEventData.company_complimentary_invitee_info[index][field];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();

            Object.keys(eventData).forEach(key => {
                const imageFields = ['logo', 'logo2', 'event_background_image', 'event_banner_logo', 'meetingdiary_portal_bg_image'];

                if (
                    key !== 'social_links' &&
                    key !== 'attendee_types' &&
                    key !== 'company_complimentary_invitee_info' &&
                    key !== 'location' &&
                    key !== 'intl_meta' &&
                    key !== 'intl_data' &&
                    eventData[key] !== null &&
                    !(imageFields.includes(key) && typeof eventData[key] === 'string')
                ) {
                    formData.append(key, typeof eventData[key] === 'object' && !(eventData[key] instanceof File) ? JSON.stringify(eventData[key]) : eventData[key]);
                }
            });

            formData.append('social_links', JSON.stringify(eventData.social_links));
            formData.append('company_complimentary_invitee_info', JSON.stringify(eventData.company_complimentary_invitee_info || []));
            if (eventData.intl_meta !== undefined && eventData.intl_meta !== null) {
                formData.append('intl_meta', JSON.stringify(eventData.intl_meta));
            }
            if (eventData.intl_data !== undefined && eventData.intl_data !== null) {
                formData.append('intl_data', JSON.stringify(eventData.intl_data));
            }

            await eventService.updateEvent(id, token, formData);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setOriginalEventData(JSON.parse(JSON.stringify(eventData)));

            fetchEventDetails();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const getInputClass = (fieldName, isIcon = false) => `w-full p-2.5 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${isIcon ? 'pl-9' : ''} ${isFieldModified(fieldName) ? 'border-amber-500 bg-[#fffbeb] text-amber-900 focus:border-amber-600 focus:ring-amber-500/20' : 'border-border bg-bg-primary text-text-primary focus:border-accent focus:ring-accent/10'}`;

    const getInviteeInputClass = (index, fieldName) => `w-full p-2.5 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${isInviteeInfoModified(index, fieldName) ? 'border-amber-500 bg-[#fffbeb] text-amber-900 focus:border-amber-600 focus:ring-amber-500/20' : 'border-border bg-bg-primary text-text-primary focus:border-accent focus:ring-accent/10'}`;

    const [paymentSubTab, setPaymentSubTab] = useState('selection');

    if (isLoading) {
        return (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center gap-4 text-text-secondary">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading settings...</p>
            </div>
        );
    }

    if (!eventData) return null;

    return (
        <div className="pb-8 animate-fade-in">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-border">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Event Settings</h1>
                    <p className="text-sm text-text-secondary">Manage configuration for {eventData.name}</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} style={{ marginRight: '0.5rem' }} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-md mb-6 text-sm font-medium border ${message.type === 'success' ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'}`}>
                    {message.text}
                </div>
            )}

            <div>
                <div className="flex gap-2 mb-6 border-b border-border pb-[1px]">
                    <button
                        className={`bg-transparent border-none py-3 px-6 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 ${activeTab === 'general' ? 'text-accent border-accent font-semibold' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </button>
                    <button
                        className={`bg-transparent border-none py-3 px-6 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 ${activeTab === 'companies' ? 'text-accent border-accent font-semibold' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
                        onClick={() => setActiveTab('companies')}
                    >
                        Companies
                    </button>
                    <button
                        className={`bg-transparent border-none py-3 px-6 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 ${activeTab === 'attendees' ? 'text-accent border-accent font-semibold' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
                        onClick={() => setActiveTab('attendees')}
                    >
                        Attendees
                    </button>
                    <button
                        className={`bg-transparent border-none py-3 px-6 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 ${activeTab === 'payments' ? 'text-accent border-accent font-semibold' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        Payments
                    </button>
                </div>

                <div className="max-w-[800px] animate-fade-in">
                    {activeTab === 'general' && (
                        <div className="animate-fade-in space-y-6">
                            {/* Section 1: Event Identity */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-20"></div>
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <Globe size={18} className="text-accent" />
                                    Event Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Event Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={eventData.name || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('name')}
                                            placeholder="Enter event name"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Official Website</label>
                                        <div className="relative flex items-center">
                                            <Globe size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                            <input
                                                type="url"
                                                name="website"
                                                value={eventData.website || ''}
                                                onChange={handleInputChange}
                                                className={getInputClass('website', true)}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Event Description</label>
                                        <textarea
                                            name="description"
                                            value={eventData.description || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('description')}
                                            rows={4}
                                            placeholder="Briefly describe the event..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Venue & Schedule */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-success opacity-20"></div>
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <Calendar size={18} className="text-success" />
                                    Venue & Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={eventData.start_date || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('start_date')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={eventData.end_date || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('end_date')}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Venue Address</label>
                                        <div className="relative flex items-center">
                                            <MapPin size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={eventData.address || ''}
                                                onChange={handleInputChange}
                                                className={getInputClass('address', true)}
                                                placeholder="Street address, building name..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">City / Location</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={eventData.city || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('city')}
                                            placeholder="City name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="animate-fade-in space-y-6">
                            {/* Section 1: Access Controls */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <Building2 size={18} className="text-amber-500" />
                                    Platform Access & Controls
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
                                        <div>
                                            <p className="font-semibold text-text-primary m-0">Company Lock Display</p>
                                            <p className="text-xs text-text-tertiary mt-0.5">Restrict display of companies based on specific criteria.</p>
                                        </div>
                                        <ToggleSwitch
                                            name="is_company_lock_display_enabled"
                                            checked={eventData.is_company_lock_display_enabled || false}
                                            isModified={isFieldModified('is_company_lock_display_enabled')}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="p-4 bg-bg-secondary rounded-lg border border-border">
                                        <div className="flex justify-between items-center text-sm mb-4">
                                            <div>
                                                <p className="font-semibold text-text-primary m-0">Meeting Diary Portal</p>
                                                <p className="text-xs text-text-tertiary mt-0.5">Enable the dedicated B2B meeting diary for exhibitors.</p>
                                            </div>
                                            <ToggleSwitch
                                                name="meeting_diary_enabled"
                                                checked={!!eventData.meeting_diary_enabled}
                                                isModified={isFieldModified('meeting_diary_enabled')}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {eventData.meeting_diary_enabled && (
                                            <div className="animate-fade-in pt-4 border-t border-dashed border-border">
                                                <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Diary Sub-Domain</label>
                                                <input
                                                    type="text"
                                                    name="meetingdiary_domain"
                                                    value={eventData.meetingdiary_domain || ''}
                                                    onChange={handleInputChange}
                                                    className={getInputClass('meetingdiary_domain')}
                                                    placeholder="example.meetingdiary.com"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Resources */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    Exhibitor Resources
                                </h3>
                                <div className="mb-0">
                                    <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Floor Plan URL</label>
                                    <div className="relative flex items-center">
                                        <Save size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                        <input
                                            type="url"
                                            name="floor_plan_link"
                                            value={eventData.floor_plan_link || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('floor_plan_link', true)}
                                            placeholder="https://example.com/floor-plan.pdf"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Complimentary Invitee Info */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
                                    <h3 className="text-base font-semibold text-text-primary m-0 flex items-center gap-2">
                                        <Users size={18} className="text-purple-500" />
                                        Complimentary Access Rules
                                    </h3>
                                    <button className="btn btn-sm btn-secondary flex items-center gap-1" onClick={addInviteeInfo} type="button">
                                        <Plus size={14} />
                                        Add Block
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(eventData.company_complimentary_invitee_info || []).map((info, index) => (
                                        <div key={index} className="bg-bg-secondary border border-border rounded-lg p-5">
                                            <div className="flex justify-between items-center mb-5">
                                                <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-bold text-text-tertiary uppercase tracking-tighter">Rule Block #{index + 1}</span>
                                                <div className="flex gap-2">
                                                    <div className="flex rounded border border-border overflow-hidden">
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary hover:bg-bg-tertiary disabled:opacity-30"
                                                            onClick={() => moveInviteeInfo(index, -1)}
                                                            disabled={index === 0}
                                                            type="button"
                                                        ><ArrowUp size={14} /></button>
                                                        <button
                                                            className="w-8 h-8 flex items-center justify-center bg-bg-primary text-text-secondary border-l border-border hover:bg-bg-tertiary disabled:opacity-30"
                                                            onClick={() => moveInviteeInfo(index, 1)}
                                                            disabled={index === (eventData.company_complimentary_invitee_info || []).length - 1}
                                                            type="button"
                                                        ><ArrowDown size={14} /></button>
                                                    </div>
                                                    <button
                                                        className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${previewStates[index] ? 'bg-accent text-white border-accent' : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary'}`}
                                                        onClick={() => togglePreview(index)}
                                                        type="button"
                                                    >
                                                        {previewStates[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center rounded border border-border bg-bg-primary text-danger hover:bg-red-50"
                                                        onClick={() => removeInviteeInfo(index)}
                                                        type="button"
                                                    ><Trash2 size={14} /></button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block mb-1.5 text-xs font-bold text-text-secondary uppercase">Title</label>
                                                    <input
                                                        type="text"
                                                        value={info.title || ''}
                                                        onChange={(e) => handleInviteeInfoChange(index, 'title', e.target.value)}
                                                        className={getInviteeInputClass(index, 'title')}
                                                        placeholder="Eligibility, Quota, etc."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block mb-1.5 text-xs font-bold text-text-secondary uppercase">Description (HTML Support)</label>
                                                    {previewStates[index] ? (
                                                        <div
                                                            className="bg-bg-primary border border-border rounded-md p-4 min-h-[140px] text-sm leading-relaxed prose prose-sm max-w-none shadow-inner"
                                                            dangerouslySetInnerHTML={{ __html: info.description }}
                                                        />
                                                    ) : (
                                                        <textarea
                                                            value={info.description || ''}
                                                            onChange={(e) => handleInviteeInfoChange(index, 'description', e.target.value)}
                                                            className={getInviteeInputClass(index, 'description')}
                                                            rows={5}
                                                            placeholder="<p>Enter rules here...</p>"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!eventData.company_complimentary_invitee_info || eventData.company_complimentary_invitee_info.length === 0) && (
                                        <div className="text-center p-12 bg-bg-secondary rounded-lg border border-dashed border-border text-text-tertiary">
                                            <p className="mb-4">No complimentary invitee information added yet.</p>
                                            <button className="btn btn-sm btn-secondary" onClick={addInviteeInfo} type="button">Add First Block</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendees' && (
                        <div className="animate-fade-in space-y-6">
                            {/* Section 1: Modules & Services */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <Users size={18} className="text-indigo-500" />
                                    Active Modules & Services
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary m-0">Event Status</p>
                                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">{eventData.event_active ? 'Online' : 'Offline'}</p>
                                        </div>
                                        <ToggleSwitch
                                            name="event_active"
                                            checked={eventData.event_active || false}
                                            isModified={isFieldModified('event_active')}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary m-0">Print & SMS</p>
                                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">On-site registration tools</p>
                                        </div>
                                        <ToggleSwitch
                                            name="print_sms_enabled"
                                            checked={eventData.print_sms_enabled || false}
                                            isModified={isFieldModified('print_sms_enabled')}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                                        <div>
                                            <p className="text-sm font-semibold text-text-primary m-0">Twilio Communications</p>
                                            <p className="text-[10px] text-text-tertiary mt-0.5 font-bold uppercase tracking-wider">Global SMS notifications</p>
                                        </div>
                                        <ToggleSwitch
                                            name="twilio_on"
                                            checked={eventData.twilio_on || false}
                                            isModified={isFieldModified('twilio_on')}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Registration Policy */}
                            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                    <Users size={18} className="text-teal-500" />
                                    Attendee Categories
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(eventData.attendee_types || []).map(type => (
                                        <div key={type.id} className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border transition-all hover:border-accent/40 group">
                                            <span className="text-sm font-medium text-text-primary">{type.name}</span>
                                            {type.email_saved && (
                                                <span className="py-1 px-2 rounded-full font-bold text-[9px] bg-success/10 text-success uppercase tracking-widest border border-success/20">
                                                    Email Active
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {(!eventData.attendee_types || eventData.attendee_types.length === 0) && (
                                        <div className="col-span-full py-8 text-center text-text-tertiary italic text-sm">
                                            No attendee types configured.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="animate-fade-in space-y-6">
                            {/* Sub-tab Navigation */}
                            <div className="flex gap-4 p-1 bg-bg-secondary rounded-lg w-fit border border-border">
                                <button
                                    onClick={() => setPaymentSubTab('selection')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${paymentSubTab === 'selection' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                                >
                                    Event Gateway
                                </button>
                                <button
                                    onClick={() => setPaymentSubTab('config')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${paymentSubTab === 'config' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                                >
                                    Gateway Credentials
                                </button>
                            </div>

                            {paymentSubTab === 'selection' ? (
                                <div className="animate-fade-in">
                                    {/* Section 1: Global Platform Policy */}
                                    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-20"></div>
                                        <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-accent" />
                                            Active Platform Provider
                                        </h3>
                                        <div className="max-w-md">
                                            <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Default Gateway Strategy</label>
                                            <select
                                                name="payment_provider"
                                                value={eventData.payment_provider || ''}
                                                onChange={handleInputChange}
                                                className={getInputClass('payment_provider')}
                                            >
                                                <option value="">(Not Configured)</option>
                                                <option value="razorpay">Razorpay Platform</option>
                                                <option value="stripe">Stripe Global</option>
                                            </select>
                                            <p className="text-xs text-text-tertiary mt-3 leading-relaxed">
                                                Select the primary gateway that will handle all registrations and financial transactions for this event instance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    <PaymentConfig token={token} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;

