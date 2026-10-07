const READ_ONLY = new Set(['scan', 'print', 'kiosk', 'staff']);

/** Organizers edit codes. Scan, print, and kiosk can read. Staff are refused by the API. */
export function canEditPermissionCodes(user) {
  const type = String(user?.user_type || user?.role || user?.user_role || '').trim().toLowerCase();
  if (READ_ONLY.has(type)) return false;
  if (user?.is_admin === true) return true;
  if (['admin', 'organizer', 'organiser'].includes(type)) return true;
  return !type;
}
