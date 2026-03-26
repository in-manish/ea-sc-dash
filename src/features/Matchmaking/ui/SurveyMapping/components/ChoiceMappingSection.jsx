import React from 'react';
import { List, Link2, ChevronRight } from 'lucide-react';
import Dropdown from './Dropdown';

const ChoiceMappingSection = ({ 
    selectedSurveyQuestion, 
    mapping, 
    handleModeToggle, 
    matchmakingData, 
    handleMapChoice 
}) => {
    const mode = mapping?.mode || 'direct';

    return (
        <div className="animate-slide-up space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center justify-between bg-white rounded-2xl border border-border p-4 shadow-sm border-l-4 border-l-accent">
                <div className="flex items-center gap-3">
                    <h5 className="text-xs font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        Choice Mapping Mode
                    </h5>
                </div>
                <div className="flex items-center gap-1 bg-bg-secondary rounded-xl p-1 border border-border/60">
                    <button
                        onClick={() => { if (mode !== 'direct') handleModeToggle(selectedSurveyQuestion.name); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${
                            mode === 'direct'
                                ? 'bg-white text-accent shadow-sm border border-accent/20'
                                : 'text-text-tertiary hover:text-text-primary'
                        }`}
                    >
                        <List size={14} />
                        Direct
                    </button>
                    <button
                        onClick={() => { if (mode !== 'mapped') handleModeToggle(selectedSurveyQuestion.name); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${
                            mode === 'mapped'
                                ? 'bg-white text-accent shadow-sm border border-accent/20'
                                : 'text-text-tertiary hover:text-text-primary'
                        }`}
                    >
                        <Link2 size={14} />
                        Mapped
                    </button>
                </div>
            </div>

            {/* Direct Mode: Show flat list preview */}
            {mode === 'direct' && (
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 border-l-4 border-l-indigo-400">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-3">All SurveyJS choices will be sent as a flat list:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSurveyQuestion.choices.map((c, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-600 text-[12px] font-bold px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
                                {c.value}
                            </span>
                        ))}
                    </div>
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl overflow-hidden">
                        <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto custom-scrollbar">{JSON.stringify(selectedSurveyQuestion.choices.map(c => c.value), null, 2)}</pre>
                    </div>
                </div>
            )}

            {/* Mapped Mode: Per-option mapping table */}
            {mode === 'mapped' && (
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden border-l-4 border-l-emerald-400">
                    <div className="grid grid-cols-[1.2fr,40px,1fr] bg-bg-secondary/50 border-b border-border p-3 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                        <div className="px-4">Matchmaking Option</div>
                        <div />
                        <div className="px-4">SurveyJS Value</div>
                    </div>
                    <div className="divide-y divide-border/60">
                        {(() => {
                            const mmQ = (matchmakingData?.questions || (Array.isArray(matchmakingData) ? matchmakingData : []))
                                .find(q => q.id === parseInt(mapping.mmQuestionId));
                            const flattenedOptions = [];
                            if (mmQ?.type === 'grouped_array') {
                                mmQ.options.forEach(group => {
                                    group.values?.forEach(val => {
                                        flattenedOptions.push({ id: val.id, name: val.name, group: group.name });
                                    });
                                });
                            } else {
                                mmQ?.options?.forEach(opt => flattenedOptions.push({ id: opt.id, name: opt.name }));
                            }

                            return flattenedOptions.map((option) => (
                                <div key={option.id} className="grid grid-cols-[1.2fr,40px,1fr] items-center p-3 hover:bg-emerald-[0.02] transition-all">
                                    <div className="px-4">
                                        <div className="flex flex-col">
                                            {option.group && (
                                                <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest mb-0.5">{option.group}</span>
                                            )}
                                            <span className="text-[12px] font-bold text-text-primary">{option.name}</span>
                                            <span className="text-[10px] font-mono text-text-tertiary opacity-40">ID: {option.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ChevronRight size={14} className="text-border" />
                                    </div>
                                    <div className="px-4">
                                        <Dropdown 
                                            options={selectedSurveyQuestion.choices.map(c => ({ id: c.value, name: c.text }))}
                                            value={mapping?.choiceMappings?.[option.id]}
                                            onChange={(val) => handleMapChoice(selectedSurveyQuestion.name, option.id, val)}
                                            placeholder="Select value..."
                                        />
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChoiceMappingSection;
