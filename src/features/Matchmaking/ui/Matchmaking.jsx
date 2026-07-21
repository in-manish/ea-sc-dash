import React, { useState } from 'react';
import MatchmakingQuestions from './MatchmakingQuestions';
import ExhibitorPortalQuestions from './ExhibitorPortalQuestions';
import SurveyMapping from './SurveyMapping/index';
import { Layout, GitMerge, Building2 } from 'lucide-react';

const Matchmaking = () => {
    const [activeTab, setActiveTab] = useState('questions');

    const tabs = [
        { id: 'questions', label: 'Matchmaking Questions', icon: Layout },
        { id: 'exhibitor', label: 'Exhibitor Portal Questions', icon: Building2 },
        { id: 'mapping', label: 'SurveyJs Mapping', icon: GitMerge },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-6 mb-8 border-b border-border pb-4 overflow-x-auto">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative whitespace-nowrap ${
                            activeTab === id
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-text-tertiary hover:text-text-primary'
                        }`}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'questions' && <MatchmakingQuestions />}
                {activeTab === 'exhibitor' && <ExhibitorPortalQuestions />}
                {activeTab === 'mapping' && <SurveyMapping />}
            </div>
        </div>
    );
};

export default Matchmaking;
