import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { emailService } from '../../services/emailService';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CategoryEmailList from './category/components/CategoryEmailList';
import CategoryEmailEditorModal from './category/components/CategoryEmailEditorModal';

const deviceDimensions = {
    mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
    tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
    laptop13: { width: '1280px', icon: Monitor, label: '13" Laptop' },
    laptop14: { width: '1440px', icon: Monitor, label: '14" Laptop' },
    laptop16: { width: '1600px', icon: Monitor, label: '16" Laptop' },
};

const EmailCategoryTypes = ({ viewMode = 'list', onAddSignal = 0 }) => {
    const { token, selectedEvent } = useAuth();
    const { id } = useParams();
    const eventId = id || selectedEvent?.id;

    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [previewEmail, setPreviewEmail] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('laptop14');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchEmails = async () => {
        if (!eventId) return;
        setIsLoading(true);
        try {
            const data = await emailService.getCategoryEmails(eventId, token);
            setEmails(Array.isArray(data) ? data : (data.results || []));
        } catch (error) {
            console.error('Error fetching category emails:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && eventId) {
            fetchEmails();
        }
    }, [token, eventId]);

    // Handle lifted create signal
    useEffect(() => {
        if (onAddSignal > 0) {
            handleCreateNew();
        }
    }, [onAddSignal]);

    const handleViewEmail = (email) => {
        setPreviewEmail(email);
        setEditFormData({
            ...email,
            email: email.email || ''
        });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        const newTemplate = {
            isNew: true,
            category_name: '',
            email_name: '',
            subject: '',
            email: '<h1>New Email Tempalte</h1><p>Edit your content here...</p>'
        };
        setPreviewEmail(newTemplate);
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
        if (!editFormData.category_name || !editFormData.email_name || !editFormData.subject || !editFormData.email) {
            alert("Please fill in all required fields (Category, Name, Subject, Content).");
            return;
        }

        setIsSaving(true);
        try {
            if (previewEmail.isNew) {
                await emailService.createCategoryEmail(eventId, token, editFormData);
            } else {
                await emailService.updateCategoryEmail(eventId, previewEmail.id, token, editFormData);
            }
            await fetchEmails();
            setPreviewEmail(null);
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
        if (!window.confirm("Are you sure you want to delete this category email?")) return;

        try {
            await emailService.deleteCategoryEmail(eventId, id, token);
            await fetchEmails();
        } catch (err) {
            console.error('Error deleting email', err);
            alert("Failed to delete email.");
        }
    }

    return (
        <div className="relative min-h-[400px] overflow-hidden min-w-0">
            <CategoryEmailList
                isLoading={isLoading}
                emails={emails}
                viewMode={viewMode}
                handleViewEmail={handleViewEmail}
                handleDelete={handleDelete}
                handleCreateNew={handleCreateNew}
            />

            <CategoryEmailEditorModal
                previewEmail={previewEmail}
                setPreviewEmail={setPreviewEmail}
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

export default EmailCategoryTypes;
