import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MatchmakingQuestions from './MatchmakingQuestions';
import ExhibitorPortalQuestions from './ExhibitorPortalQuestions';
import SurveyMapping from './SurveyMapping/index';
import { Layout, GitMerge, Building2 } from 'lucide-react';
import { PRODUCT_QUESTION_CREATE_DEFAULTS } from '../constants/productQuestionDefaults';

const Matchmaking = () => {
    const [activeTab, setActiveTab] = useState('questions');
    const [pendingEdit, setPendingEdit] = useState(null);
    const [pendingCreate, setPendingCreate] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const tabs = [
        { id: 'questions', label: 'Matchmaking Questions', icon: Layout },
        { id: 'exhibitor', label: 'Exhibitor Portal Questions', icon: Building2 },
        { id: 'mapping', label: 'SurveyJs Mapping', icon: GitMerge },
    ];

    useEffect(() => {
        if (searchParams.get('create') !== 'product') return;
        setPendingCreate(PRODUCT_QUESTION_CREATE_DEFAULTS);
        setActiveTab('questions');
        const next = new URLSearchParams(searchParams);
        next.delete('create');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const questionId = Number(searchParams.get('question'));
        if (!questionId) return;
        setPendingEdit({ questionId });
        setActiveTab('questions');
        const next = new URLSearchParams(searchParams);
        next.delete('question');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    const handleEditFromExhibitor = (question, eventId) => {
        setPendingEdit({ questionId: question.id, eventId });
        setActiveTab('questions');
    };

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
                {activeTab === 'questions' && (
                    <MatchmakingQuestions
                        pendingEdit={pendingEdit}
                        onPendingEditConsumed={() => setPendingEdit(null)}
                        pendingCreate={pendingCreate}
                        onPendingCreateConsumed={() => setPendingCreate(null)}
                    />
                )}
                {activeTab === 'exhibitor' && (
                    <ExhibitorPortalQuestions onEditQuestion={handleEditFromExhibitor} />
                )}
                {activeTab === 'mapping' && <SurveyMapping />}
            </div>
        </div>
    );
};

export default Matchmaking;
