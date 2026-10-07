import { readPermissionWindow } from './permissionWindow';

export function parsePermissionCode(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const code = String(raw.code ?? '').trim().toUpperCase();
  const name = String(raw.name ?? '').trim();
  if (!code && !name) return null;
  return { id: raw.id ?? null, code, name, ...readPermissionWindow(raw) };
}

export function parsePermissionCodes(data) {
  const list = Array.isArray(data) ? data : [];
  return list
    .map(parsePermissionCode)
    .filter(Boolean)
    .sort((a, b) => a.code.localeCompare(b.code) || String(a.id).localeCompare(String(b.id)));
}
