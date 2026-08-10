/** Allowed SC portal login roles (case-insensitive). */
export const SC_PORTAL_ROLES = ['ADMIN', 'STAFF', 'SNAPCARD_USER'];

/** Roles available for admin user-list filter. */
export const SC_LIST_ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'SNAPCARD_USER', label: 'Snapcard user' },
];

const pickToken = (response) =>
  response?.auth_token?.Token
  || response?.auth_token?.key
  || response?.token
  || response?.auth_token
  || null;

const pickUserPayload = (response) => {
  if (!response || typeof response !== 'object') return null;
  if (response.user && typeof response.user === 'object') return response.user;
  if (response.data && typeof response.data === 'object' && !response.auth_token) {
    return response.data;
  }
  const {
    auth_token: _t,
    token: _k,
    message: _m,
    detail: _d,
    status: _s,
    ...rest
  } = response;
  return rest;
};

export const getScUserRole = (user) =>
  String(user?.role || user?.user_role || '').trim().toUpperCase();

export const canAccessScPortal = (user) =>
  SC_PORTAL_ROLES.includes(getScUserRole(user));

/** @deprecated use canAccessScPortal */
export const isScAdmin = canAccessScPortal;

/**
 * Parse SC POST /user/login/ response.
 * Allows ADMIN, STAFF, SNAPCARD_USER (case-insensitive).
 * @returns {{ ok: true, user: object, token: string } | { ok: false, error: string }}
 */
export function parseScLoginResponse(response) {
  const token = pickToken(response);
  if (!token || typeof token !== 'string') {
    return {
      ok: false,
      error: response?.message || response?.detail || response?.error || 'Login failed. Please check your credentials.',
    };
  }

  const raw = pickUserPayload(response) || {};
  const role = getScUserRole(raw) || String(raw.role || '').trim();
  const user = {
    id: raw.id ?? null,
    name: raw.name || raw.username || '',
    username: raw.username || raw.email || raw.name || '',
    email: raw.email || '',
    phone_number: raw.phone_number || '',
    country_code: raw.country_code || '',
    country_name: raw.country_name || '',
    company: raw.company || '',
    designation: raw.designation || '',
    company_address: raw.company_address || '',
    city: raw.city || '',
    state: raw.state || '',
    country: raw.country || '',
    zipcode: raw.zipcode || '',
    is_verified_email: raw.is_verified_email === true,
    is_verified_phone_number: raw.is_verified_phone_number === true,
    role,
  };

  if (!canAccessScPortal(user)) {
    return {
      ok: false,
      error: 'Access denied. Allowed roles: ADMIN, STAFF, SNAPCARD_USER.',
    };
  }

  return { ok: true, user, token };
}
