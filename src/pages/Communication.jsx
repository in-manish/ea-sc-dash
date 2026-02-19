import React, { useState } from 'react';
import WhatsAppConfig from '../components/WhatsAppConfig';
import { MessageSquare, Mail } from 'lucide-react';

const Communication = () => {
    const [activeTab, setActiveTab] = useState('whatsapp');

    return (
        <div className="communication-page animate-fade-in p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Communication</h1>
                <p className="text-gray-600">Manage your event communication templates and settings.</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'whatsapp'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('whatsapp')}
                >
                    <MessageSquare size={16} />
                    WhatsApp
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'email'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('email')}
                >
                    <Mail size={16} />
                    Email
                </button>
            </div>

            {activeTab === 'whatsapp' && <WhatsAppConfig />}

            {activeTab === 'email' && (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Mail size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
                    <p className="text-gray-500 mt-1">Email template management coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default Communication;
