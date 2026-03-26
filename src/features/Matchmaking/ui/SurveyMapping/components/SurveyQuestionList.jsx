import React from 'react';
import { Search, ChevronRight, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';

const SurveyQuestionList = ({ 
    searchQuery, setSearchQuery, 
    filteredSurveyQuestions, 
    selectedSurveyQuestion, setSelectedSurveyQuestion,
    expandedQuestions, setExpandedQuestions,
    mappings, matchmakingData,
    fetchingForm
}) => {
    return (
        <div className="w-1/3 flex flex-col bg-white rounded-2xl border border-border shadow-sm overflow-hidden min-h-0">
            <div className="p-4 border-b border-border bg-bg-secondary/20">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {filteredSurveyQuestions.map((q) => {
                    const isMapped = mappings[q.name]?.mmQuestionId;
                    const isSelected = selectedSurveyQuestion?.name === q.name;
                    
                    return (
                        <div key={q.name} className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSelectedSurveyQuestion(q)}
                                    className={`flex-1 text-left p-4 rounded-xl transition-all border flex items-center justify-between group relative overflow-hidden ${
                                        isSelected 
                                        ? 'bg-accent text-white border-accent shadow-md shadow-accent/20' 
                                        : 'bg-white border-transparent hover:bg-bg-secondary/40 text-text-secondary hover:border-border/60'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40" />
                                    )}
                                    <div className="flex flex-col gap-1.5 overflow-hidden">
                                        <span className={`text-[13px] font-bold leading-tight ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                                            {q.title}
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-mono uppercase tracking-tighter px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-bg-secondary text-text-tertiary opacity-50'}`}>
                                                    {q.name}
                                                </span>
                                                {isMapped ? (
                                                    <div className={`flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                                        isSelected 
                                                        ? 'bg-emerald-400/20 text-emerald-100 border-emerald-400/30' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                                                    }`}>
                                                        <CheckCircle2 size={10} />
                                                        Mapped
                                                    </div>
                                                ) : (
                                                    <div className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                                        isSelected
                                                        ? 'bg-white/10 text-white/60 border-white/20'
                                                        : 'text-text-tertiary bg-bg-secondary border-border/40'
                                                    }`}>
                                                        Pending
                                                    </div>
                                                )}
                                            </div>
                                            {isMapped && (
                                                <div className="flex items-center gap-1 border-l border-white/20 ml-1 pl-2">
                                                    {(() => {
                                                        const mmQ = (matchmakingData?.questions || (Array.isArray(matchmakingData) ? matchmakingData : []))
                                                            .find(mq => mq.id === parseInt(isMapped));
                                                        return mmQ && (
                                                            <span className={`text-[10px] font-bold truncate max-w-[180px] ${
                                                                isSelected ? 'text-emerald-100' : 'text-emerald-600'
                                                            }`}>
                                                                → {mmQ.question_text || mmQ.title}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform duration-300 flex-shrink-0 ${isSelected ? 'translate-x-1 text-white' : 'opacity-0 group-hover:opacity-100 text-text-tertiary'}`} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedQuestions(prev => ({ ...prev, [q.name]: !prev[q.name] }));
                                    }}
                                    className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center transition-all hover:bg-bg-secondary border border-transparent hover:border-border/40 ${
                                        expandedQuestions[q.name] ? 'text-accent bg-accent/5' : 'text-text-tertiary'
                                    }`}
                                    title="Show choices"
                                >
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${expandedQuestions[q.name] ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            {expandedQuestions[q.name] && (
                                <div className={`ml-4 mt-1 mb-2 pl-3 border-l-2 flex flex-wrap gap-1.5 py-2 animate-fade-in ${
                                    isSelected ? 'border-accent/30' : 'border-accent/15'
                                }`}>
                                    {q.choices.map((c, i) => (
                                        <span key={i} className="text-[10px] bg-accent/5 text-accent/80 font-semibold px-2 py-1 rounded-md border border-accent/10">
                                            {c.text}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredSurveyQuestions.length === 0 && !fetchingForm && (
                    <div className="py-20 flex flex-col items-center justify-center text-text-tertiary opacity-40">
                        <Search size={48} strokeWidth={1} className="mb-4" />
                        <p className="text-sm font-medium">No results for "{searchQuery}"</p>
                    </div>
                )}
                
                {fetchingForm && (
                    <div className="py-20 flex flex-col items-center justify-center text-accent/40">
                        <Loader2 size={48} strokeWidth={1} className="animate-spin mb-4" />
                        <p className="text-sm font-medium animate-pulse">Scanning Form Elements...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyQuestionList;
