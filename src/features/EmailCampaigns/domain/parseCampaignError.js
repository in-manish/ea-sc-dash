function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join('; ');
  if (value == null) return '';
  return String(value);
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  const top = result.msg || result.message || result.detail || result.error;
  return asText(top);
}

export function parseCampaignError(result, status) {
  if (status === 401) {
    return new Error('Authentication required. Please sign in again.');
  }
  if (status === 403) return new Error('Organizer access required.');
  const fromBody = messageFromBody(result);
  if (status === 404) return new Error(fromBody || 'Campaign not found.');
  if (status === 400) return new Error(fromBody || 'This campaign cannot be updated.');
  return new Error(fromBody || `Request failed (${status})`);
}
