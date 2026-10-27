import { useCallback, useEffect, useState } from 'react';
import { getAttendeeUploads } from '../api/attendeeUploadApi';

const PAGE_SIZE = 20;

function readListState(searchParams) {
    const page = Math.max(1, parseInt(searchParams?.get('page'), 10) || 1);
    const sortOrder = searchParams?.get('sort') === 'asc' ? 'asc' : 'desc';
    const uploadType = searchParams?.get('upload_type') || '';
    return { page, sortOrder, uploadType };
}

/** Paginated attendee CSV upload history for an event. Page, sort, and type live in the URL. */
export default function useAttendeeUploadHistory({ eventId, token, refreshKey = 0, searchParams, setSearchParams }) {
    const { page, sortOrder, uploadType } = readListState(searchParams);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [knownUploadTypes, setKnownUploadTypes] = useState([]);

    const patchListState = useCallback((updates) => {
        if (!setSearchParams) return;
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                const omit = value === '' || value == null
                    || (key === 'page' && Number(value) <= 1)
                    || (key === 'sort' && value === 'desc');
                if (omit) params.delete(key);
                else params.set(key, String(value));
            });
            return params.toString() === prev.toString() ? prev : params;
        }, { replace: true });
    }, [setSearchParams]);

    const setPage = useCallback((next) => {
        const value = typeof next === 'function' ? next(page) : next;
        patchListState({ page: value });
    }, [page, patchListState]);

    const setUploadType = useCallback((next) => {
        patchListState({ upload_type: next || '', page: 1 });
    }, [patchListState]);

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
            patchListState({ sort: sortOrder === 'desc' ? 'asc' : 'desc', page: 1 });
        },
    };
}
