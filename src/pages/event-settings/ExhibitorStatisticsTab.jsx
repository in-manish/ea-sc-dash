import React from 'react';
import { FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const ExhibitorStatisticsTab = ({
    eventData,
    handleExhibitorStatsChange,
    isExhibitorStatModified,
}) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
            <div>
                <p className="font-semibold text-text-primary m-0">Show Statistics</p>
                <p className="text-xs text-text-tertiary mt-0.5">Toggle visibility of exhibitor and country stats on the portal.</p>
            </div>
            <ToggleSwitch
                name="is_active"
                checked={eventData.exhibitor_stats?.is_active || false}
                isModified={isExhibitorStatModified('is_active')}
                onChange={(e) => handleExhibitorStatsChange('is_active', e.target.checked)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Country Statistics Text" description="Display text for country counts">
                <input
                    type="text"
                    name="country_stat_text"
                    value={eventData.exhibitor_stats?.country_stat_text || ''}
                    onChange={(e) => handleExhibitorStatsChange('country_stat_text', e.target.value)}
                    className={getInputClass('country_stat_text', isExhibitorStatModified('country_stat_text'))}
                    placeholder="e.g. 20+ Countries"
                />
            </FormField>
            <FormField label="Exhibitor Statistics Text" description="Display text for exhibitor counts">
                <input
                    type="text"
                    name="exhibitor_stat_text"
                    value={eventData.exhibitor_stats?.exhibitor_stat_text || ''}
                    onChange={(e) => handleExhibitorStatsChange('exhibitor_stat_text', e.target.value)}
                    className={getInputClass('exhibitor_stat_text', isExhibitorStatModified('exhibitor_stat_text'))}
                    placeholder="e.g. 500+ Exhibitors"
                />
            </FormField>
            <FormField label="Country Statistics Description" description="Additional details for countries">
                <textarea
                    name="country_stat_description"
                    value={eventData.exhibitor_stats?.country_stat_description || ''}
                    onChange={(e) => handleExhibitorStatsChange('country_stat_description', e.target.value)}
                    className={getInputClass('country_stat_description', isExhibitorStatModified('country_stat_description'))}
                    rows={2}
                    placeholder="Describe country statistics..."
                />
            </FormField>
            <FormField label="Exhibitor Statistics Description" description="Additional details for exhibitors">
                <textarea
                    name="exhibitor_stat_description"
                    value={eventData.exhibitor_stats?.exhibitor_stat_description || ''}
                    onChange={(e) => handleExhibitorStatsChange('exhibitor_stat_description', e.target.value)}
                    className={getInputClass('exhibitor_stat_description', isExhibitorStatModified('exhibitor_stat_description'))}
                    rows={2}
                    placeholder="Describe exhibitor statistics..."
                />
            </FormField>
        </div>
    </div>
);

export default ExhibitorStatisticsTab;
