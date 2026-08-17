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
    readSession,
    readLastPath,
    saveLastPath,
    resolveResumeUrl,
    persistSessionFields,
    clearStoredSession,
    buildProjectHomeUrl,
} from './authSession';
import { storageSet } from '../storage/webStorage';

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
            persistSessionFields(currentMode, currentEnv, session);
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

        persistSessionFields(mode, env, { user: userData, token: authToken });
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearStoredSession();
        setUser(null);
        setToken(null);
        setSelectedEvent(null);
        setRecentEvents([]);
        setIsAuthenticated(false);
    };

    const selectEvent = (event) => {
        setSelectedEvent(event);
        setRecentEvents((prev) => {
            const updated = [event, ...prev.filter((e) => e.id !== event.id)].slice(0, 5);
            persistSessionFields(currentMode, currentEnv, {
                event,
                recentEvents: updated,
            });
            return updated;
        });
    };

    const clearEvent = () => {
        persistSessionFields(currentMode, currentEnv, { event: null });
        const last = readLastPath(currentMode, currentEnv);
        if (last?.pathname?.startsWith('/event/')) {
            persistSessionFields(currentMode, currentEnv, {
                lastPath: { pathname: '/', search: '' },
            });
        }
        setSelectedEvent(null);
    };

    const updateUserEvents = (events) => {
        if (!user) return;
        const updatedUser = { ...user, events };
        setUser(updatedUser);
        persistSessionFields(currentMode, currentEnv, { user: updatedUser });
    };

    const switchEnvironment = (newEnv) => {
        if (newEnv === currentEnv) return;
        saveLastPath(currentMode, currentEnv);
        storageSet('app_env', newEnv);
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
