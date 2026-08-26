import { getApiUrl } from '../../../config';
import { parseCampaignDetail, parseCampaignPage } from '../domain/campaignHelpers';
import { parseCampaignError } from '../domain/parseCampaignError';

function authHeaders(token, withJson = false) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw parseCampaignError(data, response.status);
  return data;
}

/** GET /events/:eventId/campaigns/email/?page= */
export async function listEmailCampaigns(eventId, token, page = 1) {
  const response = await fetch(
    `${getApiUrl()}/events/${eventId}/campaigns/email/?page=${page}`,
    { headers: authHeaders(token) },
  );
  return parseCampaignPage(await readJson(response));
}

/** GET /events/:eventId/campaigns/email/:campaignId/ (paginated single row). */
export async function getEmailCampaign(eventId, campaignId, token) {
  const response = await fetch(
    `${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`,
    { headers: authHeaders(token) },
  );
  return parseCampaignDetail(await readJson(response));
}

/** GET /campaigns/email_sent_details/:campaignId/?page= */
export async function listCampaignRecipients(campaignId, token, page = 1) {
  const response = await fetch(
    `${getApiUrl()}/campaigns/email_sent_details/${campaignId}/?page=${page}`,
    { headers: authHeaders(token) },
  );
  return parseCampaignPage(await readJson(response));
}

/** PATCH /events/:eventId/campaigns/email/:campaignId/ { datetime } */
export async function rescheduleEmailCampaign(eventId, campaignId, token, datetime) {
  const response = await fetch(
    `${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`,
    {
      method: 'PATCH',
      headers: authHeaders(token, true),
      body: JSON.stringify({ datetime }),
    },
  );
  return readJson(response);
}

/** DELETE /events/:eventId/campaigns/email/:campaignId/ */
export async function cancelEmailCampaign(eventId, campaignId, token) {
  const response = await fetch(
    `${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`,
    { method: 'DELETE', headers: authHeaders(token) },
  );
  return readJson(response);
}
