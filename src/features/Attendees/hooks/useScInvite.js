import { useState } from 'react';
import { scInviteApi } from '../api/scInviteApi';
import { attendeeSelectionService } from '../../../services/attendeeSelectionService';

const DEFAULT_OPTIONS = { resetExisting: false, email: true, whatsapp: false };

/**
 * "Send SnapCard login" for the current selection (page rows, or all / all matching).
 * selection = { selectionMode, selectedAttendeeUuids, search, searchType, filters }.
 */
export default function useScInvite({ eventId, token, selection, onSent }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(DEFAULT_OPTIONS);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const open = () => {
        setOptions(DEFAULT_OPTIONS);
        setError('');
        setResult(null);
        setIsOpen(true);
    };

    const close = () => {
        if (sending) return;
        setIsOpen(false);
        if (result) onSent?.();
    };

    const setOption = (key, value) => {
        setError('');
        setOptions((prev) => ({ ...prev, [key]: value }));
    };

    const send = async () => {
        const sendMode = [options.email && 'email', options.whatsapp && 'whatsapp'].filter(Boolean);
        if (!sendMode.length) {
            setError('Pick at least one channel.');
            return;
        }
        const { payload } = attendeeSelectionService.buildSelection({
            mode: selection.selectionMode,
            attendeeUuids: selection.selectionMode === 'selected' ? selection.selectedAttendeeUuids : [],
            search: selection.search,
            searchType: selection.searchType,
            filters: selection.filters,
        });
        if (!payload || !eventId || !token) return;

        setSending(true);
        setError('');
        try {
            const response = await scInviteApi.sendInvites(eventId, token, {
                selectionPayload: payload,
                resetExisting: options.resetExisting,
                sendMode,
            });
            setResult({ ...response, sendMode, resetExisting: options.resetExisting });
        } catch (err) {
            setError(err.message || 'Failed to send SnapCard invites.');
        } finally {
            setSending(false);
        }
    };

    return { isOpen, options, sending, error, result, open, close, setOption, send };
}
