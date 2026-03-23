import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GatewayConfig from './GatewayConfig';
import Transactions from './Transactions';
import { Download } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

const Payments = () => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Determine active tab from URL or default to 'config' as requested by user
    const currentTab = searchParams.get('tab') || 'config';

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    return (
        <div className="animate-fade-in pb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Payments & Gateways</h1>
                    <p className="text-sm text-text-secondary">Manage configuration and monitor transaction history.</p>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex gap-4 p-1 bg-bg-secondary rounded-lg w-fit border border-border mb-6">
                <button
                    onClick={() => handleTabChange('config')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${currentTab === 'config' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                    Gateway Config
                </button>
                <button
                    onClick={() => handleTabChange('transactions')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${currentTab === 'transactions' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                    Payments
                </button>
            </div>

            <div className="animate-fade-in mt-4">
                {currentTab === 'config' && <GatewayConfig />}
                {currentTab === 'transactions' && <Transactions />}
            </div>
        </div>
    );
};

export default Payments;
