import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        // Check for stored token/user on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedEvent = localStorage.getItem('selectedEvent');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }

        if (storedEvent) {
            setSelectedEvent(JSON.parse(storedEvent));
        }

        setIsLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        setSelectedEvent(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('selectedEvent');
    };

    const selectEvent = (event) => {
        setSelectedEvent(event);
        localStorage.setItem('selectedEvent', JSON.stringify(event));
    };

    const clearEvent = () => {
        setSelectedEvent(null);
        localStorage.removeItem('selectedEvent');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, selectedEvent, selectEvent, clearEvent }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
