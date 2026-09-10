import { useCallback, useEffect, useState } from 'react';
import { getAttendeeUploads } from '../api/attendeeUploadApi';

const PAGE_SIZE = 20;

/** Paginated attendee CSV upload history for an event. */
export default function useAttendeeUploadHistory({ eventId, token, refreshKey = 0 }) {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
    const [uploadType, setUploadType] = useState('');
    const [knownUploadTypes, setKnownUploadTypes] = useState([]);

    const loadUploads = useCallback(async (targetPage) => {
        if (!eventId || !token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAttendeeUploads(eventId, token, {
                page: targetPage, size: PAGE_SIZE, sortBy: 'uploaded_on', sortOrder, uploadType,
            });
            const rows = data.upload_data || [];
            setUploads(rows);
            setTotal(data.total ?? 0);
            setKnownUploadTypes((prev) => {
                const next = new Set(prev);
                rows.forEach((r) => { if (r.upload_type) next.add(r.upload_type); });
                return Array.from(next);
            });
        } catch (err) {
            setError(err.message || 'Failed to load upload history.');
        } finally {
            setLoading(false);
        }
    }, [eventId, token, sortOrder, uploadType]);

    useEffect(() => {
        loadUploads(page);
    }, [page, refreshKey, loadUploads]);

    return {
        uploads,
        loading,
        error,
        page,
        setPage,
        total,
        hasNext: page * PAGE_SIZE < total,
        sortOrder,
        uploadType,
        setUploadType,
        knownUploadTypes,
        loadUploads,
        toggleSort: () => {
            setSortOrder((order) => (order === 'desc' ? 'asc' : 'desc'));
            setPage(1);
        },
    };
}
