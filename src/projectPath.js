/** Frontend path prefixes: host/ea/... and host/sc/... */

export const PROJECT_SLUGS = { EA: 'ea', SC: 'sc' };
const SLUG_TO_PROJECT = { ea: 'EA', sc: 'SC' };

export const getViteBase = () =>
  (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Strip deploy base; return path like /ea/login or /login */
export const getAppPathname = (pathname = window.location.pathname) => {
  const base = getViteBase();
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/';
  }
  return pathname || '/';
};

/** EA | SC from first path segment, or null if missing. */
export const getProjectFromPathname = (pathname = window.location.pathname) => {
  const slug = getAppPathname(pathname).split('/').filter(Boolean)[0]?.toLowerCase();
  return SLUG_TO_PROJECT[slug] || null;
};

/** /ea or /sc (includes vite base when set). */
export const getProjectHomePath = (project) => {
  const slug = PROJECT_SLUGS[project] || PROJECT_SLUGS.EA;
  const joined = `${getViteBase()}/${slug}`.replace(/\/+/g, '/');
  return joined.startsWith('/') ? joined : `/${joined}`;
};

export const getRouterBasename = (project) => getProjectHomePath(project);

/** Absolute URL to project home, e.g. https://host/ea/ */
export const buildProjectHomeUrl = (project) => {
  const path = getProjectHomePath(project);
  return `${window.location.origin}${path.endsWith('/') ? path : `${path}/`}`;
};

/** Path + search inside the project (no /ea|/sc prefix). */
export const getProjectRelativeLocation = () => {
  const appPath = getAppPathname();
  const segments = appPath.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const rest =
    first === 'ea' || first === 'sc'
      ? `/${segments.slice(1).join('/')}`
      : appPath;
  const params = new URLSearchParams(window.location.search);
  params.delete('mode');
  const search = params.toString();
  return {
    pathname: !rest || rest === '/' ? '/' : rest,
    search: search ? `?${search}` : '',
  };
};

/** Absolute URL for a path inside a project, e.g. /event/9/attendees → https://host/ea/event/9/attendees */
export const buildProjectUrl = (project, pathname = '/', search = '') => {
  const home = getProjectHomePath(project);
  const suffix = !pathname || pathname === '/' ? '/' : pathname;
  const url = new URL(
    `${window.location.origin}${home}${suffix === '/' ? '/' : suffix}`
  );
  if (search) {
    url.search = search.startsWith('?') ? search.slice(1) : search;
  }
  return url.toString();
};

/**
 * Redirect legacy URLs (no /ea|/sc prefix) into the project namespace.
 * /login?mode=SC → /sc/login
 * /event/1/attendees → /ea/event/1/attendees (using stored/default project)
 */
export const buildProjectRedirectUrl = (project) => {
  const appPath = getAppPathname();
  const segments = appPath.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const rest =
    first === 'ea' || first === 'sc'
      ? `/${segments.slice(1).join('/')}`
      : appPath;

  const home = getProjectHomePath(project);
  const suffix = !rest || rest === '/' ? '/' : rest;
  const url = new URL(`${window.location.origin}${home}${suffix === '/' ? '/' : suffix}`);
  // Drop legacy ?mode= — path is the source of truth now.
  const params = new URLSearchParams(window.location.search);
  params.delete('mode');
  url.search = params.toString();
  url.hash = window.location.hash;
  return url.toString();
};
