import React from 'react';
import { AlertCircle } from 'lucide-react';
import CopySourceQuestionRow from './CopySourceQuestionRow';
import { copyableSourceQuestionIds } from '../domain/matchCopyQuestionTitle';

const CopyQuestionsStep = ({
    sourceForm, destQuestions = [], selectedIds, toggleQuestion, toggleSelectAll,
    error, onBack, onContinue, onOpenDestQuestion,
}) => {
    const questions = sourceForm?.questions || [];
    const copyableIds = copyableSourceQuestionIds(questions, destQuestions);
    const selectedCount = selectedIds.filter((id) => copyableIds.includes(id)).length;
    const allSelected = copyableIds.length > 0 && selectedCount === copyableIds.length;
    const canContinue = selectedCount > 0;

    return (
        <div className="flex flex-col gap-5">
            {error && (
                <div className="p-3 bg-status-danger/5 border border-status-danger/20 rounded-lg flex items-start gap-3 text-status-danger text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
            <div className="flex items-center justify-between gap-3">
                <label className={`flex items-center gap-2 text-xs font-bold ${copyableIds.length ? 'cursor-pointer' : 'opacity-50'}`}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        disabled={copyableIds.length === 0}
                        onChange={toggleSelectAll}
                    />
                    Select all
                </label>
                <p className="text-xs font-bold text-text-primary">
                    {selectedCount}/{questions.length} selected
                </p>
            </div>
            <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 pr-1">
                {questions.map((q) => (
                    <CopySourceQuestionRow
                        key={q.id}
                        question={q}
                        selectable
                        selected={selectedIds.includes(q.id)}
                        onToggle={toggleQuestion}
                        destQuestions={destQuestions}
                        onOpenDestQuestion={onOpenDestQuestion}
                    />
                ))}
            </div>
            {copyableIds.length === 0 && questions.length > 0 && (
                <p className="text-xs text-text-secondary">Every source question already exists on this event.</p>
            )}
            <div className="flex gap-3">
                <button type="button" onClick={onBack} className="btn btn-secondary flex-1">Back</button>
                <button type="button" disabled={!canContinue} onClick={onContinue} className="btn btn-primary flex-1">
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CopyQuestionsStep;
