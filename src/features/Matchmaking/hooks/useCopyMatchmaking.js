import { useState, useEffect, useCallback } from 'react';
import { matchmakingFormApi } from '../api/matchmakingFormApi';
import { eventService } from '../../../services/eventService';
import { isMatchmakingFormNotFound, isEventNotFound } from '../domain/isMatchmakingFormNotFound';
import {
    buildCopyMatchmakingPayload,
    defaultTypeMappings,
} from '../domain/buildCopyMatchmakingPayload';
import {
    COPY_ERROR,
    parseCopyMatchmakingError,
    copyMatchmakingErrorMessage,
} from '../domain/parseCopyMatchmakingError';
import {
    copyableSourceQuestionIds,
    findDestQuestionByTitle,
} from '../domain/matchCopyQuestionTitle';

const STORAGE_KEY = 'matchmaking_mapping_state';

export function useCopyMatchmaking({ isOpen, toEventId, token, onSuccess, onDestExists }) {
    const stored = (() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
        catch { return {}; }
    })();

    const [step, setStep] = useState('source');
    const [fromId, setFromId] = useState(stored.fromId || '');
    const [sourceForm, setSourceForm] = useState(null);
    const [destQuestions, setDestQuestions] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [types, setTypes] = useState(stored.types || []);
    const [sourceTypes, setSourceTypes] = useState([]);
    const [destTypes, setDestTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ fromId, types }));
    }, [fromId, types]);

    useEffect(() => {
        if (!isOpen || !toEventId) return;
        eventService.getAttendeeTypes(toEventId, token)
            .then((d) => setDestTypes(d.attendee_types || []))
            .catch(() => setDestTypes([]));
        matchmakingFormApi.getMatchmakingQuestions(toEventId, token)
            .then((form) => setDestQuestions(form?.questions || []))
            .catch(() => setDestQuestions([]));
    }, [isOpen, toEventId, token]);

    useEffect(() => {
        if (!sourceForm || !sourceTypes.length || !destTypes.length) return;
        setTypes((prev) => (prev.some((row) => row.to) ? prev : defaultTypeMappings(sourceTypes, destTypes)));
    }, [sourceForm, sourceTypes, destTypes]);

    const resetWizard = useCallback(() => {
        setStep('source');
        setSourceForm(null);
        setSelectedIds([]);
        setError(null);
        setSuccess(false);
        setLoading(false);
    }, []);

    const loadSource = useCallback(async () => {
        if (!fromId) return;
        setLoading(true);
        setError(null);
        setSourceForm(null);
        try {
            const [form, destForm] = await Promise.all([
                matchmakingFormApi.getMatchmakingQuestions(fromId, token),
                matchmakingFormApi.getMatchmakingQuestions(toEventId, token).catch(() => null),
            ]);
            const attend = await eventService.getAttendeeTypes(fromId, token).catch(() => ({ attendee_types: [] }));
            const nextSourceTypes = attend.attendee_types || [];
            setDestQuestions(destForm?.questions || []);
            setSourceTypes(nextSourceTypes);
            setSourceForm(form);
            setTypes(defaultTypeMappings(nextSourceTypes, destTypes));
            setSelectedIds([]);
            setStep('questions');
        } catch (err) {
            if (isEventNotFound(err)) setError('Event not found. Check the event id.');
            else if (isMatchmakingFormNotFound(err)) setError('This event has no matchmaking form. Pick another source.');
            else setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fromId, token, destTypes, toEventId]);

    const toggleQuestion = useCallback((id) => {
        const sourceQuestion = (sourceForm?.questions || []).find((q) => q.id === id);
        if (sourceQuestion && findDestQuestionByTitle(sourceQuestion, destQuestions)) return;
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, [sourceForm, destQuestions]);

    const toggleSelectAll = useCallback(() => {
        const copyableIds = copyableSourceQuestionIds(sourceForm?.questions, destQuestions);
        const allSelected = copyableIds.length > 0
            && copyableIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : copyableIds);
        setError(null);
    }, [sourceForm, destQuestions, selectedIds]);

    const submitCopy = useCallback(async () => {
        if (!sourceForm) {
            setError('Load a source event before copying.');
            setStep('source');
            return;
        }
        const copyableIds = copyableSourceQuestionIds(sourceForm.questions, destQuestions);
        const idsToCopy = selectedIds.filter((id) => copyableIds.includes(id));
        if (idsToCopy.length === 0) {
            setError('Select at least one question that is not already on this event.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await matchmakingFormApi.copyMatchmaking(
                buildCopyMatchmakingPayload({
                    fromEventId: fromId,
                    toEventId,
                    mappings: types,
                    selectedIds: idsToCopy,
                }),
                token,
            );
            setSuccess(true);
            setTimeout(() => { onSuccess?.(); resetWizard(); }, 1200);
        } catch (err) {
            const code = parseCopyMatchmakingError(err);
            setError(copyMatchmakingErrorMessage(code, err.message));
            if (code === COPY_ERROR.DEST_EXISTS) onDestExists?.();
            if (code === COPY_ERROR.SOURCE_NOT_FOUND || code === COPY_ERROR.EVENT_NOT_FOUND) {
                setStep('source');
                setSourceForm(null);
            }
        } finally {
            setLoading(false);
        }
    }, [selectedIds, fromId, toEventId, types, token, onSuccess, onDestExists, resetWizard, sourceForm, destQuestions]);

    return {
        step, setStep, fromId, setFromId, sourceForm, destQuestions,
        selectedIds, toggleQuestion, toggleSelectAll, types, setTypes, sourceTypes, destTypes,
        loading, success, error, setError, loadSource, submitCopy, resetWizard,
    };
}
