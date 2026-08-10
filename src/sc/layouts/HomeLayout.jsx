import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ScHomeSidebarNav from './ScHomeSidebarNav';
import ScUsersSectionTabs from './ScUsersSectionTabs';
import ScSidebarProfile from './ScSidebarProfile';

const HomeLayout = () => {
    const { currentEnv, switchEnvironment, currentMode, switchMode } = useAuth();
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

                <ScSidebarProfile />
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
