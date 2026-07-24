import React from 'react';
import { ShieldCheck, Coins } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';

export const EVENT_CURRENCIES = [
    { value: 'INR', label: 'INR — Indian Rupee' },
    { value: 'USD', label: 'USD — US Dollar' },
];

const PaymentSettings = ({
    eventData,
    handleInputChange,
    isFieldModified,
    handleCurrencyToggle,
    isCurrenciesModified,
}) => {
    const selectedCurrencies = Array.isArray(eventData.currencies) ? eventData.currencies : [];

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

            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Coins} title="Accepted Currencies" colorClass="text-emerald-500" borderClass="bg-emerald-500" />
                <FormField
                    label="Currencies"
                    description="Select which currencies are accepted for payments on this event."
                >
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg ${isCurrenciesModified?.() ? 'ring-1 ring-accent/40 rounded-lg p-1' : ''}`}>
                        {EVENT_CURRENCIES.map(({ value, label }) => {
                            const checked = selectedCurrencies.includes(value);
                            return (
                                <label
                                    key={value}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                                        checked
                                            ? 'bg-accent/5 border-accent text-text-primary'
                                            : 'bg-bg-secondary border-border text-text-secondary hover:border-border-hover'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCurrencyToggle?.(value)}
                                        className="w-4 h-4 accent-accent cursor-pointer"
                                    />
                                    <span className="font-medium">{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </FormField>
            </div>
        </div>
    );
};

export default PaymentSettings;
