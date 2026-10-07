import { permissionIdList } from './permissionIds';

/**
 * POST and PATCH body.
 * permissions replaces the list with ids. [] clears it.
 * special_permission is always sent so an empty list does not leave Special unchanged,
 * and so PATCH does not 400 when the key is required.
 */
export function buildScanLocationBody({ name, permissionIds, specialPermission }) {
  return {
    location: String(name || '').trim(),
    permissions: permissionIdList(permissionIds),
    special_permission: Boolean(specialPermission),
  };
}
