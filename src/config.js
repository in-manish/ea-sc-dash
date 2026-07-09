export const DASHBOARD_MODES = {
    EA: 'EA',
    SC: 'SC'
};

export const DEFAULT_MODE = 'EA';

export const getDashboardMode = () => {
    if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        if (mode === 'EA' || mode === 'SC') {
            sessionStorage.setItem('dashboard_mode', mode);
            return mode;
        }
    }
    return sessionStorage.getItem('dashboard_mode') || DEFAULT_MODE;
};

export const setDashboardMode = (mode) => {
    if (DASHBOARD_MODES[mode]) {
        sessionStorage.setItem('dashboard_mode', mode);
        return true;
    }
    return false;
};

export const ENV_CONFIG = {
    EA: {
        STAGE: {
            BASE_URL: 'https://reconnect.stage-eventapp-reconnect.fairfest.in',
            NAME: 'Staging',
            THEME: {
                '--color-accent': '#0f172a', // Slate 900 (Default)
                '--color-accent-hover': '#1e293b',
                '--color-bg-tertiary': '#f1f5f9' // Slate 100
            }
        },
        PROD: {
            BASE_URL: 'https://reconnect.eventapp-reconnect.fairfest.in',
            NAME: 'Production',
            THEME: {
                '--color-accent': '#dc2626', // Red 600
                '--color-accent-hover': '#b91c1c', // Red 700
                '--color-bg-tertiary': '#fef2f2' // Red 50
            }
        },
        LOCAL: {
            BASE_URL: '', // Will be overridden by sessionStorage
            NAME: 'Local',
            THEME: {
                '--color-accent': '#7c3aed', // Violet 600
                '--color-accent-hover': '#6d28d9',
                '--color-bg-tertiary': '#f5f3ff'
            }
        }
    },
    SC: {
        STAGE: {
            BASE_URL: 'https://stage-reconnect-snapcard.fairfest.in',
            NAME: 'Staging',
            THEME: {
                '--color-accent': '#0284c7', // Sky 600
                '--color-accent-hover': '#0369a1', // Sky 700
                '--color-bg-tertiary': '#f0f9ff' // Sky 50
            }
        },
        PROD: {
            BASE_URL: 'https://reconnect-snapcard.fairfest.in',
            NAME: 'Production',
            THEME: {
                '--color-accent': '#059669', // Emerald 600
                '--color-accent-hover': '#047857', // Emerald 700
                '--color-bg-tertiary': '#ecfdf5' // Emerald 50
            }
        },
        LOCAL: {
            BASE_URL: '', // Will be overridden by sessionStorage
            NAME: 'Local',
            THEME: {
                '--color-accent': '#d97706', // Amber 600
                '--color-accent-hover': '#b45309', // Amber 700
                '--color-bg-tertiary': '#fef3c7' // Amber 50
            }
        }
    }
};

export const DEFAULT_ENV = 'STAGE';

export const getEnv = () => {
    return sessionStorage.getItem('app_env') || DEFAULT_ENV;
};

export const setEnv = (env) => {
    const mode = getDashboardMode();
    if (ENV_CONFIG[mode] && ENV_CONFIG[mode][env]) {
        sessionStorage.setItem('app_env', env);
        return true;
    }
    return false;
};

export const getApiUrl = () => {
    const env = getEnv();
    const mode = getDashboardMode();
    if (env === 'LOCAL') {
        return sessionStorage.getItem(`${mode}_local_base_url`) || (mode === 'SC' ? 'http://localhost:8010' : 'http://localhost:8000');
    }
    return ENV_CONFIG[mode][env].BASE_URL;
};

export const setLocalBaseUrl = (url) => {
    const mode = getDashboardMode();
    sessionStorage.setItem(`${mode}_local_base_url`, url);
};

export const getLocalBaseUrl = () => {
    const mode = getDashboardMode();
    return sessionStorage.getItem(`${mode}_local_base_url`) || (mode === 'SC' ? 'http://localhost:8010' : 'http://localhost:8000');
};

export const getEnvName = () => {
    const env = getEnv();
    const mode = getDashboardMode();
    return ENV_CONFIG[mode][env].NAME;
};

export const applyTheme = () => {
    const env = getEnv();
    const mode = getDashboardMode();
    const theme = ENV_CONFIG[mode][env].THEME;

    if (theme) {
        const root = document.documentElement;
        Object.keys(theme).forEach(key => {
            root.style.setProperty(key, theme[key]);
        });
    }
};

