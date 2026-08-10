import { NavLink } from 'react-router-dom';
import { UserCog, ChevronDown, Cpu } from 'lucide-react';

const subLinkClass = ({ isActive }) =>
  `text-[13px] py-1.5 px-2 rounded-md transition-all duration-200 ${
    isActive
      ? 'text-accent font-semibold bg-accent/5'
      : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'
  }`;

const parentClass = (active) =>
  `flex items-center gap-3 text-sm transition-all duration-200 whitespace-nowrap rounded-md py-2.5 px-3 cursor-pointer border-none w-full text-left ${
    active
      ? 'text-accent bg-accent/10 font-semibold'
      : 'text-text-secondary font-medium hover:text-text-primary hover:bg-bg-secondary bg-transparent'
  }`;

/** SC home sidebar groups — parent click opens the first child route. */
export default function ScHomeSidebarNav({
  locationPath,
  isUsersExpanded,
  isCeleryExpanded,
  onOpenUsers,
  onOpenCelery,
}) {
  const usersActive = locationPath.includes('/users/');
  const celeryActive = locationPath.includes('/celery-beat');

  return (
    <nav className="flex-1 flex flex-col gap-1 py-4 px-3 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <button type="button" onClick={onOpenUsers} className={parentClass(usersActive)}>
          <UserCog size={20} className="shrink-0" />
          <span className="flex-1">Users</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isUsersExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {isUsersExpanded && (
          <div className="ml-9 flex flex-col gap-1 border-l border-border pl-2 my-1 animate-fade-in">
            <NavLink to="/users/manage" className={subLinkClass}>
              Manage user
            </NavLink>
            <NavLink to="/users/sync-track" className={subLinkClass}>
              User Sync Track
            </NavLink>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <button type="button" onClick={onOpenCelery} className={parentClass(celeryActive)}>
          <Cpu size={20} className="shrink-0" />
          <span className="flex-1">Celery Manage</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isCeleryExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        {isCeleryExpanded && (
          <div className="ml-9 flex flex-col gap-1 border-l border-border pl-2 my-1 animate-fade-in">
            <NavLink to="/celery-beat" className={subLinkClass}>
              Celery Beat
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
