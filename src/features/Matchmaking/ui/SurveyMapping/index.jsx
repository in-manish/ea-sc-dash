import React from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Loader2, Code } from 'lucide-react';

// Hooks
import { useSurveyMapping } from './hooks/useSurveyMapping';

// Components
import ConfigBar from './components/ConfigBar';
import SurveyQuestionList from './components/SurveyQuestionList';
import MappingWorkspace from './components/MappingWorkspace';
import ChoicesOverview from './components/ChoicesOverview';
import ChoiceMappingSection from './components/ChoiceMappingSection';
import PayloadModal from './components/PayloadModal';

const SurveyMapping = () => {
    const { selectedEvent, token } = useAuth();
    const {
        searchQuery, setSearchQuery,
        matchmakingData,
        surveyQuestions, filteredSurveyQuestions,
        formValue, setFormValue,
        loading, fetchingForm, saving, error, setError,
        selectedSurveyQuestion, setSelectedSurveyQuestion,
        showJsonPreview, setShowJsonPreview,
        showGlobalJson, setShowGlobalJson,
        expandedQuestions, setExpandedQuestions,
        mappings, setMappings,
        handleMapQuestion, handleModeToggle, handleMapChoice,
        handleSaveMapping, generatePayload, fetchSurveyForm
    } = useSurveyMapping(selectedEvent, token);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-tertiary gap-4">
                <Loader2 className="animate-spin text-accent" size={40} />
                <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Syncing Matchmaking Library...</p>
            </div>
        );
    }

    const mappedCount = Object.keys(mappings).length;
    const totalCount = surveyQuestions.length;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-4 animate-fade-in pb-4">
            <ConfigBar 
                formValue={formValue}
                setFormValue={setFormValue}
                fetchSurveyForm={fetchSurveyForm}
                fetchingForm={fetchingForm}
                error={error}
                setShowGlobalJson={setShowGlobalJson}
                mappedCount={mappedCount}
                totalCount={totalCount}
            />

            <div className="flex flex-1 gap-6 min-h-0">
                <SurveyQuestionList 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredSurveyQuestions={filteredSurveyQuestions}
                    selectedSurveyQuestion={selectedSurveyQuestion}
                    setSelectedSurveyQuestion={setSelectedSurveyQuestion}
                    expandedQuestions={expandedQuestions}
                    setExpandedQuestions={setExpandedQuestions}
                    mappings={mappings}
                    matchmakingData={matchmakingData}
                    fetchingForm={fetchingForm}
                />

                <MappingWorkspace 
                    selectedSurveyQuestion={selectedSurveyQuestion}
                    matchmakingData={matchmakingData}
                    mappings={mappings}
                    handleMapQuestion={handleMapQuestion}
                    handleSaveMapping={handleSaveMapping}
                    setMappings={setMappings}
                    saving={saving}
                    fetchingForm={fetchingForm}
                >
                    {mappings[selectedSurveyQuestion?.name]?.mmQuestionId && (
                        <>
                            <ChoiceMappingSection 
                                selectedSurveyQuestion={selectedSurveyQuestion}
                                mapping={mappings[selectedSurveyQuestion.name]}
                                handleModeToggle={handleModeToggle}
                                matchmakingData={matchmakingData}
                                handleMapChoice={handleMapChoice}
                            />

                            <ChoicesOverview 
                                selectedSurveyQuestion={selectedSurveyQuestion}
                                matchmakingData={matchmakingData}
                                mappings={mappings}
                            />

                            <button 
                                onClick={() => setShowJsonPreview(prev => prev === 'payload' ? false : 'payload')}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-accent hover:underline px-2"
                            >
                                <Code size={12} />
                                {showJsonPreview === 'payload' ? 'Hide Payload' : 'Preview Payload'}
                            </button>
                            
                            {showJsonPreview === 'payload' && (
                                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
                                    <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                                        {JSON.stringify(generatePayload(), null, 2)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </MappingWorkspace>
            </div>

            <PayloadModal 
                showGlobalJson={showGlobalJson}
                setShowGlobalJson={setShowGlobalJson}
                generatePayload={generatePayload}
            />
        </div>
    );
};

export default SurveyMapping;
