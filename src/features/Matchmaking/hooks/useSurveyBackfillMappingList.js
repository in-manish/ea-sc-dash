import { useState, useCallback, useEffect } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { parseBackfillMappingList } from '../domain/parseBackfillMappingList';

export default function useSurveyBackfillMappingList({ eventId, token, formValue, search }) {
    const [data, setData] = useState(() => parseBackfillMappingList(null));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!eventId || !token) return;
        setLoading(true);
        setError(null);
        try {
            const raw = await matchmakingApi.getSurveyBackfillMapping(
                eventId,
                {
                    formValue: formValue || undefined,
                    search: search || undefined,
                },
                token,
            );
            setData(parseBackfillMappingList(raw));
        } catch (err) {
            setError(err.message || 'Failed to load mappings.');
            setData(parseBackfillMappingList(null));
        } finally {
            setLoading(false);
        }
    }, [eventId, token, formValue, search]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        ...data,
        loading,
        error,
        refresh: load,
    };
}
