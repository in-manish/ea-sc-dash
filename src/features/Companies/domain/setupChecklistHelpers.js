/** Sort checklist steps by `order` ascending. */
export function sortSetupSteps(steps) {
  if (!Array.isArray(steps)) return [];
  return [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Tailwind classes for deadline urgency chips/text. */
export function urgencyClasses(urgency) {
  switch (urgency) {
    case 'warning':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'critical':
      return 'text-orange-800 bg-orange-50 border-orange-300';
    case 'overdue':
      return 'text-red-700 bg-red-50 border-red-300';
    default:
      return 'text-text-secondary bg-bg-secondary border-border';
  }
}

/** Chip styles for status_type (mandatory / recommended / optional). */
export function statusTypeClasses(statusType) {
  const key = String(statusType || '').toLowerCase();
  if (key === 'mandatory') return 'bg-red-50 text-red-800 border-red-200';
  if (key === 'recommended') return 'bg-blue-50 text-blue-800 border-blue-200';
  return 'bg-bg-tertiary text-text-secondary border-border';
}

/** Chip styles for completion_status. */
export function completionStatusClasses(status) {
  const key = String(status || '').toLowerCase();
  if (key === 'completed') return 'bg-green-50 text-green-800 border-green-200';
  if (key.includes('progress')) return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-bg-tertiary text-text-primary border-border';
}

/**
 * Map exhibitor portal_route → organizer dashboard path.
 * Returns null when no organizer equivalent exists.
 */
export function resolvePortalRoute(portalRoute, { eventId, companyId }) {
  if (!portalRoute || !eventId || !companyId) return null;
  const key = String(portalRoute).toLowerCase().replace(/_/g, '-');
  const base = `/event/${eventId}`;
  const routes = {
    'company-details': `${base}/companies/${companyId}/edit`,
    'edit-company': `${base}/companies/${companyId}/edit`,
    'manage-team': `${base}/attendees?exhibitor_id=${companyId}`,
    badges: `${base}/attendees?exhibitor_id=${companyId}`,
    attendees: `${base}/attendees?exhibitor_id=${companyId}`,
    matchmaking: `${base}/matchmaking`,
    orders: `${base}/companies?tab=additional_requirements&company_ids=${companyId}`,
  };
  return routes[key] || null;
}

export function formatDeadlineLabel(deadline, urgency) {
  if (!deadline) return null;
  const prefix = urgency === 'overdue' ? 'Overdue · ' : 'Due ';
  return `${prefix}${deadline}`;
}
