/** Surface DRF attendee create/update error bodies for the UI. */
export function parseAttendeeError(result, status) {
  if (status === 404) return 'Attendee not found for this event.';
  if (status === 403) return 'You do not have permission to edit this attendee.';
  if (status === 401) return 'Authentication credentials were not provided.';

  if (Array.isArray(result)) {
    return result.map(String).join(', ') || `Request failed (${status})`;
  }

  if (!result || typeof result !== 'object') {
    return `Request failed (${status})`;
  }

  if (result.detail) {
    return typeof result.detail === 'string'
      ? result.detail
      : JSON.stringify(result.detail);
  }

  const skip = new Set(['success', 'message', 'msg', 'error', 'conflicts']);
  const fieldParts = Object.entries(result)
    .filter(([key]) => !skip.has(key))
    .map(([field, msgs]) => {
      const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
      return `${field}: ${text}`;
    });

  if (fieldParts.length) return fieldParts.join('\n');

  return (
    result.message ||
    result.msg ||
    result.error ||
    `Request failed (${status})`
  );
}

/** Extract per-field messages from a DRF error body. */
export function attendeeFieldErrors(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return null;
  const skip = new Set(['detail', 'success', 'message', 'msg', 'error', 'conflicts']);
  const out = {};
  Object.entries(result).forEach(([key, val]) => {
    if (skip.has(key)) return;
    out[key] = Array.isArray(val) ? val.join(', ') : String(val);
  });
  return Object.keys(out).length ? out : null;
}
