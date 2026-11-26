const FIELD_LABELS = {
  activate: 'Reminders on',
  cutoff_minutes: 'Remind after',
  days_window: 'Look back',
  min_gap_minutes: 'Minimum gap',
  max_digests_per_day: 'Emails per day',
  event_id: 'Time zone event',
  limit: 'Limit',
  receiver_evc_ids: 'Receiver ids',
  confirm: 'Confirm',
  event: 'Event',
  non_field_errors: 'Error',
};

function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(' ');
  if (value == null || typeof value === 'object') return '';
  return String(value);
}

/**
 * Banner text and per-field messages. EA chat reminder APIs answer 400 with {errors: {field: text}};
 * the kill switch and beat APIs use {success: false, error|message}.
 */
export function parseChatReminderError(result, status) {
  if (status === 401) return { message: 'Authentication required. Please sign in again.', fields: {} };
  if (status === 403) return { message: 'Organizer access required.', fields: {} };
  const body = result && typeof result === 'object' ? result : {};
  const fields = {};
  const lines = [];
  Object.entries(body.errors && typeof body.errors === 'object' ? body.errors : {}).forEach(([key, value]) => {
    const text = asText(value);
    if (!text) return;
    fields[key] = text;
    lines.push(`${FIELD_LABELS[key] || key}: ${text}`);
  });
  const top = asText(body.detail || body.message || body.error);
  const message = [top, ...lines].filter(Boolean).join('\n')
    || (status === 404 ? 'Not found. Is this EA server up to date?' : `Request failed (${status})`);
  return { message, fields };
}
