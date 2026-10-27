import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function RatingModal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-lg bg-bg-primary border border-border rounded-2xl shadow-md p-6 max-h-[90vh] overflow-y-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-text-primary m-0">{title}</h2>
            {subtitle ? <p className="text-sm text-text-secondary mt-1 mb-0">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-bg-secondary text-text-tertiary" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
