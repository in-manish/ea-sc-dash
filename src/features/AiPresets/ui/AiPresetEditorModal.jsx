import { useEffect } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import AiPresetFormFields from './AiPresetFormFields';

export default function AiPresetEditorModal({
  isCreate,
  form,
  fieldErrors,
  error,
  isSaving,
  onPatch,
  onClose,
  onSubmit,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSaving, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={isSaving ? undefined : onClose}
      role="presentation"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-preset-editor-title"
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <header className="px-5 py-4 border-b border-border flex justify-between items-center shrink-0">
          <h3 id="ai-preset-editor-title" className="text-lg font-semibold text-text-primary m-0">
            {isCreate ? 'Create preset' : 'Edit preset'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg border-none bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="px-5 py-4 overflow-y-auto flex-1">
          {error ? (
            <div className="mb-4 text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2 whitespace-pre-line">
              {error}
            </div>
          ) : null}
          <AiPresetFormFields
            form={form}
            fieldErrors={fieldErrors}
            isCreate={isCreate}
            onPatch={onPatch}
          />
        </div>

        <footer className="px-5 py-4 border-t border-border flex justify-end gap-2 shrink-0">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm inline-flex items-center gap-1.5" disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isCreate ? 'Create preset' : 'Save changes'}
          </button>
        </footer>
      </form>
    </div>
  );
}
