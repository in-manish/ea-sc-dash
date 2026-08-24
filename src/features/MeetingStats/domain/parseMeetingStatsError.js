const SKIP_KEYS = new Set(['success', 'message', 'msg', 'error', 'detail', 'ERROR']);

function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join('; ');
  if (value == null) return '';
  return String(value);
}

function fieldMessages(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return '';
  return Object.entries(result)
    .filter(([key]) => !SKIP_KEYS.has(key))
    .map(([key, value]) => {
      const text = asText(value);
      return text ? `${key}: ${text}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  if (typeof result.detail === 'string') return result.detail;
  if (result.ERROR) return String(result.ERROR);
  const top = result.message || result.msg || result.error;
  const topText = asText(top);
  if (topText) return topText;
  return fieldMessages(result);
}

function messageForStatus(result, status) {
  if (status === 401) return 'Authentication required. Please sign in again.';
  if (status === 403) return 'Organizer access required';
  if (status === 404) return messageFromBody(result) || 'Report not found.';
  if (status === 500) return 'Something went wrong. Please try again.';
  return messageFromBody(result) || `Failed to load meeting stats (${status})`;
}

export function parseMeetingStatsError(result, status) {
  const error = new Error(messageForStatus(result, status));
  error.status = status;
  error.data = result;
  return error;
}
