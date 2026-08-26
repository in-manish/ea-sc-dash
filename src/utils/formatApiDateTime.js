import {
    DASHBOARD_DATETIME_OPTIONS,
    DASHBOARD_LOCALE,
} from './formatDateTime';

/**
 * Format API datetime strings that already carry IST wall-clock time.
 * Values like "2025-07-20 11:28:58.035146+00:00" must not be timezone-shifted —
 * the numeric time is already IST; only format for display (en-IN).
 */
export function formatApiDateTime(value, options = {}) {
    if (!value) return '-';

    const match = String(value).match(
        /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
    );
    if (!match) return String(value);

    const [, year, month, day, hour, minute, second = '00'] = match;
    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    );

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString(DASHBOARD_LOCALE, {
        ...DASHBOARD_DATETIME_OPTIONS,
        ...options,
    });
}
