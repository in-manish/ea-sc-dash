import React from 'react';
import { FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const InterestedInCtaTab = ({
    eventData,
    handleInterestedInChange,
    isInterestedInModified,
}) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
            <div>
                <p className="font-semibold text-text-primary m-0">Show Interested In CTA</p>
                <p className="text-xs text-text-tertiary mt-0.5">Toggle visibility of the "Interested In" call to action.</p>
            </div>
            <ToggleSwitch
                name="is_active"
                checked={eventData.interested_in?.is_active ?? true}
                isModified={isInterestedInModified('is_active')}
                onChange={(e) => handleInterestedInChange('is_active', e.target.checked)}
            />
        </div>

        <div className="grid grid-cols-1 gap-6">
            <FormField label="Title" description="The heading/title for the Interested In section">
                <input
                    type="text"
                    name="title"
                    value={eventData.interested_in?.title || ''}
                    onChange={(e) => handleInterestedInChange('title', e.target.value)}
                    className={getInputClass('title', isInterestedInModified('title'))}
                    placeholder="Enter title (e.g., Interested in participating?)"
                />
            </FormField>
            <FormField label="Description" description="Short description text explaining the call to action">
                <textarea
                    name="description"
                    value={eventData.interested_in?.description || ''}
                    onChange={(e) => handleInterestedInChange('description', e.target.value)}
                    className={getInputClass('description', isInterestedInModified('description'))}
                    rows={2}
                    placeholder="Enter description..."
                />
            </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Exhibit URL" description="Link for exhibit inquiry">
                <input
                    type="url"
                    name="exhibit_url"
                    value={eventData.interested_in?.exhibit_url || ''}
                    onChange={(e) => handleInterestedInChange('exhibit_url', e.target.value)}
                    className={getInputClass('exhibit_url', isInterestedInModified('exhibit_url'))}
                    placeholder="https://example.com/exhibit"
                />
            </FormField>
            <FormField label="Visit URL" description="Link for visit inquiry">
                <input
                    type="url"
                    name="visit_url"
                    value={eventData.interested_in?.visit_url || ''}
                    onChange={(e) => handleInterestedInChange('visit_url', e.target.value)}
                    className={getInputClass('visit_url', isInterestedInModified('visit_url'))}
                    placeholder="https://example.com/visit"
                />
            </FormField>
        </div>
    </div>
);

export default InterestedInCtaTab;
