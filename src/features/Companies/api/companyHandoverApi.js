import { getApiUrl } from '../../../config';
import { parseCompanyError } from '../domain/parseCompanyError';

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

async function getCompaniesPage(eventId, token, page) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(PAGE_SIZE),
    sort_by: 'company_name',
    sort_order: 'asc',
  });
  const response = await fetch(`${getApiUrl()}/events/${eventId}/companies/?${params}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization: `Token ${token}`,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(parseCompanyError(result, response.status));
    error.status = response.status;
    throw error;
  }
  return result;
}

/**
 * GET /events/:eventId/companies/ — every company of the event (parents + co-exhibitors).
 * The endpoint has no handover filter, so pages are collected and filtered by the caller.
 */
export async function getAllEventCompanies(eventId, token) {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = await getCompaniesPage(eventId, token, page);
    const batch = Array.isArray(result.company_list) ? result.company_list : [];
    all.push(...batch);
    const total = Number(result.total_search_companies) || 0;
    if (batch.length < PAGE_SIZE || all.length >= total) break;
  }
  return all;
}
