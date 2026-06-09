import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import { Save, Loader2 } from 'lucide-react';

// Import modular components
import GeneralSettings from './GeneralSettings';
import CompanySettings from './CompanySettings';
import AttendeeSettings from './AttendeeSettings';
import PaymentSettings from './PaymentSettings';
import CommunicationSettings from './CommunicationSettings';
import IntegrationSettings from './IntegrationSettings';
import LocalizationSettings from './LocalizationSettings';
import MeetingDiarySettings from './MeetingDiarySettings';
import AgendaSettings from './AgendaSettings';
import JsonTree from './components/JsonTree';

const EventSettings = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = useAuth();
    
    const urlTab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(urlTab || 'general');

    useEffect(() => {
        if (urlTab && urlTab !== activeTab) {
            setActiveTab(urlTab);
        }
    }, [urlTab]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId }, { replace: true });
    };
    const [eventData, setEventData] = useState(null);
    const [originalEventData, setOriginalEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewStates, setPreviewStates] = useState({});
    const [editableJson, setEditableJson] = useState('');
    const [payloadView, setPayloadView] = useState('tree'); // 'tree' or 'editor'

    useEffect(() => {
        if (id && token) {
            fetchEventDetails();
        }
    }, [id, token]);

    useEffect(() => {
        if (eventData) {
            setEditableJson(JSON.stringify(eventData, null, 2));
        }
    }, [activeTab === 'payload']);

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const isFieldModified = (fieldName) => {
        if (!originalEventData) return false;
        if (typeof eventData[fieldName] === 'boolean' || typeof originalEventData[fieldName] === 'boolean') {
            return !!eventData[fieldName] !== !!originalEventData[fieldName];
        }
        return eventData[fieldName] !== originalEventData[fieldName];
    };

    // Comp-Complimentary Invitee Helpers
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
        setPreviewStates(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const moveInviteeInfo = (index, direction) => {
        setEventData(prev => {
            const updatedInfo = [...(prev.company_complimentary_invitee_info || [])];
            const targetIndex = index + direction;
            if (targetIndex >= 0 && targetIndex < updatedInfo.length) {
                [updatedInfo[index], updatedInfo[targetIndex]] = [updatedInfo[targetIndex], updatedInfo[index]];
            }
            return { ...prev, company_complimentary_invitee_info: updatedInfo };
        });
    };

    const handleExhibitorStatsChange = (field, value) => {
        setEventData(prev => ({
            ...prev,
            exhibitor_stats: {
                ...(prev.exhibitor_stats || { 
                    is_active: false, 
                    country_stat_text: '', 
                    exhibitor_stat_text: '',
                    country_stat_description: '',
                    exhibitor_stat_description: ''
                }),
                [field]: value
            }
        }));
    };

    const isExhibitorStatModified = (field) => {
        if (!originalEventData) return false;
        const current = eventData.exhibitor_stats?.[field];
        const original = originalEventData.exhibitor_stats?.[field];
        return current !== original;
    };

    const handleInterestedInChange = (field, value) => {
        setEventData(prev => ({
            ...prev,
            interested_in: {
                ...(prev.interested_in || { 
                    is_active: true, 
                    exhibit_url: '', 
                    visit_url: ''
                }),
                [field]: value
            }
        }));
    };

    const isInterestedInModified = (field) => {
        if (!originalEventData) return false;
        const current = eventData.interested_in?.[field];
        const original = originalEventData.interested_in?.[field];
        return current !== original;
    };

    const handleMeetingDiaryChange = (field, value) => {
        setEventData(prev => ({
            ...prev,
            meeting_diary: {
                ...(prev.meeting_diary || { 
                    active_login_text_display: '', 
                    inactive_login_text_display: ''
                }),
                [field]: value
            }
        }));
    };

    const isMeetingDiaryModified = (field) => {
        if (!originalEventData) return false;
        const current = eventData.meeting_diary?.[field];
        const original = originalEventData.meeting_diary?.[field];
        return current !== original;
    };

    const handleAgendaChange = (field, value) => {
        setEventData(prev => ({
            ...prev,
            agenda: {
                ...(prev.agenda || {
                    preview_active: false,
                    preview_title: '',
                    preview_description: '',
                    preview_cta: {
                        is_active: true,
                        title: '',
                        description: '',
                        exhibit_url: '',
                        visit_url: ''
                    },
                    preview_stats: {
                        is_active: true,
                        speaker_text: '',
                        speaker_description: '',
                        session_text: '',
                        session_description: ''
                    }
                }),
                [field]: value
            }
        }));
    };

    const handleAgendaNestedChange = (section, field, value) => {
        setEventData(prev => {
            const currentAgenda = prev.agenda || {};
            return {
                ...prev,
                agenda: {
                    ...currentAgenda,
                    [section]: {
                        ...(currentAgenda[section] || {}),
                        [field]: value
                    }
                }
            };
        });
    };

    const isAgendaModified = (field, section = null) => {
        if (!originalEventData) return false;
        const current = section ? eventData.agenda?.[section]?.[field] : eventData.agenda?.[field];
        const original = section ? originalEventData.agenda?.[section]?.[field] : originalEventData.agenda?.[field];
        return current !== original;
    };

    const handleApplyJson = () => {
        try {
            const parsed = JSON.parse(editableJson);
            setEventData(parsed);
            setMessage({ type: 'success', text: 'JSON applied to state. Don\'t forget to Save Changes to persist.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Invalid JSON: ' + err.message });
        }
    };

    const handleUpdatePayloadPath = (path, value) => {
        setEventData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newData;
        });
        setMessage({ type: 'success', text: `Field "${path.join('.')}" updated locally.` });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            
            // List of fields to exclude from direct stringification or handled separately
            const excludedFields = [
                'social_links', 
                'attendee_types', 
                'company_complimentary_invitee_info', 
                'location', 
                'intl_meta', 
                'intl_data',
                'exhibitor_stats',
                'interested_in',
                'meeting_diary',
                'agenda'
            ];
            
            const imageFields = ['logo', 'logo2', 'event_background_image', 'event_banner_logo', 'meetingdiary_portal_bg_image'];

            Object.keys(eventData).forEach(key => {
                const value = eventData[key];
                
                if (excludedFields.includes(key)) return;
                
                // Skip unchanged images if they are strings (URLs)
                if (imageFields.includes(key) && typeof value === 'string') return;
                
                if (value === null) {
                    formData.append(key, '');
                    return;
                }

                if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            // Re-append complex fields stringified
            formData.append('social_links', JSON.stringify(eventData.social_links || {}));
            formData.append('company_complimentary_invitee_info', JSON.stringify(eventData.company_complimentary_invitee_info || []));
            formData.append('exhibitor_stats', JSON.stringify(eventData.exhibitor_stats || { 
                is_active: false, 
                country_stat_text: '', 
                exhibitor_stat_text: '',
                country_stat_description: '',
                exhibitor_stat_description: ''
            }));
            formData.append('interested_in', JSON.stringify(eventData.interested_in || {
                is_active: true,
                exhibit_url: '',
                visit_url: ''
            }));
            formData.append('meeting_diary', JSON.stringify(eventData.meeting_diary || {
                active_login_text_display: '',
                inactive_login_text_display: ''
            }));
            formData.append('agenda', JSON.stringify(eventData.agenda || {
                preview_active: false,
                preview_title: '',
                preview_description: '',
                preview_cta: {
                    is_active: true,
                    title: '',
                    description: '',
                    exhibit_url: '',
                    visit_url: ''
                },
                preview_stats: {
                    is_active: true,
                    speaker_text: '',
                    speaker_description: '',
                    session_text: '',
                    session_description: ''
                }
            }));
            
            if (eventData.intl_meta) formData.append('intl_meta', JSON.stringify(eventData.intl_meta));
            if (eventData.intl_data) formData.append('intl_data', JSON.stringify(eventData.intl_data));

            // --- MANUAL PAYLOAD MODIFICATION AREA ---
            // You can manually add or override any keys here before the update request.
            // Example: formData.append('new_feature_key', 'true');
            // formData.append('another_key', JSON.stringify({ a: 1 }));
            // ---------------------------------------

            // console.log('Final Payload:', Object.fromEntries(formData.entries()));

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

    if (isLoading) {
        return (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center gap-4 text-text-secondary">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading settings...</p>
            </div>
        );
    }

    if (!eventData) return null;

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'companies', label: 'Companies' },
        { id: 'attendees', label: 'Attendees' },
        { id: 'communication', label: 'Communication' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'payments', label: 'Payments' },
        { id: 'localization', label: 'Localization' },
        { id: 'meeting_diary', label: 'Meeting Diary' },
        { id: 'agenda', label: 'Agenda' },
        { id: 'payload', label: 'Payload' },
    ];

    return (
        <div className="pb-8 animate-fade-in">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-border">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Event Settings</h1>
                    <p className="text-sm text-text-secondary">Manage configuration for {eventData.name}</p>
                </div>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="mr-2" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-md mb-6 text-sm font-medium border ${message.type === 'success' ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-2 mb-6 border-b border-border pb-[1px]">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`bg-transparent border-none py-3 px-6 text-sm font-medium cursor-pointer border-b-2 transition-all duration-200 ${activeTab === tab.id ? 'text-accent border-accent font-semibold' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-[800px]">
                {activeTab === 'general' && (
                    <GeneralSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                    />
                )}
                {activeTab === 'companies' && (
                    <CompanySettings 
                        eventData={{...eventData, originalData: originalEventData}} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified}
                        addInviteeInfo={addInviteeInfo}
                        removeInviteeInfo={removeInviteeInfo}
                        handleInviteeInfoChange={handleInviteeInfoChange}
                        togglePreview={togglePreview}
                        moveInviteeInfo={moveInviteeInfo}
                        previewStates={previewStates}
                        handleExhibitorStatsChange={handleExhibitorStatsChange}
                        isExhibitorStatModified={isExhibitorStatModified}
                        handleInterestedInChange={handleInterestedInChange}
                        isInterestedInModified={isInterestedInModified}
                    />
                )}
                {activeTab === 'attendees' && (
                    <AttendeeSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                    />
                )}
                {activeTab === 'communication' && (
                    <CommunicationSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                    />
                )}
                {activeTab === 'integrations' && (
                    <IntegrationSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                    />
                )}
                {activeTab === 'payments' && (
                    <PaymentSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                        token={token}
                    />
                )}
                {activeTab === 'localization' && (
                    <LocalizationSettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                    />
                )}
                {activeTab === 'meeting_diary' && (
                    <MeetingDiarySettings 
                        eventData={eventData} 
                        handleInputChange={handleInputChange} 
                        isFieldModified={isFieldModified} 
                        handleMeetingDiaryChange={handleMeetingDiaryChange}
                        isMeetingDiaryModified={isMeetingDiaryModified}
                    />
                )}
                {activeTab === 'agenda' && (
                    <AgendaSettings
                        eventData={eventData}
                        handleAgendaChange={handleAgendaChange}
                        handleAgendaNestedChange={handleAgendaNestedChange}
                        isAgendaModified={isAgendaModified}
                    />
                )}
                {activeTab === 'payload' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-base font-semibold text-text-primary m-0">Current Working Data</h3>
                                    <div className="flex bg-bg-secondary rounded-md p-1 border border-border">
                                        <button 
                                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${payloadView === 'editor' ? 'bg-accent text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                                            onClick={() => setPayloadView('editor')}
                                        >
                                            EDITOR
                                        </button>
                                        <button 
                                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${payloadView === 'tree' ? 'bg-accent text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                                            onClick={() => setPayloadView('tree')}
                                        >
                                            TREE
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {payloadView === 'editor' && (
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={handleApplyJson}
                                        >
                                            Apply Changes
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            const original = JSON.parse(JSON.stringify(originalEventData));
                                            setEventData(original);
                                            setEditableJson(JSON.stringify(original, null, 2));
                                            setMessage({ type: 'success', text: 'Reset to original data.' });
                                        }}
                                    >
                                        Reset
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => navigator.clipboard.writeText(editableJson)}
                                    >
                                        Copy JSON
                                    </button>
                                </div>
                            </div>
                            
                            {payloadView === 'editor' ? (
                                <textarea 
                                    className="w-full bg-bg-secondary p-4 rounded-md text-[11px] font-mono border border-border text-text-secondary leading-relaxed shadow-inner min-h-[500px] focus:outline-none focus:ring-1 focus:ring-accent"
                                    value={editableJson}
                                    onChange={(e) => setEditableJson(e.target.value)}
                                    spellCheck={false}
                                />
                            ) : (
                                <div className="animate-fade-in">
                                    <JsonTree 
                                        data={eventData} 
                                        onUpdate={handleUpdatePayloadPath}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-text-primary m-0">Original Loaded Data</h3>
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => navigator.clipboard.writeText(JSON.stringify(originalEventData, null, 2))}
                                >
                                    Copy JSON
                                </button>
                            </div>
                            <div className="animate-fade-in">
                                <JsonTree data={originalEventData} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventSettings;
