export const ENV_CONFIG = {
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
    }
};

export const DEFAULT_ENV = 'STAGE';

export const getEnv = () => {
    return localStorage.getItem('app_env') || DEFAULT_ENV;
};

export const setEnv = (env) => {
    if (ENV_CONFIG[env]) {
        localStorage.setItem('app_env', env);
        // We might want to reload here or let the caller handle it
        return true;
    }
    return false;
};

export const getApiUrl = () => {
    const env = getEnv();
    return ENV_CONFIG[env].BASE_URL;
};

export const getEnvName = () => {
    const env = getEnv();
    return ENV_CONFIG[env].NAME;
};

export const applyTheme = () => {
    const env = getEnv();
    const theme = ENV_CONFIG[env].THEME;

    if (theme) {
        const root = document.documentElement;
        Object.keys(theme).forEach(key => {
            root.style.setProperty(key, theme[key]);
        });
    }
};
