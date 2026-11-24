import React, { useState } from 'react';
import { HardHat, Eye, EyeOff } from 'lucide-react';
import { SectionHeader, FormField, getInputClass } from './components/SharedComponents';
import { getContractorRegistrationInfo } from './exhibitorPortalDefaults';

/** Companies tab: edit exhibitor_portal_data.contractor_registration_information (HTML). */
const ContractorRegistrationInfoSection = ({ eventData, onChange, isModified }) => {
    const [showPreview, setShowPreview] = useState(false);
    const value = getContractorRegistrationInfo(eventData);

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
            <SectionHeader icon={HardHat} title="Contractor Registration Information" colorClass="text-orange-500" borderClass="bg-orange-500" />
            <FormField
                label="Information HTML"
                description="Shown to exhibitors in the exhibitor portal as exhibitor_portal_data.contractor_registration_information."
            >
                <div className="space-y-2">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowPreview((v) => !v)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                                showPreview
                                    ? 'bg-accent text-white border-accent'
                                    : 'border-border bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                            }`}
                        >
                            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showPreview ? 'Edit HTML' : 'Preview'}
                        </button>
                    </div>
                    {showPreview ? (
                        <div
                            className="bg-bg-secondary border border-border rounded-md p-4 min-h-[120px] text-sm leading-relaxed prose prose-sm max-w-none shadow-inner text-text-primary"
                            dangerouslySetInnerHTML={{
                                __html: value || '<span class="text-text-tertiary italic">No contractor registration information</span>',
                            }}
                        />
                    ) : (
                        <textarea
                            value={value}
                            onChange={(e) => onChange?.(e.target.value)}
                            className={`${getInputClass('contractor_registration_information', isModified?.())} font-mono text-xs min-h-[120px]`}
                            placeholder="<p>Contractors must register before build-up…</p>"
                            rows={6}
                            spellCheck={false}
                        />
                    )}
                </div>
            </FormField>
        </div>
    );
};

export default ContractorRegistrationInfoSection;
