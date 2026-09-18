import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { eventNavLinkClass } from './eventNavStyles';

export default function EventNavLink({ to, title, icon, isCollapsed }) {
  return (
    <NavLink
      to={to}
      className={eventNavLinkClass(isCollapsed)}
      title={isCollapsed ? title : ''}
    >
      {createElement(icon, { size: 20, className: 'shrink-0' })}
      {!isCollapsed && <span className="flex-1">{title}</span>}
    </NavLink>
  );
}
