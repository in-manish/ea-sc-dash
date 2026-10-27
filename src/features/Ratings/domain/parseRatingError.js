function text(value) {
  if (Array.isArray(value)) return value.map(String).join('; ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join('; ');
  return value == null ? '' : String(value);
}

// Helper-raised errors carry `details` as a stringified dict, e.g. "{'title': [ErrorDetail(string='...')]}".
function cleanDetails(raw) {
  if (typeof raw !== 'string') return raw;
  const found = [...raw.matchAll(/string='([^']*)'/g)].map((m) => m[1]);
  return found.length ? found.join('; ') : raw;
}

function fieldMap(details) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) return {};
  return Object.fromEntries(Object.entries(details).map(([key, value]) => [key, text(value)]));
}

/** Builds an Error with `status` and `fields` from an EA rating API error body. */
export function parseRatingError(result, status) {
  const fields = fieldMap(result?.details);
  const detail = text(Object.keys(fields).length ? fields : cleanDetails(result?.details));
  const top = text(result?.message || result?.error || result?.detail);
  let message = [top, detail].filter(Boolean).join(': ') || `Request failed (${status})`;
  if (status === 401) message = 'Authentication required. Please sign in again.';
  if (status === 403) message = 'Organizer access required';
  if (status >= 500) message = 'Something went wrong. Please try again.';
  const error = new Error(message);
  error.status = status;
  error.fields = fields;
  return error;
}
