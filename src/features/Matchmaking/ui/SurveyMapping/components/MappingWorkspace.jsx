import React from 'react';
import { Code, Search, RefreshCw, Loader2, Save, ChevronRight } from 'lucide-react';
import Dropdown from './Dropdown';

const MappingWorkspace = ({ 
    selectedSurveyQuestion, 
    matchmakingData, 
    mappings, 
    handleMapQuestion,
    handleSaveMapping,
    setMappings,
    saving,
    fetchingForm,
    children
}) => {
    if (!selectedSurveyQuestion) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-pulse-slow bg-white rounded-2xl border border-border shadow-md">
                <div className="w-32 h-32 bg-accent/5 rounded-[40px] flex items-center justify-center mb-8 rotate-12 relative border border-accent/10">
                    <Code size={64} strokeWidth={1} className="text-accent -rotate-12" />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-border">
                        <Search size={24} className="text-success" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-text-primary mb-3">Ready to Bridge?</h3>
                <p className="text-sm text-text-tertiary max-w-[320px] leading-relaxed mb-8">
                    Select a source question from the left sidebar to begin mapping your SurveyJS response data to Matchmaking attributes.
                </p>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary px-3 py-1.5 rounded-full border border-border/60">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                       Select Source
                   </div>
                   <ChevronRight size={14} className="text-border" />
                   <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 py-1.5 rounded-full border border-border border-dashed opacity-50">
                       Map Target
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-border shadow-md overflow-hidden relative min-h-0">
            {/* Background Visual Enhancements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-success/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />
            
            <div className="relative p-5 border-b border-border bg-white flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/10 shadow-sm shadow-accent/5">
                        <Code className="text-accent" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Configure Question Mapping</h3>
                        <p className="text-xs text-text-tertiary flex items-center gap-1.5 mt-0.5">
                            Source: <span className="font-mono bg-bg-secondary px-1.5 py-0.5 rounded text-text-primary border border-border/40">"{selectedSurveyQuestion.name}"</span>
                        </p>
                    </div>
                </div>
                <div className="min-w-[320px]">
                    <Dropdown 
                        options={(matchmakingData?.questions || (Array.isArray(matchmakingData) ? matchmakingData : []))
                            .map(q => ({ id: q.id, name: q.question_text || q.title || `Question ${q.id}` }))}
                        value={mappings[selectedSurveyQuestion.name]?.mmQuestionId}
                        onChange={(val) => handleMapQuestion(selectedSurveyQuestion.name, val)}
                        placeholder="Select matchmaking question..."
                        title="Target Matchmaking Field"
                        icon={Search}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
                {children}
            </div>

            <div className="p-6 bg-white border-t border-border flex items-center justify-between relative z-20">
                <div className="flex items-center gap-4 text-text-tertiary">
                    <button 
                        onClick={() => {
                            if (confirm('Clear ALL mapping data for this entire form?')) {
                                setMappings({});
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:text-status-danger transition-colors border border-transparent hover:border-status-danger/20 rounded-xl"
                    >
                        <RefreshCw size={14} />
                        Reset All
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 text-xs font-bold text-text-tertiary hover:text-text-primary transition-colors">Discard Draft</button>
                    <button 
                        onClick={handleSaveMapping}
                        disabled={saving || !Object.keys(mappings).length || fetchingForm}
                        className={`px-8 py-3.5 text-white rounded-2xl text-[13px] font-black shadow-xl shadow-accent/30 hover:shadow-accent/40 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3 border-none cursor-pointer uppercase tracking-wider ${
                            saving ? 'bg-accent/80' : 'bg-accent'
                        }`}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Synchronizing...' : 'Save & Publish Mapping'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MappingWorkspace;
