import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-3 rounded-md transition-all duration-200 text-[0.925rem] ${isActive ? 'bg-bg-tertiary text-accent font-semibold' : 'text-text-secondary font-medium hover:bg-bg-secondary hover:text-text-primary'
        }`;

    return (
        <aside className="w-[var(--sidebar-width)] h-screen fixed left-0 top-0 bg-bg-primary border-r border-border flex flex-col z-50">
            <div className="h-[var(--header-height)] flex items-center px-6 border-b border-bg-secondary">
                <div className="flex items-center gap-3 font-bold text-text-primary">
                    <div className="w-8 h-8 bg-accent text-white rounded-md flex items-center justify-center text-lg">C</div>
                    <span className="logo-text">Command</span>
                </div>
            </div>

            <nav className="flex-1 py-6 px-4 flex flex-col gap-1">
                <NavLink to="/" className={navLinkClass}>
                    <LayoutDashboard size={20} />
                    <span>Events</span>
                </NavLink>
                <NavLink to="/attendees" className={navLinkClass}>
                    <Users size={20} />
                    <span>Attendees</span>
                </NavLink>
                <NavLink to="/schedule" className={navLinkClass}>
                    <Calendar size={20} />
                    <span>Schedule</span>
                </NavLink>
                <div className="h-px bg-border my-4"></div>
                <NavLink to="/settings" className={navLinkClass}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="p-4 flex items-center gap-2 border-t border-border bg-bg-secondary">
                <div className="flex-1 flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-bg-tertiary text-text-secondary flex items-center justify-center font-semibold text-[0.925rem] border border-border shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{user?.name || 'User'}</span>
                        <span className="text-xs text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">{user?.username || 'email@example.com'}</span>
                    </div>
                </div>
                <button onClick={logout} className="p-2 text-text-secondary bg-transparent border-none rounded-md flex items-center justify-center transition-all duration-200 hover:bg-bg-primary hover:text-danger cursor-pointer" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
