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
        <div className="bg-bg-primary rounded-2xl shadow-premium border border-border flex flex-col min-h-[600px]">
            <div className="px-8 pt-8 border-b border-border">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">{config.title}</h2>
                        <p className="text-sm text-text-tertiary mt-1">{config.desc}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-bg-tertiary p-1 rounded-xl border border-border">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-accent text-white shadow-md' : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'}`}
                                title="List View"
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-accent text-white shadow-md' : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'}`}
                                title="Grid View"
                            >
                                <Grid size={16} />
                            </button>
                        </div>

                        {/* Primary Action */}
                        {config.button && (
                            <button
                                onClick={handleActionClick}
                                className="btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-accent/20 font-black uppercase tracking-widest text-[10px]"
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

            <div className="flex-1 p-8 bg-bg-secondary/20">
                {activeTab === 'categories' && <EmailCategoryTypes viewMode={viewMode} onAddSignal={createSignal} />}
                {activeTab === 'templates' && <EmailTemplates viewMode={viewMode} onAddSignal={createSignal} />}
                {activeTab === 'campaigns' && <EmailCampaigns viewMode={viewMode} />}
            </div>
        </div>
    );
};

export default EmailConfig;
