import { parsePermissionCode } from './parsePermissionCodes';

function count(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function nullableCount(value) {
  return value == null ? null : count(value);
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function freshness(raw) {
  return {
    generatedAt: raw?.generated_at || '',
    cached: Boolean(raw?.cached),
    ttlSeconds: count(raw?.cache_ttl_seconds),
  };
}

function place(raw) {
  return { id: raw?.id ?? null, name: String(raw?.name || '').trim() || 'Untitled location' };
}

/** GET permission-codes/metrics/ → totals plus one row per permission, with where it is used. */
export function parseHolderMetrics(raw) {
  const permissions = list(raw?.permissions)
    .map((item) => {
      const base = parsePermissionCode(item);
      if (!base) return null;
      return {
        ...base,
        badges: count(item.badges),
        percentage: count(item.percentage),
        locations: list(item.locations).map(place),
        byAttendeeType: list(item.by_attendee_type).map((row) => ({
          id: row?.id ?? null,
          name: String(row?.name || '').trim() || 'Unnamed type',
          badges: count(row?.badges),
        })),
      };
    })
    .filter(Boolean);
  return {
    totalBadges: count(raw?.total_badges),
    withPermissions: count(raw?.badges_with_permissions),
    withoutPermissions: count(raw?.badges_without_permissions),
    permissions,
    ...freshness(raw),
  };
}

/** GET permission-codes/scan-metrics/ → totals, per-location rows, per-permission roll-up, per-day rows. */
export function parseScanMetrics(raw) {
  const locations = list(raw?.locations).map((item) => ({
    ...place(item),
    deleted: Boolean(item?.deleted),
    required: list(item?.required_permissions).map(parsePermissionCode).filter(Boolean),
    scans: count(item?.scans),
    uniqueBadges: count(item?.unique_badges),
    unmatchedScans: count(item?.unmatched_scans),
    withRequired: nullableCount(item?.with_required_permission),
    withoutRequired: nullableCount(item?.without_required_permission),
    byPermission: list(item?.by_permission)
      .map((row) => {
        const base = parsePermissionCode(row);
        return base ? { ...base, uniqueBadges: count(row.unique_badges) } : null;
      })
      .filter(Boolean),
  }));
  const permissions = list(raw?.permissions)
    .map((row) => {
      const base = parsePermissionCode(row);
      return base ? { ...base, scans: count(row.scans), uniqueBadges: count(row.unique_badges) } : null;
    })
    .filter(Boolean);
  return {
    range: { from: raw?.range?.from || '', to: raw?.range?.to || '' },
    totals: {
      scans: count(raw?.totals?.scans),
      uniqueBadges: count(raw?.totals?.unique_badges),
      unmatchedScans: count(raw?.totals?.unmatched_scans),
    },
    locations,
    permissions,
    byDate: list(raw?.by_date).map((row) => ({
      date: String(row?.date || ''),
      scans: count(row?.scans),
      uniqueBadges: count(row?.unique_badges),
    })),
    ...freshness(raw),
  };
}
