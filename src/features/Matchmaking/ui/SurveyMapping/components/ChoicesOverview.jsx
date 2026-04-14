import React from 'react';
import { Info } from 'lucide-react';

const ChoicesOverview = ({ selectedSurveyQuestion, matchmakingData, mappings }) => {
    const mmQ = (matchmakingData?.questions || (Array.isArray(matchmakingData) ? matchmakingData : []))
        .find(q => q.id === parseInt(mappings[selectedSurveyQuestion.name]?.mmQuestionId));
    
    const mmOptions = [];
    if (mmQ?.type === 'grouped_array') {
        mmQ.options?.forEach(group => {
            group.values?.forEach(val => mmOptions.push({ name: val.name, group: group.name }));
        });
    } else {
        mmQ?.options?.forEach(opt => mmOptions.push({ name: opt.name }));
    }

    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-slide-up">
            <div className="p-3 bg-bg-secondary/30 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Info size={14} className="text-accent" />
                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Choices Overview</span>
                </div>
                <span className="text-[10px] text-text-tertiary font-bold px-2 py-0.5 bg-white border border-border/60 rounded-full">
                    {selectedSurveyQuestion.choices.length} source → {mmOptions.length} target
                </span>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-border">
                <div className="p-4 bg-accent/[0.02]">
                    <div className="text-[9px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
                        SurveyJS Source
                    </div>
                    <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {selectedSurveyQuestion.choices.map((c, i) => (
                            <div key={i} className="text-[11px] font-semibold text-text-primary bg-white px-3 py-2 rounded-xl border border-border/60 shadow-sm hover:border-accent/30 transition-colors">
                                {c.text}
                                <span className="block text-[9px] font-mono text-text-tertiary mt-0.5 opacity-60">Value: {c.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-emerald-[0.02]">
                    <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                        Matchmaking Target
                    </div>
                    <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {mmOptions.map((opt, i) => (
                            <div key={i} className="text-[11px] font-semibold text-text-primary bg-white px-3 py-2 rounded-xl border border-border/60 shadow-sm hover:border-emerald-300/30 transition-colors">
                                {opt.name}
                                {opt.group && <span className="block text-[9px] font-bold text-emerald-500/60 uppercase mt-0.5 tracking-tighter">{opt.group}</span>}
                            </div>
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
