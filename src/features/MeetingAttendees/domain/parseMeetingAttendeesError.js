function textOf(value) {
  if (Array.isArray(value)) return value.map(String).join('; ');
  return value == null ? '' : String(value);
}

function bodyMessage(result) {
  if (!result || typeof result !== 'object') return '';
  const top = textOf(result.msg || result.message || result.detail || result.error);
  if (top) return top;
  return Object.entries(result)
    .map(([key, value]) => `${key}: ${textOf(value)}`)
    .join('\n');
}

export function parseMeetingAttendeesError(result, status) {
  let message = bodyMessage(result) || `Request failed (${status})`;
  if (status === 401) message = 'Authentication required. Please sign in again.';
  if (status === 403) message = 'Organizer access required';
  if (status === 500) message = 'Something went wrong. Please try again.';
  const error = new Error(message);
  error.status = status;
  return error;
}
