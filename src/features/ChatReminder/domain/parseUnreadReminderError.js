function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join('; ');
  if (value == null) return '';
  return String(value);
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  if (typeof result.detail === 'string') return result.detail;
  if (result.ERROR) return String(result.ERROR);
  const top = result.message || result.msg || result.error;
  const topText = asText(top);
  if (topText) return topText;
  return Object.entries(result)
    .filter(([key]) => !['success', 'message', 'msg', 'error', 'detail', 'ERROR'].includes(key))
    .map(([key, value]) => {
      const text = asText(value);
      return text ? `${key}: ${text}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

export function parseUnreadReminderError(result, status) {
  if (status === 401) return 'Authentication required. Please sign in again.';
  if (status === 403) return 'Organizer access required.';
  if (status === 404) return messageFromBody(result) || 'Chat reminder config not found.';
  if (status === 500) return 'Something went wrong. Please try again.';
  return messageFromBody(result) || `Failed to update chat reminder (${status})`;
}
