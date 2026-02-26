import React, { useState } from 'react';
import WhatsAppConfig from '../components/WhatsAppConfig';
import EmailConfig from '../components/EmailConfig';
import { MessageSquare, Mail } from 'lucide-react';

const Communication = () => {
    const [activeTab, setActiveTab] = useState('whatsapp');

    return (
        <div className="communication-page animate-fade-in p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Communication</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your event communication templates and settings.</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6 gap-2">
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'whatsapp'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                        }`}
                    onClick={() => setActiveTab('whatsapp')}
                >
                    <MessageSquare size={16} />
                    WhatsApp
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'email'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
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
