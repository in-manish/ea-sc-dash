import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { getFullUrl } from '../utils/url';
import AttendeeTypeListView from './attendee-types/components/AttendeeTypeListView';
import AttendeeTypeDetailView from './attendee-types/components/AttendeeTypeDetailView';
import AddEditModal from './attendee-types/components/AddEditModal';
import FullscreenPreview from './attendee-types/components/FullscreenPreview';

const AttendeeTypes = () => {
    const { id } = useParams();
    const { token } = useAuth();

    // Core State
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Modal & Action State
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
    const [editingAttendeeType, setEditingAttendeeType] = useState(null);
    const [attendeeTypeForm, setAttendeeTypeForm] = useState({ name: '', is_special: false });
    const [isAttendeeSaving, setIsAttendeeSaving] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Feature-specific State
    const [badgeDesign, setBadgeDesign] = useState({ badge_width: '', badge_height: '', displayFields: {} });
    const [emailDraft, setEmailDraft] = useState({ subject: '', email: '' });
    const [smsDraft, setSmsDraft] = useState({ sms_body: '' });
    const [transferTargetId, setTransferTargetId] = useState('');
    const [isBadgeFlipped, setIsBadgeFlipped] = useState(false);
    const [isFullscreenPreviewOpen, setIsFullscreenPreviewOpen] = useState(false);
    const [fullscreenPreviewType, setFullscreenPreviewType] = useState('badge');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    useEffect(() => {
        if (id && token) fetchAttendeeTypes();
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
        setEditingAttendeeType(type);
        setAttendeeTypeForm(type ? { name: type.name, is_special: !!type.is_special } : { name: '', is_special: false });
        setIsAttendeeModalOpen(true);
    };

    const handleSaveAttendeeType = async () => {
        if (!attendeeTypeForm.name.trim()) return;
        setIsAttendeeSaving(true);
        try {
            const updatedTypes = editingAttendeeType
                ? attendeeTypes.map(at => at.id === editingAttendeeType.id ? { ...at, ...attendeeTypeForm } : at)
                : [...attendeeTypes, { id: null, ...attendeeTypeForm }];

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
        if (!window.confirm('Are you sure you want to delete this attendee type?')) return;
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
        setIsLoading(true);
        try {
            const designData = await eventService.getBadgeDesign(id, type.id, token);
            setBadgeDesign({
                badge_width: designData.badge_width || '1000',
                badge_height: designData.badge_height || '1400',
                displayFields: designData.displayFields || {}
            });

            const emailData = await eventService.getEmailDrafts(id, token, type.id);
            const smsData = await eventService.getSMSDrafts(id, token, type.id);

            setEmailDraft(emailData.attendee_types?.length > 0
                ? { subject: emailData.attendee_types[0].subject || '', email: emailData.attendee_types[0].email || '' }
                : { subject: '', email: '' });

            setSmsDraft(smsData?.length > 0 ? { sms_body: smsData[0].sms_body || '' } : { sms_body: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadBadgeImage = async (field, file) => {
        if (!file) return;
        setIsActionLoading(true);
        try {
            const formData = new FormData();
            formData.append(field, file);
            const response = await eventService.uploadBadgeImages(id, selectedType.id, token, formData);
            setSelectedType(prev => ({ ...prev, [field]: response[field] || prev[field] }));
            setMessage({ type: 'success', text: `${field.replace('_', ' ')} uploaded.` });
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUploadEmailTemplate = async (file) => {
        if (!file) return;
        setIsActionLoading(true);
        try {
            const response = await eventService.uploadEmailBadgeTemplate(id, selectedType.id, token, file);
            setSelectedType(prev => ({ ...prev, email_badge_template: response.badge }));
            setMessage({ type: 'success', text: 'Template uploaded.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateDesign = async () => {
        setIsActionLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('badge_width', badgeDesign.badge_width);
            formData.append('badge_height', badgeDesign.badge_height);
            formData.append('displayFields', JSON.stringify(badgeDesign.displayFields));
            await eventService.updateBadgeDesign(id, selectedType.id, token, formData);
            setMessage({ type: 'success', text: 'Design updated.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Update failed.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSaveDrafts = async () => {
        setIsActionLoading(true);
        try {
            await eventService.saveEmailDraft(id, token, { attendee_types: [selectedType.id], email: emailDraft.email, subject: emailDraft.subject });
            await eventService.saveSMSDraft(id, token, { attendee_types: [selectedType.id], sms_body: smsDraft.sms_body });
            setMessage({ type: 'success', text: 'Drafts saved.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Save failed.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleTransferAttendees = async () => {
        if (!transferTargetId || !window.confirm('Transfer all attendees? Irreversible.')) return;
        setIsActionLoading(true);
        try {
            await eventService.transferAttendees(id, token, { id: selectedType.id, new_id: parseInt(transferTargetId) });
            setMessage({ type: 'success', text: 'Attendees transferred.' });
            setTransferTargetId('');
        } catch (err) {
            setMessage({ type: 'error', text: 'Transfer failed.' });
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            {selectedType ? (
                <AttendeeTypeDetailView
                    {...{
                        selectedType, setSelectedType, activeTab, setActiveTab, isLoading, isActionLoading,
                        message, setMessage, badgeDesign, setBadgeDesign, emailDraft, setEmailDraft,
                        smsDraft, setSmsDraft, isBadgeFlipped, setIsBadgeFlipped, setIsFullscreenPreviewOpen,
                        setFullscreenPreviewType, isPreviewMode, setIsPreviewMode, handleUploadBadgeImage,
                        handleUploadEmailTemplate, handleUpdateDesign, handleSaveDrafts, handleTransferAttendees,
                        attendeeTypes, transferTargetId, setTransferTargetId, getFullUrl, handleSelectType
                    }}
                />
            ) : (
                <AttendeeTypeListView
                    {...{ isLoading, attendeeTypes, message, handleOpenAttendeeModal, handleDeleteAttendeeType, handleSelectType }}
                />
            )}

            <AddEditModal
                {...{ isAttendeeModalOpen, setIsAttendeeModalOpen, editingAttendeeType, attendeeTypeForm, setAttendeeTypeForm, isAttendeeSaving, handleSaveAttendeeType }}
            />

            <FullscreenPreview
                {...{ isFullscreenPreviewOpen, setIsFullscreenPreviewOpen, fullscreenPreviewType, selectedType, isBadgeFlipped, setIsBadgeFlipped, getFullUrl }}
            />
        </div>
    );
};

export default AttendeeTypes;
