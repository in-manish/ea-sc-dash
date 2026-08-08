import { useState, useRef } from 'react';
import { eventService } from '../../../services/eventService';
import { attendeeSelectionService } from '../../../services/attendeeSelectionService';

export default function useEBadgeActions({
    selectedEvent,
    token,
    getSelection,
    debouncedSearch,
    searchType,
    filters,
    total,
    clearSelection,
    setActiveTab,
}) {
    const [isEBadgeModalOpen, setIsEBadgeModalOpen] = useState(false);
    const [isGeneratingEBadge, setIsGeneratingEBadge] = useState(false);
    const [eBadgeResult, setEBadgeResult] = useState(null);
    const [eBadgeError, setEBadgeError] = useState('');

    const clearSelectionRef = useRef(clearSelection);
    clearSelectionRef.current = clearSelection;
    const getSelectionRef = useRef(getSelection);
    getSelectionRef.current = getSelection;

    const clearError = () => setEBadgeError('');

    const handleCreateEBadge = async (singleAttendeeUuid = null) => {
        if (!selectedEvent) return;

        setIsGeneratingEBadge(true);
        setEBadgeError('');
        setEBadgeResult(null);
        setIsEBadgeModalOpen(true);

        try {
            let payload;
            if (singleAttendeeUuid) {
                payload = { attendee_uuids: [singleAttendeeUuid] };
            } else {
                const { selectionMode, selectedAttendeeUuids } = getSelectionRef.current();
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
                payload = selection.payload;
            }

            const data = await eventService.createEBadge(selectedEvent.id, token, payload);

            if (data.badge_link) {
                setEBadgeResult({ type: 'single', link: data.badge_link });
            } else if (data.progress_uuid) {
                setEBadgeResult({
                    type: 'multiple',
                    progressUuid: data.progress_uuid,
                    total:
                        data.total ||
                        (payload.attendee_uuids ? payload.attendee_uuids.length : total),
                });
                clearSelectionRef.current?.();
            } else {
                throw new Error('Unexpected response format from e-badge service.');
            }
        } catch (err) {
            setEBadgeError(err.message || 'Failed to generate e-badge. Please try again.');
        } finally {
            setIsGeneratingEBadge(false);
        }
    };

    const closeEBadgeModal = () => {
        setIsEBadgeModalOpen(false);
        if (eBadgeResult && eBadgeResult.type === 'multiple') {
            setActiveTab('tasks');
        }
    };

    return {
        isEBadgeModalOpen,
        setIsEBadgeModalOpen,
        isGeneratingEBadge,
        eBadgeResult,
        eBadgeError,
        clearError,
        handleCreateEBadge,
        closeEBadgeModal,
    };
}
