import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import DeviceToggle from '../../../components/email/shared/DeviceToggle';
import { EMAIL_TEMPLATE_DEVICE_PRESETS } from '../constants/devicePreview';
import EmailTemplateEditorSidebar from './EmailTemplateEditorSidebar';
import EmailTemplatePreviewCanvas from './EmailTemplatePreviewCanvas';

export default function EmailTemplateEditorLayout({
  form,
  fieldErrors,
  error,
  isLoading,
  isEditing,
  dropdowns,
  eventListId,
  onPatch,
  onSubmit,
}) {
  const [previewDevice, setPreviewDevice] = useState('laptop14');

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 size={36} className="animate-spin text-accent mb-3" />
        <span className="text-sm text-text-secondary">Loading template...</span>
      </div>
    );
  }

  return (
    <form id="sc-email-template-form" onSubmit={onSubmit} className="flex flex-1 overflow-hidden min-h-0">
      {form ? (
        <EmailTemplateEditorSidebar
          isEditing={isEditing}
          form={form}
          fieldErrors={fieldErrors}
          dropdowns={dropdowns}
          eventListId={eventListId}
          onPatch={onPatch}
        />
      ) : null}
      <div className="flex-1 flex flex-col bg-bg-secondary min-w-0">
        {error ? (
          <div className="m-4 text-sm text-danger bg-red-50 border border-red-100 rounded-lg p-3 whitespace-pre-wrap shrink-0">
            {error}
          </div>
        ) : null}
        <DeviceToggle
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
          deviceDimensions={EMAIL_TEMPLATE_DEVICE_PRESETS}
        />
        {form ? (
          <EmailTemplatePreviewCanvas
            form={form}
            isEditing={isEditing}
            previewDevice={previewDevice}
            onPatch={onPatch}
          />
        ) : null}
      </div>
    </form>
  );
}
