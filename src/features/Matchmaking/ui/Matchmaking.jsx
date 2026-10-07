import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MatchmakingQuestions from './MatchmakingQuestions';
import ExhibitorPortalQuestions from './ExhibitorPortalQuestions';
import SurveyMapping from './SurveyMapping/index';
import SurveyBackfillPage from './SurveyBackfill/SurveyBackfillPage';
import { Layout, GitMerge, Building2, DatabaseBackup } from 'lucide-react';
import { PRODUCT_QUESTION_CREATE_DEFAULTS } from '../constants/productQuestionDefaults';

const TABS = [
    { id: 'questions', label: 'Matchmaking Questions', icon: Layout },
    { id: 'exhibitor', label: 'Exhibitor Portal Questions', icon: Building2 },
    { id: 'mapping', label: 'SurveyJs Mapping', icon: GitMerge },
    {
        id: 'backfill',
        label: 'surveyjs mapping & backfill',
        icon: DatabaseBackup,
        badge: 'New',
    },
];
const TAB_IDS = TABS.map((tab) => tab.id);

const Matchmaking = () => {
    const [pendingEdit, setPendingEdit] = useState(null);
    const [pendingCreate, setPendingCreate] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const requested = searchParams.get('tab');
    const activeTab = TAB_IDS.includes(requested) ? requested : 'questions';

    const setTab = (tab) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        setSearchParams(params, { replace: true });
    };

    useEffect(() => {
        if (searchParams.get('create') !== 'product') return;
        setPendingCreate(PRODUCT_QUESTION_CREATE_DEFAULTS);
        const next = new URLSearchParams(searchParams);
        next.delete('create');
        next.set('tab', 'questions');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        const questionId = Number(searchParams.get('question'));
        if (!questionId) return;
        setPendingEdit({ questionId });
        const next = new URLSearchParams(searchParams);
        next.delete('question');
        next.set('tab', 'questions');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    const handleEditFromExhibitor = (question, eventId) => {
        setPendingEdit({ questionId: question.id, eventId });
        setTab('questions');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-6 mb-8 border-b border-border pb-4 overflow-x-auto">
                {TABS.map(({ id, label, icon: Icon, badge }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative whitespace-nowrap ${
                            activeTab === id
                                ? 'text-accent border-b-2 border-accent'
                                : 'text-text-tertiary hover:text-text-primary'
                        }`}
                    >
                        <Icon size={18} />
                        {badge && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-amber-950 shadow-sm">
                                {badge}
                            </span>
                        )}
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
                {activeTab === 'backfill' && <SurveyBackfillPage />}
            </div>
        </div>
    );
};

export default Matchmaking;
