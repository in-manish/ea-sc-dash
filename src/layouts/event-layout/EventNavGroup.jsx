import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { eventNavLinkClass, eventSubLinkClass, eventTabActive } from './eventNavStyles';

export default function EventNavGroup({
  title,
  icon,
  pathPart,
  defaultTo,
  isCollapsed,
  expanded,
  onToggle,
  location,
  navigate,
  items,
}) {
  const isActive = location.pathname.includes(pathPart);
  const navClass = eventNavLinkClass(isCollapsed);

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`${navClass({ isActive })} cursor-pointer`}
        onClick={() => {
          onToggle(title);
          if (!isActive) navigate(defaultTo);
        }}
        title={isCollapsed ? title : ''}
      >
        {createElement(icon, { size: 20, className: 'shrink-0' })}
        {!isCollapsed && (
          <>
            <span className="flex-1">{title}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </div>
      {!isCollapsed && expanded && (
        <div className="ml-9 flex flex-col gap-1 border-l border-border pl-2 my-1 animate-fade-in">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.to}
              className={() =>
                eventSubLinkClass(
                  eventTabActive(location, item.pathPart || pathPart, item.tab, item.isDefault)
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
