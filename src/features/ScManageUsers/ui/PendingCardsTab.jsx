import { AlertCircle, ChevronLeft, ChevronRight, Inbox, Loader2, Send } from 'lucide-react';
import { cardListKey } from '../domain/savedCardHelpers';
import SavedCardListItem from './SavedCardListItem';

const DIRECTIONS = [
  { value: 'sent', label: 'Sent', icon: Send },
  { value: 'received', label: 'Received', icon: Inbox },
];

/** Paginated pending list for one direction (sent | received). */
export default function PendingCardsTab({
  cards,
  count,
  page,
  hasNext,
  hasPrev,
  isLoading,
  error,
  direction,
  onDirectionChange,
  onPrev,
  onNext,
  onSelect,
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-border shrink-0 flex flex-wrap gap-1.5">
        {DIRECTIONS.map((d) => {
          const Icon = d.icon;
          const active = direction === d.value;
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => onDirectionChange(d.value)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                active
                  ? 'bg-accent text-accent-text border-accent'
                  : 'bg-bg-primary text-text-secondary border-border hover:bg-bg-secondary'
              }`}
            >
              <Icon size={12} />
              {d.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-secondary">
          <Loader2 size={28} className="animate-spin text-accent" />
          <span className="text-sm">Loading pending {direction}…</span>
        </div>
      ) : error ? (
        <div className="m-4 bg-red-50 text-danger p-3.5 rounded-lg text-sm border border-red-100 flex gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Could not load pending</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <Inbox size={40} className="text-border-hover mb-3" />
          <h4 className="font-semibold text-text-secondary mb-1">No pending {direction}</h4>
          <p className="text-sm text-text-tertiary">
            {direction === 'sent'
              ? 'No open outbound card requests for this user.'
              : 'No open inbound card requests for this user.'}
          </p>
        </div>
      ) : (
        <>
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
          <div className="px-4 py-3 border-t border-border shrink-0 flex items-center justify-between gap-2 bg-bg-secondary/15">
            <span className="text-[11px] text-text-tertiary">
              Page {page} · {count} total
            </span>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={onPrev} disabled={!hasPrev || isLoading} className="btn btn-secondary py-1 px-2.5 flex items-center gap-1 text-xs disabled:opacity-40">
                <ChevronLeft size={14} /> Prev
              </button>
              <button type="button" onClick={onNext} disabled={!hasNext || isLoading} className="btn btn-secondary py-1 px-2.5 flex items-center gap-1 text-xs disabled:opacity-40">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
