import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="top-header">
                    {/* Breadcrumbs or page title could go here */}
                </header>
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
