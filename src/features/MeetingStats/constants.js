export const MEETING_STATUSES = [
  { value: 'request', label: 'Request' },
  { value: 'accept', label: 'Accept' },
  { value: 'decline', label: 'Decline' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'reschedule', label: 'Reschedule' },
];

export const MEETING_DURATIONS = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '60 min' },
];

export const DEFAULT_UNIQUE_PARTICIPANTS = true;

export const EMAIL_STORAGE_KEY = 'meeting_stats_report_emails';

export const EMAIL_COOLDOWN_MS = 5000;

export const EMAIL_SENT_MSG = 'Email sent. Meeting Stats Report will be emailed.';

