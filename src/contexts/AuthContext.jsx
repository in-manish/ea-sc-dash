/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, getDashboardMode, setDashboardMode } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);

    // Get current mode (EA vs SC)
    const [currentMode, setCurrentMode] = useState(() => getDashboardMode());

    // Get current environment
    const currentEnv = sessionStorage.getItem('app_env') || 'STAGE';

    // Helper to get storage keys based on mode and env
    const getStorageKeys = (mode = currentMode, env = currentEnv) => ({
        user: `${mode}_user_${env}`,
        token: `${mode}_token_${env}`,
        event: `${mode}_selectedEvent_${env}`,
        recentEvents: `${mode}_recentEvents_${env}`
    });

    useEffect(() => {
        // Apply theme for current environment and mode
        applyTheme();

        const keys = getStorageKeys();
        const storedUser = sessionStorage.getItem(keys.user);
        const storedToken = sessionStorage.getItem(keys.token);
        const storedEvent = sessionStorage.getItem(keys.event);
        const storedRecentEvents = sessionStorage.getItem(keys.recentEvents);

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
    }, [currentMode, currentEnv]);

    const login = (userData, authToken) => {
        const keys = getStorageKeys();
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        sessionStorage.setItem(keys.user, JSON.stringify(userData));
        sessionStorage.setItem(keys.token, authToken);
    };

    const logout = () => {
        const keys = getStorageKeys();
        setUser(null);
        setToken(null);
        setSelectedEvent(null);
        setRecentEvents([]);
        setIsAuthenticated(false);
        sessionStorage.removeItem(keys.user);
        sessionStorage.removeItem(keys.token);
        sessionStorage.removeItem(keys.event);
        sessionStorage.removeItem(keys.recentEvents);
    };

    const selectEvent = (event) => {
        const keys = getStorageKeys();
        setSelectedEvent(event);
        sessionStorage.setItem(keys.event, JSON.stringify(event));

        // Update recent events (max 5)
        setRecentEvents(prevEvents => {
            const filtered = prevEvents.filter(e => e.id !== event.id);
            const updated = [event, ...filtered].slice(0, 5);
            sessionStorage.setItem(keys.recentEvents, JSON.stringify(updated));
            return updated;
        });
    };

    const clearEvent = () => {
        const keys = getStorageKeys();
        setSelectedEvent(null);
        sessionStorage.removeItem(keys.event);
    };

    const updateUserEvents = (events) => {
        const keys = getStorageKeys();
        if (user) {
            const updatedUser = { ...user, events };
            setUser(updatedUser);
            sessionStorage.setItem(keys.user, JSON.stringify(updatedUser));
        }
    };

    const switchEnvironment = (newEnv) => {
        if (newEnv === currentEnv) return;

        sessionStorage.setItem('app_env', newEnv);
        // Navigate to root to ensure we don't stay on a page with invalid ID (like an event detail page)
        // and reload to apply the new config/theme
        window.location.href = import.meta.env.BASE_URL;
    };

    const switchMode = (newMode) => {
        if (newMode === currentMode) return;

        setDashboardMode(newMode);
        setCurrentMode(newMode);
        // Reload the page to preserve the exact same screen path, parameters, and query state
        window.location.reload();
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
            updateUserEvents,
            recentEvents,
            currentEnv,
            switchEnvironment,
            currentMode,
            switchMode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

