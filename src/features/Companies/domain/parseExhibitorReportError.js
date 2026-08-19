const SKIP_KEYS = new Set(['success', 'message', 'msg', 'error', 'detail', 'ERROR']);

function fieldMessages(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return '';
  return Object.entries(result)
    .filter(([key]) => !SKIP_KEYS.has(key))
    .map(([key, value]) => {
      const text = Array.isArray(value) ? value.join(', ') : String(value);
      return `${key}: ${text}`;
    })
    .join('\n');
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  if (typeof result.detail === 'string') return result.detail;
  if (result.ERROR) return String(result.ERROR);
  const top = result.message || result.msg || result.error;
  if (top && typeof top === 'string') return top;
  return fieldMessages(result);
}

function messageForStatus(result, status) {
  if (status === 401) return 'Authentication required. Please sign in again.';
  if (status === 403) return 'Organizer access required';
  if (status === 404) return messageFromBody(result) || 'Event not found.';
  if (status === 500) return 'Something went wrong. Please try again.';
  return messageFromBody(result) || `Failed to request exhibitor report (${status})`;
}

/** 400 uses payload text; 401/403/404/500 have fixed UI copy. */
export function parseExhibitorReportError(result, status) {
  const error = new Error(messageForStatus(result, status));
  error.status = status;
  error.data = result;
  return error;
}
