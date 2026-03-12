import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionHeader, getInputClass } from './components/SharedComponents';
import PaymentConfig from '../../components/PaymentConfig';

const PaymentSettings = ({ eventData, handleInputChange, isFieldModified, token }) => {
    const [paymentSubTab, setPaymentSubTab] = useState('selection');

    return (
        <div className="animate-fade-in space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex gap-4 p-1 bg-bg-secondary rounded-lg w-fit border border-border">
                <button
                    onClick={() => setPaymentSubTab('selection')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${paymentSubTab === 'selection' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                    Event Gateway
                </button>
                <button
                    onClick={() => setPaymentSubTab('config')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${paymentSubTab === 'config' ? 'bg-bg-primary text-accent shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                    Gateway Credentials
                </button>
            </div>

            {paymentSubTab === 'selection' ? (
                <div className="animate-fade-in">
                    {/* Section 1: Global Platform Policy */}
                    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm overflow-hidden relative">
                        <SectionHeader icon={ShieldCheck} title="Active Platform Provider" />
                        <div className="max-w-md space-y-4">
                            <div>
                                <label className="block mb-2 text-xs font-bold text-text-secondary uppercase tracking-wider">Default Gateway Strategy</label>
                                <select
                                    name="payment_provider"
                                    value={eventData.payment_provider || ''}
                                    onChange={handleInputChange}
                                    className={getInputClass('payment_provider', isFieldModified('payment_provider'))}
                                >
                                    <option value="">(Not Configured)</option>
                                    <option value="razorpay">Razorpay Platform</option>
                                    <option value="stripe">Stripe Global</option>
                                </select>
                                <p className="text-xs text-text-tertiary mt-3 leading-relaxed">
                                    Select the primary gateway that will handle all registrations and financial transactions for this event instance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <PaymentConfig token={token} />
                </div>
            )}
        </div>
    );
};

export default PaymentSettings;
