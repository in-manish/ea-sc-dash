import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { matchmakingApi } from '../api/matchmakingApi';
import { Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';
import CopyMatchmakingModal from './CopyMatchmakingModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MatchmakingQuestionModal from './MatchmakingQuestionModal';
import MatchmakingEmptySetup from './MatchmakingEmptySetup';
import MatchmakingQuestionsHeader from './MatchmakingQuestionsHeader';
import MatchmakingQuestionFilters from './MatchmakingQuestionFilters';
import MatchmakingQuestionsList from './MatchmakingQuestionsList';
import { useMatchmakingForm } from '../hooks/useMatchmakingForm';
import { useMatchmakingQuestionSort } from '../hooks/useMatchmakingQuestionSort';
import { sortMatchmakingQuestions } from '../domain/sortMatchmakingQuestions';
import { ATTENDEE_QUESTION_TYPE_OPTIONS, EXHIBITOR_QUESTION_TYPE_OPTIONS, normalizeQuestionType } from '../constants/questionTypes';

const MatchmakingQuestions = ({ pendingEdit = null, onPendingEditConsumed, pendingCreate = null, onPendingCreateConsumed }) => {
    const { selectedEvent, token } = useAuth();
    const [currentId, setCurrentId] = useState(pendingEdit?.eventId || selectedEvent?.id);
    const [tempId, setTempId] = useState(pendingEdit?.eventId || selectedEvent?.id || '');
    const [modals, setModals] = useState({ copy: false, del: false, delLoading: false, ques: false, selectedQues: null, createDefaults: null });
    const [questionTypeFilter, setQuestionTypeFilter] = useState('');
    const [allExpanded, setAllExpanded] = useState(false);
    const listRef = useRef(null);

    const form = useMatchmakingForm(currentId, token);
    const ids = useMemo(() => {
        const start = Math.max(1, currentId - 4);
        return Array.from({ length: 5 }, (_, i) => start + i);
    }, [currentId]);
    const sortedQuestions = useMemo(() => sortMatchmakingQuestions(form.data?.questions), [form.data?.questions]);
    const questionTypeCounts = useMemo(() => {
        const counts = { __unset__: 0 };
        [...ATTENDEE_QUESTION_TYPE_OPTIONS, ...EXHIBITOR_QUESTION_TYPE_OPTIONS].forEach((opt) => { counts[opt.value] = 0; });
        sortedQuestions.forEach((q) => {
            const key = normalizeQuestionType(q.question_type);
            if (key) counts[key] += 1; else counts.__unset__ += 1;
        });
        return counts;
    }, [sortedQuestions]);
    const filteredQuestions = useMemo(() => {
        if (!questionTypeFilter) return sortedQuestions;
        if (questionTypeFilter === '__unset__') return sortedQuestions.filter((q) => !normalizeQuestionType(q.question_type));
        return sortedQuestions.filter((q) => normalizeQuestionType(q.question_type) === questionTypeFilter);
    }, [sortedQuestions, questionTypeFilter]);
    const hasFilter = Boolean(questionTypeFilter);

    useMatchmakingQuestionSort({
        listRef,
        enabled: !form.loading && !hasFilter,
        disabled: form.reordering,
        itemCount: filteredQuestions.length,
        onReorder: form.handleReorder,
    });

    useEffect(() => { setCurrentId(selectedEvent?.id); setTempId(selectedEvent?.id); }, [selectedEvent]);
    useEffect(() => { setQuestionTypeFilter(''); }, [currentId]);

    useEffect(() => {
        if (!pendingEdit?.questionId) return;
        if (pendingEdit.eventId && pendingEdit.eventId !== currentId) {
            setCurrentId(pendingEdit.eventId);
            setTempId(pendingEdit.eventId);
            return;
        }
        if (form.loading || !form.data?.questions) return;
        const question = form.data.questions.find((q) => q.id === pendingEdit.questionId);
        if (question) setModals((m) => ({ ...m, ques: true, selectedQues: question, createDefaults: null }));
        onPendingEditConsumed?.();
    }, [pendingEdit, currentId, form.loading, form.data, onPendingEditConsumed]);

    useEffect(() => {
        if (!pendingCreate || form.loading) return;
        setModals((m) => ({ ...m, ques: true, selectedQues: null, createDefaults: pendingCreate }));
        onPendingCreateConsumed?.();
    }, [pendingCreate, form.loading, onPendingCreateConsumed]);

    const openCreate = () => setModals((m) => ({ ...m, ques: true, selectedQues: null, createDefaults: null }));
    const handleDelete = async () => {
        setModals((m) => ({ ...m, delLoading: true }));
        try {
            const res = await matchmakingApi.deleteMatchmakingForm(currentId, form.data.id, token);
            if (res && res.msg) alert(res.msg);
            form.fetchData();
            setModals((m) => ({ ...m, del: false }));
        } catch (err) { form.setError(err.message); }
        finally { setModals((m) => ({ ...m, delLoading: false })); }
    };

    const handleDestExists = () => {
        form.fetchData();
    };

    const handleOpenDestQuestion = (destQuestion) => {
        setModals((m) => ({
            ...m,
            copy: false,
            ques: true,
            selectedQues: destQuestion,
            createDefaults: null,
        }));
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto py-12 px-8 animate-fade-in min-h-screen">
            {form.error && (
                <div className="mb-8 p-5 bg-status-danger/5 border border-status-danger/10 rounded-2xl flex items-center gap-4 text-status-danger">
                    <AlertCircle size={16} />
                    <span className="text-[11px] font-bold">{form.error}</span>
                    <button type="button" onClick={() => form.setError(null)} className="ml-auto p-2"><X size={18} /></button>
                </div>
            )}
            <MatchmakingQuestionsHeader
                currentId={currentId} tempId={tempId} setTempId={setTempId} setCurrentId={setCurrentId} ids={ids}
                data={form.data} reordering={form.reordering} loading={form.loading} canCopy={form.canCopy}
                onCopy={() => setModals((m) => ({ ...m, copy: true }))} onRefresh={form.fetchData}
                onDelete={() => setModals((m) => ({ ...m, del: true }))} onAdd={openCreate}
                allExpanded={allExpanded} setAllExpanded={setAllExpanded}
            />
            {form.loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-text-tertiary gap-8">
                    <Loader2 className="animate-spin text-accent" size={32} />
                    <p className="text-sm font-bold uppercase tracking-wider">Loading matchmaking</p>
                </div>
            ) : form.error && !form.data && !form.notFound ? (
                <div className="bg-white rounded-2xl border border-border/60 p-12 text-center max-w-2xl mx-auto">
                    <AlertCircle className="text-status-danger mx-auto mb-4" size={32} />
                    <h3 className="text-xl font-bold mb-3">Could not load form</h3>
                    <p className="text-sm text-text-secondary mb-8">{form.error}</p>
                    <button type="button" onClick={form.fetchData} className="btn btn-secondary py-3 px-8 rounded-xl gap-2"><RefreshCw size={16} /> Retry</button>
                </div>
            ) : form.notFound ? (
                <MatchmakingEmptySetup onCreate={openCreate} onCopy={() => setModals((m) => ({ ...m, copy: true }))} />
            ) : (
                <>
                    {sortedQuestions.length > 0 && (
                        <MatchmakingQuestionFilters
                            questionTypeFilter={questionTypeFilter} setQuestionTypeFilter={setQuestionTypeFilter}
                            questionTypeCounts={questionTypeCounts} filteredCount={filteredQuestions.length}
                            totalCount={sortedQuestions.length} hasFilter={hasFilter}
                        />
                    )}
                    <MatchmakingQuestionsList
                        listRef={listRef} filteredQuestions={filteredQuestions} sortedQuestions={sortedQuestions}
                        attendeeTypes={form.attendeeTypes}
                        onEdit={(q) => setModals((m) => ({ ...m, ques: true, selectedQues: q, createDefaults: null }))}
                        onRemove={form.handleRemoveQuestion} onToggleExhibitorPortal={form.handleToggleExhibitorPortal}
                        togglingPortalId={form.togglingPortalId} allExpanded={allExpanded} hasFilter={hasFilter}
                        onClearFilter={() => setQuestionTypeFilter('')} onAdd={openCreate}
                    />
                </>
            )}
            <CopyMatchmakingModal
                isOpen={modals.copy}
                onClose={() => setModals((m) => ({ ...m, copy: false }))}
                toEventId={currentId}
                onSuccess={() => { setModals((m) => ({ ...m, copy: false })); form.fetchData(); }}
                onDestExists={handleDestExists}
                onOpenDestQuestion={handleOpenDestQuestion}
            />
            <DeleteConfirmationModal isOpen={modals.del} onClose={() => setModals((m) => ({ ...m, del: false }))} onConfirm={handleDelete} formName={form.data?.form_name} loading={modals.delLoading} />
            <MatchmakingQuestionModal
                isOpen={modals.ques}
                onClose={() => setModals((m) => ({ ...m, ques: false, createDefaults: null }))}
                eventId={currentId}
                token={token}
                question={modals.selectedQues}
                createDefaults={modals.createDefaults}
                formId={form.data?.id}
                formName={form.data?.form_name}
                onSuccess={form.fetchData}
            />
        </div>
    );
};

export default MatchmakingQuestions;
