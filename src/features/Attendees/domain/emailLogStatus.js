/** Labels, colors and summaries for the email delivery log (EA common_services MessageBatch / MessageDelivery). */

export const CARD_EXPORT_PURPOSE = 'attendee_card_export';

/** Delivery status → chip text + Tailwind classes. Order = how filters are listed. */
export const DELIVERY_STATUS = {
  queued: { label: 'Queued', className: 'bg-bg-secondary text-text-secondary' },
  sent: { label: 'Sent', className: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
  deferred: { label: 'Deferred', className: 'bg-amber-100 text-amber-800' },
  bounced: { label: 'Bounced', className: 'bg-red-100 text-red-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  spam: { label: 'Spam', className: 'bg-red-100 text-red-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  blocked: { label: 'Blocked', className: 'bg-orange-100 text-orange-800' },
  skipped: { label: 'Skipped', className: 'bg-gray-100 text-gray-700' },
};

export const BATCH_STATUS = {
  queued: { label: 'Queued', className: 'bg-bg-secondary text-text-secondary' },
  running: { label: 'Sending…', className: 'bg-blue-100 text-blue-800' },
  done: { label: 'Done', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
};

export const FAILED_STATUSES = ['bounced', 'rejected', 'spam', 'failed', 'blocked', 'skipped'];

/** Status filter choices for the deliveries table ('' = all). */
export const DELIVERY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'sent,delivered', label: 'Sent / delivered' },
  { value: FAILED_STATUSES.join(','), label: 'Failed / not sent' },
  { value: 'queued,deferred', label: 'Waiting' },
];

export const isBatchActive = (batch) => batch?.status === 'queued' || batch?.status === 'running';

/** { ok, failed, waiting, total } from a batch's status_counts. */
export function summarizeCounts(statusCounts = {}) {
  const sum = (keys) => keys.reduce((total, key) => total + (statusCounts[key] || 0), 0);
  const ok = sum(['sent', 'delivered']);
  const failed = sum(FAILED_STATUSES);
  const waiting = sum(['queued', 'deferred']);
  return { ok, failed, waiting, total: ok + failed + waiting };
}

/** "Each attendee + boss@x.com" from the batch options. */
export function describeBatchRecipients(options = {}) {
  const parts = [];
  if (options.send_to_attendee) parts.push('Each attendee');
  if (options.emails?.length) parts.push(options.emails.join(', '));
  return parts.join(' + ') || '—';
}

/** "05-02-2026 → 07-02-2026" from ISO start/end (dates only; already venue-local in EA). */
export function describeRange(options = {}) {
  const day = (value) => (value ? String(value).slice(0, 10).split('-').reverse().join('-') : '');
  if (!options.start && !options.end) return 'Whole event';
  return `${day(options.start) || 'start'} → ${day(options.end) || 'end'}`;
}

/** ISO with timezone → local "17 Nov 2026, 17:50". */
export function formatLogTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Who a delivery row is about: one attendee ("R1 · Asha") or "3 attendees". */
export function describeDeliveryAttendees(delivery) {
  const payload = delivery.payload || {};
  if (delivery.recipient_type === 'custom') {
    const count = delivery.attendee_count || payload.attendees?.length || 0;
    const part = payload.part > 1 ? ` (part ${payload.part})` : '';
    return `${count} attendee${count === 1 ? '' : 's'}${part}`;
  }
  return [payload.reg_id, payload.name].filter(Boolean).join(' · ') || `Badge ${delivery.badge_id ?? '—'}`;
}

/** How many emails of a send fall under a filter pill ('' = all; 'a,b' = those statuses). */
export function countForFilter(statusCounts = {}, filterValue = '') {
  const keys = filterValue ? filterValue.split(',') : Object.keys(statusCounts);
  return keys.reduce((total, key) => total + (statusCounts[key] || 0), 0);
}
