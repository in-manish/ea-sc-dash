import { getApiUrl } from '../../../config';
import { parseRatingError } from '../domain/parseRatingError';

function buildQuery(query) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : '';
}

/** One EA rating call. Returns the parsed body, or throws an Error with `status` and `fields`. */
export async function ratingRequest(token, path, { method = 'GET', query, body } = {}) {
  const response = await fetch(`${getApiUrl()}/${path}${buildQuery(query)}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result?.success === false) throw parseRatingError(result, response.status);
  return result;
}
