import { getProjectFromPathname } from './projectPath';
import { storageGet, storageSet } from './storage/webStorage';

/** App environments (deploy targets). */
export const APP_ENVS = { LOCAL: 'LOCAL', STAGE: 'STAGE', PROD: 'PROD' };

/** Dashboard projects — each has its own API + theme per env. */
export const PROJECTS = { EA: 'EA', SC: 'SC' };

/** @deprecated Prefer PROJECTS — kept for existing imports. */
export const DASHBOARD_MODES = PROJECTS;

export const DEFAULT_ENV = APP_ENVS.STAGE;
export const DEFAULT_PROJECT = PROJECTS.EA;
/** @deprecated Prefer DEFAULT_PROJECT */
export const DEFAULT_MODE = DEFAULT_PROJECT;

const STORAGE = {
  env: 'app_env',
  project: 'dashboard_mode', // legacy key — do not rename
  localUrl: (project) => `${project}_local_base_url`,
};

/**
 * ENV → PROJECT → { BASE_URL, THEME }
 * BASE_URL is always project-owned; never share across EA/SC.
 */
export const ENV_CONFIG = {
  LOCAL: {
    NAME: 'Local',
    EA: {
      BASE_URL: 'http://reconnect.localhost:8000',
      THEME: {
        '--color-accent': '#7c3aed',
        '--color-accent-hover': '#6d28d9',
        '--color-bg-tertiary': '#f5f3ff',
      },
    },
    SC: {
      BASE_URL: 'http://localhost:8010',
      THEME: {
        '--color-accent': '#d97706',
        '--color-accent-hover': '#b45309',
        '--color-bg-tertiary': '#fef3c7',
      },
    },
  },
  STAGE: {
    NAME: 'Staging',
    EA: {
      BASE_URL: 'https://reconnect.stage-eventapp-reconnect.fairfest.in',
      THEME: {
        '--color-accent': '#0f172a',
        '--color-accent-hover': '#1e293b',
        '--color-bg-tertiary': '#f1f5f9',
      },
    },
    SC: {
      BASE_URL: 'https://stage-reconnect-snapcard.fairfest.in',
      THEME: {
        '--color-accent': '#0284c7',
        '--color-accent-hover': '#0369a1',
        '--color-bg-tertiary': '#f0f9ff',
      },
    },
  },
  PROD: {
    NAME: 'Production',
    EA: {
      BASE_URL: 'https://reconnect.eventapp-reconnect.fairfest.in',
      THEME: {
        '--color-accent': '#dc2626',
        '--color-accent-hover': '#b91c1c',
        '--color-bg-tertiary': '#fef2f2',
      },
    },
    SC: {
      BASE_URL: 'https://reconnect-snapcard.fairfest.in',
      THEME: {
        '--color-accent': '#059669',
        '--color-accent-hover': '#047857',
        '--color-bg-tertiary': '#ecfdf5',
      },
    },
  },
};

const isProject = (v) => Boolean(PROJECTS[v]);
const isEnv = (v) => Boolean(APP_ENVS[v]);

/** Active project (EA | SC). Path /ea|/sc wins, then ?mode=, then stored project. */
export const getProject = () => {
  if (typeof window !== 'undefined' && window.location) {
    const fromPath = getProjectFromPathname();
    if (fromPath) {
      storageSet(STORAGE.project, fromPath);
      return fromPath;
    }
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (isProject(mode)) {
      storageSet(STORAGE.project, mode);
      return mode;
    }
  }
  return storageGet(STORAGE.project) || DEFAULT_PROJECT;
};

export const setProject = (project) => {
  if (!isProject(project)) return false;
  storageSet(STORAGE.project, project);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('modechange', { detail: { project } }));
  }
  return true;
};

export const getDashboardMode = getProject;
export const setDashboardMode = setProject;

export const getEnv = () => storageGet(STORAGE.env) || DEFAULT_ENV;

export const setEnv = (env) => {
  if (!isEnv(env) || !ENV_CONFIG[env]) return false;
  storageSet(STORAGE.env, env);
  return true;
};

/** Resolve { BASE_URL, THEME } for current (or given) env + project. Never cached. */
export const getActiveConfig = (env = getEnv(), project = getProject()) => {
  const envBlock = ENV_CONFIG[env] || ENV_CONFIG[DEFAULT_ENV];
  return envBlock[project] || envBlock[DEFAULT_PROJECT];
};

/**
 * API base URL for the active project + env.
 * LOCAL may use a per-project session override; otherwise config BASE_URL.
 */
export const getApiUrl = () => {
  const env = getEnv();
  const project = getProject();
  if (env === APP_ENVS.LOCAL) {
    const override = storageGet(STORAGE.localUrl(project));
    if (override) return override.replace(/\/$/, '');
  }
  return (getActiveConfig(env, project).BASE_URL || '').replace(/\/$/, '');
};

export const setLocalBaseUrl = (url) => {
  storageSet(STORAGE.localUrl(getProject()), url.replace(/\/$/, ''));
};

/** LOCAL base URL for the active project (ignores current env — used by LoginLocal). */
export const getLocalBaseUrl = () => {
  const project = getProject();
  const override = storageGet(STORAGE.localUrl(project));
  if (override) return override.replace(/\/$/, '');
  return (getActiveConfig(APP_ENVS.LOCAL, project).BASE_URL || '').replace(/\/$/, '');
};

export const getEnvName = () => {
  const env = getEnv();
  return (ENV_CONFIG[env] || ENV_CONFIG[DEFAULT_ENV]).NAME;
};

export const applyTheme = () => {
  const theme = getActiveConfig().THEME;
  if (!theme) return;
  const root = document.documentElement;
  Object.keys(theme).forEach((key) => root.style.setProperty(key, theme[key]));
};
