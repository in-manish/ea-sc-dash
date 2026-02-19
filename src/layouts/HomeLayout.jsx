import React from 'react';
import { Outlet } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './HomeLayout.css';

const HomeLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="home-layout">
            {/* Top Right Profile & Settings */}
            <div className="home-header">
                <div className="profile-menu">
                    <div className="env-selector-wrapper" style={{ position: 'relative', marginRight: '1rem' }}>
                        <select
                            value={useAuth().currentEnv}
                            onChange={(e) => {
                                if (window.confirm(`Switch to ${e.target.value === 'PROD' ? 'Production' : 'Staging'}? You will be redirected to the dashboard.`)) {
                                    useAuth().switchEnvironment(e.target.value);
                                }
                            }}
                            className="env-badge-select"
                            style={{
                                appearance: 'none',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backgroundColor: useAuth().currentEnv === 'PROD' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: useAuth().currentEnv === 'PROD' ? '#ef4444' : '#3b82f6',
                                border: `1px solid ${useAuth().currentEnv === 'PROD' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                                letterSpacing: '0.025em',
                                textAlign: 'center',
                                outline: 'none'
                            }}
                        >
                            <option value="STAGE">STAGING</option>
                            <option value="PROD">PRODUCTION</option>
                        </select>
                    </div>
                    <button className="settings-btn" title="Settings">
                        <Settings size={20} />
                    </button>
                    <div className="profile-icon" title={user?.username}>
                        <User size={20} />
                    </div>
                    <button onClick={logout} className="btn-text">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <main className="home-content">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;
