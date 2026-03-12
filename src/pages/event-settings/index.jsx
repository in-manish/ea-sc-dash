import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const EventSettings = () => {
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
        if (id && token) {
            fetchEventDetails();
        }
    }, [id, token]);

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
                'intl_data'
            ];
            
            const imageFields = ['logo', 'logo2', 'event_background_image', 'event_banner_logo', 'meetingdiary_portal_bg_image'];

            Object.keys(eventData).forEach(key => {
                const value = eventData[key];
                
                if (excludedFields.includes(key)) return;
                
                // Skip unchanged images if they are strings (URLs)
                if (imageFields.includes(key) && typeof value === 'string') return;
                
                if (value === null) return;

                if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            // Re-append complex fields stringified
            formData.append('social_links', JSON.stringify(eventData.social_links || {}));
            formData.append('company_complimentary_invitee_info', JSON.stringify(eventData.company_complimentary_invitee_info || []));
            
            if (eventData.intl_meta) formData.append('intl_meta', JSON.stringify(eventData.intl_meta));
            if (eventData.intl_data) formData.append('intl_data', JSON.stringify(eventData.intl_data));

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
                        onClick={() => setActiveTab(tab.id)}
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
            </div>
        </div>
    );
};

export default EventSettings;
