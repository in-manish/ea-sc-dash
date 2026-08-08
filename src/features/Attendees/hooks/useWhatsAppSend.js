import { useState, useEffect, useRef } from 'react';
import { eventService } from '../../../services/eventService';
import { attendeeSelectionService } from '../../../services/attendeeSelectionService';
import { whatsappService } from '../../../services/whatsappService';

export default function useWhatsAppSend({
    token,
    selectedEvent,
    getSelection,
    debouncedSearch,
    searchType,
    filters,
    clearSelection,
}) {
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [whatsAppTemplates, setWhatsAppTemplates] = useState([]);
    const [whatsAppTemplatesLoading, setWhatsAppTemplatesLoading] = useState(false);
    const [whatsAppTemplatesError, setWhatsAppTemplatesError] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [whatsAppActionError, setWhatsAppActionError] = useState('');
    const [whatsAppActionSuccess, setWhatsAppActionSuccess] = useState('');
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
    const [templateViewMode, setTemplateViewMode] = useState('list');
    const [expandedTemplateId, setExpandedTemplateId] = useState(null);
    const [previewContentMode, setPreviewContentMode] = useState('preview');

    const clearSelectionRef = useRef(clearSelection);
    clearSelectionRef.current = clearSelection;
    const getSelectionRef = useRef(getSelection);
    getSelectionRef.current = getSelection;

    useEffect(() => {
        if (!isWhatsAppModalOpen || !token) return;

        const fetchWhatsAppTemplates = async () => {
            setWhatsAppTemplatesLoading(true);
            setWhatsAppTemplatesError('');
            try {
                const response = await whatsappService.getTemplates(token, 'attendee');
                if (response?.success) {
                    setWhatsAppTemplates(response.templates || []);
                    return;
                }
                throw new Error(response?.message || 'Failed to load WhatsApp templates.');
            } catch (err) {
                setWhatsAppTemplates([]);
                setWhatsAppTemplatesError(err.message || 'Failed to load WhatsApp templates.');
            } finally {
                setWhatsAppTemplatesLoading(false);
            }
        };

        fetchWhatsAppTemplates();
    }, [isWhatsAppModalOpen, token]);

    const clearMessages = () => {
        setWhatsAppActionError('');
        setWhatsAppActionSuccess('');
    };

    const handleOpenWhatsAppModal = () => {
        setSelectedTemplateId(null);
        setTemplateViewMode('list');
        setExpandedTemplateId(null);
        setPreviewContentMode('preview');
        setWhatsAppActionError('');
        setWhatsAppActionSuccess('');
        setIsWhatsAppModalOpen(true);
    };

    const handleCloseWhatsAppModal = () => {
        setIsWhatsAppModalOpen(false);
        setSelectedTemplateId(null);
        setExpandedTemplateId(null);
        setPreviewContentMode('preview');
        setWhatsAppActionError('');
    };

    const handleSendWhatsApp = async () => {
        const { selectionMode, selectedAttendeeUuids } = getSelectionRef.current();
        if (!selectedTemplateId || selectionMode === 'none' || !selectedEvent) return;

        setIsSendingWhatsApp(true);
        setWhatsAppActionError('');

        try {
            const selection = attendeeSelectionService.buildSelection({
                mode: selectionMode,
                attendeeUuids: selectedAttendeeUuids,
                search: debouncedSearch,
                searchType,
                filters,
            });

            if (!selection.payload) {
                throw new Error('No attendees selected.');
            }

            const response = await eventService.sendAttendeeWhatsApp(selectedEvent.id, token, {
                ...selection.payload,
                wa_template_id: selectedTemplateId,
            });

            setWhatsAppActionSuccess(response?.msg || 'WhatsApp message sent successfully.');
            clearSelectionRef.current();
            setIsWhatsAppModalOpen(false);
            setSelectedTemplateId(null);
        } catch (err) {
            setWhatsAppActionError(err.message || 'Failed to send WhatsApp message.');
        } finally {
            setIsSendingWhatsApp(false);
        }
    };

    return {
        isWhatsAppModalOpen,
        whatsAppTemplates,
        whatsAppTemplatesLoading,
        whatsAppTemplatesError,
        selectedTemplateId,
        setSelectedTemplateId,
        whatsAppActionError,
        whatsAppActionSuccess,
        isSendingWhatsApp,
        templateViewMode,
        setTemplateViewMode,
        expandedTemplateId,
        setExpandedTemplateId,
        previewContentMode,
        setPreviewContentMode,
        clearMessages,
        handleOpenWhatsAppModal,
        handleCloseWhatsAppModal,
        handleSendWhatsApp,
    };
}
