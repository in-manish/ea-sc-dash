import React, { useState } from 'react';
import { ShieldCheck, Coins, Receipt, FileText, Eye, EyeOff } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';
import { getAdditionalRequirement } from './exhibitorPortalDefaults';
import ArTaxList from './ArTaxList';

export const EVENT_CURRENCIES = [
    { value: 'INR', label: 'INR — Indian Rupee' },
    { value: 'USD', label: 'USD — US Dollar' },
];

const PaymentSettings = ({
    eventData,
    handleInputChange,
    isFieldModified,
    handleCurrencySelect,
    isCurrenciesModified,
    handleAdditionalRequirementChange,
    isAdditionalRequirementModified,
    handleTaxChange,
    addTax,
    removeTax,
    isTaxModified,
}) => {
    const selectedCurrency = Array.isArray(eventData.currencies) && eventData.currencies.length > 0
        ? eventData.currencies[0]
        : '';
    const { tax, page } = getAdditionalRequirement(eventData);
    const [showFooterPreview, setShowFooterPreview] = useState(false);

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
                <SectionHeader icon={Coins} title="Accepted Currency" colorClass="text-emerald-500" borderClass="bg-emerald-500" />
                <FormField
                    label="Currency"
                    description="Choose the single currency accepted for payments on this event."
                >
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg ${isCurrenciesModified?.() ? 'ring-1 ring-accent/40 rounded-lg p-1' : ''}`}>
                        {EVENT_CURRENCIES.map(({ value, label }) => {
                            const checked = selectedCurrency === value;
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
                                        type="radio"
                                        name="event_currency"
                                        checked={checked}
                                        onChange={() => handleCurrencySelect?.(value)}
                                        className="w-4 h-4 accent-accent cursor-pointer"
                                    />
                                    <span className="font-medium">{label}</span>
                                </label>
                            );
                        })}
                    </div>
                </FormField>
            </div>

            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Receipt} title="Additional Requirements Tax" colorClass="text-orange-500" borderClass="bg-orange-500" />
                <p className="text-xs text-text-tertiary -mt-4 mb-6">
                    Tax applied to exhibitor portal additional-requirement orders. Each rate is a percentage (0–100).
                    Saving replaces the whole list; an empty list means no tax. If tax was never set, the backend defaults to GST 18%.
                    Order totals still return <code className="text-[10px]">gst_rate</code> / <code className="text-[10px]">gst_amount</code>.
                </p>
                <ArTaxList
                    taxes={tax}
                    onChange={handleTaxChange}
                    onAdd={addTax}
                    onRemove={removeTax}
                    isModified={isTaxModified}
                />
            </div>

            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={FileText} title="AR Stall Detail Footer" colorClass="text-sky-500" borderClass="bg-sky-500" />
                <FormField
                    label="Footer HTML"
                    description="Shown on stall detail as additional_requirements_footer in the exhibitor portal."
                >
                    <div className="space-y-2">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowFooterPreview((v) => !v)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                                    showFooterPreview
                                        ? 'bg-accent text-white border-accent'
                                        : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                                }`}
                            >
                                {showFooterPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                                {showFooterPreview ? 'Edit HTML' : 'Preview'}
                            </button>
                        </div>
                        {showFooterPreview ? (
                            <div
                                className="bg-bg-secondary border border-border rounded-md p-4 min-h-[120px] text-sm leading-relaxed prose prose-sm max-w-none shadow-inner text-text-primary"
                                dangerouslySetInnerHTML={{
                                    __html: page.footer || '<span class="text-text-tertiary italic">No footer content</span>',
                                }}
                            />
                        ) : (
                            <textarea
                                value={page.footer}
                                onChange={(e) => handleAdditionalRequirementChange?.('page', 'footer', e.target.value)}
                                className={`${getInputClass('page.footer', isAdditionalRequirementModified?.('page', 'footer'))} font-mono text-xs min-h-[120px]`}
                                placeholder='<strong>Orders valid with full remittance.</strong>'
                                rows={5}
                                spellCheck={false}
                            />
                        )}
                    </div>
                </FormField>
            </div>
        </div>
    );
};

export default PaymentSettings;
