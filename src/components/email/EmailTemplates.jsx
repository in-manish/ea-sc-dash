import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useParams } from 'react-router-dom';
import EmailTemplateList from './templates/components/EmailTemplateList';
import EmailTemplateFilters from './templates/components/EmailTemplateFilters';
import EmailTemplateEditorModal from './templates/components/EmailTemplateEditorModal';
import TemplateActionsModal from './templates/components/TemplateActionsModal';
import CreateTemplateTypePicker from './templates/components/CreateTemplateTypePicker';
import useEmailTemplatesList from './templates/hooks/useEmailTemplatesList';
import useEmailTemplateEditor from './templates/hooks/useEmailTemplateEditor';

const deviceDimensions = {
    mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
    tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
    laptop13: { width: '1280px', icon: Monitor, label: '13" Laptop' },
    laptop14: { width: '1440px', icon: Monitor, label: '14" Laptop' },
    laptop16: { width: '1600px', icon: Monitor, label: '16" Laptop' },
};

const EmailTemplates = ({ viewMode = 'list', onAddSignal = 0 }) => {
    const { token, selectedEvent } = useAuth();
    const { id } = useParams();
    const eventId = id || selectedEvent?.id;

    const list = useEmailTemplatesList({ eventId, token });
    const editor = useEmailTemplateEditor({ eventId, token, refetch: list.refetch });

    useEffect(() => {
        if (onAddSignal > 0) editor.openTypePicker();
    }, [onAddSignal]);

    return (
        <div className="relative min-h-[400px]">
            <EmailTemplateFilters
                searchInput={list.searchInput}
                onSearchChange={list.setSearchInput}
                filters={list.filters}
                onFilterChange={list.setFilter}
                filterOptions={list.filterOptions}
                onClear={list.clearFilters}
                hasActiveFilters={list.hasActiveFilters}
            />

            <EmailTemplateList
                isLoading={list.isLoading}
                templates={list.templates}
                viewMode={viewMode}
                handleViewTemplate={editor.handleViewTemplate}
                onOpenActions={editor.setActionsTemplate}
                handleCreateNew={editor.openTypePicker}
                page={list.page}
                totalPages={list.totalPages}
                setPage={list.setPage}
                hasActiveFilters={list.hasActiveFilters}
            />

            <CreateTemplateTypePicker
                open={editor.typePickerOpen}
                eventId={eventId}
                token={token}
                onClose={editor.closeTypePicker}
                onSelect={editor.createFromType}
                onOpenExisting={editor.handleViewTemplate}
            />

            <TemplateActionsModal
                template={editor.actionsTemplate}
                onClose={() => editor.setActionsTemplate(null)}
                onView={editor.handleViewTemplate}
                onDelete={editor.handleDelete}
            />

            <EmailTemplateEditorModal
                previewTemplate={editor.previewTemplate}
                setPreviewTemplate={editor.setPreviewTemplate}
                isEditing={editor.isEditing}
                setIsEditing={editor.setIsEditing}
                editFormData={editor.editFormData}
                setEditFormData={editor.setEditFormData}
                handleEditChange={editor.handleEditChange}
                handleSave={editor.handleSave}
                isSaving={editor.isSaving}
                previewDevice={editor.previewDevice}
                setPreviewDevice={editor.setPreviewDevice}
                deviceDimensions={deviceDimensions}
                supportingVariables={list.supportingVariables}
                typeLocked={editor.typeLocked}
                eventId={eventId}
            />
        </div>
    );
};

export default EmailTemplates;
