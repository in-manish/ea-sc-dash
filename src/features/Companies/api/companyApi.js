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

export const companyApi = {
  /** GET /events/:eventId/companies/:companyId/ */
  async getCompany(eventId, companyId, token) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/companies/${companyId}/`,
      {
        method: 'GET',
        headers: authHeaders(token),
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /** POST /events/:eventId/companies/ — multipart create */
  async createCompany(eventId, token, formData) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/companies/`,
      {
        method: 'POST',
        headers: authHeaders(token),
        body: formData,
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /** PATCH /events/:eventId/companies/:companyId/ — multipart partial update */
  async updateCompany(eventId, companyId, token, formData) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/companies/${companyId}/`,
      {
        method: 'PATCH',
        headers: authHeaders(token),
        body: formData,
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /** GET /evc/events/:eventId/company/filter/options/ — country keys */
  async getFilterOptions(eventId, token) {
    const response = await fetch(
      `${getApiUrl()}/evc/events/${eventId}/company/filter/options/`,
      {
        method: 'GET',
        headers: authHeaders(token),
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /**
   * GET /exhibitor/events/:eventId/overview/?company_id=
   * Organizer must pass companyId. Soft-fail at call site.
   */
  async getExhibitorOverview(eventId, companyId, token) {
    const params = new URLSearchParams({ company_id: String(companyId) });
    const response = await fetch(
      `${getApiUrl()}/exhibitor/events/${eventId}/overview/?${params}`,
      {
        method: 'GET',
        headers: authHeaders(token),
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /**
   * POST /events/:eventId/exhibitor/setup-checklist/remind/
   * 200 sync (0–1 company) or nothing to send; 202 async multi-company (poll log_id).
   * Body: omit step_id = any incomplete; omit company_ids = all matching for event.
   */
  async sendSetupChecklistReminder(eventId, token, { stepId, companyIds } = {}) {
    const body = {};
    if (stepId) body.step_id = stepId;
    if (Array.isArray(companyIds) && companyIds.length > 0) {
      body.company_ids = companyIds.map((id) => Number(id) || id);
    }

    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor/setup-checklist/remind/`,
      {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) await throwParsed(response);
    const data = await response.json().catch(() => ({}));
    return {
      ...data,
      async: Boolean(data.async) || response.status === 202,
      log_id: data.log_id ?? null,
    };
  },

  /**
   * PATCH /events/:eventId/companies/bulk-action/
   * lock_company (single|multiple|all parents) or feature_company (single|multiple).
   */
  async bulkAction(eventId, token, payload) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/companies/bulk-action/`,
      {
        method: 'PATCH',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) await throwParsed(response);
    return response.json().catch(() => ({}));
  },

  /**
   * POST /events/:eventId/exhibitor/password/reset/
   * Single POC only. Body: badge_id and/or company_id (no email / bulk_email).
   */
  async resetExhibitorPassword(eventId, token, payload) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor/password/reset/`,
      {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) await throwParsed(response);
    return response.json().catch(() => ({}));
  },
};
