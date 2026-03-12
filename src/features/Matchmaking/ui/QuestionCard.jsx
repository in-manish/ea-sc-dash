import React, { useState } from 'react';
import { Filter, Star, Hash, Trash2, Layout, Layers, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import OptionList from './OptionList';

const QuestionCard = ({ question, attendeeTypes, onEdit, onRemove, defaultExpanded }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false);
    const optionCount = question.options?.length || 0;

    const getAttendeeNames = () => {
        if (!question.attendee_types || !attendeeTypes) return [];
        return question.attendee_types.map(id => {
            const type = attendeeTypes.find(t => t.id === id);
            return type ? type.name : `ID ${id}`;
        });
    };

    const attendeeNames = getAttendeeNames();

    React.useEffect(() => {
        setIsExpanded(defaultExpanded);
    }, [defaultExpanded]);

    return (
        <div className={`group relative bg-white rounded-2xl border transition-all duration-500 ease-out animate-fade-in flex flex-col overflow-hidden ${isExpanded ? 'shadow-lg border-accent/20 h-full min-h-[400px]' : 'shadow-sm hover:shadow-md border-border/50 hover:border-accent/30 h-fit'}`}>
            <div className={`absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[100px] rounded-full -mr-24 -mt-24 transition-opacity duration-1000 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            
            {/* Header: Utility Row (ID, Step, Edit, Toggle) */}
            <div className="relative z-10 px-6 pt-5 pb-3 flex items-center justify-between border-b border-border/40 bg-bg-secondary/20">
                <div className="flex items-center gap-3">
                    <span className="text-[8px] font-bold bg-white text-text-tertiary px-2 py-0.5 rounded-full uppercase tracking-tighter border border-border/40 shadow-sm">#{question.id}</span>
                    <span className="text-[9px] font-bold text-text-tertiary flex items-center gap-1 uppercase tracking-tight opacity-70"><Hash size={10} className="text-accent" /> Step {question.sort_key || 0}</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit?.(question); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold text-accent bg-white hover:bg-accent hover:text-white rounded-lg transition-all duration-300 active:scale-95 border border-accent/20 shadow-sm group/edit" title="Edit Configuration">
                        <MoreHorizontal size={14} className="group-hover/edit:rotate-90 transition-transform" />
                        EDIT
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1.5 rounded-lg transition-all duration-300 ${isExpanded ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white text-text-tertiary hover:bg-accent/10 hover:text-accent border border-border/40'}`}>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Title & Brand Row (Full Title + Badges) */}
            <div className="relative z-10 p-6 pt-5 cursor-pointer flex-1" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-base font-semibold text-text-primary leading-snug transition-colors duration-300 break-words ${isExpanded ? 'text-accent' : 'group-hover:text-accent'}`}>
                                {question.title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                            {!isExpanded && (
                                <span className="text-[9px] font-bold bg-accent/5 text-accent px-2 py-0.5 rounded-md border border-accent/10 uppercase tracking-tighter animate-fade-in">
                                     {optionCount} {optionCount === 1 ? 'Option' : 'Options'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {attendeeNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {attendeeNames.map((name, i) => (
                                    <span key={i} className="text-[8px] font-bold text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-lg border border-border/40 uppercase tracking-tighter">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        )}
                        {question.is_filter && <span className="text-[8px] font-bold text-status-success bg-status-success/5 px-2 py-0.5 rounded-lg border border-status-success/10 uppercase tracking-tighter">Filterable</span>}
                        {question.is_mandatory && <span className="text-[8px] font-bold text-status-danger bg-status-danger/5 px-2 py-0.5 rounded-lg border border-status-danger/10 uppercase tracking-tighter">Required</span>}
                    </div>
                </div>

                {!isExpanded && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-in">
                        {question.design_type && (
                            <span className="text-[9px] font-bold text-text-tertiary/60 flex items-center gap-1 uppercase tracking-tight bg-bg-secondary/50 px-2 py-0.5 rounded-lg border border-border/40"><Layout size={10} /> {question.design_type}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Expanded Body & Footer */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 pt-2 flex flex-col h-full">
                    <div className="flex-1 relative z-10">
                        <div className="mb-4">
                            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Layers size={12} className="text-accent" />
                                Available Configurations
                            </div>
                            <OptionList options={question.options} type={question.type} />
                        </div>
                    </div>

                    <div className="relative z-10 mt-4 pt-4 border-t border-border/40">
                        <div className="flex items-center justify-between">
                            <button onClick={(e) => { e.stopPropagation(); onEdit?.(question); }} className="flex-1 py-2.5 text-[10px] font-bold text-accent bg-accent/5 hover:bg-accent hover:text-white rounded-xl transition-all duration-300 active:scale-[0.97] border border-accent/10 hover:border-accent shadow-sm uppercase tracking-wider">
                                Refine Configuration
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onRemove?.(question.id); }} className="ml-3 p-2.5 text-text-tertiary/40 hover:text-status-danger hover:bg-status-danger/5 rounded-xl transition-all duration-300 border border-transparent hover:border-status-danger/10" title="Delete Question">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
