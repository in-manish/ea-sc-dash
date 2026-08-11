import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

/** Type-to-confirm before irreversible admin card delete. */
export default function PermanentDeleteCardModal({
  card,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  const [typed, setTyped] = useState('');
  const matches = typed === 'DELETE';
  const name = card?.name || 'this card';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSubmitting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !isSubmitting && onCancel()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-card-title"
        className="bg-bg-primary border border-border rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden animate-modal-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-red-200 bg-red-50 flex justify-between items-start gap-3">
          <div className="flex items-start gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-red-100 text-danger flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h3 id="delete-card-title" className="font-bold text-sm text-red-950">
                Permanently delete card
              </h3>
              <p className="text-[11px] text-red-800/90 mt-0.5 leading-snug">
                This cannot be undone. The card will be removed for good.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-red-800/70 hover:text-red-950 border-none bg-transparent cursor-pointer p-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-text-secondary">
            Delete <strong className="text-text-primary">{name}</strong>
            {card?.card_id != null && (
              <span className="text-text-tertiary"> · card_id {card.card_id}</span>
            )}
            ?
          </p>
          <div className="space-y-1.5">
            <label htmlFor="delete-card-confirm" className="text-xs text-text-secondary block">
              Type{' '}
              <kbd className="font-mono text-[11px] font-semibold text-text-primary bg-bg-tertiary px-1.5 py-0.5 rounded border border-border">
                DELETE
              </kbd>{' '}
              to confirm
            </label>
            <input
              id="delete-card-confirm"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className={`input-field font-mono text-sm ${
                typed && !matches ? 'border-danger focus:border-danger' : matches ? 'border-success' : ''
              }`}
              placeholder="DELETE"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border flex justify-end gap-2 bg-bg-secondary/20">
          <button type="button" className="btn btn-secondary text-xs" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn text-xs flex items-center gap-1.5 bg-status-danger hover:opacity-90 text-white border-none disabled:opacity-40"
            disabled={!matches || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : null}
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}
