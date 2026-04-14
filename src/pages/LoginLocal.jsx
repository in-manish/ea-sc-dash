import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getLocalBaseUrl, setLocalBaseUrl, setEnv } from '../config';
import { eventService } from '../services/eventService';
import { ArrowLeft, Globe, Key, Save, Edit2, Loader2, AlertCircle } from 'lucide-react';

const LoginLocal = () => {
    const [baseUrl, setBaseUrl] = useState(getLocalBaseUrl());
    const [token, setToken] = useState(localStorage.getItem('local_auth_token') || '');
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [isEditingToken, setIsEditingToken] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // Check if we already have a token in LOCAL storage to auto-fill
    useEffect(() => {
        const storedToken = localStorage.getItem('local_auth_token');
        if (storedToken) {
            setToken(storedToken);
            setIsEditingToken(false);
        }
    }, []);

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
            // Save settings to localStorage
            setLocalBaseUrl(baseUrl);
            localStorage.setItem('local_auth_token', token);
            
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
                email: 'local@admin.com',
                is_admin: true,
                user_type: 'admin',
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
                        className="absolute -left-2 -top-2 p-2 text-text-secondary hover:text-text-primary transition-colors"
                        title="Back to standard login"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    
                    <div className="text-center mt-4">
                        <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center text-xl mx-auto mb-4 font-bold shadow-lg shadow-violet-200">
                            L
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-1">Local Login</h1>
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
                                className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${!isEditingUrl ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                placeholder="http://localhost:8000"
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
                                className={`w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-border rounded-lg text-sm min-h-[100px] transition-all outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none ${!isEditingToken ? 'opacity-70 cursor-not-allowed' : ''}`}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste your authentication token here..."
                                disabled={!isEditingToken}
                                required
                            />
                        </div>
                    </div>

                    {!token && (
                        <div className="p-3 bg-violet-50 rounded-lg border border-violet-100 mb-2">
                            <p className="text-xs text-violet-700 leading-relaxed">
                                <strong>Note:</strong> You must provide a valid authentication token to access the dashboard in local mode.
                            </p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
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
                        Switch back to <button onClick={() => { setEnv('STAGE'); navigate('/login'); }} className="text-accent hover:underline">Staging</button> or <button onClick={() => { setEnv('PROD'); navigate('/login'); }} className="text-accent hover:underline">Production</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginLocal;
