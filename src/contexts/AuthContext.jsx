import { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Get current environment
    const currentEnv = localStorage.getItem('app_env') || 'STAGE';

    // Helper to get storage keys based on env
    const getStorageKeys = (env = currentEnv) => ({
        user: `user_${env}`,
        token: `token_${env}`,
        event: `selectedEvent_${env}`
    });

    useEffect(() => {
        // Apply theme for current environment
        applyTheme();

        const keys = getStorageKeys();
        const storedUser = localStorage.getItem(keys.user);
        const storedToken = localStorage.getItem(keys.token);
        const storedEvent = localStorage.getItem(keys.event);

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsAuthenticated(true);
        }

        if (storedEvent) {
            setSelectedEvent(JSON.parse(storedEvent));
        }

        setIsLoading(false);
    }, []);

    const login = (userData, authToken) => {
        const keys = getStorageKeys();
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        localStorage.setItem(keys.user, JSON.stringify(userData));
        localStorage.setItem(keys.token, authToken);
    };

    const logout = () => {
        const keys = getStorageKeys();
        setUser(null);
        setToken(null);
        setSelectedEvent(null);
        setIsAuthenticated(false);
        localStorage.removeItem(keys.user);
        localStorage.removeItem(keys.token);
        localStorage.removeItem(keys.event);
    };

    const selectEvent = (event) => {
        const keys = getStorageKeys();
        setSelectedEvent(event);
        localStorage.setItem(keys.event, JSON.stringify(event));
    };

    const clearEvent = () => {
        const keys = getStorageKeys();
        setSelectedEvent(null);
        localStorage.removeItem(keys.event);
    };

    const switchEnvironment = (newEnv) => {
        if (newEnv === currentEnv) return;

        localStorage.setItem('app_env', newEnv);
        // Navigate to root to ensure we don't stay on a page with invalid ID (like an event detail page)
        // and reload to apply the new config/theme
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            isLoading,
            login,
            logout,
            selectedEvent,
            selectEvent,
            clearEvent,
            currentEnv,
            switchEnvironment
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
