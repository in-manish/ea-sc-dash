import { useNavigate } from 'react-router-dom';
import { formatPermissionWindow } from '../../ScanLocations/domain/permissionWindow';
import { attendeePermissions, permissionConfigPath } from '../domain/attendeePermissionLink';

export default function AttendeePermissionChips({ attendee, eventId }) {
  const navigate = useNavigate();
  const permissions = attendeePermissions(attendee);
  const targetEventId = attendee.event_id || eventId;

  if (!permissions.length) {
    return <span className="text-xs text-text-tertiary">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {permissions.map((permission) => {
        const label = [permission.code, permission.name].filter(Boolean).join(' ');
        return (
          <button
            key={permission.id ?? label}
            type="button"
            title={formatPermissionWindow(permission)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2 py-1 text-xs font-medium text-text-primary hover:border-accent hover:text-accent"
            onClick={(event) => {
              event.stopPropagation();
              if (!targetEventId || permission.id == null) return;
              navigate(permissionConfigPath(targetEventId, permission.id));
            }}
          >
            {permission.code ? (
              <span className="font-mono font-semibold text-accent">{permission.code}</span>
            ) : null}
            {permission.name ? <span>{permission.name}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
