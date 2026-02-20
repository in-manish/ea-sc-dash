import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Save, Loader2, Calendar, MapPin, Globe, Building2, Users, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

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
                if (key !== 'social_links' && key !== 'attendee_types' && key !== 'company_complimentary_invitee_info' && key !== 'location' && eventData[key] !== null) {
                    formData.append(key, eventData[key]);
                }
            });

            formData.append('social_links', JSON.stringify(eventData.social_links));
            formData.append('company_complimentary_invitee_info', JSON.stringify(eventData.company_complimentary_invitee_info || []));

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
                </div>

                <div className="max-w-[800px] animate-fade-in">
                    {activeTab === 'general' && (
                        <div className="animate-fade-in">
                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Basic Information</h3>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">Event Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={eventData.name || ''}
                                        onChange={handleInputChange}
                                        className={getInputClass('name')}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">Description</label>
                                    <textarea
                                        name="description"
                                        value={eventData.description || ''}
                                        onChange={handleInputChange}
                                        className={getInputClass('description')}
                                        rows={3}
                                    />
                                </div>
                                <div className="mb-0">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">Website</label>
                                    <div className="relative flex items-center">
                                        <Globe size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={eventData.website || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('website', true)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Date & Location</h3>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-text-primary">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={eventData.start_date || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('start_date')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-text-primary">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={eventData.end_date || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('end_date')}
                                        />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">Address</label>
                                    <div className="relative flex items-center">
                                        <MapPin size={16} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                                        <input
                                            type="text"
                                            name="address"
                                            value={eventData.address || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('address', true)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={eventData.city || ''}
                                        onChange={handleInputChange}
                                        className={getInputClass('city')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="animate-fade-in">
                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Configuration</h3>
                                <div className="flex justify-between items-center mb-5 pb-5 border-b border-dashed border-border text-sm">
                                    <label className="font-medium text-text-primary cursor-pointer mb-0">Company Lock Display</label>
                                    <ToggleSwitch
                                        name="is_company_lock_display_enabled"
                                        checked={eventData.is_company_lock_display_enabled || false}
                                        isModified={isFieldModified('is_company_lock_display_enabled')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={`flex justify-between items-center ${eventData.meeting_diary_enabled ? 'mb-5 pb-5 border-b border-dashed border-border' : 'mb-0'} text-sm`}>
                                    <label className="font-medium text-text-primary cursor-pointer mb-0">Meeting Diary Enabled</label>
                                    <ToggleSwitch
                                        name="meeting_diary_enabled"
                                        checked={!!eventData.meeting_diary_enabled}
                                        isModified={isFieldModified('meeting_diary_enabled')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {eventData.meeting_diary_enabled && (
                                    <div className="mb-0 mt-5">
                                        <label className="block mb-2 text-sm font-medium text-text-primary">Meeting Diary Domain</label>
                                        <input
                                            type="text"
                                            name="meetingdiary_domain"
                                            value={eventData.meetingdiary_domain || ''}
                                            onChange={handleInputChange}
                                            className={getInputClass('meetingdiary_domain')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Resources</h3>
                                <div className="mb-0">
                                    <label className="block mb-2 text-sm font-medium text-text-primary">Floor Plan Link</label>
                                    <input
                                        type="url"
                                        name="floor_plan_link"
                                        value={eventData.floor_plan_link || ''}
                                        onChange={handleInputChange}
                                        className={getInputClass('floor_plan_link')}
                                    />
                                </div>
                            </div>

                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
                                    <h3 className="text-base font-semibold text-text-primary m-0">Complimentary Invitee Info</h3>
                                    <button className="btn btn-sm btn-secondary flex items-center" onClick={addInviteeInfo} type="button">
                                        <Plus size={14} style={{ marginRight: '4px' }} />
                                        Add Info Block
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {(eventData.company_complimentary_invitee_info || []).map((info, index) => (
                                        <div key={index} className="bg-bg-secondary border border-border rounded-md p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">#{index + 1}</span>
                                                <div className="flex gap-2 items-center">
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 rounded-sm border border-border bg-bg-primary text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => moveInviteeInfo(index, -1)}
                                                        disabled={index === 0}
                                                        title="Move Up"
                                                        type="button"
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 rounded-sm border border-border bg-bg-primary text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => moveInviteeInfo(index, 1)}
                                                        disabled={index === (eventData.company_complimentary_invitee_info || []).length - 1}
                                                        title="Move Down"
                                                        type="button"
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                    <div className="w-[1px] h-6 bg-border mx-1"></div>
                                                    <button
                                                        className={`flex items-center justify-center w-8 h-8 rounded-sm border transition-all duration-200 ${previewStates[index] ? 'bg-accent text-white border-accent' : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`}
                                                        onClick={() => togglePreview(index)}
                                                        title={previewStates[index] ? "Edit Mode" : "Preview Mode"}
                                                        type="button"
                                                    >
                                                        {previewStates[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 rounded-sm border border-border bg-bg-primary text-text-secondary transition-all duration-200 hover:bg-red-100 hover:text-red-800 hover:border-red-200"
                                                        onClick={() => removeInviteeInfo(index)}
                                                        title="Remove"
                                                        type="button"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <label className="block mb-2 text-sm font-medium text-text-primary">Title</label>
                                                <input
                                                    type="text"
                                                    value={info.title || ''}
                                                    onChange={(e) => handleInviteeInfoChange(index, 'title', e.target.value)}
                                                    className={getInviteeInputClass(index, 'title')}
                                                    placeholder="e.g., Eligibility Criteria"
                                                />
                                            </div>

                                            <div className="mb-0">
                                                <label className="block mb-2 text-sm font-medium text-text-primary">Description (HTML Supported)</label>
                                                {previewStates[index] ? (
                                                    <div
                                                        className="bg-bg-primary border border-border rounded-md p-4 min-h-[120px] text-sm leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: info.description }}
                                                        style={{ listStylePosition: 'inside' }}
                                                    />
                                                ) : (
                                                    <textarea
                                                        value={info.description || ''}
                                                        onChange={(e) => handleInviteeInfoChange(index, 'description', e.target.value)}
                                                        className={getInviteeInputClass(index, 'description')}
                                                        rows={5}
                                                        placeholder="Enter description..."
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {(!eventData.company_complimentary_invitee_info || eventData.company_complimentary_invitee_info.length === 0) && (
                                        <div className="text-center p-8 bg-bg-secondary rounded-md border border-dashed border-border text-text-secondary flex flex-col items-center gap-4">
                                            <p>No complimentary invitee information added.</p>
                                            <button className="btn btn-sm btn-secondary" onClick={addInviteeInfo} type="button">
                                                Add First Block
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendees' && (
                        <div className="animate-fade-in">
                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Features</h3>
                                <div className="flex justify-between items-center mb-5 pb-5 border-b border-dashed border-border text-sm">
                                    <label className="font-medium text-text-primary cursor-pointer mb-0">Event Active</label>
                                    <ToggleSwitch
                                        name="event_active"
                                        checked={eventData.event_active || false}
                                        isModified={isFieldModified('event_active')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-between items-center mb-5 pb-5 border-b border-dashed border-border text-sm">
                                    <label className="font-medium text-text-primary cursor-pointer mb-0">Print/SMS Enabled</label>
                                    <ToggleSwitch
                                        name="print_sms_enabled"
                                        checked={eventData.print_sms_enabled || false}
                                        isModified={isFieldModified('print_sms_enabled')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <label className="font-medium text-text-primary cursor-pointer mb-0">Twilio Enabled</label>
                                    <ToggleSwitch
                                        name="twilio_on"
                                        checked={eventData.twilio_on || false}
                                        isModified={isFieldModified('twilio_on')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                                <h3 className="text-base font-semibold text-text-primary mb-6 pb-2 border-b border-border">Attendee Types</h3>
                                <div className="flex flex-col gap-2">
                                    {eventData.attendee_types?.map(type => (
                                        <div key={type.id} className="flex justify-between items-center p-3 bg-bg-secondary rounded-md">
                                            <span className="text-sm font-medium">{type.name}</span>
                                            {type.email_saved && <span className="py-1 px-2 rounded font-semibold text-xs bg-green-100 text-green-800">Email Saved</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
