/** Eligible to create: found, no active badge, has email and/or phone. */
export function eligibleForCreate(items = []) {
  return items.filter(
    (item) => item && !item.has_active_badge && item.has_contact !== false,
  );
}

export function alreadyActiveItems(items = []) {
  return items.filter((item) => item?.has_active_badge);
}

export function summarizeStatus(response) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const notFound = response?.not_found || {};
  const active = alreadyActiveItems(data);
  const eligible = eligibleForCreate(data);
  const noContact = data.filter(
    (item) => !item.has_active_badge && item.has_contact === false,
  );
  const missingIds = Array.isArray(notFound.ids) ? notFound.ids : [];
  const missingUuids = Array.isArray(notFound.uuids) ? notFound.uuids : [];

  return {
    data,
    active,
    eligible,
    noContact,
    missingIds,
    missingUuids,
    summary: [
      `${data.length} found`,
      `${active.length} already active`,
      `${eligible.length} can create`,
      noContact.length ? `${noContact.length} missing contact` : null,
      missingIds.length + missingUuids.length
        ? `${missingIds.length + missingUuids.length} not found`
        : null,
    ]
      .filter(Boolean)
      .join(' · '),
  };
}

const STATUS_LABEL = {
  created: 'Created',
  already_active: 'Already active',
  skipped: 'Skipped',
  failed: 'Failed',
};

export function summarizeCreate(response) {
  const data = Array.isArray(response?.data) ? response.data : [];
  const notFound = response?.not_found || {};
  const counts = data.reduce((acc, item) => {
    const key = item?.status || 'failed';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const missingIds = Array.isArray(notFound.ids) ? notFound.ids : [];
  const missingUuids = Array.isArray(notFound.uuids) ? notFound.uuids : [];
  const parts = Object.entries(STATUS_LABEL)
    .filter(([key]) => counts[key])
    .map(([key, label]) => `${counts[key]} ${label.toLowerCase()}`);
  if (missingIds.length + missingUuids.length) {
    parts.push(`${missingIds.length + missingUuids.length} not found`);
  }

  return {
    data,
    counts,
    missingIds,
    missingUuids,
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
  return 'Eligible';
}

export function createStatusLabel(status) {
  return STATUS_LABEL[status] || status || 'Unknown';
}
