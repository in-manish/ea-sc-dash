import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function PanelMessage({ type, text, onClear }) {
  if (!text) return null;
  const success = type === 'success';
  return (
    <div
      className={`p-4 rounded-xl text-sm flex items-start gap-3 border whitespace-pre-line ${
        success
          ? 'bg-success/10 border-success/20 text-success'
          : 'bg-danger/10 border-danger/20 text-danger'
      }`}
    >
      {success ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
      <span className="flex-1">{text}</span>
      {onClear ? (
        <button type="button" onClick={onClear} className="p-1 rounded hover:bg-black/5" aria-label="Dismiss message">
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
