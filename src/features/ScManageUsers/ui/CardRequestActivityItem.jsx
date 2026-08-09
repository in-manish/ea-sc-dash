import { Building } from 'lucide-react';
import { cardInitials } from '../domain/savedCardHelpers';
import { activityMeta, cardStatusMeta } from '../domain/cardRequestHelpers';

export default function CardRequestActivityItem({ item, onSelect }) {
  const card = item?.card || {};
  const act = activityMeta(item?.activity);
  const st = cardStatusMeta(card.status);

  return (
    <button
      type="button"
      onClick={() => card && onSelect?.(card)}
      className="w-full text-left px-4 py-3.5 border-b border-border hover:bg-bg-secondary/40 transition-colors border-l-2 border-l-transparent hover:border-l-accent"
    >
      <div className="flex gap-3">
        {card.image_url ? (
          <img src={card.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-bg-secondary" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
            {cardInitials(card.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${act.className}`}>
              {act.label}
            </span>
            {card.status && (
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${st.className}`}>
                {st.label}
              </span>
            )}
          </div>
          <p className="text-sm text-text-primary leading-snug">{item.message || 'Card activity'}</p>
          {(card.name || card.company) && (
            <p className="text-[11px] text-text-secondary mt-1.5 truncate flex items-center gap-1">
              <Building size={10} className="text-text-tertiary shrink-0" />
              {[card.name, card.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
