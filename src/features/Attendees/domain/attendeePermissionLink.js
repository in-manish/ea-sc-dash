import { SCAN_LOCATION_TAB } from '../../ScanLocations/domain/scanLocationTab';

export const PERMISSION_ID_FILTER = 'permission_ids';
export const PERMISSION_CODE_FILTER = 'permission_codes';
export const PERMISSION_FOCUS_PARAM = 'permission';

export function attendeePermissions(attendee) {
  if (!Array.isArray(attendee?.permissions)) return [];
  return attendee.permissions.filter((item) => item && (item.id != null || item.code || item.name));
}

export function permissionConfigPath(eventId, permissionId) {
  const params = new URLSearchParams({
    tab: SCAN_LOCATION_TAB,
    panel: 'codes',
  });
  if (permissionId != null && permissionId !== '') {
    params.set(PERMISSION_FOCUS_PARAM, String(permissionId));
  }
  return `/event/${eventId}/settings?${params}`;
}

export function attendeesWithPermissionPath(eventId, permissionId) {
  const params = new URLSearchParams();
  if (permissionId != null && permissionId !== '') {
    params.set(PERMISSION_ID_FILTER, String(permissionId));
  }
  const query = params.toString();
  return query ? `/event/${eventId}/attendees?${query}` : `/event/${eventId}/attendees`;
}
