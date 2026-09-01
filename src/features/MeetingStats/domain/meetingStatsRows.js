import { isContractorLabel } from './excludeContractors';

export function formatStatsNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
}

export function rowAttendeeType(row) {
  return row?.attendee_type || row?.attendee_category || '';
}

export function compareAttendeeTypeRows(a, b) {
  return String(rowAttendeeType(a)).localeCompare(String(rowAttendeeType(b)), undefined, {
    sensitivity: 'base',
  });
}

export function sortAttendeeTypeRows(rows) {
  return [...rows].sort(compareAttendeeTypeRows);
}

export function rowHasUnique(row) {
  return row && Object.prototype.hasOwnProperty.call(row, 'unique_confirmed_participants');
}

export function normalizeMeetingStats(payload) {
  const eventGroups = Array.isArray(payload?.results) ? payload.results : [];
  let showUnique = false;

  const totals = eventGroups.map((group) => {
    const attendeeTypes = Array.isArray(group?.attendee_types) ? group.attendee_types : [];
    const visibleTypes = sortAttendeeTypeRows(
      attendeeTypes.filter((row) => !isContractorLabel(rowAttendeeType(row))),
    );
    if (visibleTypes.some(rowHasUnique)) showUnique = true;
    return {
      event: group.event,
      event_id: group.event_id,
      unique_meetings: group.unique_meetings,
      total_participants: group.total_participants,
      active_users: group.active_users,
      meeting_requests_sent: group.meeting_requests_sent,
      meeting_requests_received: group.meeting_requests_received,
      confirmed_meetings: group.confirmed_meetings,
      ...(Object.prototype.hasOwnProperty.call(group, 'unique_confirmed_participants')
        ? { unique_confirmed_participants: group.unique_confirmed_participants }
        : {}),
      attendee_types: visibleTypes,
    };
  });

  return {
    fromCache: Boolean(payload?.from_cache),
    generatedAt: payload?.generated_at || '',
    totals,
    showUnique,
  };
}
