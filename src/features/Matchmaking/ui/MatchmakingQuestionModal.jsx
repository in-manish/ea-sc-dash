import React, { useState, useEffect } from 'react';
import { Plus, Loader2, ChevronLeft } from 'lucide-react';
import { matchmakingFormApi } from '../api/matchmakingFormApi';
import { buildSaveMatchmakingPayload } from '../domain/buildSaveMatchmakingPayload';
import { eventService } from '../../../services/eventService';
import { normalizeQuestionType } from '../constants/questionTypes';
import MatchmakingQuestionFormFields from './MatchmakingQuestionFormFields';

const EMPTY_QUESTION_FORM = {
    title: '', type: 'radio', question_type: '', is_mandatory: false, is_filter: false,
    can_support_exhibitor_portal: false, design_type: 'vertical', row_no: 1, sort_key: 1,
    attendee_types: [], options: [{ name: '' }],
};

const MatchmakingQuestionModal = ({
    isOpen, onClose, eventId, token, question, formId, formName, onSuccess, createDefaults = null,
}) => {
    const [loading, setLoading] = useState(false);
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [formData, setFormData] = useState(EMPTY_QUESTION_FORM);

    useEffect(() => {
        if (!isOpen) return;
        eventService.getAttendeeTypes(eventId, token).then((d) => setAttendeeTypes(d.attendee_types || []));
        if (question) {
            const initialOptions = question.options?.length > 0
                ? question.options
                : (question.type === 'grouped_array' ? [{ name: '', values: [{ name: '' }] }] : [{ name: '' }]);
            setFormData({
                ...question,
                question_type: normalizeQuestionType(question.question_type),
                attendee_types: question.attendee_types || [],
                is_filter: question.is_filter || false,
                can_support_exhibitor_portal: question.can_support_exhibitor_portal || false,
                options: initialOptions,
            });
        } else {
            setFormData({
                ...EMPTY_QUESTION_FORM,
                ...(createDefaults || {}),
                options: createDefaults?.options || [{ name: '' }],
            });
        }
    }, [isOpen, question, createDefaults, eventId, token]);

    useEffect(() => {
        if (formData.type === 'grouped_array' && (!formData.options[0]?.values)) {
            setFormData((prev) => ({ ...prev, options: [{ name: '', values: [{ name: '' }] }] }));
        } else if (['radio', 'array'].includes(formData.type) && formData.options[0]?.values) {
            setFormData((prev) => ({ ...prev, options: [{ name: '' }] }));
        }
    }, [formData.type]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formattedOptions = formData.options
                .map((opt) => ({ ...opt, values: opt.values?.filter((v) => v.name) }))
                .filter((opt) => opt.name || opt.values?.length > 0);
            const payload = {
                ...formData,
                id: question?.id,
                options: formattedOptions,
                question_type: formData.question_type || null,
            };
            if (!question?.id) delete payload.id;
            await matchmakingFormApi.saveMatchmakingQuestions(
                eventId,
                buildSaveMatchmakingPayload({ formId, formName, questions: [payload] }),
                token,
            );
            onSuccess?.();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const editOpt = (idx, val) => {
        const next = [...formData.options];
        next[idx].name = val;
        setFormData({ ...formData, options: next });
    };
    const editGValue = (gi, vi, val) => {
        const next = [...formData.options];
        next[gi].values[vi].name = val;
        setFormData({ ...formData, options: next });
    };

    return (
        <div className={`fixed inset-0 left-[var(--sidebar-width)] z-[40] bg-white ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
            <div className="h-full flex flex-col">
                <div className="px-8 py-4 border-b border-border/60 bg-white/80 backdrop-blur-xl flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <button type="button" onClick={onClose} className="group flex items-center gap-2 text-text-tertiary hover:text-accent">
                            <div className="p-2 rounded-xl bg-bg-secondary group-hover:bg-accent group-hover:text-white">
                                <ChevronLeft size={18} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Back to Questions</span>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                                {question ? 'Refine Configuration' : 'Create New Parameter'}
                                {question?.id && <span className="text-[10px] font-mono bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded-full">#{question.id}</span>}
                            </h2>
                            <p className="text-[11px] text-text-tertiary mt-1 uppercase tracking-wider font-bold">
                                {formName || 'Matchmaking'} / Event #{eventId}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-[11px] font-bold text-text-tertiary">DISCARD</button>
                        <button type="submit" disabled={loading} onClick={handleSubmit} className="btn btn-primary px-6 py-2.5 rounded-xl gap-2 border-none font-bold text-[11px]">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            {question ? 'SYNC CHANGES' : 'PUBLISH PARAMETER'}
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-bg-tertiary">
                    <MatchmakingQuestionFormFields
                        formData={formData}
                        setFormData={setFormData}
                        attendeeTypes={attendeeTypes}
                        editOpt={editOpt}
                        editGValue={editGValue}
                    />
                </form>
            </div>
        </div>
    );
};

export default MatchmakingQuestionModal;
