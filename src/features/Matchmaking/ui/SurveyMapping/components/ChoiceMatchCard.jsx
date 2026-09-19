import React from 'react';

const ChoiceMatchCard = ({ title, subtitle, match, unmatchedHint }) => {
    const tone = match?.tone;
    return (
        <div
            className={`text-[11px] font-semibold px-3 py-2 rounded-xl border shadow-sm transition-colors ${
                tone ? `${tone.wrap}` : 'bg-white border-border/60 text-text-primary'
            }`}
        >
            <div className="flex items-start gap-2">
                {match && (
                    <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${tone.badge}`}>
                        {match.letter}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <p className={tone ? tone.label : 'text-text-primary'}>{title}</p>
                    {subtitle && (
                        <span className="block text-[9px] font-mono text-text-tertiary mt-0.5 opacity-70">{subtitle}</span>
                    )}
                    {match ? (
                        <span className={`block text-[9px] font-bold mt-1 ${tone.label}`}>
                            {match.auto ? 'Same name as' : 'Matched to'} {match.counterpart}
                        </span>
                    ) : (
                        unmatchedHint && (
                            <span className="block text-[9px] font-medium text-text-tertiary mt-1 opacity-50">
                                {unmatchedHint}
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChoiceMatchCard;
