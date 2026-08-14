import { useState } from 'react';
import EmailTemplateEditorLayout from './EmailTemplateEditorLayout';
import EmailTemplateFormModalShell from './EmailTemplateFormModalShell';

export default function CreateEmailTemplateModal({
  open,
  form,
  fieldErrors,
  error,
  isSaving,
  dropdowns,
  onPatch,
  onClose,
  onSubmit,
}) {
  const [isEditing, setIsEditing] = useState(true);
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <EmailTemplateFormModalShell
      title={isEditing ? 'New email template' : 'Template overview'}
      isEditing={isEditing}
      isNew
      isSaving={isSaving}
      canSave
      onEdit={() => setIsEditing(true)}
      onCancelEdit={onClose}
      onClose={onClose}
    >
      <EmailTemplateEditorLayout
        form={form}
        fieldErrors={fieldErrors}
        error={error}
        isLoading={false}
        isEditing={isEditing}
        dropdowns={dropdowns}
        eventListId="create-email-template-event-ids"
        onPatch={onPatch}
        onSubmit={handleSubmit}
      />
    </EmailTemplateFormModalShell>
  );
}
