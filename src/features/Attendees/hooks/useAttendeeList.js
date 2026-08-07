import { useState, useEffect } from 'react';
import { eventService } from '../../../services/eventService';

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
    const [isModalMaximized, setIsModalMaximized] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', page);
        if (debouncedSearch) params.set('q', debouncedSearch);
        if (searchType && searchType !== 'local') params.set('search_type', searchType);

        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value) {
                if (Array.isArray(value)) {
                    if (value.length > 0) params.set(key, value.join(','));
                } else {
                    params.set(key, value);
                }
            }
        });

        setSearchParams(params, { replace: true });
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
        isModalMaximized,
        setIsModalMaximized,
        openAttendeeDetail,
        closeAttendeeDetail,
        handleCreated,
    };
}
