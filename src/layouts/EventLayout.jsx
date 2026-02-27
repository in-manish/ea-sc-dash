import React, { useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { Menu, X, Users, Calendar, Settings, ChevronLeft, Building2, ArrowLeft, LogOut, MessageSquare, BarChart2, UserCog, ShieldCheck, IdCard } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

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
        return <div className="p-4 text-text-secondary">Loading Event Context...</div>;
    }

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 text-sm transition-all duration-200 whitespace-nowrap rounded-md ${isActive ? 'text-accent bg-accent/10 font-semibold' : 'text-text-secondary font-medium hover:text-text-primary hover:bg-bg-secondary'
        } ${isCollapsed ? 'justify-center p-[10px]' : 'py-2.5 px-3'}`;

    return (
        <div className="flex min-h-screen bg-bg-secondary">
            <aside className={`bg-bg-primary border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
                <div className={`border-b border-border transition-all duration-300 ${isCollapsed ? 'p-4 px-3' : 'py-5 px-4'}`}>
                    <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4 mb-0' : 'justify-between mb-4'}`}>
                        <button
                            onClick={() => {
                                clearEvent();
                                navigate('/');
                            }}
                            className={`bg-transparent border-none text-text-tertiary cursor-pointer rounded-md flex items-center justify-center transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${isCollapsed ? 'p-2 w-full' : 'p-2'}`}
                            title="Back to Events"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`bg-transparent border-none text-text-tertiary cursor-pointer rounded-md flex items-center justify-center transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${isCollapsed ? 'p-2 w-full' : 'p-2'}`} title="Toggle Sidebar">
                            <Menu size={20} />
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="px-2 animate-[fadeIn_0.5s_ease-out]">
                            <h2 className="text-base font-semibold text-text-primary mb-1 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">{selectedEvent.name}</h2>
                            <div className="flex flex-col text-xs text-text-secondary gap-0.5">
                                <span>#{selectedEvent.id}</span>
                                <span>{formatDate(selectedEvent.start_date)} - {formatDate(selectedEvent.end_date)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto ${isCollapsed ? 'py-4 px-2' : 'py-4 px-3'}`}>
                    <NavLink
                        to={`/event/${selectedEvent.id}/attendees`}
                        className={navLinkClass}
                        title={isCollapsed ? "Attendees" : ""}
                    >
                        <Users size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Attendees</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/agenda`}
                        className={navLinkClass}
                        title={isCollapsed ? "Agenda" : ""}
                    >
                        <Calendar size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Agenda</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/companies`}
                        className={navLinkClass}
                        title={isCollapsed ? "Companies" : ""}
                    >
                        <Building2 size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Companies</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/communication`}
                        className={navLinkClass}
                        title={isCollapsed ? "Communication" : ""}
                    >
                        <MessageSquare size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Communication</span>
                    </NavLink>

                    <NavLink
                        to={`/event/${selectedEvent.id}/reports`}
                        className={navLinkClass}
                        title={isCollapsed ? "Reports" : ""}
                    >
                        <BarChart2 size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Reports</span>
                    </NavLink>

                    <div className="mt-auto flex flex-col gap-1">
                        <div className={`h-px bg-border my-2 ${isCollapsed ? 'mx-1' : ''}`}></div>

                        <NavLink
                            to={`/event/${selectedEvent.id}/attendee-types`}
                            className={navLinkClass}
                            title={isCollapsed ? "Attendee Types" : ""}
                        >
                            <IdCard size={20} className="shrink-0" />
                            <span className={isCollapsed ? 'hidden' : 'block'}>Attendee Types</span>
                        </NavLink>

                        <NavLink
                            to={`/event/${selectedEvent.id}/staff`}
                            className={navLinkClass}
                            title={isCollapsed ? "Staff Management" : ""}
                        >
                            <ShieldCheck size={20} className="shrink-0" />
                            <span className={isCollapsed ? 'hidden' : 'block'}>Staff Management</span>
                        </NavLink>
                    </div>
                </nav>

                <div className={`border-t border-border flex flex-col gap-1 ${isCollapsed ? 'py-4 px-2' : 'py-4 px-3'}`}>
                    <button
                        className={`flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-bg-secondary hover:text-text-primary whitespace-nowrap ${isCollapsed ? 'justify-center p-[10px]' : 'py-2.5 px-3'}`}
                        title={isCollapsed ? "Settings" : ""}
                        onClick={() => navigate(`/event/${selectedEvent.id}/settings`)}
                    >
                        <Settings size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Settings</span>
                    </button>

                    <div className={`h-px bg-border my-2 ${isCollapsed ? 'hidden' : 'block'}`}></div>

                    <button onClick={logout} className={`flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-danger whitespace-nowrap ${isCollapsed ? 'justify-center p-[10px]' : 'py-2.5 px-3'}`} title={isCollapsed ? "Logout" : ""}>
                        <LogOut size={20} className="shrink-0" />
                        <span className={isCollapsed ? 'hidden' : 'block'}>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={`flex-1 bg-bg-secondary p-8 min-h-screen transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default EventLayout;
