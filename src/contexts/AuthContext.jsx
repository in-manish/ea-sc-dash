/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);

    // Get current environment
    const currentEnv = localStorage.getItem('app_env') || 'STAGE';

    // Helper to get storage keys based on env
    const getStorageKeys = (env = currentEnv) => ({
        user: `user_${env}`,
        token: `token_${env}`,
        event: `selectedEvent_${env}`,
        recentEvents: `recentEvents_${env}`
    });

    useEffect(() => {
        // Apply theme for current environment
        applyTheme();

        const keys = getStorageKeys();
        const storedUser = localStorage.getItem(keys.user);
        const storedToken = localStorage.getItem(keys.token);
        const storedEvent = localStorage.getItem(keys.event);
        const storedRecentEvents = localStorage.getItem(keys.recentEvents);

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsAuthenticated(true);
        }

        if (storedEvent) {
            setSelectedEvent(JSON.parse(storedEvent));
        }

        if (storedRecentEvents) {
            try {
                setRecentEvents(JSON.parse(storedRecentEvents));
            } catch (e) {
                console.error("Failed to parse recent events", e);
                setRecentEvents([]);
            }
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
        setRecentEvents([]);
        setIsAuthenticated(false);
        localStorage.removeItem(keys.user);
        localStorage.removeItem(keys.token);
        localStorage.removeItem(keys.event);
        localStorage.removeItem(keys.recentEvents);
    };

    const selectEvent = (event) => {
        const keys = getStorageKeys();
        setSelectedEvent(event);
        localStorage.setItem(keys.event, JSON.stringify(event));

        // Update recent events (max 5)
        setRecentEvents(prevEvents => {
            const filtered = prevEvents.filter(e => e.id !== event.id);
            const updated = [event, ...filtered].slice(0, 5);
            localStorage.setItem(keys.recentEvents, JSON.stringify(updated));
            return updated;
        });
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
        window.location.href = import.meta.env.BASE_URL;
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
            recentEvents,
            currentEnv,
            switchEnvironment
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
