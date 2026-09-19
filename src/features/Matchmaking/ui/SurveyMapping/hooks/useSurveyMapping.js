import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchmakingApi } from '../../../api/matchmakingApi';
import { findMatchmakingQuestions } from '../../../domain/findMatchmakingQuestions';
import { parseSurveyMappingResponse } from '../../../domain/parseSurveyMappingResponse';
import { buildSurveyMappingPayload } from '../../../domain/buildSurveyMappingPayload';
import { otmEventCode } from '../../../domain/otmEventCode';
import { useSurveyFormList } from './useSurveyFormList';

export const useSurveyMapping = (selectedEvent, token) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [matchmakingData, setMatchmakingData] = useState(null);
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetchingForm, setFetchingForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSurveyQuestion, setSelectedSurveyQuestion] = useState(null);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [showGlobalJson, setShowGlobalJson] = useState(false);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [mappings, setMappings] = useState({});

    const eventCode = otmEventCode(selectedEvent?.id);
    const { forms, loading: formsLoading, error: formsError } = useSurveyFormList(eventCode);

    const fetchMatchmakingQuestions = useCallback(async () => {
        if (!selectedEvent?.id) return;
        try {
            const data = await matchmakingApi.getMatchmakingQuestions(selectedEvent.id, token);
            setMatchmakingData(data);
        } catch (err) {
            setError('Matchmaking: ' + err.message);
        }
    }, [selectedEvent?.id, token]);

    const fetchSurveyForm = useCallback(async () => {
        if (!formValue || !eventCode) return;
        setFetchingForm(true);
        setError(null);
        try {
            const formData = await matchmakingApi.getSurveyForm(formValue, eventCode);
            const questions = findMatchmakingQuestions(formData);
            setSurveyQuestions(questions);
            setSelectedSurveyQuestion(questions[0] || null);
            if (questions.length === 0) {
                setError('No matchmaking questions found in this form.');
            }
        } catch (err) {
            setSurveyQuestions([]);
            setSelectedSurveyQuestion(null);
            setError('SurveyJS: ' + err.message);
        } finally {
            setFetchingForm(false);
        }
    }, [formValue, eventCode]);

    const fetchExistingMapping = useCallback(async () => {
        if (!selectedEvent?.id || !formValue) return;
        try {
            const data = await matchmakingApi.getSurveyMapping(selectedEvent.id, formValue, token);
            setMappings(parseSurveyMappingResponse(data));
        } catch (err) {
            console.error('Failed to fetch existing mapping:', err);
            setMappings({});
        }
    }, [selectedEvent?.id, formValue, token]);

    useEffect(() => {
        if (!selectedEvent?.id || !token) return;
        setLoading(true);
        fetchMatchmakingQuestions().finally(() => setLoading(false));
    }, [selectedEvent?.id, token, fetchMatchmakingQuestions]);

    useEffect(() => {
        if (!formValue) {
            setSurveyQuestions([]);
            setSelectedSurveyQuestion(null);
            setMappings({});
            return;
        }
        let cancelled = false;
        (async () => {
            await fetchSurveyForm();
            if (!cancelled) await fetchExistingMapping();
        })();
        return () => { cancelled = true; };
    }, [formValue, fetchSurveyForm, fetchExistingMapping]);

    const generatePayload = useCallback(
        () => buildSurveyMappingPayload(formValue, mappings, surveyQuestions),
        [formValue, mappings, surveyQuestions],
    );

    const handleSaveMapping = async () => {
        setSaving(true);
        setError(null);
        try {
            await matchmakingApi.saveSurveyMapping(selectedEvent.id, generatePayload(), token);
            alert('Mapping saved successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredSurveyQuestions = useMemo(() => (
        surveyQuestions.filter((q) =>
            q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    ), [surveyQuestions, searchQuery]);

    const handleMapQuestion = (surveyName, mmQuestionId) => {
        setMappings((prev) => ({
            ...prev,
            [surveyName]: {
                ...prev[surveyName],
                mmQuestionId,
                mode: prev[surveyName]?.mode || 'direct',
                choiceMappings: prev[surveyName]?.choiceMappings || {},
            },
        }));
    };

    const handleModeToggle = (surveyName) => {
        setMappings((prev) => ({
            ...prev,
            [surveyName]: {
                ...prev[surveyName],
                mode: prev[surveyName]?.mode === 'mapped' ? 'direct' : 'mapped',
                choiceMappings: {},
            },
        }));
    };

    const handleMapChoice = (surveyName, choiceId, surveyValue) => {
        setMappings((prev) => {
            const current = prev[surveyName] || {};
            const choiceMappings = { ...(current.choiceMappings || {}) };
            if (surveyValue === '') delete choiceMappings[choiceId];
            else choiceMappings[choiceId] = surveyValue;
            return { ...prev, [surveyName]: { ...current, choiceMappings } };
        });
    };

    return {
        searchQuery, setSearchQuery,
        matchmakingData,
        surveyQuestions, filteredSurveyQuestions,
        formValue, setFormValue,
        forms: Array.isArray(forms) ? forms : [],
        formsLoading, formsError,
        loading, fetchingForm, saving, error, setError,
        selectedSurveyQuestion, setSelectedSurveyQuestion,
        showJsonPreview, setShowJsonPreview,
        showGlobalJson, setShowGlobalJson,
        expandedQuestions, setExpandedQuestions,
        mappings, setMappings,
        handleMapQuestion, handleModeToggle, handleMapChoice,
        handleSaveMapping, generatePayload, fetchSurveyForm,
    };
};
