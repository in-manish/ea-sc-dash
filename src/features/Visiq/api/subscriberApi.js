import { getApiUrl } from '../../../config';
import { parseVisiqError } from '../domain/parseVisiqError';
import { buildSubscriberQuery, normalizeSubscriberPage } from '../domain/subscriberQuery';

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseVisiqError(result, response.status);
}

function authHeaders(token) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
  };
}

/** GET /visiq/subscribers/?page=&size=&search=&status= */
export async function listSubscribers(token, filters = {}) {
  const query = buildSubscriberQuery(filters);
  const response = await fetch(`${getApiUrl()}/visiq/subscribers/?${query}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return normalizeSubscriberPage(await response.json());
}

/** GET /visiq/subscribers/:id/ */
export async function getSubscriber(token, id) {
  const response = await fetch(`${getApiUrl()}/visiq/subscribers/${id}/`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return response.json();
}

export const subscriberApi = { listSubscribers, getSubscriber };
