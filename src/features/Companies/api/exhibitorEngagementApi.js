import { getApiUrl } from '../../../config';
import { parseExhibitorEngagementError } from '../domain/exhibitorEngagement';

function engagementUrl(eventId, refresh) {
  const base = `${getApiUrl()}/events/${eventId}/exhibitor/engagement/`;
  if (!refresh) return base;
  return `${base}?refresh=true`;
}

/**
 * GET /events/:eventId/exhibitor/engagement/
 * Cached ~5 minutes. Pass refresh=true to recompute and recache.
 */
export async function getExhibitorEngagement(eventId, token, { refresh = false } = {}) {
  const response = await fetch(engagementUrl(eventId, refresh), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw parseExhibitorEngagementError(result, response.status);
  }

  return response.json();
}

export const exhibitorEngagementApi = { getExhibitorEngagement };
