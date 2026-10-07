export const DEFAULT_SCAN_FILTERS = {
  mode: 'all',
  date: '',
  from: '',
  to: '',
  scannedIn: '',
  byDay: false,
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Query params for scan-metrics. Date text is sent as typed (YYYY-MM-DD, no timezone). */
export function scanFilterParams(filters) {
  const params = {};
  if (filters.mode === 'day' && filters.date) params.date = filters.date;
  if (filters.mode === 'range') {
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
  }
  if (filters.scannedIn) params.scanned_in = filters.scannedIn;
  if (filters.byDay) params.group_by = 'date';
  return params;
}

/** Field messages that mirror the API, so a bad range is caught before the request. */
export function validateScanFilters(filters) {
  const errors = {};
  const check = (key, value) => {
    if (value && !DATE_RE.test(value)) errors[key] = 'Use the format YYYY-MM-DD.';
  };
  if (filters.mode === 'day') check('date', filters.date);
  if (filters.mode === 'range') {
    check('from', filters.from);
    check('to', filters.to);
    if (!errors.from && !errors.to && filters.from && filters.to && filters.to < filters.from) {
      errors.to = 'End date cannot be before the start date.';
    }
  }
  return errors;
}

export function describeScanRange(range) {
  if (range.from && range.to) return range.from === range.to ? range.from : `${range.from} to ${range.to}`;
  if (range.from) return `From ${range.from}`;
  if (range.to) return `Until ${range.to}`;
  return 'All dates';
}
