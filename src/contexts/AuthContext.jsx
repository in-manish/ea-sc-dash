/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import {
    applyTheme,
    getDashboardMode,
    setDashboardMode,
    getEnv,
} from '../config';
import {
    getStorageKeys,
    readSession,
    readLastPath,
    saveLastPath,
    resolveResumeUrl,
    buildProjectHomeUrl,
} from './authSession';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);
    const [currentMode, setCurrentMode] = useState(() => getDashboardMode());
    const [currentEnv, setCurrentEnv] = useState(() => getEnv());

    // Restore (or clear) auth for the active project — never wipe the other project's keys.
    useEffect(() => {
        applyTheme();
        const session = readSession(currentMode, currentEnv);
        if (session) {
            setUser(session.user);
            setToken(session.token);
            setIsAuthenticated(true);
            setSelectedEvent(session.event);
            setRecentEvents(Array.isArray(session.recentEvents) ? session.recentEvents : []);
        } else {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            setSelectedEvent(null);
            setRecentEvents([]);
        }
        setIsLoading(false);
    }, [currentMode, currentEnv]);

    const login = (userData, authToken) => {
        const mode = getDashboardMode();
        const env = getEnv();
        setCurrentMode(mode);
        setCurrentEnv(env);

        const keys = getStorageKeys(mode, env);
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
        sessionStorage.removeItem(keys.lastPath);
    };

    const selectEvent = (event) => {
        const keys = getStorageKeys();
        setSelectedEvent(event);
        sessionStorage.setItem(keys.event, JSON.stringify(event));
        setRecentEvents((prev) => {
            const updated = [event, ...prev.filter((e) => e.id !== event.id)].slice(0, 5);
            sessionStorage.setItem(keys.recentEvents, JSON.stringify(updated));
            return updated;
        });
    };

    const clearEvent = () => {
        const keys = getStorageKeys();
        sessionStorage.removeItem(keys.event);
        const last = readLastPath(currentMode, currentEnv);
        if (last?.pathname?.startsWith('/event/')) {
            sessionStorage.setItem(
                keys.lastPath,
                JSON.stringify({ pathname: '/', search: '' })
            );
        }
        setSelectedEvent(null);
    };

    const updateUserEvents = (events) => {
        if (!user) return;
        const updatedUser = { ...user, events };
        setUser(updatedUser);
        sessionStorage.setItem(getStorageKeys().user, JSON.stringify(updatedUser));
    };

    const switchEnvironment = (newEnv) => {
        if (newEnv === currentEnv) return;
        saveLastPath(currentMode, currentEnv);
        sessionStorage.setItem('app_env', newEnv);
        setCurrentEnv(newEnv);
        window.location.href = buildProjectHomeUrl(getDashboardMode());
    };

    const switchMode = (newMode) => {
        if (newMode === currentMode) return;
        saveLastPath(currentMode, currentEnv);
        setDashboardMode(newMode);
        window.location.href = resolveResumeUrl(newMode, currentEnv);
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
            switchMode,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
