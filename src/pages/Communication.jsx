import React, { useState } from 'react';
import WhatsAppConfig from '../components/WhatsAppConfig';
import EmailConfig from '../components/EmailConfig';
import { MessageSquare, Mail } from 'lucide-react';

const Communication = () => {
    const [activeTab, setActiveTab] = useState('whatsapp');

    return (
        <div className="communication-page animate-fade-in p-6 bg-bg-secondary min-h-[calc(100vh-64px)]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Communication</h1>
                <p className="text-sm text-text-secondary mt-1">Manage your event communication templates and settings.</p>
            </div>

            <div className="flex border-b border-border mb-6 gap-2">
                <button
                    className={`px-4 py-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'whatsapp'
                        ? 'border-accent text-accent bg-bg-primary rounded-t-lg shadow-sm'
                        : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('whatsapp')}
                >
                    <MessageSquare size={16} />
                    WhatsApp
                </button>
                <button
                    className={`px-4 py-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'email'
                        ? 'border-accent text-accent bg-bg-primary rounded-t-lg shadow-sm'
                        : 'border-transparent text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('email')}
                >
                    <Mail size={16} />
                    Email
                </button>
            </div>

            {activeTab === 'whatsapp' && <WhatsAppConfig />}
            {activeTab === 'email' && <EmailConfig />}
        </div>
    );
};

export default Communication;
