import { useState } from 'react';
import { eventService } from '../../../services/eventService';
import { needsScSync } from '../domain/attendeeFieldGroups';

export default function useScBadgeSync({
    selectedEvent,
    token,
    setAttendees,
    setSelectedAttendee,
}) {
    const [syncingScUuid, setSyncingScUuid] = useState(null);
    const [scSyncError, setScSyncError] = useState('');
    const [scSyncSuccess, setScSyncSuccess] = useState('');
    const [isScSyncErrorModalOpen, setIsScSyncErrorModalOpen] = useState(false);

    const clearScSyncMessages = () => {
        setScSyncError('');
        setScSyncSuccess('');
    };

    const handleSyncWithSC = async (attendee) => {
        if (!selectedEvent || !attendee?.uuid) return;

        setSyncingScUuid(attendee.uuid);
        setScSyncError('');
        setScSyncSuccess('');
        setIsScSyncErrorModalOpen(false);

        try {
            const data = await eventService.syncAttendeeWithSC(
                selectedEvent.id,
                token,
                attendee.uuid
            );

            setAttendees((prev) =>
                prev.map((item) =>
                    item.uuid === attendee.uuid ? { ...item, evc_id: data.evc_id } : item
                )
            );
            setSelectedAttendee((prev) =>
                prev?.uuid === attendee.uuid ? { ...prev, evc_id: data.evc_id } : prev
            );
            setScSyncSuccess(`Synced with SC. EVC ID: ${data.evc_id}`);
        } catch (err) {
            const reason = err.message || 'Failed to sync badge with SC.';
            setScSyncError(reason);
            setIsScSyncErrorModalOpen(true);
        } finally {
            setSyncingScUuid(null);
        }
    };

    const closeScSyncErrorModal = () => {
        setIsScSyncErrorModalOpen(false);
    };

    return {
        syncingScUuid,
        scSyncError,
        scSyncSuccess,
        isScSyncErrorModalOpen,
        needsScSync,
        clearScSyncMessages,
        handleSyncWithSC,
        closeScSyncErrorModal,
    };
}
