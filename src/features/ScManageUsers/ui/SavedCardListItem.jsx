import { Building, Mail, Phone, Tag } from 'lucide-react';
import {
  cardInitials,
  formatCardDate,
  formatCardLocation,
  formatCardPhone,
  isNonSnapCard,
} from '../domain/savedCardHelpers';

export default function SavedCardListItem({ card, selected, onSelect }) {
  const nonSc = isNonSnapCard(card);
  const phone = formatCardPhone(card);
  const location = formatCardLocation(card);
  const savedAt = formatCardDate(card.confirmed_at || card.created_at);
  const tags = Array.isArray(card.tags) ? card.tags : [];

  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
        selected ? 'bg-accent/8 border-l-2 border-l-accent' : 'hover:bg-bg-secondary/40 border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex gap-3">
        {card.image_url ? (
          <img src={card.image_url} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0 bg-bg-secondary" />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
            {cardInitials(card.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{card.name || 'Unnamed contact'}</p>
              {(card.company || card.designation) && (
                <p className="text-[11px] text-text-secondary truncate mt-0.5 flex items-center gap-1">
                  <Building size={10} className="shrink-0 text-text-tertiary" />
                  {[card.designation, card.company].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            {nonSc && (
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-bg-secondary text-text-tertiary border border-border">
                Non-SC
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-text-secondary">
            {card.email && (
              <span className="flex items-center gap-1 truncate"><Mail size={10} className="text-text-tertiary shrink-0" />{card.email}</span>
            )}
            {phone && (
              <span className="flex items-center gap-1 truncate"><Phone size={10} className="text-text-tertiary shrink-0" />{phone}</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 min-w-0">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary border border-border">
                  <Tag size={8} />{t}
                </span>
              ))}
              {tags.length > 3 && <span className="text-[9px] text-text-tertiary">+{tags.length - 3}</span>}
            </div>
            <span className="text-[10px] text-text-tertiary shrink-0">{savedAt}</span>
          </div>
          {location && <p className="text-[10px] text-text-tertiary mt-1 truncate">{location}</p>}
        </div>
      </div>
    </button>
  );
}
