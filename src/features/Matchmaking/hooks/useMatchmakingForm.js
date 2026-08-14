import { useState, useEffect, useCallback, useRef } from 'react';
import { matchmakingFormApi } from '../api/matchmakingFormApi';
import { eventService } from '../../../services/eventService';
import { isMatchmakingFormNotFound } from '../domain/isMatchmakingFormNotFound';
import { canCopyMatchmakingIntoEvent } from '../domain/hasExistingMatchmakingSetup';
import { sortMatchmakingQuestions } from '../domain/sortMatchmakingQuestions';
import { buildSaveMatchmakingPayload } from '../domain/buildSaveMatchmakingPayload';

export function useMatchmakingForm(eventId, token) {
    const [data, setData] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [reordering, setReordering] = useState(false);
    const [togglingPortalId, setTogglingPortalId] = useState(null);
    const dataRef = useRef(data);
    dataRef.current = data;

    const fetchData = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        setError(null);
        try {
            const [quesData, attendData] = await Promise.all([
                matchmakingFormApi.getMatchmakingQuestions(eventId, token),
                eventService.getAttendeeTypes(eventId, token),
            ]);
            setNotFound(false);
            setData(quesData);
            setAttendeeTypes(attendData.attendee_types || []);
        } catch (err) {
            setAttendeeTypes([]);
            if (isMatchmakingFormNotFound(err)) {
                setNotFound(true);
                setData(null);
                setError(null);
            } else {
                setNotFound(false);
                setData(null);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const saveQuestions = useCallback(async (questions) => {
        const current = dataRef.current;
        return matchmakingFormApi.saveMatchmakingQuestions(
            eventId,
            buildSaveMatchmakingPayload({
                formId: current?.id,
                formName: current?.form_name,
                questions,
            }),
            token,
        );
    }, [eventId, token]);

    const handleReorder = useCallback(async (oldIndex, newIndex) => {
        if (oldIndex === newIndex) return;
        const current = dataRef.current;
        if (!current?.questions?.length || !current.id) return;
        const ordered = sortMatchmakingQuestions(current.questions);
        const [moved] = ordered.splice(oldIndex, 1);
        ordered.splice(newIndex, 0, moved);
        const reindexed = ordered.map((q, i) => ({ ...q, sort_key: i + 1 }));
        setData((prev) => (prev ? { ...prev, questions: reindexed } : prev));
        setReordering(true);
        setError(null);
        try {
            const updated = await saveQuestions(reindexed);
            if (updated?.questions) setData(updated);
        } catch (err) {
            setError(err.message || 'Failed to update sort order.');
            fetchData();
        } finally {
            setReordering(false);
        }
    }, [fetchData, saveQuestions]);

    const handleRemoveQuestion = useCallback(async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await saveQuestions([{ id, is_deleted: true }]);
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    }, [fetchData, saveQuestions]);

    const handleToggleExhibitorPortal = useCallback(async (question) => {
        if (!dataRef.current?.id) return;
        setTogglingPortalId(question.id);
        setError(null);
        try {
            const updated = await saveQuestions([{
                ...question,
                can_support_exhibitor_portal: !question.can_support_exhibitor_portal,
            }]);
            setData(updated);
        } catch (err) {
            setError(err.message);
        } finally {
            setTogglingPortalId(null);
        }
    }, [saveQuestions]);

    const canCopy = canCopyMatchmakingIntoEvent({ notFound, form: data });

    return {
        data, setData, notFound, canCopy, loading, error, setError, attendeeTypes,
        reordering, togglingPortalId, fetchData, handleReorder, handleRemoveQuestion,
        handleToggleExhibitorPortal, dataRef,
    };
}
