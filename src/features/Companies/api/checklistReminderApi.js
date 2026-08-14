import { getApiUrl } from '../../../config';
import { parseCompanyError } from '../domain/parseCompanyError';

const authHeaders = (token) => ({
  Accept: 'application/json, text/plain, */*',
  Authorization: `Token ${token}`,
});

async function throwParsed(response) {
  const result = await response.json().catch(() => ({}));
  const error = new Error(parseCompanyError(result, response.status));
  error.status = response.status;
  error.data = result;
  throw error;
}

function buildReminderQuery(filters = {}) {
  const params = new URLSearchParams();
  const {
    step_id,
    step,
    trigger,
    sent_status,
    status,
    reminder_date,
    sent_at,
    sent_at_from,
    sent_at_to,
    page = 1,
    page_size = 20,
  } = filters;

  const stepVal = step_id || step;
  const statusVal = sent_status || status;
  if (stepVal) params.set('step_id', String(stepVal));
  if (trigger) params.set('trigger', String(trigger));
  if (statusVal) params.set('sent_status', String(statusVal));
  if (reminder_date) params.set('reminder_date', String(reminder_date));
  if (sent_at) params.set('sent_at', String(sent_at));
  if (sent_at_from) params.set('sent_at_from', String(sent_at_from));
  if (sent_at_to) params.set('sent_at_to', String(sent_at_to));
  if (page) params.set('page', String(page));
  if (page_size) params.set('page_size', String(page_size));
  return params.toString();
}

export const checklistReminderApi = {
  /** GET /events/:eventId/exhibitor-setup-checklist/ */
  async getSettings(eventId, token) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor-setup-checklist/`,
      { method: 'GET', headers: authHeaders(token) }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /** PATCH /events/:eventId/exhibitor-setup-checklist/ — settings only, no steps */
  async updateSettings(eventId, token, payload) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor-setup-checklist/`,
      {
        method: 'PATCH',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /** GET /events/:eventId/exhibitor/setup-checklist/reminders/ */
  async listReminders(eventId, token, filters = {}) {
    const qs = buildReminderQuery(filters);
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor/setup-checklist/reminders/?${qs}`,
      { method: 'GET', headers: authHeaders(token) }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /**
   * GET /events/:eventId/exhibitor/setup-checklist/reminders/:logId/
   * Poll while sent_status is pending | in_progress. ?detail=true for addl_data.
   */
  async getReminderProgress(eventId, logId, token, { detail = false } = {}) {
    const qs = detail ? '?detail=true' : '';
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor/setup-checklist/reminders/${logId}/${qs}`,
      { method: 'GET', headers: authHeaders(token) }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },
};
