import React from 'react';
import { Filter, Plus, Layout } from 'lucide-react';
import QuestionCard from './QuestionCard';

const MatchmakingQuestionsList = ({
    listRef, filteredQuestions, sortedQuestions, attendeeTypes, onEdit, onRemove,
    onToggleExhibitorPortal, togglingPortalId, allExpanded, hasFilter, onClearFilter, onAdd,
}) => {
    if (filteredQuestions.length > 0) {
        return (
            <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10 items-start">
                {filteredQuestions.map((q) => (
                    <QuestionCard
                        key={q.id}
                        question={q}
                        attendeeTypes={attendeeTypes}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onToggleExhibitorPortal={onToggleExhibitorPortal}
                        togglingPortal={togglingPortalId === q.id}
                        defaultExpanded={allExpanded}
                        draggable={!hasFilter}
                    />
                ))}
            </div>
        );
    }

    if (sortedQuestions.length > 0) {
        return (
            <div className="py-24 px-10 text-center bg-white rounded-[2rem] border border-border/60 flex flex-col items-center">
                <div className="mb-6 p-6 bg-bg-secondary rounded-2xl text-text-tertiary"><Filter size={32} /></div>
                <h3 className="text-lg font-bold text-text-primary mb-2">No matching questions</h3>
                <p className="text-xs text-text-secondary max-w-sm mb-6">No questions match the selected type.</p>
                <button type="button" onClick={onClearFilter} className="btn btn-secondary py-2.5 px-6 rounded-xl text-[11px] font-bold">
                    Clear filter
                </button>
            </div>
        );
    }

    return (
        <div className="py-32 px-10 text-center bg-white rounded-[3rem] border-2 border-dashed border-border/60 flex flex-col items-center">
            <div className="mb-8 p-8 bg-bg-secondary rounded-[2rem] text-text-tertiary"><Layout size={48} /></div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">No questions yet</h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto mb-8">
                This event already has a matchmaking form. Add questions here. Copy is disabled so existing questions stay unchanged.
            </p>
            <button type="button" onClick={onAdd} className="btn btn-primary py-3 px-8 rounded-xl gap-2 font-bold text-[11px] border-none">
                <Plus size={18} /> Add first question
            </button>
        </div>
    );
};

export default MatchmakingQuestionsList;
