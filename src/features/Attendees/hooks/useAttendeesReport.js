import { useCallback, useEffect, useState } from 'react';
import { getAttendeesReport } from '../api/attendeesReportApi';

export default function useAttendeesReport({ eventId, token, filters, enabled }) {
    const [source, setSource] = useState('es');
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchReport = useCallback(async () => {
        if (!eventId || !token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAttendeesReport(eventId, token, {
                source,
                filters,
            });
            setReport(data);
            setHasFetched(true);
        } catch (err) {
            setReport(null);
            setError(err.message || 'Failed to load attendees report.');
        } finally {
            setLoading(false);
        }
    }, [eventId, token, source, filters]);

    useEffect(() => {
        if (!enabled) return;
        fetchReport();
    }, [enabled, fetchReport]);

    return {
        source,
        setSource,
        report,
        loading,
        error,
        hasFetched,
        fetchReport,
    };
}
