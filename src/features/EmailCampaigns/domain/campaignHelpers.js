import { DASHBOARD_LOCALE, formatDateTime } from '../../../utils/formatDateTime';
import { CAMPAIGN_SCOPE, SCHEDULED_STATUSES } from '../constants';

export function parseCampaignPage(data) {
  const results = Array.isArray(data?.results) ? data.results : [];
  return {
    count: Number(data?.count) || 0,
    next: data?.next || null,
    previous: data?.previous || null,
    results,
  };
}

export function parseCampaignDetail(data) {
  if (Array.isArray(data?.results)) return data.results[0] || null;
  if (data?.id) return data;
  return null;
}

export function campaignStatusKey(campaign) {
  return String(campaign?.status || '').toUpperCase();
}

export function isScheduledCampaign(campaign) {
  return SCHEDULED_STATUSES.has(campaignStatusKey(campaign));
}

export function isHistoryCampaign(campaign) {
  return !isScheduledCampaign(campaign);
}

export function filterCampaignsByScope(campaigns, scope) {
  const rows = Array.isArray(campaigns) ? campaigns : [];
  if (scope === CAMPAIGN_SCOPE.SCHEDULED) return rows.filter(isScheduledCampaign);
  if (scope === CAMPAIGN_SCOPE.HISTORY) return rows.filter(isHistoryCampaign);
  return rows;
}

export function formatCampaignDate(iso) {
  return formatDateTime(iso);
}

/** List payload `count` (all campaigns), not row `number_recipients`. */
export function formatCampaignCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n) || n < 0) return '';
  const formatted = n.toLocaleString(DASHBOARD_LOCALE);
  return n === 1 ? '1 campaign' : `${formatted} campaigns`;
}

/** Date column: Created + Updated; Scheduled first when the campaign is scheduled. */
export function campaignDateLines(campaign) {
  const lines = [];
  if (isScheduledCampaign(campaign) && campaign?.scheduled_time) {
    lines.push({ label: 'Scheduled', value: campaign.scheduled_time });
  }
  lines.push({ label: 'Created', value: campaign?.created_at });
  lines.push({ label: 'Updated', value: campaign?.updated_at });
  return lines;
}

export function formatReschedulePayload(datetimeLocal) {
  const date = new Date(datetimeLocal);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function isFullHtmlDocument(html) {
  return /<html[\s>]/i.test(html || '');
}

export function campaignBodySrcDoc(html) {
  if (!html) return '<!DOCTYPE html><html><body></body></html>';
  if (isFullHtmlDocument(html)) return html;
  return `<!DOCTYPE html><html><head><style>
    body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; margin: 16px; color: #1a1a1a; }
  </style></head><body>${html}</body></html>`;
}

export function mergeUniqueById(existing, incoming) {
  const seen = new Set(existing.map((row) => row.id));
  const next = [...existing];
  incoming.forEach((row) => {
    if (row?.id == null || seen.has(row.id)) return;
    seen.add(row.id);
    next.push(row);
  });
  return next;
}

/** Prefer email, then SnapCard uuid, then registration id. */
export function attendeeSearchQuery(row) {
  return String(row?.email || row?.user_uuid || row?.reg_id || '').trim();
}

export function attendeeListPath(eventId, row) {
  const base = `/event/${eventId}/attendees`;
  const q = attendeeSearchQuery(row);
  return q ? `${base}?q=${encodeURIComponent(q)}` : base;
}
