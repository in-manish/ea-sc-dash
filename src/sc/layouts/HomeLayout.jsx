import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ScHomeSidebarNav from './ScHomeSidebarNav';
import ScUsersSectionTabs from './ScUsersSectionTabs';

const HomeLayout = () => {
    const { user, logout, currentEnv, switchEnvironment, currentMode, switchMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCeleryExpanded, setIsCeleryExpanded] = useState(location.pathname.includes('/celery-beat'));
    const [isUsersExpanded, setIsUsersExpanded] = useState(location.pathname.includes('/users/'));

    const openUsers = () => {
        setIsUsersExpanded(true);
        navigate('/users/manage');
    };

    const openCelery = () => {
        setIsCeleryExpanded(true);
        navigate('/celery-beat');
    };

    return (
        <div className="flex min-h-screen bg-bg-secondary">
            {/* Left Sidebar */}
            <aside className="bg-bg-primary border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50 w-[260px]">
                {/* Logo & Brand */}
                <div className="py-5 px-4 border-b border-border">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 bg-accent text-white rounded-md flex items-center justify-center text-lg font-bold shrink-0">C</div>
                        <div>
                            <h2 className="text-sm font-semibold text-text-primary leading-tight">Snapcard</h2>
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Admin portal</span>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex items-center bg-bg-secondary border border-border rounded-full p-0.5 shadow-sm w-full">
                        <button
                            onClick={() => switchMode('EA')}
                            className={`flex-1 text-center py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-none ${
                                currentMode === 'EA'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            EA
                        </button>
                        <button
                            onClick={() => switchMode('SC')}
                            className={`flex-1 text-center py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-none ${
                                currentMode === 'SC'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-transparent text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            SC
                        </button>
                    </div>
                </div>

                {/* Sidebar Navigation — parent click opens first child */}
                <ScHomeSidebarNav
                    locationPath={location.pathname}
                    isUsersExpanded={isUsersExpanded}
                    isCeleryExpanded={isCeleryExpanded}
                    onOpenUsers={openUsers}
                    onOpenCelery={openCelery}
                />

                {/* Bottom Profile / Settings */}
                <div className="border-t border-border py-4 px-3 flex flex-col gap-1">
                    <div className="flex items-center gap-3 py-2 px-3 mb-2 rounded-md bg-bg-secondary/40 border border-border/50">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                            {user?.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs font-semibold text-text-primary truncate" title={user?.username}>
                                {user?.username || 'Admin User'}
                            </div>
                            <span className="text-[9px] text-text-tertiary uppercase font-bold tracking-wide">Administrator</span>
                        </div>
                    </div>

                    <button
                        className="flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-bg-secondary hover:text-text-primary py-2.5 px-3"
                        onClick={() => navigate('/settings')}
                    >
                        <Settings size={20} className="shrink-0" />
                        <span>Settings</span>
                    </button>

                    <div className="h-px bg-border my-1"></div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-danger py-2.5 px-3"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-[260px] min-w-0">
                {/* Top Header */}
                <header className="h-[var(--header-height)] px-8 flex justify-end items-center border-b border-border bg-bg-primary/50 backdrop-blur-sm sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                value={currentEnv}
                                onChange={(e) => {
                                    if (window.confirm(`Switch to ${e.target.value === 'PROD' ? 'Production' : 'Staging'}? You will be redirected.`)) {
                                        switchEnvironment(e.target.value);
                                    }
                                }}
                                className={`appearance-none py-1 px-3 rounded-full text-xs font-semibold cursor-pointer tracking-wide text-center focus:outline-none border ${
                                    currentEnv === 'PROD'
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}
                            >
                                <option value="STAGE">STAGING</option>
                                <option value="PROD">PRODUCTION</option>
                            </select>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 py-8 px-8 overflow-y-auto">
                    {location.pathname.includes('/users/') && <ScUsersSectionTabs />}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default HomeLayout;
