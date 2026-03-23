import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SectionHeader, getInputClass } from './components/SharedComponents';

const PaymentSettings = ({ eventData, handleInputChange, isFieldModified }) => {
    return (
        <div className="animate-fade-in space-y-6">
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
    );
};

export default PaymentSettings;
