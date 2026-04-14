import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Lock, Mail, KeyRound, Loader2, Globe } from 'lucide-react';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, currentEnv, switchEnvironment } = useAuth();
    const navigate = useNavigate();

    const ENV_OPTIONS = [
        { value: 'STAGE', label: 'Staging' },
        { value: 'PROD', label: 'Production' }
    ];

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.checkUserType(email);
            if (response.status === 'success' && response.data.is_admin && response.data.user_type === 'admin') {
                setStep(2);
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } catch (err) {
            setError(err.message || 'Failed to verify user.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password);
            console.log('Login Response:', response);
            if (response.otp_required) {
                setStep(3);
            } else if (response.auth_token) {
                // Direct login without OTP (just in case)
                login(response, response.auth_token.key);
                navigate('/');
            } else {
                setError('Unexpected login response.');
            }
        } catch (err) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.verify2FA(email, otp);
            if (response.auth_token) {
                login(response, response.auth_token.key);
                navigate('/');
            } else {
                setError('Verification failed. Invalid response.');
            }
        } catch (err) {
            setError(err.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-secondary">
            <div className="w-full max-w-[400px] p-8 bg-bg-primary border border-border rounded-lg shadow-md animate-fade-in">
                <div className="mb-8 text-center">
                    <div className="w-8 h-8 bg-accent text-white rounded-md flex items-center justify-center text-lg mx-auto mb-4 font-bold">C</div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {step === 1 ? 'Welcome Back' : step === 2 ? 'Enter Password' : 'Security Check'}
                    </h1>
                    <p className="text-sm text-text-secondary">
                        {step === 1 ? 'Sign in to your dashboard' : step === 2 ? `Hello, ${email}` : 'Enter the code sent to your email'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-danger p-3 rounded-md text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex justify-center mb-8 bg-bg-tertiary p-1 rounded-lg w-fit mx-auto">
                    {ENV_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => switchEnvironment(option.value)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: currentEnv === option.value ? 'var(--color-bg-primary)' : 'transparent',
                                color: currentEnv === option.value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                boxShadow: currentEnv === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <Loader2 className="spinner" /> : <>Continue <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} /></>}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <Loader2 className="spinner" /> : <>Sign In <Lock size={16} style={{ marginLeft: '0.5rem' }} /></>}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <label className="input-label">Verification Code</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-field"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <Loader2 className="spinner" /> : <>Verify <KeyRound size={16} style={{ marginLeft: '0.5rem' }} /></>}
                            </button>
                        </div>
                    </form>
                )}
                <div className="mt-8 pt-6 border-t border-border text-center">
                    <button 
                        onClick={() => navigate('/login-local')}
                        className="text-sm text-text-secondary hover:text-accent transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Globe size={14} />
                        Local environment login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
