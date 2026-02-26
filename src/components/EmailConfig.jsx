import React, { useState } from 'react';
import EmailCategoryTypes from './email/EmailCategoryTypes';
import EmailTemplates from './email/EmailTemplates';
import EmailCampaigns from './email/EmailCampaigns';
import { Layers, FileText, Send } from 'lucide-react';

const EmailConfig = () => {
    const [activeTab, setActiveTab] = useState('categories');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
            {/* Header & Sub-tabs */}
            <div className="px-6 pt-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Email Configuration</h2>
                <p className="text-sm text-gray-500 mb-6">Manage event emails, templates, and campaigns.</p>

                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'categories'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <Layers size={16} />
                        Category Emails
                    </button>
                    <button
                        className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'templates'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('templates')}
                    >
                        <FileText size={16} />
                        Templates
                    </button>
                    <button
                        className={`px-4 py-2.5 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'campaigns'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab('campaigns')}
                    >
                        <Send size={16} />
                        Campaigns
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 bg-gray-50/30">
                {activeTab === 'categories' && <EmailCategoryTypes />}
                {activeTab === 'templates' && <EmailTemplates />}
                {activeTab === 'campaigns' && <EmailCampaigns />}
            </div>
        </div>
    );
};

export default EmailConfig;
