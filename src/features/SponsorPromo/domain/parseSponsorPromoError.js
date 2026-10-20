function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join('; ');
  if (value == null) return '';
  return String(value);
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object') return '';
  const lines = Array.isArray(result.errors) ? result.errors.map(String) : [];
  const top = asText(result.error || result.msg || result.detail);
  if (top || lines.length) return [top, ...lines].filter(Boolean).join('\n');
  // DRF field errors: { slug: ['...'] }
  return Object.entries(result)
    .map(([key, value]) => {
      const text = asText(value);
      return text ? `${key}: ${text}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

export function parseSponsorPromoError(result, status) {
  if (status === 401) return 'Authentication required. Please sign in again.';
  if (status === 403) return 'Organizer access required.';
  if (status === 500) return 'Something went wrong. Please try again.';
  return messageFromBody(result) || `Request failed (${status})`;
}
