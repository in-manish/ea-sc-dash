import { getApiUrl } from '../../../config';
import { parseChatReminderError } from '../domain/parseChatReminderError';

const BASE = '/meeting/chat-reminder';

async function request(token, path, { method = 'GET', body } = {}) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const parsed = parseChatReminderError(result, response.status);
    const error = new Error(parsed.message);
    error.status = response.status;
    error.fields = parsed.fields;
    throw error;
  }
  return result;
}

/** GET /meeting/chat-reminder/config/ */
export const getConfig = (token) => request(token, `${BASE}/config/`);

/** PATCH /meeting/chat-reminder/config/ — only the fields sent change. */
export const patchConfig = (token, body) => request(token, `${BASE}/config/`, { method: 'PATCH', body });

/** GET /meeting/chat-reminder/status/ */
export const getStatus = (token) => request(token, `${BASE}/status/`);

/** GET /meeting/chat-reminder/activity/?limit= */
export const getActivity = (token, limit = 20) => request(token, `${BASE}/activity/?limit=${limit}`);

/** POST /meeting/chat-reminder/preview/ — dry run, sends nothing. */
export const previewRun = (token, body) => request(token, `${BASE}/preview/`, { method: 'POST', body });

/** POST /meeting/chat-reminder/send/ — emails real people; body must include confirm: true. */
export const sendNow = (token, body) => request(token, `${BASE}/send/`, { method: 'POST', body: { ...body, confirm: true } });

/** POST /common-services/emailing/kill-switches/ — is_enabled false stops that email type at once. */
export const setKillSwitch = (token, key, isEnabled, reason) => request(token, '/common-services/emailing/kill-switches/', {
  method: 'POST',
  body: { key, is_enabled: isEnabled, reason: reason || '' },
});

/** PATCH /celery-beat/tasks/status/ — the sweep entry is shared by every tenant. */
export const setScheduleEnabled = (token, taskName, enabled) => request(token, '/celery-beat/tasks/status/', {
  method: 'PATCH',
  body: { task_name: taskName, enabled },
});

/** PATCH /celery-beat/tasks/:id/ — run the sweep every N minutes. */
export const setScheduleEveryMinutes = (token, periodicTaskId, minutes) => request(token, `/celery-beat/tasks/${periodicTaskId}/`, {
  method: 'PATCH',
  body: { schedule_type: 'interval', schedule_value: { every: minutes, period: 'minutes' } },
});
