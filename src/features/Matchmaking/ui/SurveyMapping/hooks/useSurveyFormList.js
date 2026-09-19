import { useState, useEffect, useCallback } from 'react';
import { matchmakingApi } from '../../../api/matchmakingApi';
import { parseOtmFormList } from '../../../domain/parseOtmFormList';

export function useSurveyFormList(eventCode) {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchForms = useCallback(async () => {
        if (!eventCode) {
            setForms([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await matchmakingApi.getSurveyFormList(eventCode);
            const list = parseOtmFormList(data);
            setForms(Array.isArray(list) ? list : []);
        } catch (err) {
            setForms([]);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventCode]);

    useEffect(() => {
        fetchForms();
    }, [fetchForms]);

    return { forms, loading, error, refetch: fetchForms };
}
