import { COMPANY_REPORT_SAMPLES } from './companyReportSamples';

/** How a report is delivered: on screen, file download, or emailed as an attachment. */
export const DELIVERY = { SCREEN: 'screen', DOWNLOAD: 'download', EMAIL: 'email' };

export const DELIVERY_LABELS = {
  [DELIVERY.SCREEN]: 'On screen',
  [DELIVERY.DOWNLOAD]: 'Download CSV',
  [DELIVERY.EMAIL]: 'Email',
};

export const COMPANY_REPORT_CATEGORIES = [
  { id: 'overview', title: 'Overview & badges' },
  { id: 'directory', title: 'Exhibitor directory' },
  { id: 'engagement', title: 'Portal engagement' },
  { id: 'orders', title: 'Orders & services' },
];

/**
 * One entry per company report the organizer can pull (Companies → Reports tab).
 * `endpoint` is the EA route, shown so admins and devs can match a file to its source.
 */
const REPORTS = [
  {
    id: 'company_metrics',
    category: 'overview',
    title: 'Exhibitor Totals: Handover, Water Coupons & Printed Badges',
    summary: 'Live totals for the event: parent and co-exhibitors, handover, water coupons and printed badges.',
    useWhen: 'You need a quick status check before or during the show, or numbers for one parent exhibitor.',
    rowUnit: 'One line per metric',
    scope: 'Whole event, or one parent exhibitor and its co-exhibitors',
    delivery: [DELIVERY.SCREEN],
    endpoint: 'GET /events/:id/company/comprehensive-report/',
  },
  {
    id: 'exhibitor_csv',
    category: 'directory',
    title: 'Exhibitor Setup & Badge Usage (Parent Exhibitors)',
    summary: 'Parent exhibitor spreadsheet: POC contact, OBF, stall, profile completeness, co-exhibitors and badge usage.',
    useWhen: 'Ops or sales need to see which exhibitors are set up and how many badges each has used.',
    rowUnit: 'One row per parent exhibitor (co-exhibitors are counts)',
    scope: 'All parent exhibitors',
    delivery: [DELIVERY.DOWNLOAD, DELIVERY.EMAIL],
    endpoint: 'GET /events/:id/exhibitor/report/',
  },
  {
    id: 'company_export',
    category: 'directory',
    title: 'Full Company Directory (All Companies)',
    summary: 'Full company directory: website, stall, category, products, parent exhibitor, space type, fascia and stall requirements.',
    useWhen: 'You need every company record (parents and co-exhibitors) for the catalogue, signage or a data check.',
    rowUnit: 'One row per company (parents and co-exhibitors)',
    scope: 'All companies in the event',
    delivery: [DELIVERY.DOWNLOAD],
    endpoint: 'GET /events/:id/company/export/',
  },
  {
    id: 'engagement_csv',
    category: 'engagement',
    title: 'Exhibitor Portal Activity & Matchmaking Completion',
    summary: 'Portal activity per company: POC login, matchmaking completion, team members, invites and matchmaking answers.',
    useWhen: 'You are chasing exhibitors who have not finished the portal or matchmaking.',
    rowUnit: 'One row per company (parents and co-exhibitors)',
    scope: 'All, completed only, or not completed',
    options: ['Completed filter', 'Include matchmaking answers', 'Include POC login info'],
    delivery: [DELIVERY.DOWNLOAD, DELIVERY.EMAIL],
    endpoint: 'GET /events/:id/exhibitor/engagement/?format=csv',
  },
  {
    id: 'invitee_report',
    category: 'engagement',
    title: 'Exhibitor POC Logins & Invitees Added',
    summary: 'Whether each company has a POC, if the POC has logged in, team size and how many invitees they added.',
    useWhen: 'You want to see which exhibitors are inviting their buyers and guests.',
    rowUnit: 'One row per company',
    scope: 'All companies in the event',
    delivery: [DELIVERY.EMAIL],
    note: 'Email only: the file is built in the background and sent as an attachment.',
    endpoint: 'GET /events/:id/invitee-report/',
  },
  {
    id: 'ar_orders',
    category: 'orders',
    title: 'Stall Requirement Orders & Payments',
    summary: 'Every stall-requirement order line: product, quantity, price, payment mode, status and billing details.',
    useWhen: 'Finance or the stall contractor needs the list of paid / pay-later orders.',
    rowUnit: 'One row per ordered product',
    scope: 'Orders with the statuses you pick',
    options: ['Order status'],
    delivery: [DELIVERY.EMAIL],
    note: 'Sent by email. Prices are in the event currency.',
    endpoint: 'GET /admin/events/:id/additional-requirements/orders/report/',
  },
];

export const COMPANY_REPORTS = REPORTS.map((report) => ({
  ...report,
  sample: COMPANY_REPORT_SAMPLES[report.id],
}));

export const DEFAULT_COMPANY_REPORT_ID = COMPANY_REPORTS[0].id;

export function findCompanyReport(id) {
  return COMPANY_REPORTS.find((r) => r.id === id) || COMPANY_REPORTS[0];
}

export function reportsInCategory(categoryId) {
  return COMPANY_REPORTS.filter((r) => r.category === categoryId);
}

/** Counts for the tab's summary strip, e.g. { total: 6, download: 3, email: 4, screen: 1 }. */
export function companyReportCounts() {
  const count = (mode) => COMPANY_REPORTS.filter((r) => r.delivery.includes(mode)).length;
  return {
    total: COMPANY_REPORTS.length,
    download: count(DELIVERY.DOWNLOAD),
    email: count(DELIVERY.EMAIL),
    screen: count(DELIVERY.SCREEN),
  };
}
