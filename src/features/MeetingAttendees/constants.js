export const PAGE_SIZE = 50;
export const MAX_COMPANY_CHOICES = [3, 5];
export const DEFAULT_MAX_COMPANIES = 3;

// One entry per meeting count. `key` gives the filter names (`<key>Min`, `<key>Max`) and the API
// params (`<apiPrefix>_min`, `<apiPrefix>_max`); `field` is the number in each attendee row.
export const COUNT_FILTERS = [
  { key: 'pending', apiPrefix: 'pending', field: 'pending_requests_count', label: 'Pending received' },
  { key: 'pendingSent', apiPrefix: 'pending_sent', field: 'pending_sent_count', label: 'Pending sent' },
  { key: 'confirmed', apiPrefix: 'confirmed', field: 'confirmed_meetings_count', label: 'Confirmed' },
  { key: 'declined', apiPrefix: 'declined', field: 'declined_meetings_count', label: 'Declined' },
];

// Search box plus exact lookups. `key` is the filter name, `param` the API param. `numbers` fields take one id or a comma list.
export const SEARCH_KEY = 'search';
export const LOOKUP_FILTERS = [
  { key: 'badgeId', param: 'badge_id', label: 'Attendee ID', placeholder: 'e.g. 1042 or 1042, 1043', numbers: true },
  { key: 'uuid', param: 'uuid', label: 'Attendee UID', placeholder: 'Full UID' },
  { key: 'regId', param: 'reg_id', label: 'Reg ID', placeholder: 'Full reg ID' },
  { key: 'email', param: 'email', label: 'Email', placeholder: 'Part of the email' },
  { key: 'company', param: 'company', label: 'Company name', placeholder: 'Part of the name' },
  {
    key: 'companyId',
    param: 'company_id',
    label: 'Company ID',
    placeholder: 'Exhibitors only',
    numbers: true,
  },
];

const EMPTY_TEXT = LOOKUP_FILTERS.reduce((all, { key }) => ({ ...all, [key]: '' }), { [SEARCH_KEY]: '' });

export const EMPTY_FILTERS = COUNT_FILTERS.reduce(
  (filters, { key }) => ({ ...filters, [`${key}Min`]: '', [`${key}Max`]: '' }),
  { attendeeTypeIds: [], hasEmail: false, ...EMPTY_TEXT },
);
