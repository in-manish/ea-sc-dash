import { ChevronDown } from 'lucide-react';
import { formatEventRangeDate } from './formatEventRange';

export default function EventSidebarHeader({
  selectedEvent,
  recentEvents,
  currentMode,
  switchMode,
  isEventDropdownOpen,
  setIsEventDropdownOpen,
  selectEvent,
  clearEvent,
  navigate,
}) {
  return (
    <>
      <div className="px-2 mb-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center bg-bg-secondary border border-border rounded-full p-0.5 shadow-sm">
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

      <div className="px-2 animate-[fadeIn_0.5s_ease-out] relative">
        <button
          onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
          className="w-full text-left bg-bg-primary border border-border rounded-lg p-2.5 flex items-center justify-between transition-all hover:border-border-hover hover:bg-bg-secondary cursor-pointer relative z-20 group"
        >
          <div className="flex flex-col overflow-hidden mr-2">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-0.5 group-hover:text-accent transition-colors">
              Current Event
            </span>
            <h2 className="text-sm font-semibold text-text-primary leading-snug break-words pr-2">
              {selectedEvent.name}
            </h2>
            <div className="flex flex-wrap text-[11px] text-text-secondary gap-x-1 gap-y-0.5 mt-1">
              <span className="font-medium text-text-primary whitespace-nowrap">#{selectedEvent.id}</span>
              <span className="whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">
                {formatEventRangeDate(selectedEvent.start_date)} - {formatEventRangeDate(selectedEvent.end_date)}
              </span>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-text-tertiary transition-transform duration-200 shrink-0 ${
              isEventDropdownOpen ? 'rotate-180 text-text-primary' : ''
            }`}
          />
        </button>

        {isEventDropdownOpen && (
          <RecentEventsMenu
            selectedEvent={selectedEvent}
            recentEvents={recentEvents}
            onClose={() => setIsEventDropdownOpen(false)}
            selectEvent={selectEvent}
            clearEvent={clearEvent}
            navigate={navigate}
          />
        )}
      </div>
    </>
  );
}

function RecentEventsMenu({
  selectedEvent,
  recentEvents,
  onClose,
  selectEvent,
  clearEvent,
  navigate,
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute top-[calc(100%+4px)] left-2 right-2 bg-bg-primary border border-border rounded-lg shadow-lg z-30 py-1.5 animate-fade-in overflow-hidden">
        <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider bg-bg-secondary/50 border-b border-border">
          Recent Events
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {recentEvents && recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <button
                key={`recent-${event.id}`}
                onClick={() => {
                  selectEvent(event);
                  onClose();
                  navigate(`/event/${event.id}/attendees`);
                }}
                className={`w-full text-left px-3 py-2 text-sm border-none bg-transparent cursor-pointer transition-colors hover:bg-bg-secondary flex flex-col ${
                  event.id === selectedEvent.id ? 'bg-accent/5' : ''
                }`}
              >
                <span
                  className={`font-medium ${
                    event.id === selectedEvent.id ? 'text-accent' : 'text-text-primary'
                  } whitespace-nowrap overflow-hidden text-ellipsis w-full`}
                >
                  {event.name}
                </span>
                <span className="text-[11px] text-text-secondary">#{event.id}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-text-tertiary text-center">No recent events</div>
          )}
        </div>
        <div className="border-t border-border mt-1">
          <button
            onClick={() => {
              clearEvent();
              onClose();
              navigate('/');
            }}
            className="w-full text-center px-3 py-2 text-[13px] font-medium text-accent border-none bg-transparent cursor-pointer hover:bg-accent/5 transition-colors"
          >
            View all events
          </button>
        </div>
      </div>
    </>
  );
}
