/** Pure helpers for the "Business cards" export: event date window, form validation and request bodies. */

export const CARD_FORMATS = [
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
];

export const DEFAULT_CARD_FORMATS = ['csv'];
const FORMATS_KEY = 'ea_dash_card_export_formats';

/** Last formats used (any non-empty mix of csv/xlsx), else CSV. Storage may be blocked: fall back quietly. */
export function loadCardFormats() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(FORMATS_KEY) || 'null');
    const formats = CARD_FORMATS.map((f) => f.value).filter((v) => Array.isArray(saved) && saved.includes(v));
    return formats.length ? formats : [...DEFAULT_CARD_FORMATS];
  } catch {
    return [...DEFAULT_CARD_FORMATS];
  }
}

export function saveCardFormats(formats) {
  if (!formats.length) return;
  try {
    window.localStorage.setItem(FORMATS_KEY, JSON.stringify(formats));
  } catch {
    // Private mode or blocked storage: the choice just isn't remembered.
  }
}
export const MAX_CUSTOM_EMAILS = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** '2026-11-10T00:00:00Z' or '2026-11-10' → '2026-11-10'; anything else → ''. */
export function toDateInput(value) {
  const text = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
}

/** Event dates for the date pickers: { min, max } as YYYY-MM-DD ('' when unknown). */
export function eventDateWindow(event) {
  return { min: toDateInput(event?.start_date), max: toDateInput(event?.end_date) };
}

/** 'a@x.com, b@x.com\nc@x.com' → ['a@x.com', 'b@x.com', 'c@x.com'] (trimmed, lower-case, no repeats). */
export function parseEmailList(text) {
  const emails = String(text || '')
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(emails)];
}

/** First problem with the form, or '' when it can be sent. */
export function validateCardExportForm({ formats, start, end, dateWindow, mode, emailsText }) {
  if (!formats.length) return 'Pick at least one file format.';
  if (start && end && start > end) return 'Start date must be on or before the end date.';
  if (dateWindow.min && start && start < dateWindow.min) return `Start date must be on or after ${dateWindow.min}.`;
  if (dateWindow.max && end && end > dateWindow.max) return `End date must be on or before ${dateWindow.max}.`;
  if (mode === 'email') {
    const emails = parseEmailList(emailsText);
    const bad = emails.find((email) => !EMAIL_RE.test(email));
    if (bad) return `Not a valid email: ${bad}`;
    if (emails.length > MAX_CUSTOM_EMAILS) return `Add at most ${MAX_CUSTOM_EMAILS} email addresses.`;
  }
  return '';
}

/** Request body for EA. Empty dates are left out so EA uses the event dates. */
export function buildCardExportBody({ regIds, formats, start, end, mode, sendToAttendee, emailsText }) {
  const body = { reg_ids: regIds, formats };
  if (start) body.start = start;
  if (end) body.end = end;
  if (mode === 'email') {
    body.send_to_attendee = Boolean(sendToAttendee);
    const emails = parseEmailList(emailsText);
    if (emails.length) body.emails = emails;
  }
  return body;
}

/** Who gets the email, as a sentence for the confirm text. */
export function describeRecipients({ sendToAttendee, emailsText }) {
  const emails = parseEmailList(emailsText);
  const parts = [];
  if (sendToAttendee) parts.push('each attendee (only their own cards)');
  if (emails.length) parts.push(emails.join(', '));
  if (!parts.length) parts.push('your login email');
  return parts.join(' and ');
}
