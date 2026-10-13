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

export const EMPTY_FILTERS = COUNT_FILTERS.reduce(
  (filters, { key }) => ({ ...filters, [`${key}Min`]: '', [`${key}Max`]: '' }),
  { attendeeTypeIds: [], hasEmail: false },
);
