import React from 'react';
import MatchSideBadge from './MatchSideBadge';

const ROWS = [
    { key: 'title_seeking', label: 'Seeking Title', side: 'seeking' },
    { key: 'short_title_offering', label: 'Short Title (Offering)', side: 'offering' },
    { key: 'short_title_seeking', label: 'Short Title (Seeking)', side: 'seeking' },
    { key: 'title_filter', label: 'Filter Title' },
];

/** Titles under the card's main (offering) title, same order as the editor. Unset values show "Default". */
const QuestionLabelsSummary = ({ question }) => (
    <dl className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-border/40 bg-bg-secondary/30 p-3">
        {ROWS.map(({ key, label, side }) => (
            <div key={key} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-2 text-[9px] font-bold text-text-tertiary uppercase tracking-wider">
                    {label}
                    {side && <MatchSideBadge side={side} />}
                </dt>
                <dd className={`text-xs break-words ${question[key] ? 'text-text-primary font-medium' : 'text-text-tertiary italic'}`}>
                    {question[key] || 'Default'}
                </dd>
            </div>
        ))}
    </dl>
);

export default QuestionLabelsSummary;
