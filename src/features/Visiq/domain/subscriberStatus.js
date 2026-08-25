export const SUBSCRIBER_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'subscribed', label: 'Subscribed' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'complained', label: 'Complained' },
];

const TONE = {
  subscribed: 'bg-emerald-500/10 text-emerald-700',
  unsubscribed: 'bg-bg-tertiary text-text-secondary',
  bounced: 'bg-amber-500/10 text-amber-700',
  complained: 'bg-red-500/10 text-red-700',
};

export function subscriberStatusLabel(status) {
  const found = SUBSCRIBER_STATUSES.find((s) => s.value === status);
  return found?.label || status || '—';
}

export function subscriberStatusTone(status) {
  return TONE[status] || 'bg-bg-tertiary text-text-secondary';
}

/** Prefer NAME property value for display next to email. */
export function subscriberDisplayName(subscriber) {
  const props = subscriber?.properties || [];
  const nameProp = props.find((p) => String(p.key || '').toUpperCase() === 'NAME');
  if (!nameProp || nameProp.value == null || nameProp.value === '') return '';
  return Array.isArray(nameProp.value) ? nameProp.value.join(', ') : String(nameProp.value);
}
