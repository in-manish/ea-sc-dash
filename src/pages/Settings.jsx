import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Save, Loader2, Calendar, MapPin, Globe, Building2, Users, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const { id } = useParams();
    const { selectedEvent, token } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [eventData, setEventData] = useState(null);
    const [originalEventData, setOriginalEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewStates, setPreviewStates] = useState({}); // formatted: { index: boolean }

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        setIsLoading(true);
        try {
            // Token from context
            const data = await eventService.getEventDetails(id, token);
            setEventData(data);
            setOriginalEventData(JSON.parse(JSON.stringify(data))); // Deep copy for comparison
        } catch (error) {
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

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [name]: value
            }
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

        // Also swap preview states if needed, though they are index based so maybe just reset or swap them too
        // For simplicity, let's just reset the swapped indices preview state to false (edit mode) to avoid confusion
        setPreviewStates(prev => {
            const newState = { ...prev };
            const targetIndex = index + direction;
            if (newState[index] !== undefined || newState[targetIndex] !== undefined) {
                // Swap the preview states as well to maintain the view mode
                const temp = newState[index];
                newState[index] = newState[targetIndex];
                newState[targetIndex] = temp;
            }
            return newState;
        });
    };

    const isFieldModified = (fieldName) => {
        if (!originalEventData) return false;
        // Handle boolean fields which might be null in DB but false in state or vice versa
        if (typeof eventData[fieldName] === 'boolean' || typeof originalEventData[fieldName] === 'boolean') {
            return !!eventData[fieldName] !== !!originalEventData[fieldName];
        }
        return eventData[fieldName] !== originalEventData[fieldName];
    };

    const isSocialLinkModified = (platform) => {
        if (!originalEventData || !originalEventData.social_links) return false;
        const original = originalEventData.social_links[platform] || '';
        const current = eventData.social_links?.[platform] || '';
        return original !== current;
    };

    const isInviteeInfoModified = (index, field) => {
        if (!originalEventData || !originalEventData.company_complimentary_invitee_info) return true; // New item
        if (!originalEventData.company_complimentary_invitee_info[index]) return true; // New item
        return eventData.company_complimentary_invitee_info[index][field] !== originalEventData.company_complimentary_invitee_info[index][field];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Token from context
            const formData = new FormData();

            // Append simple fields
            Object.keys(eventData).forEach(key => {
                if (key !== 'social_links' && key !== 'attendee_types' && key !== 'company_complimentary_invitee_info' && key !== 'location' && eventData[key] !== null) {
                    formData.append(key, eventData[key]);
                }
            });

            // Append complex fields
            formData.append('social_links', JSON.stringify(eventData.social_links));
            formData.append('company_complimentary_invitee_info', JSON.stringify(eventData.company_complimentary_invitee_info || []));

            await eventService.updateEvent(id, token, formData);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setOriginalEventData(JSON.parse(JSON.stringify(eventData))); // Update original reference on save

            // Refresh data to ensure sync
            fetchEventDetails();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="settings-page loading">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading settings...</p>
            </div>
        );
    }

    if (!eventData) return null;

    return (
        <div className="settings-page animate-fade-in">
            <div className="settings-header">
                <div>
                    <h1 className="page-title">Event Settings</h1>
                    <p className="page-subtitle">Manage configuration for {eventData.name}</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-content">
                <div className="settings-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('companies')}
                    >
                        Companies
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'attendees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendees')}
                    >
                        Attendees
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'general' && (
                        <div className="tab-panel animate-fade-in">
                            <div className="form-section">
                                <h3 className="section-title">Basic Information</h3>
                                <div className="form-group">
                                    <label>Event Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={eventData.name || ''}
                                        onChange={handleInputChange}
                                        className={`form-input ${isFieldModified('name') ? 'changed' : ''}`}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={eventData.description || ''}
                                        onChange={handleInputChange}
                                        className={`form-textarea ${isFieldModified('description') ? 'changed' : ''}`}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <div className="input-with-icon">
                                        <Globe size={16} />
                                        <input
                                            type="url"
                                            name="website"
                                            value={eventData.website || ''}
                                            onChange={handleInputChange}
                                            className={`form-input ${isFieldModified('website') ? 'changed' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Date & Location</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={eventData.start_date || ''}
                                            onChange={handleInputChange}
                                            className={`form-input ${isFieldModified('start_date') ? 'changed' : ''}`}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={eventData.end_date || ''}
                                            onChange={handleInputChange}
                                            className={`form-input ${isFieldModified('end_date') ? 'changed' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <div className="input-with-icon">
                                        <MapPin size={16} />
                                        <input
                                            type="text"
                                            name="address"
                                            value={eventData.address || ''}
                                            onChange={handleInputChange}
                                            className={`form-input ${isFieldModified('address') ? 'changed' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={eventData.city || ''}
                                        onChange={handleInputChange}
                                        className={`form-input ${isFieldModified('city') ? 'changed' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="tab-panel animate-fade-in">
                            <div className="form-section">
                                <h3 className="section-title">Configuration</h3>
                                <div className="form-group-toggle">
                                    <label>Company Lock Display</label>
                                    <label className={`toggle-switch ${isFieldModified('is_company_lock_display_enabled') ? 'changed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="is_company_lock_display_enabled"
                                            checked={eventData.is_company_lock_display_enabled || false}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="form-group-toggle">
                                    <label>Meeting Diary Enabled</label>
                                    <label className={`toggle-switch ${isFieldModified('meeting_diary_enabled') ? 'changed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="meeting_diary_enabled"
                                            checked={!!eventData.meeting_diary_enabled}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                {eventData.meeting_diary_enabled && (
                                    <div className="form-group">
                                        <label>Meeting Diary Domain</label>
                                        <input
                                            type="text"
                                            name="meetingdiary_domain"
                                            value={eventData.meetingdiary_domain || ''}
                                            onChange={handleInputChange}
                                            className={`form-input ${isFieldModified('meetingdiary_domain') ? 'changed' : ''}`}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Resources</h3>
                                <div className="form-group">
                                    <label>Floor Plan Link</label>
                                    <input
                                        type="url"
                                        name="floor_plan_link"
                                        value={eventData.floor_plan_link || ''}
                                        onChange={handleInputChange}
                                        className={`form-input ${isFieldModified('floor_plan_link') ? 'changed' : ''}`}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="section-header">
                                    <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>Complimentary Invitee Info</h3>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={addInviteeInfo}
                                        type="button"
                                    >
                                        <Plus size={14} style={{ marginRight: '4px' }} />
                                        Add Info Block
                                    </button>
                                </div>
                                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0 1.5rem 0' }}></div>

                                <div className="invitee-info-list">
                                    {(eventData.company_complimentary_invitee_info || []).map((info, index) => (
                                        <div key={index} className="invitee-info-card">
                                            <div className="invitee-info-header">
                                                <span className="info-index">#{index + 1}</span>
                                                <div className="info-actions">
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => moveInviteeInfo(index, -1)}
                                                        disabled={index === 0}
                                                        title="Move Up"
                                                        type="button"
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => moveInviteeInfo(index, 1)}
                                                        disabled={index === (eventData.company_complimentary_invitee_info || []).length - 1}
                                                        title="Move Down"
                                                        type="button"
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 4px' }}></div>
                                                    <button
                                                        className={`btn-icon ${previewStates[index] ? 'active' : ''}`}
                                                        onClick={() => togglePreview(index)}
                                                        title={previewStates[index] ? "Edit Mode" : "Preview Mode"}
                                                        type="button"
                                                    >
                                                        {previewStates[index] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        className="btn-icon danger"
                                                        onClick={() => removeInviteeInfo(index)}
                                                        title="Remove"
                                                        type="button"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={info.title || ''}
                                                    onChange={(e) => handleInviteeInfoChange(index, 'title', e.target.value)}
                                                    className={`form-input ${isInviteeInfoModified(index, 'title') ? 'changed' : ''}`}
                                                    placeholder="e.g., Eligibility Criteria"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Description (HTML Supported)</label>
                                                {previewStates[index] ? (
                                                    <div
                                                        className="html-preview"
                                                        dangerouslySetInnerHTML={{ __html: info.description }}
                                                    />
                                                ) : (
                                                    <textarea
                                                        value={info.description || ''}
                                                        onChange={(e) => handleInviteeInfoChange(index, 'description', e.target.value)}
                                                        className={`form-textarea ${isInviteeInfoModified(index, 'description') ? 'changed' : ''}`}
                                                        rows={5}
                                                        placeholder="Enter description..."
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {(!eventData.company_complimentary_invitee_info || eventData.company_complimentary_invitee_info.length === 0) && (
                                        <div className="empty-info-state">
                                            <p>No complimentary invitee information added.</p>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={addInviteeInfo}
                                                type="button"
                                            >
                                                Add First Block
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendees' && (
                        <div className="tab-panel animate-fade-in">
                            <div className="form-section">
                                <h3 className="section-title">Features</h3>
                                <div className="form-group-toggle">
                                    <label>Event Active</label>
                                    <label className={`toggle-switch ${isFieldModified('event_active') ? 'changed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="event_active"
                                            checked={eventData.event_active || false}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="form-group-toggle">
                                    <label>Print/SMS Enabled</label>
                                    <label className={`toggle-switch ${isFieldModified('print_sms_enabled') ? 'changed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="print_sms_enabled"
                                            checked={eventData.print_sms_enabled || false}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="form-group-toggle">
                                    <label>Twilio Enabled</label>
                                    <label className={`toggle-switch ${isFieldModified('twilio_on') ? 'changed' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="twilio_on"
                                            checked={eventData.twilio_on || false}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Attendee Types</h3>
                                <div className="attendee-types-list">
                                    {eventData.attendee_types?.map(type => (
                                        <div key={type.id} className="attendee-type-item">
                                            <span className="type-name">{type.name}</span>
                                            {type.email_saved && <span className="badge badge-success">Email Saved</span>}
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
