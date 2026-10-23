import { useState } from 'react';
import { attendeeApi } from '../api/attendeeApi';

/** EA's meeting guardrail returns { msg: [...], meeting_count: [...] }; prefer msg. */
function deleteErrorMessage(err) {
    if (err.status === 403) return 'You do not have permission to delete attendees.';
    const msg = err.data?.msg;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
    return err.message || 'Failed to delete attendees.';
}

/** 400 from EA's meeting guardrail: the request can be retried with force_delete. */
function isLinkedMeetingsError(err) {
    return err.status === 400 && err.data?.meeting_count != null;
}

/** Delete the rows selected on the current page (selection mode 'selected' only). */
export default function useDeleteAttendees({
    eventId,
    token,
    selectionMode,
    selectedAttendeeUuids,
    clearSelection,
    onDeleted,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [canForce, setCanForce] = useState(false);
    const [success, setSuccess] = useState('');

    const canDelete = selectionMode === 'selected' && selectedAttendeeUuids.length > 0;

    const open = () => {
        if (!canDelete) return;
        setError('');
        setCanForce(false);
        setSuccess('');
        setIsOpen(true);
    };

    const close = () => {
        if (deleting) return;
        setIsOpen(false);
        setError('');
        setCanForce(false);
    };

    const confirm = async ({ forceDelete = false } = {}) => {
        if (!canDelete || !eventId || !token) return;
        const count = selectedAttendeeUuids.length;
        setDeleting(true);
        setError('');
        try {
            await attendeeApi.deleteAttendees(eventId, selectedAttendeeUuids, token, { forceDelete });
            setIsOpen(false);
            setSuccess(`Deleted ${count} attendee${count === 1 ? '' : 's'}.`);
            clearSelection();
            onDeleted?.();
        } catch (err) {
            setError(deleteErrorMessage(err));
            if (isLinkedMeetingsError(err)) setCanForce(true);
        } finally {
            setDeleting(false);
        }
    };

    return {
        success,
        canDelete,
        open,
        modalProps: { isOpen, deleting, error, canForce, onClose: close, onConfirm: confirm },
    };
}
