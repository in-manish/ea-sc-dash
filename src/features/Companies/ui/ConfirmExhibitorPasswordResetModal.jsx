import { AlertTriangle, Loader2, X } from 'lucide-react';

export default function ConfirmExhibitorPasswordResetModal({
  title = 'Reset exhibitor POC password',
  description = 'Resets the exhibitor portal password for this POC.',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={loading ? undefined : onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhibitor-password-reset-title"
        className="bg-bg-primary rounded-lg border border-border shadow-xl w-full max-w-[440px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center gap-3">
          <h3
            id="exhibitor-password-reset-title"
            className="text-base font-bold text-text-primary m-0"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer p-1 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-3">
            <AlertTriangle
              size={18}
              className="text-amber-700 shrink-0 mt-0.5"
              aria-hidden
            />
            <p className="m-0 text-sm text-text-primary leading-snug">
              {description}
            </p>
          </div>
          {error && (
            <p className="m-0 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
