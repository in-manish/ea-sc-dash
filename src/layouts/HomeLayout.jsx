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
