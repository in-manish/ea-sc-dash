import { APP_ENVS, PROJECTS, getDashboardMode, getEnv } from '../config';
import {
  buildProjectHomeUrl,
  buildProjectUrl,
  getAppPathname,
  getProjectRelativeLocation,
} from '../projectPath';
import {
  discardTabSessionIfLoggedOut,
  storageGet,
  storageRemove,
  storageSet,
} from '../storage/webStorage';

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
  discardTabSessionIfLoggedOut(keys.token, Object.values(keys));
  const rawUser = storageGet(keys.user);
  const token = storageGet(keys.token);
  if (!rawUser || !token) return null;
  try {
    return {
      user: JSON.parse(rawUser),
      token,
      event: JSON.parse(storageGet(keys.event) || 'null'),
      recentEvents: JSON.parse(storageGet(keys.recentEvents) || '[]'),
    };
  } catch {
    return null;
  }
};

export const persistSessionFields = (mode, env, fields) => {
  const keys = getStorageKeys(mode, env);
  if (fields.user != null) storageSet(keys.user, JSON.stringify(fields.user));
  if (fields.token != null) storageSet(keys.token, fields.token);
  if (fields.event !== undefined) {
    if (fields.event) storageSet(keys.event, JSON.stringify(fields.event));
    else storageRemove(keys.event);
  }
  if (fields.recentEvents != null) {
    storageSet(keys.recentEvents, JSON.stringify(fields.recentEvents));
  }
  if (fields.lastPath !== undefined) {
    if (fields.lastPath) storageSet(keys.lastPath, JSON.stringify(fields.lastPath));
    else storageRemove(keys.lastPath);
  }
};

export const clearStoredSession = (mode, env) => {
  Object.values(getStorageKeys(mode, env)).forEach(storageRemove);
};

export const readLastPath = (mode, env) => {
  try {
    const raw = storageGet(getStorageKeys(mode, env).lastPath);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Remember current in-project URL (skip login so it does not wipe a good resume point). */
export const saveLastPath = (mode, env) => {
  const { pathname, search } = getProjectRelativeLocation();
  if (pathname === '/login' || pathname === '/login-local') return;
  persistSessionFields(mode, env, { lastPath: { pathname, search } });
};

const SESSION_ENVS = [APP_ENVS.STAGE, APP_ENVS.PROD, APP_ENVS.LOCAL];
const SESSION_PROJECTS = [PROJECTS.EA, PROJECTS.SC];

/** Prefer stored project+env; otherwise any combo that still has a token. */
export const findStoredSession = () => {
  const env = getEnv();
  const storedMode = storageGet('dashboard_mode');
  if (storedMode && readSession(storedMode, env)) {
    return { mode: storedMode, env };
  }
  for (const project of SESSION_PROJECTS) {
    if (readSession(project, env)) return { mode: project, env };
  }
  for (const otherEnv of SESSION_ENVS) {
    for (const project of SESSION_PROJECTS) {
      if (readSession(project, otherEnv)) {
        return { mode: project, env: otherEnv };
      }
    }
  }
  return null;
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

/**
 * Bare host (no /ea|/sc): keep the path, but bind to a project that still has a token.
 */
export const resolveLandingUrl = () => {
  const appPath = getAppPathname();
  const segments = appPath.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const rest =
    first === 'ea' || first === 'sc'
      ? `/${segments.slice(1).join('/')}`
      : appPath;
  const relative = !rest || rest === '/' ? '/' : rest;
  const isAuthPage = relative === '/login' || relative === '/login-local';
  const found = findStoredSession();

  if (found) {
    storageSet('app_env', found.env);
    storageSet('dashboard_mode', found.mode);
    if (relative === '/' || isAuthPage) return resolveResumeUrl(found.mode, found.env);
    const params = new URLSearchParams(window.location.search);
    params.delete('mode');
    const search = params.toString() ? `?${params.toString()}` : '';
    return buildProjectUrl(found.mode, relative, search);
  }

  const project = getDashboardMode();
  if (relative === '/') return buildProjectUrl(project, '/login');
  return buildProjectUrl(project, relative);
};

export { buildProjectHomeUrl };
