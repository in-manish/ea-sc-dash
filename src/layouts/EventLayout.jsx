import React, { useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { Menu, X, Users, Calendar, Settings, ChevronLeft, Building2, ArrowLeft, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './EventLayout.css';

const EventLayout = () => {
    const { selectedEvent, clearEvent, logout } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!selectedEvent || selectedEvent.id.toString() !== id) {
        return <div className="loading-state">Loading Event Context...</div>;
    }

    return (
        <div className={`event-layout ${isCollapsed ? 'collapsed' : ''}`}>
            <aside className="event-sidebar">
                <div className="event-sidebar-header">
                    <div className="header-top">
                        <button
                            onClick={() => {
                                clearEvent();
                                navigate('/');
                            }}
                            className="back-btn"
                            title="Back to Events"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="toggle-btn" title="Toggle Sidebar">
                            <Menu size={20} />
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="event-info animate-fade-in">
                            <h2 className="event-sidebar-title">{selectedEvent.name}</h2>
                            <div className="event-meta">
                                <span>#{selectedEvent.id}</span>
                                <span>{formatDate(selectedEvent.start_date)} - {formatDate(selectedEvent.end_date)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="event-nav">
                    <NavLink
                        to={`/event/${selectedEvent.id}/attendees`}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? "Attendees" : ""}
                    >
                        <Users size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Attendees</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/agenda`}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? "Agenda" : ""}
                    >
                        <Calendar size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Agenda</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/companies`}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? "Companies" : ""}
                    >
                        <Building2 size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Companies</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/communication`}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        title={isCollapsed ? "Communication" : ""}
                    >
                        <MessageSquare size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Communication</span>
                    </NavLink>
                </nav>

                <div className="event-sidebar-footer">
                    <button
                        className="settings-btn-sidebar"
                        title={isCollapsed ? "Settings" : ""}
                        onClick={() => navigate(`/event/${selectedEvent.id}/settings`)}
                    >
                        <Settings size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Settings</span>
                    </button>

                    <div className="sidebar-divider"></div>

                    <button onClick={logout} className="logout-btn-sidebar" title={isCollapsed ? "Logout" : ""}>
                        <LogOut size={20} className="sidebar-item-icon" />
                        <span className="sidebar-label">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="event-content">
                <Outlet />
            </main>
        </div>
    );
};

export default EventLayout;
