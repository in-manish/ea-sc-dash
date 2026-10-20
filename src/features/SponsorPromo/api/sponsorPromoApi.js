import { getApiUrl } from '../../../config';
import { parseSponsorPromoError } from '../domain/parseSponsorPromoError';

function authHeaders(token, extra = {}) {
  return { Accept: 'application/json', Authorization: `Token ${token}`, ...extra };
}

async function request(url, options, token) {
  const response = await fetch(url, { ...options, headers: authHeaders(token, options.headers) });
  if (response.status === 204) return {};
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(parseSponsorPromoError(data, response.status));
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

const poolsUrl = (eventId) => `${getApiUrl()}/events/${eventId}/sponsor-promo-pool/`;
const codesUrl = (eventId, slug) => `${poolsUrl(eventId)}${slug}/sponsor-promo-codes/`;

/** GET /events/:eventId/sponsor-promo-pool/ -> { pools } */
export const listPools = (eventId, token) => request(poolsUrl(eventId), { method: 'GET' }, token);

/** POST /events/:eventId/sponsor-promo-pool/ { name, slug, is_active } */
export const createPool = (eventId, token, payload) => request(
  poolsUrl(eventId),
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
  token,
);

/** PATCH /events/:eventId/sponsor-promo-pool/:slug/ { name?, is_active? } */
export const updatePool = (eventId, token, slug, payload) => request(
  `${poolsUrl(eventId)}${slug}/`,
  { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
  token,
);

/** GET .../:slug/sponsor-promo-codes/?assigned=true|false */
export const listCodes = (eventId, token, slug, assigned) => request(
  `${codesUrl(eventId, slug)}${assigned ? `?assigned=${assigned}` : ''}`,
  { method: 'GET' },
  token,
);

/** POST .../:slug/sponsor-promo-codes/ multipart `file` (CSV with promotional_code column) */
export function importCodes(eventId, token, slug, file) {
  const body = new FormData();
  body.append('file', file);
  return request(codesUrl(eventId, slug), { method: 'POST', body }, token);
}

/** DELETE .../:slug/sponsor-promo-codes/:codeId/ (unassigned only) */
export const deleteCode = (eventId, token, slug, codeId) => request(
  `${codesUrl(eventId, slug)}${codeId}/`,
  { method: 'DELETE' },
  token,
);

export const sponsorPromoApi = { listPools, createPool, updatePool, listCodes, importCodes, deleteCode };
