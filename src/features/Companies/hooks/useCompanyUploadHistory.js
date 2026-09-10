import { useCallback, useEffect, useState } from 'react';
import { getCompanyUploads } from '../api/companyUploadApi';

const PAGE_SIZE = 20;

/** Paginated company CSV upload history for an event. */
export default function useCompanyUploadHistory({ eventId, token, refreshKey = 0 }) {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');

    const loadUploads = useCallback(async (targetPage) => {
        if (!eventId || !token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getCompanyUploads(eventId, token, {
                page: targetPage,
                pageSize: PAGE_SIZE,
                sortBy: 'uploaded_on',
                sortOrder,
                uploadType: '',
            });
            setUploads(data.results || []);
            setTotal(data.total ?? 0);
        } catch (err) {
            setError(err.message || 'Failed to load company upload history.');
        } finally {
            setLoading(false);
        }
    }, [eventId, token, sortOrder]);

    useEffect(() => {
        loadUploads(page);
    }, [page, refreshKey, loadUploads]);

    const toggleSort = () => {
        setSortOrder((order) => (order === 'desc' ? 'asc' : 'desc'));
        setPage(1);
    };

    return {
        uploads,
        loading,
        error,
        page,
        setPage,
        total,
        hasNext: page * PAGE_SIZE < total,
        sortOrder,
        toggleSort,
        loadUploads,
    };
}
