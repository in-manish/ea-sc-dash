import { getApiUrl } from '../../../config';

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Token ${token}`,
});

const parseError = async (response, fallback) => {
  const body = await response.json().catch(() => ({}));
  const message = body.error || body.detail || body.message || fallback;
  const err = new Error(message);
  err.status = response.status;
  err.body = body;
  return err;
};

/** Admin: list saved cards for a user. GET /evc/admin/users/{userId}/cards/ */
export async function fetchUserSavedCards(token, userId) {
  const response = await fetch(
    `${getApiUrl()}/evc/admin/users/${userId}/cards/`,
    { method: 'GET', headers: authHeaders(token) }
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'User not found'
        : response.status === 403
          ? 'Admin or staff access required'
          : `Failed to load saved cards (${response.status})`;
    throw await parseError(response, fallback);
  }

  const data = await response.json();
  return Array.isArray(data?.cards) ? data.cards : [];
}

/**
 * Admin: paginated card-request activity for a user.
 * GET /evc/admin/users/{userId}/card_requests/?page&size&status
 * @param {{ page?: number, size?: number, status?: string }} options
 */
export async function fetchUserCardRequests(token, userId, options = {}) {
  const { page = 1, size = 10, status = '' } = options;
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  if (status) params.set('status', status);

  const response = await fetch(
    `${getApiUrl()}/evc/admin/users/${userId}/card_requests/?${params}`,
    { method: 'GET', headers: authHeaders(token) }
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'User not found'
        : response.status === 403
          ? 'Admin or staff access required'
          : `Failed to load card activity (${response.status})`;
    throw await parseError(response, fallback);
  }

  const data = await response.json();
  return {
    cards: Array.isArray(data?.cards) ? data.cards : [],
    count: Number(data?.count) || 0,
    next: Number(data?.next) || 0,
  };
}

/** Admin: pending sent + received for a user. GET /evc/admin/users/{userId}/pending/ */
export async function fetchUserPendingCards(token, userId) {
  const response = await fetch(
    `${getApiUrl()}/evc/admin/users/${userId}/pending/`,
    { method: 'GET', headers: authHeaders(token) }
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'User not found'
        : response.status === 403
          ? 'Admin or staff access required'
          : `Failed to load pending requests (${response.status})`;
    throw await parseError(response, fallback);
  }

  const data = await response.json();
  return {
    sent: Array.isArray(data?.sent) ? data.sent : [],
    received: Array.isArray(data?.received) ? data.received : [],
  };
}

/**
 * Admin: paginated pending in one direction.
 * GET /evc/admin/users/{userId}/pending/{sent|received}/?page=
 * Page size is fixed at 3 by the API.
 * @param {'sent'|'received'} direction
 */
export async function fetchUserPendingByDirection(token, userId, direction, options = {}) {
  const { page = 1 } = options;
  if (direction !== 'sent' && direction !== 'received') {
    throw new Error('direction must be sent or received');
  }
  const params = new URLSearchParams();
  params.set('page', String(page));

  const response = await fetch(
    `${getApiUrl()}/evc/admin/users/${userId}/pending/${direction}/?${params}`,
    { method: 'GET', headers: authHeaders(token) }
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'User not found'
        : response.status === 403
          ? 'Admin or staff access required'
          : `Failed to load pending ${direction} (${response.status})`;
    throw await parseError(response, fallback);
  }

  const data = await response.json();
  return {
    cards: Array.isArray(data?.cards) ? data.cards : [],
    count: Number(data?.count) || 0,
    next: Number(data?.next) || 0,
  };
}
