import React from 'react';
import { FormField, getInputClass } from './components/SharedComponents';

const AgendaPreviewDetailsTab = ({ agenda, handleAgendaChange, isAgendaModified }) => (
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
);

export default AgendaPreviewDetailsTab;
