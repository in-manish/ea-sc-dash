import { Eye } from 'lucide-react';
import { previewDocument } from '../domain/templateText';

/** Shows the email as it will look. The frame has no scripts and no access to the dashboard. */
export default function TemplatePreview({ template }) {
  if (!template) {
    return (
      <div className="h-full min-h-[320px] flex flex-col items-center justify-center gap-2 text-text-tertiary text-sm border border-dashed border-border rounded-lg">
        <Eye size={20} />
        Select a template to see its preview
      </div>
    );
  }
  return (
    <div className="flex flex-col border border-border rounded-lg overflow-hidden h-full min-h-[320px]">
      <div className="px-3 py-2 bg-bg-secondary border-b border-border">
        <p className="m-0 text-xs text-text-tertiary">{template.name}</p>
        <p className="m-0 text-sm font-medium text-text-primary">{template.subject || '(no subject)'}</p>
      </div>
      <iframe
        title={`Preview of ${template.name}`}
        sandbox=""
        srcDoc={previewDocument(template.content)}
        className="w-full flex-1 border-none bg-white"
        style={{ minHeight: '300px' }}
      />
      <p className="m-0 px-3 py-1.5 text-[0.7rem] text-text-tertiary bg-bg-secondary border-t border-border">
        Highlighted names are filled in for each attendee.
      </p>
    </div>
  );
}
