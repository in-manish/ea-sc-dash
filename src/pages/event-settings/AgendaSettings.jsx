import React from 'react';
import { Calendar, Settings, MousePointerClick, BarChart3 } from 'lucide-react';
import { SectionHeader, FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const AgendaSettings = ({
    eventData,
    handleAgendaChange,
    handleAgendaNestedChange,
    isAgendaModified
}) => {
    const agenda = eventData.agenda || {};
    const previewCta = agenda.preview_cta || {};
    const previewStats = agenda.preview_stats || {};

    return (
        <div className="animate-fade-in space-y-6">
            {/* Section 1: Preview Settings */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={Settings} title="Agenda Preview" colorClass="text-purple-500" borderClass="bg-purple-500" />
                <div className="space-y-6">
                    <div className="p-4 bg-bg-secondary rounded-lg border border-border mb-4">
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-text-primary m-0">Enable Preview</p>
                                <p className="text-xs text-text-tertiary mt-0.5">Toggle the agenda preview section.</p>
                            </div>
                            <ToggleSwitch
                                name="preview_active"
                                checked={!!agenda.preview_active}
                                isModified={isAgendaModified('preview_active')}
                                onChange={(e) => handleAgendaChange('preview_active', e.target.checked)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Preview Title" description="Main title for the agenda preview">
                            <input
                                type="text"
                                value={agenda.preview_title || ''}
                                onChange={(e) => handleAgendaChange('preview_title', e.target.value)}
                                className={getInputClass('preview_title', isAgendaModified('preview_title'))}
                                placeholder="Enter preview title"
                            />
                        </FormField>
                        <FormField label="Preview Description" description="Description text for the agenda preview">
                            <input
                                type="text"
                                value={agenda.preview_description || ''}
                                onChange={(e) => handleAgendaChange('preview_description', e.target.value)}
                                className={getInputClass('preview_description', isAgendaModified('preview_description'))}
                                placeholder="Enter preview description"
                            />
                        </FormField>
                    </div>
                </div>
            </div>

            {/* Section 2: Preview CTA */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={MousePointerClick} title="Preview CTA" colorClass="text-emerald-500" borderClass="bg-emerald-500" />
                <div className="space-y-6">
                    <div className="p-4 bg-bg-secondary rounded-lg border border-border mb-4">
                        <div className="flex justify-between items-center text-sm">
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
            </div>

            {/* Section 3: Preview Stats */}
            <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                <SectionHeader icon={BarChart3} title="Preview Stats" colorClass="text-blue-500" borderClass="bg-blue-500" />
                <div className="space-y-6">
                    <div className="p-4 bg-bg-secondary rounded-lg border border-border mb-4">
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold text-text-primary m-0">Enable Stats Section</p>
                                <p className="text-xs text-text-tertiary mt-0.5">Toggle the statistics in the preview.</p>
                            </div>
                            <ToggleSwitch
                                name="preview_stats_active"
                                checked={previewStats.is_active !== false}
                                isModified={isAgendaModified('is_active', 'preview_stats')}
                                onChange={(e) => handleAgendaNestedChange('preview_stats', 'is_active', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Speaker Text" description="Headline statistic for speakers">
                            <input
                                type="text"
                                value={previewStats.speaker_text || ''}
                                onChange={(e) => handleAgendaNestedChange('preview_stats', 'speaker_text', e.target.value)}
                                className={getInputClass('speaker_text', isAgendaModified('speaker_text', 'preview_stats'))}
                                placeholder="e.g. 50+"
                            />
                        </FormField>
                        <FormField label="Speaker Description" description="Subtext for speakers statistic">
                            <input
                                type="text"
                                value={previewStats.speaker_description || ''}
                                onChange={(e) => handleAgendaNestedChange('preview_stats', 'speaker_description', e.target.value)}
                                className={getInputClass('speaker_description', isAgendaModified('speaker_description', 'preview_stats'))}
                                placeholder="Speakers"
                            />
                        </FormField>
                        <FormField label="Session Text" description="Headline statistic for sessions">
                            <input
                                type="text"
                                value={previewStats.session_text || ''}
                                onChange={(e) => handleAgendaNestedChange('preview_stats', 'session_text', e.target.value)}
                                className={getInputClass('session_text', isAgendaModified('session_text', 'preview_stats'))}
                                placeholder="e.g. 20+"
                            />
                        </FormField>
                        <FormField label="Session Description" description="Subtext for sessions statistic">
                            <input
                                type="text"
                                value={previewStats.session_description || ''}
                                onChange={(e) => handleAgendaNestedChange('preview_stats', 'session_description', e.target.value)}
                                className={getInputClass('session_description', isAgendaModified('session_description', 'preview_stats'))}
                                placeholder="Sessions"
                            />
                        </FormField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendaSettings;
