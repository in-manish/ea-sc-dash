import React from 'react';
import { Filter, X } from 'lucide-react';
import { ATTENDEE_QUESTION_TYPE_OPTIONS, EXHIBITOR_QUESTION_TYPE_OPTIONS } from '../constants/questionTypes';

const chipClass = (isActive, variant) => {
    if (variant === 'exhibitor') {
        return isActive
            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/10'
            : 'bg-accent/8 text-accent border-accent/25 hover:border-accent/50';
    }
    return isActive
        ? 'bg-accent text-white border-accent shadow-lg shadow-accent/10'
        : 'bg-bg-secondary text-text-secondary border-border hover:border-accent/30 hover:text-accent';
};

const MatchmakingQuestionFilters = ({
    questionTypeFilter, setQuestionTypeFilter, questionTypeCounts,
    filteredCount, totalCount, hasFilter,
}) => {
    const renderChip = (opt, variant = 'default') => {
        const isActive = questionTypeFilter === opt.value;
        return (
            <button
                key={opt.value}
                type="button"
                onClick={() => setQuestionTypeFilter(isActive ? '' : opt.value)}
                className={`px-3.5 py-2 rounded-full text-[10px] font-bold border transition-all ${chipClass(isActive, variant)}`}
            >
                {opt.label}
                <span className={`ml-1 ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                    ({questionTypeCounts[opt.value] || 0})
                </span>
            </button>
        );
    };

    return (
        <div className="mb-10 bg-white rounded-2xl border border-border/50 shadow-sm p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent"><Filter size={14} /></div>
                    <div>
                        <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Question Type</p>
                        <p className="text-[10px] text-text-tertiary mt-0.5">Filter by mapped attendee field</p>
                    </div>
                </div>
                {hasFilter && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">
                            Showing <span className="text-accent">{filteredCount}</span> of {totalCount}
                        </span>
                        <button type="button" onClick={() => setQuestionTypeFilter('')} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-text-tertiary hover:text-status-danger bg-bg-secondary rounded-lg border border-border/60">
                            <X size={12} /> Clear
                        </button>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setQuestionTypeFilter('')}
                        className={`px-3.5 py-2 rounded-full text-[10px] font-bold border ${!questionTypeFilter ? 'bg-accent text-white border-accent' : 'bg-bg-secondary text-text-secondary border-border'}`}
                    >
                        All <span className="opacity-70 ml-1">({totalCount})</span>
                    </button>
                    {ATTENDEE_QUESTION_TYPE_OPTIONS.map((opt) => renderChip(opt))}
                    {questionTypeCounts.__unset__ > 0 && renderChip({ value: '__unset__', label: 'Unmapped' })}
                </div>
                <div className="h-px bg-border/60" />
                <div className="flex flex-wrap gap-2">
                    {EXHIBITOR_QUESTION_TYPE_OPTIONS.map((opt) => renderChip(opt, 'exhibitor'))}
                </div>
            </div>
            {hasFilter && (
                <p className="mt-3 text-[10px] text-text-tertiary">Drag-to-reorder is disabled while a filter is active</p>
            )}
        </div>
    );
};

export default MatchmakingQuestionFilters;
