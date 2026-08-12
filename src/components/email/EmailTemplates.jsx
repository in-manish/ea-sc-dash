import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useParams } from 'react-router-dom';
import EmailTemplateList from './templates/components/EmailTemplateList';
import EmailTemplateFilters from './templates/components/EmailTemplateFilters';
import EmailTemplateEditorModal from './templates/components/EmailTemplateEditorModal';
import useEmailTemplatesList from './templates/hooks/useEmailTemplatesList';

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

    const {
        templates,
        filterOptions,
        filters,
        searchInput,
        setSearchInput,
        setFilter,
        clearFilters,
        hasActiveFilters,
        isLoading,
        page,
        setPage,
        totalPages,
        refetch,
    } = useEmailTemplatesList({ eventId, token });

    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('laptop14');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (onAddSignal > 0) handleCreateNew();
    }, [onAddSignal]);

    const handleViewTemplate = (template) => {
        setPreviewTemplate(template);
        setEditFormData({ ...template, email_content: template.email_content || '' });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newTemplate = {
            isNew: true,
            email_name: '',
            subject: '',
            description: '',
            template_type: 'custom',
            is_active: true,
            email_content: '<h1>New Template</h1><p>Edit your content here...</p>',
        };
        setPreviewTemplate(newTemplate);
        setEditFormData(newTemplate);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!eventId) return;
        if (!editFormData.email_name || !editFormData.subject || !editFormData.email_content) {
            alert('Please fill in all required fields (Name, Subject, Content).');
            return;
        }
        setIsSaving(true);
        try {
            if (previewTemplate.isNew) {
                await emailService.createEmailTemplate(eventId, token, editFormData);
            } else {
                await emailService.updateEmailTemplate(eventId, previewTemplate.id, token, editFormData);
            }
            await refetch();
            setPreviewTemplate(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving email template:', error);
            alert('Failed to save email template. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await emailService.deleteEmailTemplate(eventId, id, token);
            await refetch();
        } catch (err) {
            console.error('Error deleting template', err);
            alert('Failed to delete template.');
        }
    };

    return (
        <div className="relative min-h-[400px]">
            <EmailTemplateFilters
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                filters={filters}
                onFilterChange={setFilter}
                filterOptions={filterOptions}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            <EmailTemplateList
                isLoading={isLoading}
                templates={templates}
                viewMode={viewMode}
                handleViewTemplate={handleViewTemplate}
                handleDelete={handleDelete}
                handleCreateNew={handleCreateNew}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                hasActiveFilters={hasActiveFilters}
            />

            <EmailTemplateEditorModal
                previewTemplate={previewTemplate}
                setPreviewTemplate={setPreviewTemplate}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
                handleEditChange={handleEditChange}
                handleSave={handleSave}
                isSaving={isSaving}
                previewDevice={previewDevice}
                setPreviewDevice={setPreviewDevice}
                deviceDimensions={deviceDimensions}
            />
        </div>
    );
};

export default EmailTemplates;
