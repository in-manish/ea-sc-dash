import { ArrowLeft, Building, Mail, MapPin, Phone } from 'lucide-react';
import {
  cardInitials,
  formatCardDate,
  formatCardLocation,
  formatCardPhone,
  isNonSnapCard,
} from '../domain/savedCardHelpers';
import { cardStatusMeta } from '../domain/cardRequestHelpers';

const Field = ({ label, children }) => {
  if (!children) return null;
  return (
    <div className="py-2.5 border-b border-border last:border-0">
      <dt className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm text-text-primary whitespace-pre-wrap break-words">{children}</dd>
    </div>
  );
};

export default function SavedCardDetail({ card, onBack }) {
  const phone = formatCardPhone(card);
  const location = formatCardLocation(card);
  const tags = Array.isArray(card.tags) ? card.tags : [];
  const nonSc = isNonSnapCard(card);
  const status = card.status ? cardStatusMeta(card.status) : null;
  const extras = card.extra_fields && typeof card.extra_fields === 'object'
    ? Object.entries(card.extra_fields)
    : [];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-border shrink-0 flex items-center gap-2">
        <button type="button" onClick={onBack} className="p-1.5 rounded-lg border-none bg-transparent text-text-secondary hover:bg-bg-secondary cursor-pointer" aria-label="Back to list">
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-text-primary">Contact detail</span>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        <div className="flex gap-3 items-start">
          {card.image_url ? (
            <img src={card.image_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-bg-secondary" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg font-bold">
              {cardInitials(card.name)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-base font-bold text-text-primary">{card.name || 'Unnamed contact'}</h4>
            {(card.company || card.designation) && (
              <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                <Building size={12} className="shrink-0" />
                {[card.designation, card.company].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {nonSc && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-bg-secondary text-text-tertiary border border-border">
                  Non-SnapCard
                </span>
              )}
              {status && (
                <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${status.className}`}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <dl>
          <Field label="Email">{card.email && <span className="inline-flex items-center gap-1.5"><Mail size={13} className="text-text-tertiary" />{card.email}</span>}</Field>
          <Field label="Phone">{phone && <span className="inline-flex items-center gap-1.5"><Phone size={13} className="text-text-tertiary" />{phone}</span>}</Field>
          <Field label="Location">{location && <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-text-tertiary" />{location}</span>}</Field>
          <Field label="Company address">{card.company_address}</Field>
          <Field label="Company description">{card.company_description}</Field>
          <Field label="Buying interests">{card.buying_interests}</Field>
          <Field label="Selling interests">{card.selling_interests}</Field>
          <Field label="Notes">{card.notes}</Field>
          {tags.length > 0 && (
            <Field label="Tags">
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-bg-secondary border border-border text-text-secondary">{t}</span>
                ))}
              </div>
            </Field>
          )}
          {extras.map(([k, v]) => (
            <Field key={k} label={k}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</Field>
          ))}
        </dl>

        <div className="text-[11px] text-text-tertiary space-y-1 pt-2 border-t border-border">
          {card.card_id != null && <p>Card request ID · {card.card_id}</p>}
          {card.id != null && <p>Contact user ID · {card.id}</p>}
          {card.non_sc_id != null && <p>Non-SC ID · {card.non_sc_id}</p>}
          {card.uuid && <p>UUID · {card.uuid}</p>}
          <p>Saved · {formatCardDate(card.confirmed_at || card.created_at) || '—'}</p>
          {card.last_modified_at && <p>Updated · {formatCardDate(card.last_modified_at)}</p>}
        </div>
      </div>
    </div>
  );
}
