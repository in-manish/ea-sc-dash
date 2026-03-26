import React, { useState } from 'react';
import MatchmakingQuestions from './MatchmakingQuestions';
import SurveyMapping from './SurveyMapping/index';
import { Layout, GitMerge } from 'lucide-react';

const Matchmaking = () => {
    const [activeTab, setActiveTab] = useState('questions');

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-6 mb-8 border-b border-border pb-4">
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative ${
                        activeTab === 'questions' 
                        ? 'text-accent border-b-2 border-accent' 
                        : 'text-text-tertiary hover:text-text-primary'
                    }`}
                >
                    <Layout size={18} />
                    Matchmaking Questions
                </button>
                <button
                    onClick={() => setActiveTab('mapping')}
                    className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative ${
                        activeTab === 'mapping' 
                        ? 'text-accent border-b-2 border-accent' 
                        : 'text-text-tertiary hover:text-text-primary'
                    }`}
                >
                    <GitMerge size={18} />
                    SurveyJs Mapping
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'questions' ? <MatchmakingQuestions /> : <SurveyMapping />}
            </div>
        </div>
    );
};

export default Matchmaking;
