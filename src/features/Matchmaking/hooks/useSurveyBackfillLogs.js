import { useState, useCallback, useEffect, useRef } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { parseBackfillLogs } from '../domain/parseBackfillMappingResult';

const POLL_MS = 4000;
export const BACKFILL_PAGE_SIZES = [20, 50, 100];

export default function useSurveyBackfillLogs({
    eventId,
    token,
    formValue,
    status,
    page,
    setPage,
    pageSize,
}) {
    const [data, setData] = useState(() => parseBackfillLogs(null));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [polling, setPolling] = useState(false);
    const pollRef = useRef(null);

    const load = useCallback(async ({ silent = false } = {}) => {
        if (!eventId || !token) return;
        if (!silent) setLoading(true);
        setError(null);
        try {
            const raw = await matchmakingApi.getSurveyBackfillLogs(
                eventId,
                {
                    status: status || undefined,
                    formValue: formValue || undefined,
                    page,
                    pageSize,
                },
                token,
            );
            setData(parseBackfillLogs(raw));
        } catch (err) {
            setError(err.message || 'Failed to load backfill logs.');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [eventId, token, formValue, status, page, pageSize]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (!polling) {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            return undefined;
        }
        pollRef.current = setInterval(() => load({ silent: true }), POLL_MS);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
        };
    }, [polling, load]);

    return {
        ...data,
        page,
        setPage,
        pageSize,
        loading,
        error,
        polling,
        setPolling,
        refresh: () => load(),
    };
}
