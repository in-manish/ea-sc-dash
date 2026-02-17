import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Lock, Mail, KeyRound, Loader2 } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

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
        <div className="login-container">
            <div className="login-card animate-fade-in">
                <div className="login-header">
                    <div className="logo-icon" style={{ margin: '0 auto 1rem' }}>C</div>
                    <h1 className="login-title">
                        {step === 1 ? 'Welcome Back' : step === 2 ? 'Enter Password' : 'Security Check'}
                    </h1>
                    <p className="login-subtitle">
                        {step === 1 ? 'Sign in to your dashboard' : step === 2 ? `Hello, ${email}` : 'Enter the code sent to your email'}
                    </p>
                </div>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="login-form">
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
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
                    <form onSubmit={handlePasswordSubmit} className="login-form">
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
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
                        <div className="form-actions-between">
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
                    <form onSubmit={handleOtpSubmit} className="login-form">
                        <div className="input-group">
                            <label className="input-label">Verification Code</label>
                            <div className="input-wrapper">
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
                        <div className="form-actions-between">
                            <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <Loader2 className="spinner" /> : <>Verify <KeyRound size={16} style={{ marginLeft: '0.5rem' }} /></>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
