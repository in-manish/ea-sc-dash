import {
  DASHBOARD_DATE_OPTIONS,
  DASHBOARD_LOCALE,
  DASHBOARD_TIMEZONE,
} from '../../../utils/formatDateTime';

export { formatDateTime } from '../../../utils/formatDateTime';

function calendarYear(date) {
  return date.toLocaleString(DASHBOARD_LOCALE, {
    timeZone: DASHBOARD_TIMEZONE,
    year: 'numeric',
  });
}

/** Compact list date: "26 Aug" or "26 Aug 2025" if not this year. */
export function formatShortDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const opts =
    calendarYear(d) === calendarYear(new Date())
      ? { month: 'short', day: '2-digit' }
      : DASHBOARD_DATE_OPTIONS;
  return d.toLocaleDateString(DASHBOARD_LOCALE, {
    timeZone: DASHBOARD_TIMEZONE,
    ...opts,
  });
}
