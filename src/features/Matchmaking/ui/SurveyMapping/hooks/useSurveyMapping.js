import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchmakingApi } from '../../../api/matchmakingApi';

export const useSurveyMapping = (selectedEvent, token) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [matchmakingData, setMatchmakingData] = useState(null);
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [formValue, setFormValue] = useState('municipalika-trade_visitor');
    const [loading, setLoading] = useState(true);
    const [fetchingForm, setFetchingForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSurveyQuestion, setSelectedSurveyQuestion] = useState(null);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [showGlobalJson, setShowGlobalJson] = useState(false);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    
    // State: { surveyName: { mmQuestionId, mode: 'direct'|'mapped', choiceMappings: { choiceId: surveyValue } } }
    const [mappings, setMappings] = useState({});

    // Recursive function to find questions with isMatchMaking: true
    const findMatchmakingQuestions = useCallback((obj, results = []) => {
        if (!obj || typeof obj !== 'object') return results;

        if (obj.isMatchMaking === true) {
            results.push({
                title: obj.title || obj.name,
                name: obj.name,
                choices: obj.choices?.map(c => 
                    typeof c === 'object' ? { text: c.text, value: c.value } : { text: c, value: c }
                ) || []
            });
        }

        Object.values(obj).forEach(val => {
            if (typeof val === 'object') {
                findMatchmakingQuestions(val, results);
            }
        });

        return results;
    }, []);

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
        if (!formValue) return;
        setFetchingForm(true);
        setError(null);
        try {
            const eventCode = `reconnect_${selectedEvent?.id || 9}`;
            const formData = await matchmakingApi.getSurveyForm(formValue, eventCode);
            
            // Extract questions with isMatchMaking: true
            const questions = findMatchmakingQuestions(formData);
            setSurveyQuestions(questions);
            if (questions.length > 0) {
                if (!selectedSurveyQuestion) {
                    setSelectedSurveyQuestion(questions[0]);
                }
            } else {
                setError('No matchmaking questions found in this form.');
            }
        } catch (err) {
            setError('SurveyJS: ' + err.message);
        } finally {
            setFetchingForm(false);
        }
    }, [formValue, selectedEvent, selectedSurveyQuestion, findMatchmakingQuestions]);

    const fetchExistingMapping = useCallback(async () => {
        if (!selectedEvent?.id || !formValue) return;
        try {
            const data = await matchmakingApi.getSurveyMapping(selectedEvent.id, formValue, token);
            if (data && data.questions) {
                const newMappings = {};
                data.questions.forEach(q => {
                    const isMappedMode = q.choices.length > 0 && typeof q.choices[0] === 'object' && q.choices[0].choice_id;
                    
                    if (isMappedMode) {
                        const choiceMappings = {};
                        q.choices.forEach(c => {
                            choiceMappings[c.choice_id] = c.sj_value;
                        });
                        newMappings[q.surveyjs_name] = {
                            mmQuestionId: q.question_id,
                            mode: 'mapped',
                            choiceMappings
                        };
                    } else {
                        newMappings[q.surveyjs_name] = {
                            mmQuestionId: q.question_id,
                            mode: 'direct',
                            choiceMappings: {}
                        };
                    }
                });
                setMappings(newMappings);
            }
        } catch (err) {
            console.error('Failed to fetch existing mapping:', err);
        }
    }, [selectedEvent?.id, formValue, token]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await fetchMatchmakingQuestions();
            await fetchSurveyForm();
            await fetchExistingMapping();
        } finally {
            setLoading(false);
        }
    }, [fetchMatchmakingQuestions, fetchSurveyForm, fetchExistingMapping]);

    useEffect(() => {
        if (selectedEvent?.id && token) {
            fetchAllData();
        }
    }, [selectedEvent?.id, token, fetchAllData]);

    const generatePayload = useCallback(() => {
        return {
            form_value: formValue,
            questions: Object.entries(mappings).map(([surveyName, mapping]) => {
                if (!mapping.mmQuestionId) return null;
                const sq = surveyQuestions.find(q => q.name === surveyName);

                if (mapping.mode === 'mapped') {
                    const choices = Object.entries(mapping.choiceMappings || {}).map(([choiceId, surveyValue]) => ({
                        choice_id: parseInt(choiceId),
                        surveyjs_value: surveyValue
                    }));
                    return {
                        surveyjs_name: surveyName,
                        question_id: parseInt(mapping.mmQuestionId),
                        choices
                    };
                } else {
                    const choices = (sq?.choices || []).map(c => c.value);
                    return {
                        surveyjs_name: surveyName,
                        question_id: parseInt(mapping.mmQuestionId),
                        choices
                    };
                }
            }).filter(Boolean)
        };
    }, [formValue, mappings, surveyQuestions]);

    const handleSaveMapping = async () => {
        setSaving(true);
        setError(null);
        try {
            const payload = generatePayload();
            await matchmakingApi.saveSurveyMapping(selectedEvent.id, payload, token);
            alert('Mapping saved successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const filteredSurveyQuestions = useMemo(() => {
        return surveyQuestions.filter(q => 
            q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [surveyQuestions, searchQuery]);

    const handleMapQuestion = (surveyName, mmQuestionId) => {
        setMappings(prev => ({
            ...prev,
            [surveyName]: {
                ...prev[surveyName],
                mmQuestionId,
                mode: prev[surveyName]?.mode || 'direct',
                choiceMappings: prev[surveyName]?.choiceMappings || {}
            }
        }));
    };

    const handleModeToggle = (surveyName) => {
        setMappings(prev => ({
            ...prev,
            [surveyName]: {
                ...prev[surveyName],
                mode: prev[surveyName]?.mode === 'mapped' ? 'direct' : 'mapped',
                choiceMappings: {} 
            }
        }));
    };

    const handleMapChoice = (surveyName, choiceId, surveyValue) => {
        setMappings(prev => {
            const currentQuestionMappings = prev[surveyName] || {};
            const currentChoiceMappings = { ...(currentQuestionMappings.choiceMappings || {}) };
            
            if (surveyValue === '') {
                delete currentChoiceMappings[choiceId];
            } else {
                currentChoiceMappings[choiceId] = surveyValue;
            }

            return {
                ...prev,
                [surveyName]: {
                    ...currentQuestionMappings,
                    choiceMappings: currentChoiceMappings
                }
            };
        });
    };

    return {
        searchQuery, setSearchQuery,
        matchmakingData,
        surveyQuestions, filteredSurveyQuestions,
        formValue, setFormValue,
        loading, fetchingForm, saving, error, setError,
        selectedSurveyQuestion, setSelectedSurveyQuestion,
        showJsonPreview, setShowJsonPreview,
        showGlobalJson, setShowGlobalJson,
        expandedQuestions, setExpandedQuestions,
        mappings, setMappings,
        handleMapQuestion, handleModeToggle, handleMapChoice,
        handleSaveMapping, generatePayload, fetchSurveyForm
    };
};
