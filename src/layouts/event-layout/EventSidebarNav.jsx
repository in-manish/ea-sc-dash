import { EVENT_ADMIN_NAV, EVENT_MAIN_NAV } from './eventNavConfig';
import EventNavItem from './EventNavItem';

export default function EventSidebarNav({
  eventId,
  isCollapsed,
  location,
  navigate,
  expandedItems,
  toggleExpand,
}) {
  const itemProps = {
    eventId,
    isCollapsed,
    location,
    navigate,
    expandedItems,
    toggleExpand,
  };

  return (
    <div className="flex-1 flex flex-col gap-1 min-h-0">
      {EVENT_MAIN_NAV.map((item) => (
        <EventNavItem key={item.title} item={item} {...itemProps} />
      ))}

      <div className="mt-auto flex flex-col gap-1">
        <div className={`h-px bg-border my-2 ${isCollapsed ? 'mx-1' : ''}`} />
        {EVENT_ADMIN_NAV.map((item) => (
          <EventNavItem key={item.title} item={item} {...itemProps} />
        ))}
      </div>
    </div>
  );
}
