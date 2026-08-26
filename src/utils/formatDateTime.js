/** Dashboard datetimes: Indian locale, IST wall clock. Empty/invalid → em dash. */

export const DASHBOARD_LOCALE = 'en-IN';
export const DASHBOARD_TIMEZONE = 'Asia/Kolkata';

export const DASHBOARD_DATETIME_OPTIONS = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
};

export const DASHBOARD_DATE_OPTIONS = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

function parseDate(value) {
  if (value == null || value === '') return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

/** e.g. 26 Aug 2026, 8:01:12 pm */
export function formatDateTime(value, empty = '—') {
  const date = parseDate(value);
  if (!date) return empty;
  return date.toLocaleString(DASHBOARD_LOCALE, {
    timeZone: DASHBOARD_TIMEZONE,
    ...DASHBOARD_DATETIME_OPTIONS,
  });
}

/** e.g. 26 Aug 2026 */
export function formatDate(value, empty = '—') {
  const date = parseDate(value);
  if (!date) return empty;
  return date.toLocaleDateString(DASHBOARD_LOCALE, {
    timeZone: DASHBOARD_TIMEZONE,
    ...DASHBOARD_DATE_OPTIONS,
  });
}
