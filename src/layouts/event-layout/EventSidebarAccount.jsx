import { IdCard, LogOut, Settings } from 'lucide-react';
import EventNavLink from './EventNavLink';
import { eventNavLinkClass } from './eventNavStyles';

export default function EventSidebarAccount({ eventId, isCollapsed, onLogout, onSettings }) {
  const buttonClass = eventNavLinkClass(isCollapsed)({ isActive: false });

  return (
    <div className={`border-t border-border flex flex-col gap-1 ${isCollapsed ? 'py-4 px-2' : 'py-4 px-3'}`}>
      <EventNavLink
        to={`/event/${eventId}/attendee-types`}
        title="Attendee Types"
        icon={IdCard}
        isCollapsed={isCollapsed}
      />

      <button
        className={`${buttonClass} w-full border-none bg-transparent cursor-pointer`}
        title={isCollapsed ? 'Settings' : ''}
        onClick={onSettings}
      >
        <Settings size={20} className="shrink-0" />
        <span className={isCollapsed ? 'hidden' : 'block'}>Settings</span>
      </button>

      <div className={`h-px bg-border my-2 ${isCollapsed ? 'hidden' : 'block'}`} />

      <button
        onClick={onLogout}
        className={`flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-danger whitespace-nowrap ${
          isCollapsed ? 'justify-center p-[10px]' : 'py-2.5 px-3'
        }`}
        title={isCollapsed ? 'Logout' : ''}
      >
        <LogOut size={20} className="shrink-0" />
        <span className={isCollapsed ? 'hidden' : 'block'}>Logout</span>
      </button>
    </div>
  );
}
