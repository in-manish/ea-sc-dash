export const cardInitials = (name) => {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/** Non-SnapCard saved contact: null id and/or non_sc_id / uuid present. */
export const isNonSnapCard = (card) =>
  card == null ||
  card.id == null ||
  Boolean(card.non_sc_id) ||
  (Boolean(card.uuid) && card.id == null);

export const formatCardPhone = (card) => {
  if (!card?.phone_number) return '';
  const cc = card.country_code
    ? String(card.country_code).startsWith('+')
      ? card.country_code
      : `+${card.country_code}`
    : '';
  return cc ? `${cc} ${card.phone_number}` : card.phone_number;
};

export const formatCardLocation = (card) =>
  [card?.city, card?.state, card?.country].filter(Boolean).join(', ');

export const formatCardDate = (value) => {
  if (!value) return '';
  const normalized = String(value).replace(
    /^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})([+-]\d{2})(\d{2})$/,
    '$1T$2$3:$4'
  );
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const DELETE_REASON_LABELS = {
  USER: 'User deleted',
  SYNC: 'Sync',
  BLOCK: 'Blocked',
  ADMIN: 'Admin deleted',
};

export const formatDeleteReason = (reason) =>
  DELETE_REASON_LABELS[reason] || reason || '—';

/** Prefer card_id for restore / permanent delete (not contact user id). */
export const getSavedCardId = (card) =>
  card?.card_id != null ? card.card_id : null;

export const cardListKey = (card, index) =>
  card?.card_id ?? card?.id ?? card?.non_sc_id ?? card?.uuid ?? `idx-${index}`;
