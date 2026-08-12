import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ToggleSwitch } from './components/SharedComponents';
import AgendaPreviewDetailsTab from './AgendaPreviewDetailsTab';
import AgendaPreviewCtaTab from './AgendaPreviewCtaTab';
import AgendaPreviewStatsTab from './AgendaPreviewStatsTab';

const TABS = [
    { id: 'details', label: 'Preview Details' },
    { id: 'cta', label: 'Preview CTA' },
    { id: 'stats', label: 'Preview Stats' },
];

const AgendaSettings = ({
    eventData,
    handleAgendaChange,
    handleAgendaNestedChange,
    isAgendaModified,
}) => {
    const [activeTab, setActiveTab] = useState('details');
    const agenda = eventData.agenda || {};
    const previewCta = agenda.preview_cta || {};
    const previewStats = agenda.preview_stats || {};
    const previewOn = !!agenda.preview_active;

    return (
        <div className="animate-fade-in">
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <div className="relative mb-6 pb-2 border-b border-border">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-20" />
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <Calendar size={18} className="text-purple-500 shrink-0" />
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-text-primary m-0">Agenda Preview</h3>
                                <p className="text-xs text-text-tertiary mt-0.5 m-0">
                                    Toggle preview and configure agenda display settings.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                                <p className="font-semibold text-text-primary text-sm m-0">
                                    {previewOn ? 'Preview On' : 'Preview Off'}
                                </p>
                                <p className="text-[11px] text-text-tertiary mt-0.5 m-0">
                                    Show agenda preview on portal
                                </p>
                            </div>
                            <ToggleSwitch
                                name="preview_active"
                                checked={previewOn}
                                isModified={isAgendaModified('preview_active')}
                                onChange={(e) => handleAgendaChange('preview_active', e.target.checked)}
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

                {activeTab === 'details' && (
                    <AgendaPreviewDetailsTab
                        agenda={agenda}
                        handleAgendaChange={handleAgendaChange}
                        isAgendaModified={isAgendaModified}
                    />
                )}

                {activeTab === 'cta' && (
                    <AgendaPreviewCtaTab
                        previewCta={previewCta}
                        handleAgendaNestedChange={handleAgendaNestedChange}
                        isAgendaModified={isAgendaModified}
                    />
                )}

                {activeTab === 'stats' && (
                    <AgendaPreviewStatsTab
                        previewStats={previewStats}
                        handleAgendaNestedChange={handleAgendaNestedChange}
                        isAgendaModified={isAgendaModified}
                    />
                )}
            </div>
        </div>
    );
};

export default AgendaSettings;
