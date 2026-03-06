import React, { useState } from 'react';
import EmailCategoryTypes from './email/EmailCategoryTypes';
import EmailTemplates from './email/EmailTemplates';
import EmailCampaigns from './email/EmailCampaigns';
import { Layers, FileText, Send, List, Grid, Plus } from 'lucide-react';

const EmailConfig = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [viewMode, setViewMode] = useState('list');
    const [createSignal, setCreateSignal] = useState(0);

    const handleActionClick = () => {
        setCreateSignal(prev => prev + 1);
    };

    const getTabText = () => {
        switch (activeTab) {
            case 'categories': return { title: 'Category Type Emails', desc: 'Target emails based on attendee categories.', button: 'Create Draft' };
            case 'templates': return { title: 'Email Templates', desc: 'Reusable email designs for standard communications.', button: 'Create Template' };
            case 'campaigns': return { title: 'Email Campaigns', desc: 'Monitor and manage your scheduled bulk email campaigns.', button: null };
            default: return { title: 'Email Configuration', desc: 'Manage your email communications.' };
        }
    };

    const config = getTabText();

    return (
        <div className="bg-bg-primary rounded-2xl shadow-premium border border-border flex flex-col min-h-[600px] overflow-hidden min-w-0">
            <div className="px-6 pt-6 border-b border-border">
                {/* Header with title + action button */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-5 bg-bg-secondary/50 rounded-xl border border-border">
                    <div className="min-w-0">
                        <h2 className="text-xl font-extrabold text-text-primary tracking-tight">{config.title}</h2>
                        <p className="text-sm text-text-secondary mt-1">{config.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* View Mode Toggle */}
                        <div className="flex bg-bg-primary p-1 rounded-lg border border-border">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                                    }`}
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                                    }`}
                            >
                                <Grid size={18} />
                            </button>
                        </div>

                        {/* Primary Action Button */}
                        {config.button && (
                            <button
                                onClick={handleActionClick}
                                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                            >
                                <Plus size={16} />
                                {config.button}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'categories'
                            ? 'border-accent text-accent bg-bg-secondary/50 rounded-t-lg'
                            : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <Layers size={16} />
                        Category Emails
                    </button>
                    <button
                        className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'templates'
                            ? 'border-accent text-accent bg-bg-secondary/50 rounded-t-lg'
                            : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('templates')}
                    >
                        <FileText size={16} />
                        Templates
                    </button>
                    <button
                        className={`px-4 py-2.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'campaigns'
                            ? 'border-accent text-accent bg-bg-secondary/50 rounded-t-lg'
                            : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        <Send size={16} />
                        Campaigns
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 bg-bg-secondary/20 overflow-hidden min-w-0">
                {activeTab === 'categories' && <EmailCategoryTypes viewMode={viewMode} onAddSignal={createSignal} />}
                {activeTab === 'templates' && <EmailTemplates viewMode={viewMode} onAddSignal={createSignal} />}
                {activeTab === 'campaigns' && <EmailCampaigns viewMode={viewMode} />}
            </div>
        </div>
    );
};

export default EmailConfig;
