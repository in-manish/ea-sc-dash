import React, { useState } from 'react';
import { Filter, Star, Hash, Trash2, Layout, Layers, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import OptionList from './OptionList';

const QuestionCard = ({ question, onEdit, onRemove, defaultExpanded }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false);
    const optionCount = question.options?.length || 0;

    React.useEffect(() => {
        setIsExpanded(defaultExpanded);
    }, [defaultExpanded]);

    return (
        <div className={`group relative bg-white rounded-2xl border transition-all duration-500 ease-out animate-fade-in flex flex-col overflow-hidden ${isExpanded ? 'shadow-lg border-accent/20 h-full min-h-[400px]' : 'shadow-sm hover:shadow-md border-border/50 hover:border-accent/30 h-fit'}`}>
            <div className={`absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[100px] rounded-full -mr-24 -mt-24 transition-opacity duration-1000 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            
            {/* Header: Title & ID (Always Visible) */}
            <div className="relative z-10 p-6 pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded-full uppercase tracking-tighter border border-border/40">#{question.id}</span>
                        {!isExpanded && (
                            <div className="flex items-center gap-1.5 animate-fade-in">
                                {question.is_filter && <div className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(22,163,74,0.4)]" title="Filterable" />}
                                {question.is_mandatory && <div className="w-1.5 h-1.5 rounded-full bg-status-danger shadow-[0_0_8px_rgba(220,38,38,0.4)]" title="Required" />}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-text-tertiary flex items-center gap-1 uppercase tracking-tight"><Hash size={10} className="text-accent" /> Step {question.sort_key || 0}</span>
                        </div>
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isExpanded ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-bg-secondary text-text-tertiary group-hover:bg-accent/10 group-hover:text-accent'}`}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-start gap-3">
                    <h3 className={`text-base font-semibold text-text-primary leading-snug transition-colors duration-300 ${isExpanded ? 'text-accent' : 'group-hover:text-accent'}`}>
                        {question.title}
                    </h3>
                    {!isExpanded && (
                        <span className="shrink-0 text-[9px] font-bold bg-accent/5 text-accent px-2 py-0.5 rounded-md border border-accent/10 uppercase tracking-tighter self-center animate-fade-in">
                             {optionCount} {optionCount === 1 ? 'Option' : 'Options'}
                        </span>
                    )}
                </div>

                {!isExpanded && question.design_type && (
                    <div className="mt-3 flex items-center gap-2 animate-fade-in">
                        <span className="text-[9px] font-bold text-text-tertiary/60 flex items-center gap-1 uppercase tracking-tight"><Layout size={10} /> {question.design_type}</span>
                    </div>
                )}
            </div>

            {/* Expanded Body & Footer */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 flex flex-col h-full">
                    <div className="flex-1 relative z-10">
                        <div className="mb-4">
                            <OptionList options={question.options} type={question.type} />
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-border/60">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="flex items-center gap-1.5">
                                {question.is_filter && (
                                    <span className="flex items-center gap-1 text-[9px] font-bold bg-status-success/5 text-status-success px-2 py-0.5 rounded-lg uppercase border border-status-success/10 block">Filter</span>
                                )}
                                {question.is_mandatory && (
                                    <span className="flex items-center gap-1 text-[9px] font-bold bg-status-danger/5 text-status-danger px-2 py-0.5 rounded-lg uppercase border border-status-danger/10 block">Mandatory</span>
                                )}
                            </div>
                            {question.attendee_types?.map(attendeeTypeId => (
                                <span key={attendeeTypeId} className="text-[9px] font-bold text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-lg border border-border/40">
                                    ID {attendeeTypeId}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); onEdit?.(question); }} className="flex-1 py-2.5 text-[11px] font-bold text-accent bg-accent/5 hover:bg-accent hover:text-white rounded-xl transition-all duration-300 active:scale-[0.97] border border-accent/10 hover:border-accent shadow-sm">
                                EDIT CONFIGURATION
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onRemove?.(question.id); }} className="p-3 text-text-tertiary/30 hover:text-status-danger hover:bg-status-danger/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-status-danger/10">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
