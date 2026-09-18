import EventNavGroup from './EventNavGroup';
import EventNavLink from './EventNavLink';

function childHref(eventId, pathPart, child) {
  const tab = child.hrefTab || (typeof child.tab === 'string' ? child.tab : '');
  return `/event/${eventId}${pathPart}?tab=${tab}`;
}

export default function EventNavItem({
  item,
  eventId,
  isCollapsed,
  location,
  navigate,
  expandedItems,
  toggleExpand,
}) {
  if (item.kind === 'link') {
    return (
      <EventNavLink
        to={`/event/${eventId}${item.path}`}
        title={item.title}
        icon={item.icon}
        isCollapsed={isCollapsed}
      />
    );
  }

  return (
    <EventNavGroup
      title={item.title}
      icon={item.icon}
      pathPart={item.pathPart}
      defaultTo={`/event/${eventId}${item.pathPart}${item.defaultSearch || ''}`}
      isCollapsed={isCollapsed}
      expanded={Boolean(expandedItems[item.title])}
      onToggle={toggleExpand}
      location={location}
      navigate={navigate}
      items={item.children.map((child) => ({
        title: child.title,
        to: childHref(eventId, item.pathPart, child),
        pathPart: item.pathPart,
        tab: child.tab,
        isDefault: child.isDefault,
      }))}
    />
  );
}
