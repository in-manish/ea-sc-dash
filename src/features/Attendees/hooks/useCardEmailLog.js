import { useCallback, useEffect, useState } from 'react';
import { emailLogApi } from '../api/emailLogApi';
import { LOG_TYPES, isBatchActive, logTypeOf } from '../domain/emailLogStatus';

const POLL_MS = 5000;
const MIN_SEARCH = 2; // same as EA; shorter text searches nothing
export const SEARCH_PARAM = 'log_search';
const BATCH_PAGE_SIZE = 20;

function useBatches(eventId, token, search, purpose) {
    const [state, setState] = useState({ rows: [], count: 0, loading: false, error: '' });
    const [page, setPage] = useState(1);

    const load = useCallback(async ({ quiet = false } = {}) => {
        if (!eventId || !token) return;
        if (!quiet) setState((s) => ({ ...s, loading: true, error: '' }));
        try {
            const data = await emailLogApi.listBatches(eventId, token, {
                purpose, search, page, size: BATCH_PAGE_SIZE,
            });
            setState({ rows: data.results || [], count: data.count || 0, loading: false, error: '' });
        } catch (err) {
            setState((s) => ({ ...s, loading: false, error: err.message }));
        }
    }, [eventId, token, page, search, purpose]);

    useEffect(() => { setPage(1); }, [search, purpose]);
    useEffect(() => { load(); }, [load]);
    return { ...state, page, setPage, pageSize: BATCH_PAGE_SIZE, reload: load };
}

function useDeliveries(eventId, token, batchId, status, search) {
    const [state, setState] = useState({ batch: null, rows: [], count: 0, loading: false, error: '' });

    const load = useCallback(async ({ quiet = false } = {}) => {
        if (!eventId || !token || !batchId) return;
        if (!quiet) setState((s) => ({ ...s, loading: true, error: '' }));
        try {
            const data = await emailLogApi.listDeliveries(eventId, token, batchId, { status, search, size: 200 });
            setState({ batch: data.batch, rows: data.results || [], count: data.count || 0, loading: false, error: '' });
        } catch (err) {
            setState((s) => ({ ...s, loading: false, error: err.message }));
        }
    }, [eventId, token, batchId, status, search]);

    useEffect(() => {
        setState({ batch: null, rows: [], count: 0, loading: false, error: '' });
        load();
    }, [load]);
    return { ...state, reload: load };
}

/**
 * "Email log" tab: report email sends (MessageBatch) and their emails (MessageDelivery), one type at a time:
 * `log_type` = cards (business cards) or meetings (meeting reports).
 * The open send (`send`), status filter (`status`) and search (`log_search`: email, name or reg id) live in
 * the URL. Not `q`: that is the Attendee List search, whose hook writes it back on every URL change.
 * so a refresh keeps them. The search narrows both the sends list and the open send's emails.
 * Polls every 5 s while the open send (or any listed send) is still queued / running.
 */
export default function useCardEmailLog({ eventId, token, searchParams, setSearchParams }) {
    const batchId = searchParams.get('send') || '';
    const status = searchParams.get('status') || '';
    const query = searchParams.get(SEARCH_PARAM) || '';
    const search = query.trim().length >= MIN_SEARCH ? query.trim() : '';
    const logType = logTypeOf(searchParams.get('log_type'));
    const batches = useBatches(eventId, token, search, LOG_TYPES[logType].purpose);
    const deliveries = useDeliveries(eventId, token, batchId, status, search);

    const setParam = useCallback((key, value) => {
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            if (value) next.set(key, value);
            else next.delete(key);
            if (key === 'send' || key === 'log_type') next.delete('status');
            if (key === 'log_type') next.delete('send');
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const active = isBatchActive(deliveries.batch) || batches.rows.some(isBatchActive);
    const { reload: reloadBatches } = batches;
    const { reload: reloadDeliveries } = deliveries;
    useEffect(() => {
        if (!active) return undefined;
        const timer = setInterval(() => {
            reloadBatches({ quiet: true });
            reloadDeliveries({ quiet: true });
        }, POLL_MS);
        return () => clearInterval(timer);
    }, [active, reloadBatches, reloadDeliveries]);

    const setQuery = useCallback((value) => setParam(SEARCH_PARAM, value), [setParam]); // stable for the debounce

    const refresh = () => {
        reloadBatches();
        reloadDeliveries();
    };

    return {
        batches, deliveries, batchId, status, query, search, logType, active, refresh,
        setLogType: (value) => setParam('log_type', value === 'cards' ? '' : value),
        openBatch: (id) => setParam('send', id ? String(id) : ''),
        setStatus: (value) => setParam('status', value),
        setQuery,
    };
}
