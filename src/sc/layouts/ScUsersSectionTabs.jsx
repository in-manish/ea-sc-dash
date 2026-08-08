import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/users/manage', label: 'Manage user' },
  { to: '/users/sync-track', label: 'User Sync Track' },
];

/** Horizontal tabs for SC Users section pages. */
export default function ScUsersSectionTabs() {
  return (
    <div className="mb-6 -mt-2">
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
