import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { ToggleSwitch } from './components/SharedComponents';
import ExhibitorStatisticsTab from './ExhibitorStatisticsTab';
import InterestedInCtaTab from './InterestedInCtaTab';

const TABS = [
    { id: 'statistics', label: 'Exhibitor Statistics' },
    { id: 'interested', label: 'Interested In CTA' },
];

const ExhibitorPreviewModeSection = ({
    eventData,
    handleInputChange,
    isFieldModified,
    handleExhibitorStatsChange,
    isExhibitorStatModified,
    handleInterestedInChange,
    isInterestedInModified,
}) => {
    const [activeTab, setActiveTab] = useState('statistics');

    return (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
            <div className="relative mb-6 pb-2 border-b border-border">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-20" />
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <Eye size={18} className="text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-text-primary m-0">Exhibitor Preview Mode</h3>
                            <p className="text-xs text-text-tertiary mt-0.5 m-0">
                                Toggle preview mode and configure portal display settings.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                            <p className="font-semibold text-text-primary text-sm m-0">
                                {eventData.is_exhibitor_preview_mode_on ? 'Preview On' : 'Preview Off'}
                            </p>
                            <p className="text-[11px] text-text-tertiary mt-0.5 m-0">
                                Show portal preview to exhibitors
                            </p>
                        </div>
                        <ToggleSwitch
                            name="is_exhibitor_preview_mode_on"
                            checked={eventData.is_exhibitor_preview_mode_on || false}
                            isModified={isFieldModified('is_exhibitor_preview_mode_on')}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="relative mb-6 border-b border-border">
                <div className="flex items-center gap-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`bg-transparent border-none py-2.5 px-4 text-[13px] font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'text-accent border-accent font-semibold'
                                    : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-hover'
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'statistics' && (
                <ExhibitorStatisticsTab
                    eventData={eventData}
                    handleExhibitorStatsChange={handleExhibitorStatsChange}
                    isExhibitorStatModified={isExhibitorStatModified}
                />
            )}

            {activeTab === 'interested' && (
                <InterestedInCtaTab
                    eventData={eventData}
                    handleInterestedInChange={handleInterestedInChange}
                    isInterestedInModified={isInterestedInModified}
                />
            )}
        </div>
    );
};

export default ExhibitorPreviewModeSection;
