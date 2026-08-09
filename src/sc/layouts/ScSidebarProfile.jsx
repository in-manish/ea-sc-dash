import { useNavigate } from 'react-router-dom';
import { LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getScUserRole } from '../../features/ScAuth/domain/scLoginUser';

/** SC sidebar footer: profile chip + logout. */
export default function ScSidebarProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || user?.username || user?.email || 'User';
  const initials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const role = getScUserRole(user) || '—';

  return (
    <div className="border-t border-border py-4 px-3 flex flex-col gap-1">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-3 py-2 px-3 mb-1 rounded-md bg-bg-secondary/40 border border-border/50 text-left cursor-pointer hover:bg-bg-secondary transition-colors w-full"
        title="View profile"
      >
        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs shrink-0">
          {initials || 'U'}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <div className="text-xs font-semibold text-text-primary truncate">{displayName}</div>
          <span className="text-[9px] text-text-tertiary uppercase font-bold tracking-wide">
            {role}
          </span>
        </div>
        <UserRound size={14} className="text-text-tertiary shrink-0" />
      </button>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 w-full border-none bg-transparent text-text-secondary rounded-md text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-danger py-2.5 px-3"
      >
        <LogOut size={20} className="shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );
}
