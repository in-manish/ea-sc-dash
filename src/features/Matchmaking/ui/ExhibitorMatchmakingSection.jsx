import React, { useState, useEffect, useCallback, useRef } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { Loader2, RefreshCw, AlertCircle, Send, Eye, Edit3, CheckCircle2, Upload, Download, FileSpreadsheet } from 'lucide-react';

const TEXT_TYPES = ['text', 'number'];
const MULTI_OPTION_TYPES = ['array', 'grouped_array'];

const getSelectableOptions = (question) => {
    if (question.type === 'grouped_array') {
        return (question.options || []).flatMap((group) => group.values || []);
    }
    return question.options || [];
};

const getInitialValue = (question, existingAnswer) => {
    if (!existingAnswer) {
        return MULTI_OPTION_TYPES.includes(question.type) ? [] : '';
    }
    if (existingAnswer.answer !== undefined && existingAnswer.answer !== null) {
        return existingAnswer.answer;
    }
    if (existingAnswer.answer_options?.length) {
        if (question.type === 'radio') return existingAnswer.answer_options[0]?.id ?? '';
        return existingAnswer.answer_options.map((opt) => opt.id);
    }
    return MULTI_OPTION_TYPES.includes(question.type) ? [] : '';
};

const buildAnswerPayload = (question, value) => {
    if (TEXT_TYPES.includes(question.type)) {
        return { question_id: question.id, answer: value || '' };
    }
    if (question.type === 'radio') {
        return { question_id: question.id, answer_options: value ? [Number(value)] : [] };
    }
    if (MULTI_OPTION_TYPES.includes(question.type)) {
        return { question_id: question.id, answer_options: (value || []).map(Number) };
    }
    return { question_id: question.id, answer: value || '' };
};

const formatAnswerDisplay = (answerItem) => {
    if (answerItem.answer !== undefined && answerItem.answer !== null && answerItem.answer !== '') {
        return answerItem.answer;
    }
    if (answerItem.answer_options?.length) {
        return answerItem.answer_options.map((opt) => opt.name).join(', ');
    }
    return '—';
};

const escapeCsvValue = (value) => {
    const str = String(value ?? '');
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
};

const buildCsvTemplate = (questions) => {
    let maxOptions = 1;
    questions.forEach((q) => {
        if (!TEXT_TYPES.includes(q.type)) {
            maxOptions = Math.max(maxOptions, getSelectableOptions(q).length);
        }
    });
    const optionCols = Array.from({ length: maxOptions }, (_, i) => `option${i + 1}`);
    const headers = ['Question', 'answer(text)', ...optionCols];
    const rows = questions.map((q) => {
        const cells = [escapeCsvValue(q.title), ''];
        for (let i = 0; i < maxOptions; i += 1) cells.push('');
        return cells.join(',');
    });
    return `${headers.join(',')}\n${rows.join('\n')}`;
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const downloadTextFile = (content, filename) => {
    downloadBlob(new Blob([content], { type: 'text/csv;charset=utf-8;' }), filename);
};

const QuestionField = ({ question, value, onChange }) => {
    const options = getSelectableOptions(question);

    if (TEXT_TYPES.includes(question.type)) {
        return (
            <input
                type={question.type === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field w-full"
                placeholder={`Enter ${question.title.toLowerCase()}…`}
            />
        );
    }

    if (question.type === 'radio') {
        return (
            <div className="flex flex-col gap-2">
                {options.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/30 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={Number(value) === opt.id}
                            onChange={() => onChange(opt.id)}
                            className="accent-accent"
                        />
                        <span className="text-sm text-text-primary">{opt.name}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (question.type === 'grouped_array') {
        return (
            <div className="space-y-4">
                {(question.options || []).map((group) => (
                    <div key={group.id} className="p-4 bg-bg-secondary rounded-lg border border-border">
                        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                            {(group.values || []).map((opt) => {
                                const selected = (value || []).includes(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            const next = selected
                                                ? value.filter((id) => id !== opt.id)
                                                : [...(value || []), opt.id];
                                            onChange(next);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            selected
                                                ? 'bg-accent text-white border-accent'
                                                : 'bg-white text-text-secondary border-border hover:border-accent/30'
                                        }`}
                                    >
                                        {opt.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (question.type === 'array') {
        return (
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const selected = (value || []).includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                                const next = selected
                                    ? value.filter((id) => id !== opt.id)
                                    : [...(value || []), opt.id];
                                onChange(next);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                selected
                                    ? 'bg-accent text-white border-accent'
                                    : 'bg-white text-text-secondary border-border hover:border-accent/30'
                            }`}
                        >
                            {opt.name}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field w-full"
            placeholder="Enter answer…"
        />
    );
};

const ExhibitorMatchmakingSection = ({ eventId, companyId, token }) => {
    const [mode, setMode] = useState('submit');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [savedAnswers, setSavedAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const loadSubmitData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [questionsData, answersData] = await Promise.all([
                matchmakingApi.getExhibitorMatchmakingQuestions(eventId, token),
                matchmakingApi.getExhibitorMatchmakingAnswers(eventId, companyId, token),
            ]);
            const portalQuestions = questionsData.questions || [];
            setQuestions(portalQuestions);

            const answerMap = {};
            (answersData.answers || []).forEach((item) => {
                answerMap[item.question_id] = item;
            });

            const initial = {};
            portalQuestions.forEach((q) => {
                initial[q.id] = getInitialValue(q, answerMap[q.id]);
            });
            setAnswers(initial);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId, companyId, token]);

    const loadViewData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await matchmakingApi.getExhibitorMatchmakingAnswers(eventId, companyId, token);
            setSavedAnswers(data.answers || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId, companyId, token]);

    const loadUploadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const questionsData = await matchmakingApi.getExhibitorMatchmakingQuestions(eventId, token);
            setQuestions(questionsData.questions || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => {
        if (mode === 'submit') loadSubmitData();
        else if (mode === 'view') loadViewData();
        else if (mode === 'upload') loadUploadData();
    }, [mode, loadSubmitData, loadViewData, loadUploadData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = {
                company_id: Number(companyId),
                answers: questions.map((q) => buildAnswerPayload(q, answers[q.id])),
            };
            await matchmakingApi.saveExhibitorMatchmakingAnswers(eventId, payload, token);
            setSuccess('Matchmaking answers saved successfully.');
            await loadSubmitData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleCsvUpload = async () => {
        if (!csvFile) {
            setError('Please select a CSV file to upload.');
            return;
        }
        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await matchmakingApi.uploadExhibitorMatchmakingAnswersCsv(
                eventId,
                companyId,
                csvFile,
                token,
            );
            if (!result.success) {
                downloadBlob(result.errorCsv, 'matchmaking_answer_errors.csv');
                setError('CSV upload failed. An error report has been downloaded.');
                return;
            }
            setSuccess('CSV answers uploaded successfully.');
            setCsvFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = () => {
        if (!questions.length) {
            setError('No exhibitor portal questions available to build a template.');
            return;
        }
        downloadTextFile(buildCsvTemplate(questions), 'matchmaking_answers_template.csv');
    };

    return (
        <div className="mt-8 bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
                <h3 className="text-sm font-semibold uppercase text-text-tertiary m-0 flex items-center gap-2">
                    Exhibitor Portal Matchmaking
                </h3>
                <div className="flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMode('submit')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            mode === 'submit' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Edit3 size={14} />
                        Submit Answers
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('view')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            mode === 'view' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Eye size={14} />
                        View Answers
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            mode === 'upload' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Upload size={14} />
                        Upload CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-3 text-status-danger text-sm">
                    <AlertCircle size={16} />
                    {error}
                    <button type="button" onClick={() => setError(null)} className="ml-auto text-xs underline">Dismiss</button>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-status-success/5 border border-status-success/10 rounded-lg flex items-center gap-3 text-status-success text-sm">
                    <CheckCircle2 size={16} />
                    {success}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-12 text-text-tertiary gap-3">
                    <Loader2 className="animate-spin text-accent" size={24} />
                    <span className="text-sm">Loading matchmaking data…</span>
                </div>
            ) : mode === 'submit' ? (
                questions.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary text-sm">
                        No exhibitor portal matchmaking questions configured for this event.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {questions.map((question) => (
                            <div key={question.id} className="p-5 bg-bg-secondary rounded-lg border border-border">
                                <div className="mb-4">
                                    <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                        {question.title}
                                        {question.is_mandatory && (
                                            <span className="text-[10px] font-bold text-status-danger uppercase">Required</span>
                                        )}
                                    </label>
                                    <p className="text-xs text-text-tertiary mt-1 capitalize">{question.type?.replace('_', ' ')}</p>
                                </div>
                                <QuestionField
                                    question={question}
                                    value={answers[question.id]}
                                    onChange={(val) => handleAnswerChange(question.id, val)}
                                />
                            </div>
                        ))}
                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={submitting} className="btn btn-primary gap-2">
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Submit Answers
                            </button>
                            <button type="button" onClick={loadSubmitData} disabled={submitting} className="btn btn-secondary gap-2">
                                <RefreshCw size={16} />
                                Refresh
                            </button>
                        </div>
                    </form>
                )
            ) : mode === 'upload' ? (
                questions.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary text-sm">
                        No exhibitor portal matchmaking questions configured for this event.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-5 bg-bg-secondary rounded-lg border border-border space-y-4">
                            <div className="flex items-start gap-3">
                                <FileSpreadsheet size={20} className="text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">CSV format</p>
                                    <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                                        Use columns <code className="text-accent">Question</code>, <code className="text-accent">answer(text)</code> for text/number questions,
                                        and <code className="text-accent">option1</code>, <code className="text-accent">option2</code>, … for selection questions.
                                        Option names are matched case-insensitively.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadTemplate}
                                className="btn btn-secondary btn-sm gap-2"
                            >
                                <Download size={14} />
                                Download Template
                            </button>
                        </div>

                        <div className="p-5 bg-bg-secondary rounded-lg border border-border space-y-4">
                            <label className="text-sm font-semibold text-text-primary block">Select CSV file</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                            />
                            {csvFile && (
                                <p className="text-xs text-text-tertiary">
                                    Selected: <span className="font-medium text-text-secondary">{csvFile.name}</span>
                                </p>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCsvUpload}
                                    disabled={uploading || !csvFile}
                                    className="btn btn-primary gap-2"
                                >
                                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                    Upload Answers
                                </button>
                                <button
                                    type="button"
                                    onClick={loadUploadData}
                                    disabled={uploading}
                                    className="btn btn-secondary gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                )
            ) : savedAnswers.length === 0 ? (
                <div className="text-center py-12 text-text-secondary text-sm">
                    No matchmaking answers submitted for this company yet.
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button type="button" onClick={loadViewData} className="btn btn-secondary btn-sm gap-2">
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                    {savedAnswers.map((item) => (
                        <div key={item.id} className="p-5 bg-bg-secondary rounded-lg border border-border">
                            <p className="text-sm font-semibold text-text-primary mb-1">
                                {item.question?.title || `Question #${item.question_id}`}
                            </p>
                            <p className="text-xs text-text-tertiary mb-3 capitalize">
                                {item.question?.type?.replace('_', ' ') || 'answer'}
                            </p>
                            <p className="text-sm text-text-primary bg-white px-4 py-3 rounded-lg border border-border">
                                {formatAnswerDisplay(item)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExhibitorMatchmakingSection;
