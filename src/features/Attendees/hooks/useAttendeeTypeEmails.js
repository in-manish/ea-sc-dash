import { useEffect, useRef, useState } from 'react';
import { attendeeSelectionService } from '../../../services/attendeeSelectionService';
import {
    listAttendeeTypeEmails,
    sendAttendeeEmails,
} from '../api/attendeeTypeEmailsApi';
import { sendCategoryTypeEmails } from '../api/categoryTypeEmailsApi';
import { parseAttendeeTypeEmails } from '../domain/parseAttendeeTypeEmails';
import { attendeeEmailSendMessage } from '../domain/parseCategoryTypeEmails';
import useCategoryTypeEmails from './useCategoryTypeEmails';

export default function useAttendeeTypeEmails({
    eventId,
    token,
    getSelection,
    debouncedSearch,
    searchType,
    filters,
    clearSelection,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewingDrafts, setViewingDrafts] = useState(false);
    const [badgeEmailSelected, setBadgeEmailSelected] = useState(true);
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState('');
    const [sendSuccess, setSendSuccess] = useState('');

    const getSelectionRef = useRef(getSelection);
    getSelectionRef.current = getSelection;
    const clearSelectionRef = useRef(clearSelection);
    clearSelectionRef.current = clearSelection;
    const searchRef = useRef({ debouncedSearch, searchType, filters });
    searchRef.current = { debouncedSearch, searchType, filters };
    const categoryEmails = useCategoryTypeEmails({
        eventId,
        token,
        enabled: isOpen,
    });
    const categorySelectedRef = useRef(categoryEmails.selectedIds);
    categorySelectedRef.current = categoryEmails.selectedIds;

    useEffect(() => {
        if (!isOpen || !viewingDrafts || !eventId || !token) return;

        let active = true;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await listAttendeeTypeEmails(eventId, token);
                if (active) setDrafts(parseAttendeeTypeEmails(data));
            } catch (err) {
                if (!active) return;
                setDrafts([]);
                setError(err.message || 'Failed to load email drafts.');
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [isOpen, viewingDrafts, eventId, token]);

    const open = () => {
        setViewingDrafts(false);
        setBadgeEmailSelected(true);
        setExpandedId(null);
        setError('');
        setSendError('');
        setSendSuccess('');
        setIsOpen(true);
    };

    const close = () => {
        if (sending) return;
        setIsOpen(false);
        setViewingDrafts(false);
        setExpandedId(null);
        setSendError('');
    };

    const viewDrafts = () => {
        setSendError('');
        setViewingDrafts(true);
    };

    const backToPicker = () => {
        setViewingDrafts(false);
        setExpandedId(null);
    };

    const toggleBadgeEmail = () => {
        setBadgeEmailSelected((prev) => !prev);
    };

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const send = async () => {
        const categoryIds = categorySelectedRef.current;
        if (!badgeEmailSelected && categoryIds.length === 0) return;
        const { selectionMode, selectedAttendeeUuids } = getSelectionRef.current?.() || {};
        if (!eventId || !token || selectionMode === 'none') return;

        setSending(true);
        setSendError('');
        try {
            const { debouncedSearch: search, searchType: type, filters: nextFilters } =
                searchRef.current;
            const built = attendeeSelectionService.buildSelection({
                mode: selectionMode,
                attendeeUuids: selectedAttendeeUuids,
                search,
                searchType: type,
                filters: nextFilters,
            });
            if (!built.payload) throw new Error('No attendees selected.');

            if (badgeEmailSelected) {
                await sendAttendeeEmails(eventId, token, built.payload);
            }
            if (categoryIds.length > 0) {
                await sendCategoryTypeEmails(eventId, token, {
                    ...built.payload,
                    email_ids: categoryIds,
                });
            }
            setSendSuccess(
                attendeeEmailSendMessage({
                    badge: badgeEmailSelected,
                    categoryCount: categoryIds.length,
                }),
            );
            clearSelectionRef.current?.();
            setIsOpen(false);
        } catch (err) {
            setSendError(err.message || 'Failed to send email.');
        } finally {
            setSending(false);
        }
    };

    return {
        isOpen,
        viewingDrafts,
        viewDrafts,
        backToPicker,
        badgeEmailSelected,
        toggleBadgeEmail,
        categoryEmails,
        drafts,
        loading,
        error,
        expandedId,
        toggleExpand,
        sending,
        sendError,
        sendSuccess,
        send,
        open,
        close,
        clearMessages: () => {
            setSendError('');
            setSendSuccess('');
        },
    };
}
