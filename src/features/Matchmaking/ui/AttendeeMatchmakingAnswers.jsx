import React, { useState, useEffect, useCallback } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { Loader2, RefreshCw, AlertCircle, X, HeartHandshake, Search } from 'lucide-react';

const TABS = [
    { key: 'seeking', label: 'Seeking', icon: Search, answerFor: undefined },
    { key: 'offering', label: 'Offering', icon: HeartHandshake, answerFor: 'offering' },
];

const optionLabel = (opt) => {
    if (opt === null || opt === undefined) return '';
    if (typeof opt === 'object') return opt.name ?? opt.title ?? JSON.stringify(opt);
    return String(opt);
};

const getAnswerOptions = (item) => {
    if (Array.isArray(item.answer_options)) return item.answer_options;
    if (Array.isArray(item.answer)) return item.answer;
    return null;
};

const formatAnswer = (item) => {
    const options = getAnswerOptions(item);
    if (options && options.length) {
        return options.map(optionLabel).filter(Boolean).join(', ');
    }
    const { answer } = item;
    if (answer === null || answer === undefined || answer === '') return '—';
    if (typeof answer === 'object') return optionLabel(answer);
    return String(answer);
};

const AttendeeMatchmakingAnswers = ({ eventId, badgeUid, attendeeName, token, onClose }) => {
    const [activeTab, setActiveTab] = useState('seeking');
    const [dataByTab, setDataByTab] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTab = useCallback(async (tabKey, { force = false } = {}) => {
        const tab = TABS.find((t) => t.key === tabKey);
        if (!tab) return;
        if (!force && dataByTab[tabKey]) return;

        setLoading(true);
        setError(null);
        try {
            const data = await matchmakingApi.getAttendeeMatchmakingAnswers(eventId, badgeUid, token, tab.answerFor);
            const answers = data?.results?.[0]?.answers || [];
            setDataByTab((prev) => ({ ...prev, [tabKey]: { answers, stats: data?.stats || null } }));
        } catch (err) {
            setError(err.message || 'Failed to load matchmaking answers.');
        } finally {
            setLoading(false);
        }
    }, [eventId, badgeUid, token, dataByTab]);

    useEffect(() => {
        loadTab(activeTab);
    }, [activeTab, loadTab]);

    const current = dataByTab[activeTab];
    const answers = current?.answers || [];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in" onClick={onClose}>
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[92%] max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex items-start justify-between bg-bg-secondary">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Matchmaking Answers</h2>
                        {attendeeName && <p className="text-sm text-text-secondary">{attendeeName}</p>}
                    </div>
                    <button className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pt-4 bg-bg-primary">
                    <div className="flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg w-fit">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        activeTab === tab.key ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-3 text-status-danger text-sm">
                            <AlertCircle size={16} />
                            {error}
                            <button type="button" onClick={() => loadTab(activeTab, { force: true })} className="ml-auto text-xs underline">Retry</button>
                        </div>
                    )}

                    {loading && !current ? (
                        <div className="flex items-center justify-center py-12 text-text-tertiary gap-3">
                            <Loader2 className="animate-spin text-accent" size={24} />
                            <span className="text-sm">Loading matchmaking answers…</span>
                        </div>
                    ) : answers.length === 0 && !error ? (
                        <div className="text-center py-12 text-text-secondary text-sm">
                            No {activeTab} answers submitted by this attendee.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => loadTab(activeTab, { force: true })}
                                    disabled={loading}
                                    className="btn btn-secondary btn-sm gap-2"
                                >
                                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                    Refresh
                                </button>
                            </div>
                            {answers.map((item) => {
                                const options = getAnswerOptions(item);
                                return (
                                    <div key={item.answer_id ?? `${item.question_id}-${item.answer_for}`} className="p-5 bg-bg-secondary rounded-lg border border-border">
                                        <p className="text-sm font-semibold text-text-primary mb-1">
                                            {item.question?.title || `Question #${item.question_id}`}
                                        </p>
                                        <p className="text-xs text-text-tertiary mb-3 capitalize">
                                            {(item.question?.type || 'answer').replace('_', ' ')}
                                            {item.source ? ` · ${item.source.replace(/_/g, ' ')}` : ''}
                                        </p>
                                        {options && options.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {options.map((opt, idx) => (
                                                    <span
                                                        key={opt?.id ?? `${item.answer_id}-${idx}`}
                                                        className="inline-flex items-center rounded-full bg-white border border-border px-3 py-1 text-xs font-medium text-text-primary"
                                                    >
                                                        {optionLabel(opt)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-text-primary bg-white px-4 py-3 rounded-lg border border-border break-words">
                                                {formatAnswer(item)}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendeeMatchmakingAnswers;
