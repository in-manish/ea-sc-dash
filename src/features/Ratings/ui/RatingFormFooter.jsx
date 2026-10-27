import { Loader2 } from 'lucide-react';

export default function RatingFormFooter({ message, saving, onClose, submitLabel }) {
  return (
    <div className="flex flex-col gap-3 pt-2">
      {message ? <p className="text-sm text-red-600 whitespace-pre-line m-0">{message}</p> : null}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="h-10 px-4 rounded-md text-sm font-semibold text-text-secondary hover:bg-bg-secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-10 px-5 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
