import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const PHRASES = { email: 'verify email', phone: 'verify phone' };

/** AWS-style type-to-confirm before verifying a shared contact. */
export default function VerifyContactConfirmModal({
  contactType,
  contactValue,
  duplicateUsers = [],
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  const phrase = PHRASES[contactType] || 'verify email';
  const [typed, setTyped] = useState('');
  const matches = typed === phrase;
  const label = contactType === 'phone' ? 'phone' : 'email';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && matches && !isSubmitting) onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [matches, isSubmitting, onCancel, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-contact-title"
        className="bg-bg-primary border border-border rounded-xl shadow-2xl w-full max-w-[520px] overflow-hidden animate-modal-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-amber-200 bg-amber-50 flex justify-between items-start gap-3">
          <div className="flex items-start gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h3 id="verify-contact-title" className="font-bold text-sm text-amber-950">
                Confirm {label} verification
              </h3>
              <p className="text-[11px] text-amber-800/90 mt-0.5 leading-snug">
                This action can conflict with other accounts using the same {label}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-amber-800/70 hover:text-amber-950 border-none bg-transparent cursor-pointer p-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-lg border border-border bg-bg-secondary/40 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-text-tertiary mb-1">
              Contact value
            </p>
            <code className="text-xs text-text-primary break-all">{contactValue || '—'}</code>
          </div>

          {duplicateUsers.length > 0 && (
            <div>
              <p className="text-[11px] text-text-secondary mb-1.5">
                Found on <strong className="text-text-primary">{duplicateUsers.length}</strong> other
                user{duplicateUsers.length === 1 ? '' : 's'}:
              </p>
              <ul className="max-h-28 overflow-y-auto rounded-lg border border-border divide-y divide-border bg-bg-primary text-[11px]">
                {duplicateUsers.slice(0, 8).map((u) => (
                  <li key={u.id} className="px-3 py-2 flex justify-between gap-2">
                    <span className="truncate font-medium text-text-primary">{u.name || 'No Name'}</span>
                    <span className="text-text-tertiary shrink-0">#{u.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="verify-confirm-input" className="text-xs text-text-secondary block">
              Type <kbd className="font-mono text-[11px] font-semibold text-text-primary bg-bg-tertiary px-1.5 py-0.5 rounded border border-border">{phrase}</kbd> to confirm
            </label>
            <input
              id="verify-confirm-input"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className={`input-field font-mono text-sm ${
                typed && !matches ? 'border-danger focus:border-danger' : matches ? 'border-success' : ''
              }`}
              placeholder={phrase}
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
            className="btn btn-primary text-xs flex items-center gap-1.5 disabled:opacity-40"
            disabled={!matches || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : null}
            Verify {label}
          </button>
        </div>
      </div>
    </div>
  );
}
