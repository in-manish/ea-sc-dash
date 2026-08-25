/** Eligible to create: no active badge, has email and/or phone. */
export function eligibleForCreate(items = []) {
  return items.filter(
    (item) => item && !item.has_active_badge && item.has_contact !== false,
  );
}

export function alreadyActiveItems(items = []) {
  return items.filter((item) => item?.has_active_badge);
}

export function needsSnapCardSync(items = []) {
  return items.filter(
    (item) =>
      item &&
      !item.has_active_badge &&
      item.has_contact !== false &&
      (item.evc_id == null || item.evc_id === ''),
  );
}

function notFoundLists(response) {
  const notFound = response?.not_found || {};
  return {
    missingIds: Array.isArray(notFound.ids) ? notFound.ids : [],
    missingUuids: Array.isArray(notFound.uuids) ? notFound.uuids : [],
  };
}

export function summarizeStatus(response, { allWithoutActive = false } = {}) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const { missingIds, missingUuids } = notFoundLists(response);
  const active = alreadyActiveItems(data);
  const eligible = eligibleForCreate(data);
  const noContact = data.filter(
    (item) => !item.has_active_badge && item.has_contact === false,
  );
  const needsSync = needsSnapCardSync(data);
  const missingCount = missingIds.length + missingUuids.length;

  const summary = allWithoutActive
    ? [
        `${eligible.length} eligible (contact, no active badge)`,
        needsSync.length ? `${needsSync.length} need SnapCard sync` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : [
        `${data.length} checked`,
        `${active.length} already active`,
        `${eligible.length} can create`,
        noContact.length ? `${noContact.length} no contact` : null,
        needsSync.length ? `${needsSync.length} need SnapCard sync` : null,
        missingCount ? `${missingCount} not found` : null,
      ]
        .filter(Boolean)
        .join(' · ');

  return {
    data,
    active,
    eligible,
    noContact,
    needsSync,
    missingIds,
    missingUuids,
    allWithoutActive,
    summary,
  };
}

const STATUS_LABEL = {
  created: 'Created',
  already_active: 'Already active',
  skipped: 'Skipped',
  failed: 'Failed',
};

export function summarizeCreate(response, { allWithoutActive = false } = {}) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const { missingIds, missingUuids } = notFoundLists(response);
  const counts = data.reduce((acc, item) => {
    const key = item?.status || 'failed';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const missingCount = missingIds.length + missingUuids.length;
  const parts = Object.entries(STATUS_LABEL)
    .filter(([key]) => counts[key])
    .map(([key, label]) => `${counts[key]} ${label.toLowerCase()}`);
  if (missingCount) parts.push(`${missingCount} not found`);

  return {
    data,
    counts,
    missingIds,
    missingUuids,
    allWithoutActive,
    summary: parts.join(' · ') || 'No results',
  };
}

export function statusRowLabel(item) {
  if (item.has_active_badge) {
    return item.active_badge_id
      ? `Active (#${item.active_badge_id})`
      : 'Active';
  }
  if (item.has_contact === false) return 'No contact';
  if (item.evc_id == null || item.evc_id === '') return 'Eligible · Sync SnapCard';
  return 'Eligible';
}

export function createStatusLabel(status) {
  return STATUS_LABEL[status] || status || 'Unknown';
}

export { STATUS_LABEL };
