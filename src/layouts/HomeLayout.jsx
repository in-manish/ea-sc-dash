import React from 'react';
import { Outlet } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomeLayout = () => {
    const { user, logout, currentEnv, switchEnvironment } = useAuth();

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col relative">
            {/* Top Right Profile & Settings */}
            <div className="h-[var(--header-height)] px-8 flex justify-end items-center">
                <div className="flex items-center gap-4">
                    <div className="relative mr-4">
                        <select
                            value={currentEnv}
                            onChange={(e) => {
                                if (window.confirm(`Switch to ${e.target.value === 'PROD' ? 'Production' : 'Staging'}? You will be redirected to the dashboard.`)) {
                                    switchEnvironment(e.target.value);
                                }
                            }}
                            className={`appearance-none py-1 px-3 rounded-full text-xs font-semibold cursor-pointer tracking-wide text-center focus:outline-none border ${currentEnv === 'PROD'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}
                        >
                            <option value="STAGE">STAGING</option>
                            <option value="PROD">PRODUCTION</option>
                        </select>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-bg-primary border border-border flex items-center justify-center text-text-secondary cursor-pointer transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary" title="Settings">
                        <Settings size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-bg-primary border border-border flex items-center justify-center text-text-primary" title={user?.username}>
                        <User size={20} />
                    </div>
                    <button onClick={logout} className="bg-transparent border-none text-text-secondary text-sm cursor-pointer hover:text-text-primary hover:underline">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 py-4 px-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;
