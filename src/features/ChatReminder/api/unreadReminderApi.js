import { getApiUrl } from '../../../config';
import { parseUnreadReminderError } from '../domain/parseUnreadReminderError';

const CONFIG_PATH = '/meeting/unread-reminder/config/';

function authHeaders(token, extra = {}) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...extra,
  };
}

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  const error = new Error(parseUnreadReminderError(result, response.status));
  error.status = response.status;
  error.data = result;
  throw error;
}

/** GET /meeting/unread-reminder/config/ */
export async function getUnreadReminderConfig(token) {
  const response = await fetch(`${getApiUrl()}${CONFIG_PATH}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return response.json();
}

/** POST /meeting/unread-reminder/config/ */
export async function saveUnreadReminderConfig(token, payload) {
  const response = await fetch(`${getApiUrl()}${CONFIG_PATH}`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  await throwIfFailed(response);
  return response.json();
}

export const unreadReminderApi = {
  getUnreadReminderConfig,
  saveUnreadReminderConfig,
};
