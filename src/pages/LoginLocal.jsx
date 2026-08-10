import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getLocalBaseUrl, setLocalBaseUrl, setEnv } from '../config';
import { eventService } from '../services/eventService';
import { ArrowLeft, Globe, Key, Save, Edit2, Loader2, AlertCircle } from 'lucide-react';

const LoginLocal = () => {
    const { login, currentMode, switchMode, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    if (!isLoading && isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    const tokenKey = `${currentMode}_local_auth_token`;
    
    const [baseUrl, setBaseUrl] = useState(() => getLocalBaseUrl());
    const [token, setToken] = useState(() => sessionStorage.getItem(tokenKey) || '');
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [isEditingToken, setIsEditingToken] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Re-bind URL + token whenever EA/SC changes (each project owns its own).
    useEffect(() => {
        setBaseUrl(getLocalBaseUrl());
        const storedToken = sessionStorage.getItem(tokenKey);
        setToken(storedToken || '');
        setIsEditingToken(!storedToken);
        setError('');
    }, [currentMode, tokenKey]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!baseUrl) {
            setError('Base URL is required');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('Authentication token is required');
            setLoading(false);
            return;
        }

        try {
            // Save settings to sessionStorage
            setLocalBaseUrl(baseUrl);
            sessionStorage.setItem(tokenKey, token);
            
            // Switch to LOCAL environment in config
            setEnv('LOCAL');
            
            // Fetch events to populate the dashboard using the newly added service method
            let events = [];
            
            try {
                const data = await eventService.getEvents(token);
                // The API might return { events: [...] } or just [...]
                events = data.events || data.results || (Array.isArray(data) ? data : []);
            } catch (e) {
                console.warn("Failed to fetch events:", e);
                // Fallback to empty list to at least allow login
                events = [];
            }

            // Update user data with actual events
            const mockUser = {
                id: 'local-admin',
                username: 'Local Admin',
                name: 'Local Admin',
                email: 'local@admin.com',
                is_admin: true,
                user_type: 'admin',
                role: currentMode === 'SC' ? 'ADMIN' : undefined,
                events: events
            };

            // Login with provided token
            login(mockUser, token);
            
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login / fetch events');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-secondary p-4">
            <div className="w-full max-w-[450px] p-8 bg-bg-primary border border-border rounded-xl shadow-xl animate-fade-in">
                <div className="mb-8 relative">
                    <button 
                        onClick={() => navigate('/login')}
                        className="absolute -left-2 -top-2 p-2 text-text-secondary hover:text-text-primary transition-colors border-none bg-transparent cursor-pointer"
                        title="Back to standard login"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    
                    <div className="text-center mt-4">
                        <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center text-xl mx-auto mb-4 font-bold shadow-lg">
                            L
                        </div>
                        
                        {/* Mode Switcher */}
                        <div className="flex justify-center mb-6 bg-bg-tertiary p-1 rounded-lg w-fit mx-auto">
                            <button
                                type="button"
                                onClick={() => switchMode('EA')}
                                style={{
                                    padding: '0.4rem 1.2rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: currentMode === 'EA' ? 'var(--color-bg-primary)' : 'transparent',
                                    color: currentMode === 'EA' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    boxShadow: currentMode === 'EA' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                EA Local
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode('SC')}
                                style={{
                                    padding: '0.4rem 1.2rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: currentMode === 'SC' ? 'var(--color-bg-primary)' : 'transparent',
                                    color: currentMode === 'SC' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    boxShadow: currentMode === 'SC' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                SC Local
                            </button>
                        </div>

                        <h1 className="text-2xl font-bold text-text-primary mb-1">
                            {currentMode === 'SC' ? 'SC Local Login' : 'Local Login'}
                        </h1>
                        <p className="text-sm text-text-secondary">Configure your local development environment</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-danger animate-shake">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-text-primary">API Base URL</label>
                            <button 
                                type="button"
                                onClick={() => setIsEditingUrl(!isEditingUrl)}
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                            >
                                {isEditingUrl ? 'Lock' : 'Edit'}
                                {isEditingUrl ? <Save size={12} /> : <Edit2 size={12} />}
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                                <Globe size={18} />
                            </div>
                            <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent ${!isEditingUrl ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                placeholder={currentMode === 'SC' ? 'http://localhost:8010' : 'http://localhost:8000'}
                                disabled={!isEditingUrl}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary px-1">
                            This URL will be used for all API requests.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-text-primary">Auth Token</label>
                            <button 
                                type="button"
                                onClick={() => setIsEditingToken(!isEditingToken)}
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                            >
                                {isEditingToken ? 'Lock' : 'Edit'}
                                {isEditingToken ? <Save size={12} /> : <Edit2 size={12} />}
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                                <Key size={18} />
                            </div>
                            <textarea
                                className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border rounded-lg text-sm min-h-[100px] transition-all outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none ${!isEditingToken ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste your authentication token here..."
                                disabled={!isEditingToken}
                                required
                            />
                        </div>
                    </div>

                    {!token && (
                        <div className="p-3 bg-accent/5 rounded-lg border border-accent/10 mb-2">
                            <p className="text-xs text-accent font-medium leading-relaxed">
                                <strong>Note:</strong> You must provide a valid authentication token to access the dashboard in local mode.
                            </p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full btn btn-primary py-3 font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 h-12 border-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>Connect to Local</>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border text-center">
                    <p className="text-xs text-text-secondary">
                        Switch back to <button onClick={() => { setEnv('STAGE'); navigate('/login'); }} className="text-accent hover:underline border-none bg-transparent cursor-pointer">Staging</button> or <button onClick={() => { setEnv('PROD'); navigate('/login'); }} className="text-accent hover:underline border-none bg-transparent cursor-pointer">Production</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginLocal;

