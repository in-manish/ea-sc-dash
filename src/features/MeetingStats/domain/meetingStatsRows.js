import { isContractorLabel } from './excludeContractors';

export function formatStatsNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
}

export function rowAttendeeType(row) {
  return row?.attendee_type || row?.attendee_category || '';
}

export function compareStatsRows(a, b) {
  const eventA = String(a.event || '');
  const eventB = String(b.event || '');
  const byEvent = eventA.localeCompare(eventB, undefined, { sensitivity: 'base' });
  if (byEvent !== 0) return byEvent;
  return String(rowAttendeeType(a)).localeCompare(String(rowAttendeeType(b)), undefined, {
    sensitivity: 'base',
  });
}

export function sortMeetingStatsRows(rows) {
  return [...rows].sort(compareStatsRows);
}

export function rowHasUnique(row) {
  return row && Object.prototype.hasOwnProperty.call(row, 'unique_confirmed_participants');
}

export function normalizeMeetingStats(payload) {
  const results = Array.isArray(payload?.results) ? payload.results : [];
  const visible = results.filter((row) => !isContractorLabel(rowAttendeeType(row)));
  const rows = sortMeetingStatsRows(visible);
  return {
    fromCache: Boolean(payload?.from_cache),
    generatedAt: payload?.generated_at || '',
    rows,
    showUnique: rows.some(rowHasUnique),
  };
}
