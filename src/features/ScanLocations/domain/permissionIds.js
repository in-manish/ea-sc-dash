import { formatPermissionWindow } from './permissionWindow';

/** Permission ids for location and badge payloads. Objects with id are accepted. */
export function permissionIdList(value) {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => {
      if (item && typeof item === 'object') return Number(item.id);
      return Number(item);
    })
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function formatPermissionSummary(value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const text = value
    .map((item) => {
      if (!item || typeof item !== 'object') return '';
      const title = [item.code, item.name].filter(Boolean).join(' ');
      const window = formatPermissionWindow(item);
      return [title, window].filter(Boolean).join(' · ');
    })
    .filter(Boolean)
    .join(', ');
  return text || null;
}
