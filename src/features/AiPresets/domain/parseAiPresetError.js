const SKIP_KEYS = new Set(['success', 'message', 'msg', 'error', 'detail', 'ERROR']);

function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join('; ');
  if (value == null) return '';
  return String(value);
}

export function aiPresetFieldErrors(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const out = {};
  Object.entries(body).forEach(([key, val]) => {
    if (SKIP_KEYS.has(key)) return;
    const text = asText(val);
    if (text) out[key] = text;
  });
  return out;
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  if (typeof result.detail === 'string') return result.detail;
  const top = result.message || result.msg || result.error;
  const topText = asText(top);
  if (topText) return topText;
  const fields = aiPresetFieldErrors(result);
  return Object.entries(fields).map(([key, text]) => `${key}: ${text}`).join('\n');
}

function messageForStatus(result, status) {
  if (status === 401) return 'Authentication credentials were not provided.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 400) return messageFromBody(result) || 'Invalid request.';
  if (status === 404) return messageFromBody(result) || 'Not found';
  return messageFromBody(result) || `Request failed (${status})`;
}

export function parseAiPresetError(result, status) {
  const error = new Error(messageForStatus(result, status));
  error.status = status;
  error.data = result;
  error.fields = aiPresetFieldErrors(result);
  return error;
}
