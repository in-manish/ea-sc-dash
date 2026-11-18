import { getApiUrl } from '../../../config';

const headers = (token) => ({ Accept: 'application/json', Authorization: `Token ${token}` });

async function readJson(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 403) throw new Error('You do not have permission to view email logs.');
    throw new Error(body?.detail || (Array.isArray(body) ? body.join(' ') : '') || `Request failed (${response.status})`);
  }
  return body || {};
}

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

export const emailLogApi = {
  /**
   * GET /events/:eventId/email-logs/batches/?purpose=&search=&page=&size= → { count, results: [batch + status_counts] }
   * search (email, name or reg id, 2+ chars) keeps only sends with a matching email and adds `match_count`.
   */
  async listBatches(eventId, token, { purpose, search, page = 1, size = 20 } = {}) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/email-logs/batches/${query({ purpose, search, page, size })}`,
      { headers: headers(token) },
    );
    return readJson(response);
  },

  /** GET /events/:eventId/email-logs/batches/:batchId/deliveries/?status=a,b&search=&page=&size= → { batch, count, results } */
  async listDeliveries(eventId, token, batchId, { status, search, page = 1, size = 50 } = {}) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/email-logs/batches/${batchId}/deliveries/${query({ status, search, page, size })}`,
      { headers: headers(token) },
    );
    return readJson(response);
  },
};
