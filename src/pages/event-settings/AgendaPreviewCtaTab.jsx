import React from 'react';
import { FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const AgendaPreviewCtaTab = ({
    previewCta,
    handleAgendaNestedChange,
    isAgendaModified,
}) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
            <div>
                <p className="font-semibold text-text-primary m-0">Enable CTA Section</p>
                <p className="text-xs text-text-tertiary mt-0.5">Toggle the calls to action in the preview.</p>
            </div>
            <ToggleSwitch
                name="preview_cta_active"
                checked={previewCta.is_active !== false}
                isModified={isAgendaModified('is_active', 'preview_cta')}
                onChange={(e) => handleAgendaNestedChange('preview_cta', 'is_active', e.target.checked)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="CTA Title" description="Title for the call to action section">
                <input
                    type="text"
                    value={previewCta.title || ''}
                    onChange={(e) => handleAgendaNestedChange('preview_cta', 'title', e.target.value)}
                    className={getInputClass('cta_title', isAgendaModified('title', 'preview_cta'))}
                    placeholder="Enter CTA title"
                />
            </FormField>
            <FormField label="CTA Description" description="Description text for the CTA">
                <input
                    type="text"
                    value={previewCta.description || ''}
                    onChange={(e) => handleAgendaNestedChange('preview_cta', 'description', e.target.value)}
                    className={getInputClass('cta_description', isAgendaModified('description', 'preview_cta'))}
                    placeholder="Enter CTA description"
                />
            </FormField>
            <FormField label="Exhibit URL" description="URL for exhibiting CTA button">
                <input
                    type="text"
                    value={previewCta.exhibit_url || ''}
                    onChange={(e) => handleAgendaNestedChange('preview_cta', 'exhibit_url', e.target.value)}
                    className={getInputClass('exhibit_url', isAgendaModified('exhibit_url', 'preview_cta'))}
                    placeholder="https://..."
                />
            </FormField>
            <FormField label="Visit URL" description="URL for visiting CTA button">
                <input
                    type="text"
                    value={previewCta.visit_url || ''}
                    onChange={(e) => handleAgendaNestedChange('preview_cta', 'visit_url', e.target.value)}
                    className={getInputClass('visit_url', isAgendaModified('visit_url', 'preview_cta'))}
                    placeholder="https://..."
                />
            </FormField>
        </div>
    </div>
);

export default AgendaPreviewCtaTab;
