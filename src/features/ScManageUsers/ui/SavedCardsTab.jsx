import { AlertCircle, ContactRound, Loader2 } from 'lucide-react';
import { cardListKey } from '../domain/savedCardHelpers';
import SavedCardListItem from './SavedCardListItem';

/** Saved-cards list body for the user cards slide-over. */
export default function SavedCardsTab({ cards, isLoading, error, onSelect }) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-secondary">
        <Loader2 size={28} className="animate-spin text-accent" />
        <span className="text-sm">Loading saved cards…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 bg-red-50 text-danger p-3.5 rounded-lg text-sm border border-red-100 flex gap-2">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">Could not load cards</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <ContactRound size={40} className="text-border-hover mb-3" />
        <h4 className="font-semibold text-text-secondary mb-1">No saved cards</h4>
        <p className="text-sm text-text-tertiary">This user has not saved any contacts yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      {cards.map((card, i) => (
        <SavedCardListItem
          key={cardListKey(card, i)}
          card={card}
          selected={false}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
