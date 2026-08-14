import { useEffect, useState } from 'react';
import useEmailTemplateDetail from '../hooks/useEmailTemplateDetail';
import EmailTemplateEditorLayout from './EmailTemplateEditorLayout';
import EmailTemplateFormModalShell from './EmailTemplateFormModalShell';

export default function EmailTemplateEditModal({
  templateId,
  token,
  dropdowns,
  onClose,
  onSaved,
}) {
  const detail = useEmailTemplateDetail(token, templateId);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [templateId]);

  if (templateId == null) return null;

  const finish = (updated) => {
    if (!updated) return;
    setIsEditing(false);
    onSaved?.(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    finish(await detail.save());
  };

  const extraActions = detail.form ? (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      disabled={detail.isSaving}
      onClick={async () => finish(detail.form.is_active ? await detail.archive() : await detail.reactivate())}
    >
      {detail.form.is_active ? 'Archive' : 'Reactivate'}
    </button>
  ) : null;

  return (
    <EmailTemplateFormModalShell
      title={isEditing ? 'Modifying template' : 'Template overview'}
      isEditing={isEditing}
      isNew={false}
      isSaving={detail.isSaving}
      canSave={Boolean(detail.form)}
      onEdit={() => setIsEditing(true)}
      onCancelEdit={() => {
        detail.revert();
        setIsEditing(false);
      }}
      onClose={onClose}
      extraActions={extraActions}
    >
      <EmailTemplateEditorLayout
        form={detail.form}
        fieldErrors={detail.fieldErrors}
        error={detail.error}
        isLoading={detail.isLoading}
        isEditing={isEditing}
        dropdowns={dropdowns}
        eventListId="edit-email-template-event-ids"
        onPatch={detail.patch}
        onSubmit={handleSubmit}
      />
    </EmailTemplateFormModalShell>
  );
}
