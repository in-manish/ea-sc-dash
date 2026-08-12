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

  /** POST /events/:eventId/exhibitor/setup-checklist/remind/ */
  async sendSetupChecklistReminder(eventId, token, { stepId, companyIds }) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/exhibitor/setup-checklist/remind/`,
      {
        method: 'POST',
        headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_id: stepId,
          company_ids: companyIds,
        }),
      }
    );
    if (!response.ok) await throwParsed(response);
    return response.json().catch(() => ({}));
  },
};
