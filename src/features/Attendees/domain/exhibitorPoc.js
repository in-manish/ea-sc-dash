export function isExhibitorAttendee(attendee) {
  if (!attendee) return false;
  if (attendee.is_poc) return true;
  const type = String(attendee.attendee_type || '').toLowerCase();
  const sort = String(attendee.attendee_type_sort || '').toLowerCase();
  return type === 'exhibitor' || sort === 'exhibitor';
}

export function canResetExhibitorPortalPassword(attendee) {
  return Boolean(attendee?.is_poc);
}

/** Selection-bar reset: exactly one selected attendee who is a POC. */
export function singleSelectedPocAttendee(selectedAttendees, selectionMode) {
  if (selectionMode !== 'selected') return null;
  if (!Array.isArray(selectedAttendees) || selectedAttendees.length !== 1) {
    return null;
  }
  const attendee = selectedAttendees[0];
  return canResetExhibitorPortalPassword(attendee) ? attendee : null;
}
