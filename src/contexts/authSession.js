import { getDashboardMode, getEnv } from '../config';
import {
  buildProjectHomeUrl,
  buildProjectUrl,
  getProjectRelativeLocation,
} from '../projectPath';

/** Per-project + per-env session keys — EA and SC never share credentials. */
export const getStorageKeys = (mode = getDashboardMode(), env = getEnv()) => ({
  user: `${mode}_user_${env}`,
  token: `${mode}_token_${env}`,
  event: `${mode}_selectedEvent_${env}`,
  recentEvents: `${mode}_recentEvents_${env}`,
  lastPath: `${mode}_last_path_${env}`,
});

export const readSession = (mode, env) => {
  const keys = getStorageKeys(mode, env);
  const rawUser = sessionStorage.getItem(keys.user);
  const token = sessionStorage.getItem(keys.token);
  if (!rawUser || !token) return null;
  try {
    return {
      user: JSON.parse(rawUser),
      token,
      event: JSON.parse(sessionStorage.getItem(keys.event) || 'null'),
      recentEvents: JSON.parse(sessionStorage.getItem(keys.recentEvents) || '[]'),
    };
  } catch {
    return null;
  }
};

export const readLastPath = (mode, env) => {
  try {
    const raw = sessionStorage.getItem(getStorageKeys(mode, env).lastPath);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Remember current in-project URL (skip login so it does not wipe a good resume point). */
export const saveLastPath = (mode, env) => {
  const { pathname, search } = getProjectRelativeLocation();
  if (pathname === '/login' || pathname === '/login-local') return;
  sessionStorage.setItem(
    getStorageKeys(mode, env).lastPath,
    JSON.stringify({ pathname, search })
  );
};

/** Resume last path for a project, or selected event, or home; login if no session. */
export const resolveResumeUrl = (mode, env) => {
  const session = readSession(mode, env);
  if (!session) return buildProjectUrl(mode, '/login');

  const last = readLastPath(mode, env);
  let pathname = last?.pathname || '/';
  let search = last?.search || '';

  if (pathname === '/login' || pathname === '/login-local') {
    pathname = '/';
    search = '';
  }

  if (pathname === '/' && session.event?.id) {
    pathname = `/event/${session.event.id}/attendees`;
    search = '';
  }

  return buildProjectUrl(mode, pathname, search);
};

export { buildProjectHomeUrl };
