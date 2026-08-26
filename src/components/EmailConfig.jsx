import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Plus } from 'lucide-react';
import EmailCampaigns from '../features/EmailCampaigns';
import EmailCategoryTypes from './email/EmailCategoryTypes';
import EmailConfigTabs from './email/EmailConfigTabs.jsx';
import {
    getEmailTabCopy,
    isCampaignEmailTab,
    parseEmailTab,
} from './email/emailConfigTabs.js';
import EmailTemplates from './email/EmailTemplates';

const EmailConfig = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = parseEmailTab(searchParams.get('email_tab'));
    const [viewMode, setViewMode] = useState('list');
    const [createSignal, setCreateSignal] = useState(0);
    const config = getEmailTabCopy(activeTab);
    const showViewToggle = !isCampaignEmailTab(activeTab);

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams);
        params.set('email_tab', tab);
        setSearchParams(params, { replace: true });
    };

    return (
        <div className="bg-bg-primary rounded-2xl shadow-premium border border-border flex flex-col min-h-[600px] overflow-hidden min-w-0">
            <div className="px-6 pt-6 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-5 bg-bg-secondary/50 rounded-xl border border-border">
                    <div className="min-w-0">
                        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">{config.title}</h2>
                        <p className="text-sm text-text-secondary mt-1">{config.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {showViewToggle && (
                            <div className="flex bg-bg-primary p-1 rounded-lg border border-border">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-text-tertiary hover:text-text-secondary'
                                        }`}
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                                        ? 'bg-accent text-white shadow-sm'
                                        : 'text-text-tertiary hover:text-text-secondary'
                                        }`}
                                >
                                    <Grid size={18} />
                                </button>
                            </div>
                        )}
                        {config.button && (
                            <button
                                type="button"
                                onClick={() => setCreateSignal((prev) => prev + 1)}
                                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                            >
                                <Plus size={16} />
                                {config.button}
                            </button>
                        )}
                    </div>
                </div>
                <EmailConfigTabs activeTab={activeTab} onChange={handleTabChange} />
            </div>
            <div className="flex-1 p-6 bg-bg-secondary/20 overflow-hidden min-w-0">
                {activeTab === 'categories' && <EmailCategoryTypes viewMode={viewMode} onAddSignal={createSignal} />}
                {activeTab === 'templates' && <EmailTemplates viewMode={viewMode} onAddSignal={createSignal} />}
                {isCampaignEmailTab(activeTab) && <EmailCampaigns />}
            </div>
        </div>
    );
};

export default EmailConfig;
