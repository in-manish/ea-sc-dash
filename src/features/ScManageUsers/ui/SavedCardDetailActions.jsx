import { Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { getSavedCardId } from '../domain/savedCardHelpers';

/** Restore / permanent-delete controls for a saved card detail. */
export default function SavedCardDetailActions({
  card,
  archived,
  isBusy,
  onRestore,
  onRequestDelete,
}) {
  const cardId = getSavedCardId(card);
  const disabled = isBusy || cardId == null;

  return (
    <div className="px-4 py-3 border-t border-border shrink-0 flex flex-wrap gap-2 bg-bg-secondary/30">
      {archived && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRestore?.(card)}
          className="btn btn-secondary text-xs flex items-center gap-1.5 disabled:opacity-40"
        >
          {isBusy ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
          Restore
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onRequestDelete?.(card)}
        className="btn text-xs flex items-center gap-1.5 bg-status-danger/10 text-danger border border-danger/30 hover:bg-status-danger/20 disabled:opacity-40"
      >
        <Trash2 size={12} />
        Delete permanently
      </button>
      {cardId == null && (
        <p className="text-[10px] text-text-tertiary w-full">Missing card_id — cannot restore or delete.</p>
      )}
    </div>
  );
}
