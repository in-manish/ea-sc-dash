import React from 'react';
import { findDestQuestionByTitle } from '../domain/matchCopyQuestionTitle';

const CopySourceQuestionRow = ({
    question, selectable, selected, onToggle, destQuestions, onOpenDestQuestion,
}) => {
    const destMatch = findDestQuestionByTitle(question, destQuestions);
    const blocked = Boolean(destMatch);

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${blocked ? 'border-border/40 bg-bg-secondary/20 opacity-80' : 'border-border/60 bg-bg-secondary/40'}`}>
            {selectable && (
                <input
                    type="checkbox"
                    className="mt-0.5"
                    disabled={blocked}
                    checked={!blocked && selected}
                    onChange={() => { if (!blocked) onToggle(question.id); }}
                />
            )}
            <div className="min-w-0 flex-1">
                <p className="font-bold text-text-primary">{question.title || 'Untitled'}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">Source ID #{question.id}</p>
                {destMatch && (
                    <p className="text-[11px] text-text-secondary mt-1.5">
                        Already present on this event
                        {' '}
                        <button
                            type="button"
                            className="font-bold text-accent hover:underline"
                            onClick={() => onOpenDestQuestion?.(destMatch)}
                        >
                            #{destMatch.id}
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default CopySourceQuestionRow;
