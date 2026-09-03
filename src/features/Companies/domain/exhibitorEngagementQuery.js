import { joinSendToEmails } from './exhibitorReportQuery';

/** Omit completed to include all companies (Yes and No). */
export const COMPLETED_FILTERS = {
  ALL: '',
  YES: 'yes',
  NO: 'no',
};

export const COMPLETED_FILTER_OPTIONS = [
  { value: COMPLETED_FILTERS.ALL, label: 'All', hint: 'Every exhibitor row (parents and co-exhibitors)' },
  { value: COMPLETED_FILTERS.YES, label: 'Completed', hint: 'Answered every portal matchmaking question' },
  { value: COMPLETED_FILTERS.NO, label: 'Incomplete', hint: 'Missing one or more portal answers' },
];

export function normalizeCompletedFilter(value) {
  const filter = String(value || '').trim().toLowerCase();
  if (filter === COMPLETED_FILTERS.YES || filter === COMPLETED_FILTERS.NO) return filter;
  return COMPLETED_FILTERS.ALL;
}

/**
 * Query for GET /events/:id/exhibitor/engagement/.
 * Funnel JSON: optional refresh. CSV: format=csv. Email: send_to_emails.
 * Do not send format=csv together with send_to_emails.
 * include_matchmaking_questions only on CSV/email (default true).
 */
export function buildExhibitorEngagementQuery({
  refresh = false,
  format,
  emails,
  completed,
  includeMatchmakingQuestions,
} = {}) {
  const params = new URLSearchParams();
  if (refresh) params.set('refresh', 'true');
  if (format === 'csv') params.set('format', 'csv');
  const sendTo = joinSendToEmails(emails);
  if (sendTo) params.set('send_to_emails', sendTo);
  const filter = normalizeCompletedFilter(completed);
  if (filter) params.set('completed', filter);
  if (typeof includeMatchmakingQuestions === 'boolean') {
    params.set(
      'include_matchmaking_questions',
      includeMatchmakingQuestions ? 'true' : 'false',
    );
  }
  return params.toString();
}

export function defaultEngagementCsvFilename(eventId) {
  return `exhibitor-engagement_${eventId}.csv`;
}
