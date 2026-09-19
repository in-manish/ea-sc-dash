import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import ChoiceMatchCard from './ChoiceMatchCard';
import { flattenMatchmakingOptions, matchmakingQuestionList } from '../../../domain/flattenMatchmakingOptions';
import { buildChoiceMatchLookup } from '../../../domain/buildChoiceMatchLookup';

const ChoicesOverview = ({ selectedSurveyQuestion, matchmakingData, mappings }) => {
    const mapping = mappings?.[selectedSurveyQuestion.name];
    const mmQ = matchmakingQuestionList(matchmakingData)
        .find((q) => q.id === parseInt(mapping?.mmQuestionId, 10));
    const mmOptions = flattenMatchmakingOptions(mmQ);
    const surveyChoices = selectedSurveyQuestion.choices || [];

    const { byMmId, bySurveyValue } = useMemo(
        () => buildChoiceMatchLookup({
            choiceMappings: mapping?.choiceMappings || {},
            mmOptions,
            surveyChoices,
        }),
        [mapping?.choiceMappings, mmOptions, surveyChoices],
    );

    const matchedCount = Object.keys(bySurveyValue).length;

    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slide-up">
            <div className="p-3 bg-bg-secondary/30 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Info size={14} className="text-accent" />
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Choices Overview</span>
                </div>
                <span className="text-[10px] text-text-tertiary font-bold px-2 py-0.5 bg-white border border-border/60 rounded-full">
                    {surveyChoices.length} source → {mmOptions.length} target
                    {matchedCount ? ` · ${matchedCount} matched` : ''}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-border">
                <div className="p-4 bg-accent/[0.02]">
                    <div className="text-[9px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                        SurveyJS Source
                    </div>
                    <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {surveyChoices.map((c, i) => (
                            <ChoiceMatchCard
                                key={i}
                                title={c.text}
                                subtitle={`Value: ${c.value}`}
                                match={bySurveyValue[String(c.value)]}
                                unmatchedHint="Unmatched"
                            />
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-emerald-[0.02]">
                    <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                        Matchmaking Target
                    </div>
                    <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {mmOptions.map((opt) => (
                            <ChoiceMatchCard
                                key={opt.id}
                                title={opt.name}
                                subtitle={opt.group}
                                match={byMmId[String(opt.id)]}
                                unmatchedHint="Unmatched"
                            />
                        ))}
                        {mmOptions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-text-tertiary opacity-40">
                                <Info size={24} strokeWidth={1} className="mb-2" />
                                <p className="text-[11px] italic">No options found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoicesOverview;
