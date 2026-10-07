import { parsePermissionCode } from './parsePermissionCodes';

function parsePermission(raw) {
  return parsePermissionCode(raw);
}

/**
 * Normalize GET /events/:id/locations/scan/.
 * Keep API order (newest first). Hide soft-deleted rows.
 * Empty permissions = open entry.
 */
export function parseScanLocations(data) {
  const list = Array.isArray(data) ? data : [];
  return list
    .map((row) => {
      const permissions = (Array.isArray(row?.permissions) ? row.permissions : [])
        .map(parsePermission)
        .filter(Boolean);
      return {
        id: row?.id ?? null,
        name: String(row?.name || '').trim() || 'Untitled location',
        specialPermission: Boolean(row?.special_permission),
        createdAt: row?.created_at || '',
        deleted: Boolean(row?.deleted),
        permissions,
        openEntry: permissions.length === 0,
      };
    })
    .filter((row) => !row.deleted);
}
