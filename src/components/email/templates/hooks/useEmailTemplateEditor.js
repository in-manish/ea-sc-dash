import { useState } from 'react';
import { emailService } from '../../../../services/emailService';
import { buildEmailTemplatePayload } from '../domain/buildEmailTemplatePayload';
import { buildNewEmailTemplate } from '../domain/buildNewEmailTemplate';
import { parseEmailTemplateSaveError } from '../domain/parseEmailTemplateSaveError';
import { isKnownEmailTemplateType } from '../constants/emailTemplateTypes';

export default function useEmailTemplateEditor({ eventId, token, refetch }) {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [actionsTemplate, setActionsTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('laptop14');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const typeLocked = Boolean(
    previewTemplate?.isNew && isKnownEmailTemplateType(editFormData.template_type),
  );

  const handleViewTemplate = async (template) => {
    setTypePickerOpen(false);
    setPreviewTemplate(template);
    setEditFormData({ ...template, email_content: template.email_content || '' });
    setIsEditing(false);
    if (!eventId || !template?.id) return;
    try {
      const detail = await emailService.getEmailTemplate(eventId, template.id, token);
      const merged = { ...template, ...detail };
      setPreviewTemplate(merged);
      setEditFormData({ ...merged, email_content: merged.email_content || '' });
    } catch {
      /* list row is enough */
    }
  };

  const createFromType = (typeValue) => {
    const next = buildNewEmailTemplate(typeValue);
    setPreviewTemplate(next);
    setEditFormData(next);
    setIsEditing(true);
    setTypePickerOpen(false);
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
      const payload = buildEmailTemplatePayload(editFormData, eventId);
      if (previewTemplate.isNew) {
        await emailService.createEmailTemplate(eventId, token, payload);
      } else {
        await emailService.updateEmailTemplate(eventId, previewTemplate.id, token, payload);
      }
      await refetch();
      setPreviewTemplate(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving email template:', error);
      alert(parseEmailTemplateSaveError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (template) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await emailService.deleteEmailTemplate(eventId, template.id, token);
      await refetch();
    } catch (err) {
      console.error('Error deleting template', err);
      alert('Failed to delete template.');
    }
  };

  return {
    previewTemplate,
    setPreviewTemplate,
    actionsTemplate,
    setActionsTemplate,
    previewDevice,
    setPreviewDevice,
    isEditing,
    setIsEditing,
    editFormData,
    setEditFormData,
    isSaving,
    typePickerOpen,
    typeLocked,
    openTypePicker: () => setTypePickerOpen(true),
    closeTypePicker: () => setTypePickerOpen(false),
    handleViewTemplate,
    createFromType,
    handleEditChange,
    handleSave,
    handleDelete,
  };
}
