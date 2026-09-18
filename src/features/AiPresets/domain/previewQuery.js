export function buildPreviewQuery({ eventId, userQuery, filters }) {
  const params = new URLSearchParams();
  if (eventId != null && eventId !== '') params.set('event_id', String(eventId));
  const query = (userQuery || '').trim();
  if (query) params.set('user_query', query);
  if (filters != null && filters !== '') {
    const encoded = typeof filters === 'string' ? filters : JSON.stringify(filters);
    if (encoded.trim()) params.set('filters', encoded);
  }
  return params.toString();
}

export function parseFiltersText(text) {
  const raw = (text || '').trim();
  if (!raw) return { filters: undefined };
  try {
    return { filters: JSON.parse(raw) };
  } catch {
    return { error: 'Filters must be valid JSON (same pill shape as the people list).' };
  }
}

export function formatPreviewJson(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return String(value);
  }
}
