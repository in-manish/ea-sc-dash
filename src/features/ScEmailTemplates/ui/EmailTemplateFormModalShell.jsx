import { Edit3, Eye, Loader2, Save, X } from 'lucide-react';

export default function EmailTemplateFormModalShell({
  title,
  isEditing,
  isNew,
  isSaving,
  canSave,
  onEdit,
  onCancelEdit,
  onClose,
  extraActions,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-bg-primary rounded-2xl shadow-2xl border border-border w-full max-w-[1600px] h-[95vh] max-h-[950px] flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            {isEditing ? <Edit3 size={18} className="text-accent" /> : <Eye size={18} className="text-accent" />}
            {title}
          </h3>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button type="button" className="btn btn-secondary btn-sm inline-flex items-center gap-2" onClick={onEdit}>
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit Template</span>
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelEdit} disabled={isSaving}>
                  Cancel
                </button>
                <button
                  type="submit"
                  form="sc-email-template-form"
                  className="btn btn-primary btn-sm inline-flex items-center gap-2"
                  disabled={isSaving || !canSave}
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isNew ? 'Create template' : 'Save changes'}
                </button>
              </>
            )}
            {extraActions}
            <div className="hidden sm:block w-px h-6 bg-border mx-1" />
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg border-none bg-transparent cursor-pointer inline-flex items-center gap-1"
            >
              <X size={20} />
              <span className="hidden lg:inline text-sm font-medium">Close</span>
            </button>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
