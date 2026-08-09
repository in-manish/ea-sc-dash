import { NavLink, useLocation } from 'react-router-dom';

const TABS = [
  { to: '/users/manage', label: 'Manage user', match: (path) => path.startsWith('/users/manage') },
  { to: '/users/sync-track', label: 'User Sync Track', match: (path) => path.startsWith('/users/sync-track') },
];

/** Horizontal tabs for SC Users section pages. */
export default function ScUsersSectionTabs() {
  const { pathname } = useLocation();

  return (
    <div className="mb-6 -mt-2">
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.match(pathname);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/users/manage'}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
