import React from 'react';
import { FormField, ToggleSwitch, getInputClass } from './components/SharedComponents';

const AgendaPreviewStatsTab = ({
    previewStats,
    handleAgendaNestedChange,
    isAgendaModified,
}) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border text-sm">
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
);

export default AgendaPreviewStatsTab;
