import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-[var(--sidebar-width)] bg-bg-secondary flex flex-col h-screen overflow-hidden">
                <header className="h-[var(--header-height)] px-8 flex items-center bg-transparent">
                    {/* Breadcrumbs or page title could go here */}
                </header>
                <div className="flex-1 overflow-y-auto pt-4 px-8 pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
