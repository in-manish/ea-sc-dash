import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useParams } from 'react-router-dom';
import EmailTemplateList from './templates/components/EmailTemplateList';
import EmailTemplateEditorModal from './templates/components/EmailTemplateEditorModal';

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

    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('laptop14');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchTemplates = async () => {
        if (!eventId) return;
        setIsLoading(true);
        try {
            const data = await emailService.getEmailTemplates(eventId, token, page);
            if (Array.isArray(data)) {
                setTemplates(data);
                setTotalPages(1);
            } else {
                setTemplates(data.results || []);
                setTotalPages(Math.ceil((data.count || 0) / 10));
            }
        } catch (error) {
            console.error('Error fetching email templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && eventId) {
            fetchTemplates();
        }
    }, [token, eventId, page]);

    // Handle lifted create signal
    useEffect(() => {
        if (onAddSignal > 0) {
            handleCreateNew();
        }
    }, [onAddSignal]);

    const handleViewTemplate = (template) => {
        setPreviewTemplate(template);
        setEditFormData({
            ...template,
            email_content: template.email_content || ''
        });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newTemplate = {
            isNew: true,
            email_name: '',
            email_content: '<h1>New Template</h1><p>Edit your content here...</p>'
        };
        setPreviewTemplate(newTemplate);
        setEditFormData(newTemplate);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!eventId) return;

        // Basic Validation
        if (!editFormData.email_name || !editFormData.email_content) {
            alert("Please fill in all required fields (Name, Content).");
            return;
        }

        setIsSaving(true);
        try {
            if (previewTemplate.isNew) {
                await emailService.createEmailTemplate(eventId, token, editFormData);
            } else {
                await emailService.updateEmailTemplate(eventId, previewTemplate.id, token, editFormData);
            }
            await fetchTemplates();
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
        if (!window.confirm("Are you sure you want to delete this template?")) return;

        try {
            await emailService.deleteEmailTemplate(eventId, id, token);
            await fetchTemplates();
        } catch (err) {
            console.error('Error deleting template', err);
            alert("Failed to delete template.");
        }
    };

    return (
        <div className="relative min-h-[400px]">
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
