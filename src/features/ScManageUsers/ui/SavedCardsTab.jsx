import { AlertCircle, ContactRound, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import {
  cardListKey,
  formatCardDate,
  formatDeleteReason,
  getSavedCardId,
} from '../domain/savedCardHelpers';
import SavedCardListItem from './SavedCardListItem';
import SavedCardsScopeToggle from './SavedCardsScopeToggle';

/** Saved-cards list with Active / Archived scope. */
export default function SavedCardsTab({
  cards,
  isLoading,
  error,
  scope,
  onScopeChange,
  onSelect,
  onRestore,
  onRequestDelete,
  busyCardId,
  actionError,
}) {
  const archived = scope === 'archived';

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between gap-3 shrink-0">
        <p className="text-[11px] text-text-tertiary">
          {archived ? 'Archived cards (soft-deleted)' : 'Active saved cards'}
        </p>
        <SavedCardsScopeToggle scope={scope} onChange={onScopeChange} />
      </div>

      {actionError && (
        <div className="mx-4 mt-3 bg-red-50 text-danger p-2.5 rounded-lg text-xs border border-red-100 flex gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-secondary">
          <Loader2 size={28} className="animate-spin text-accent" />
          <span className="text-sm">
            {archived ? 'Loading archived cards…' : 'Loading saved cards…'}
          </span>
        </div>
      ) : error ? (
        <div className="m-4 bg-red-50 text-danger p-3.5 rounded-lg text-sm border border-red-100 flex gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Could not load cards</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <ContactRound size={40} className="text-border-hover mb-3" />
          <h4 className="font-semibold text-text-secondary mb-1">
            {archived ? 'No archived cards' : 'No saved cards'}
          </h4>
          <p className="text-sm text-text-tertiary">
            {archived
              ? 'Soft-deleted cards for this user will appear here.'
              : 'This user has not saved any contacts yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {cards.map((card, i) => {
            const cardId = getSavedCardId(card);
            const busy = cardId != null && busyCardId === cardId;
            return (
              <div key={cardListKey(card, i)} className="relative group">
                <SavedCardListItem
                  card={card}
                  selected={false}
                  onSelect={onSelect}
                  endPad
                />
                <div className="absolute right-3 top-3 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {archived && (
                    <button
                      type="button"
                      title="Restore card"
                      disabled={busy || cardId == null}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore?.(card);
                      }}
                      className="p-1.5 rounded-md border border-border bg-bg-primary text-text-secondary hover:text-accent hover:border-accent disabled:opacity-40 cursor-pointer"
                    >
                      {busy ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                    </button>
                  )}
                  <button
                    type="button"
                    title="Permanently delete"
                    disabled={busy || cardId == null}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete?.(card);
                    }}
                    className="p-1.5 rounded-md border border-border bg-bg-primary text-text-secondary hover:text-danger hover:border-danger disabled:opacity-40 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {archived && (card.deleted_at || card.delete_reason) && (
                  <div className="px-4 pb-2.5 -mt-1 text-[10px] text-text-tertiary flex flex-wrap gap-x-3 gap-y-0.5 border-b border-border">
                    {card.deleted_at && <span>Deleted · {formatCardDate(card.deleted_at)}</span>}
                    {card.delete_reason && (
                      <span>Reason · {formatDeleteReason(card.delete_reason)}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
