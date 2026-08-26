/** Client-side list filter. API has no status query. */
export const CAMPAIGN_SCOPE = {
  ALL: 'all',
  HISTORY: 'history',
  SCHEDULED: 'scheduled',
};

export const CAMPAIGN_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
};

/** Display values plus stored 3-letter codes from EmailSMSCampaign. */
export const SCHEDULED_STATUSES = new Set(['SCHEDULED', 'SCH']);

export const PAGE_SIZE = 10;
export const MIN_VISIBLE_ROWS = 8;
