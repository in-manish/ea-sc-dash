import { useState, useEffect } from 'react';
import { eventService } from '../../../services/eventService';
import { FILTER_PARAM_KEYS } from '../constants';

export default function useAttendeeList({
    selectedEvent,
    token,
    page,
    setPage,
    debouncedSearch,
    searchType,
    filters,
    setSearchParams,
}) {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [matchmakingAttendee, setMatchmakingAttendee] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createPrefill, setCreatePrefill] = useState(null);
    const [editingUuid, setEditingUuid] = useState(null);
    const [isModalMaximized, setIsModalMaximized] = useState(false);

    useEffect(() => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);

            if (page > 1) params.set('page', page);
            else params.delete('page');

            if (debouncedSearch) params.set('q', debouncedSearch);
            else params.delete('q');

            if (searchType && searchType !== 'local') params.set('search_type', searchType);
            else params.delete('search_type');

            FILTER_PARAM_KEYS.forEach((key) => {
                const value = filters[key];
                if (value && (!Array.isArray(value) || value.length > 0)) {
                    params.set(key, Array.isArray(value) ? value.join(',') : value);
                } else {
                    params.delete(key);
                }
            });

            return params;
        }, { replace: true });
    }, [page, debouncedSearch, searchType, filters, setSearchParams]);

    useEffect(() => {
        const fetchAttendees = async () => {
            if (!selectedEvent) return;

            setLoading(true);
            setError(null);

            try {
                const data = await eventService.getAttendees(selectedEvent.id, token, {
                    page,
                    size: 50,
                    searchQuery: debouncedSearch,
                    searchType,
                    filters,
                });
                setAttendees(data.results);
                setTotal(data.total);
                setHasLoaded(true);
            } catch (err) {
                setError('Failed to load attendees. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedEvent && token) {
            fetchAttendees();
        }
    }, [selectedEvent, page, debouncedSearch, searchType, filters, token]);

    const openAttendeeDetail = (attendee) => {
        setSelectedAttendee(attendee);
    };

    const closeAttendeeDetail = () => {
        setSelectedAttendee(null);
    };

    const handleCreated = () => {
        setPage(1);
    };

    const openEditAttendee = (attendee) => {
        if (!attendee?.uuid) return;
        setEditingUuid(attendee.uuid);
    };

    const closeEditAttendee = () => {
        setEditingUuid(null);
    };

    const handleAttendeeUpdated = (updated) => {
        if (!updated?.uuid) return;
        setAttendees((prev) =>
            prev.map((row) => (row.uuid === updated.uuid ? { ...row, ...updated } : row)),
        );
        setSelectedAttendee((prev) =>
            prev?.uuid === updated.uuid ? { ...prev, ...updated } : prev,
        );
    };

    return {
        attendees,
        setAttendees,
        loading,
        error,
        total,
        hasLoaded,
        selectedAttendee,
        setSelectedAttendee,
        matchmakingAttendee,
        setMatchmakingAttendee,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createPrefill,
        setCreatePrefill,
        editingUuid,
        setEditingUuid,
        openEditAttendee,
        closeEditAttendee,
        handleAttendeeUpdated,
        isModalMaximized,
        setIsModalMaximized,
        openAttendeeDetail,
        closeAttendeeDetail,
        handleCreated,
    };
}
