import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import EventFloatingFileUploadTool from '../components/EventFloatingFileUploadTool';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import EventSidebarAccount from './event-layout/EventSidebarAccount';
import EventSidebarHeader from './event-layout/EventSidebarHeader';
import EventSidebarNav from './event-layout/EventSidebarNav';

const EventLayout = () => {
  const { selectedEvent, selectEvent, clearEvent, logout, token, recentEvents, currentMode, switchMode } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [eventLoadError, setEventLoadError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({
    Companies: location.pathname.includes('/companies'),
    Communication: location.pathname.includes('/communication'),
    Reports: location.pathname.includes('/reports'),
    Meetings: location.pathname.includes('/meetings'),
    Visiq: location.pathname.includes('/visiq'),
    'Staff Management': location.pathname.includes('/staff'),
    'Utils Config': location.pathname.includes('/utils-config'),
  });

  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    if ((!selectedEvent || selectedEvent.id.toString() !== id) && token && id) {
      eventService.getEventDetails(id, token)
        .then((eventData) => {
          setEventLoadError(null);
          selectEvent(eventData);
        })
        .catch((err) => {
          console.error('Failed to load event:', err);
          setEventLoadError('Failed to load event. It may not exist or you may not have access.');
        });
    }
  }, [id, token, selectedEvent, selectEvent]);

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (eventLoadError) {
    return (
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="text-danger text-sm">{eventLoadError}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!selectedEvent || selectedEvent.id.toString() !== id) {
    return <div className="p-4 text-text-secondary">Loading Event Context...</div>;
  }

  const chromeBtn = `bg-transparent border-none text-text-tertiary cursor-pointer rounded-md flex items-center justify-center transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${isCollapsed ? 'p-2 w-full' : 'p-2'}`;

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
              className={chromeBtn}
              title="Back to Events"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={chromeBtn}
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
          {!isCollapsed && (
            <EventSidebarHeader
              selectedEvent={selectedEvent}
              recentEvents={recentEvents}
              currentMode={currentMode}
              switchMode={switchMode}
              isEventDropdownOpen={isEventDropdownOpen}
              setIsEventDropdownOpen={setIsEventDropdownOpen}
              selectEvent={selectEvent}
              clearEvent={clearEvent}
              navigate={navigate}
            />
          )}
        </div>

        <nav className={`flex-1 flex flex-col gap-1 overflow-y-auto ${isCollapsed ? 'py-4 px-2' : 'py-4 px-3'}`}>
          <EventSidebarNav
            eventId={selectedEvent.id}
            isCollapsed={isCollapsed}
            location={location}
            navigate={navigate}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
        </nav>

        <EventSidebarAccount
          eventId={selectedEvent.id}
          isCollapsed={isCollapsed}
          onLogout={logout}
          onSettings={() => navigate(`/event/${selectedEvent.id}/settings`)}
        />
      </aside>

      <main className={`flex-1 bg-bg-secondary p-8 min-h-screen overflow-hidden min-w-0 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <Outlet />
      </main>
      <EventFloatingFileUploadTool />
    </div>
  );
};

export default EventLayout;
