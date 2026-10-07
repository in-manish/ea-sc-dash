import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { attendeesWithPermissionPath } from '../../Attendees/domain/attendeePermissionLink';
import { formatDateRange, formatTimeRange } from '../domain/permissionWindow';
import PermissionCodeEditForm from './PermissionCodeEditForm';

function ActiveChip({ active }) {
  return active ? (
    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-success/10 text-success">
      Active
    </span>
  ) : (
    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-bg-secondary text-text-tertiary">
      Inactive
    </span>
  );
}

export default function PermissionCodeTableRow({
  row,
  eventId,
  focused,
  editing,
  canEdit,
  columns,
  usage,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (focused) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [focused]);

  return (
    <tr
      ref={ref}
      className={`border-b border-border last:border-b-0 align-top ${focused ? 'bg-accent/10' : ''}`}
    >
      <td className="px-4 py-3 font-mono font-semibold text-accent" colSpan={editing ? columns : 1}>
        {editing ? (
          <PermissionCodeEditForm row={row} onSave={onSave} onCancel={onCancel} />
        ) : (
          row.code
        )}
      </td>
      {editing ? null : (
        <>
          <td className="px-4 py-3 text-text-primary">{row.name}</td>
          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateRange(row)}</td>
          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatTimeRange(row)}</td>
          <td className="px-4 py-3"><ActiveChip active={row.is_active !== false} /></td>
          <td className="px-4 py-3 tabular-nums text-text-primary">{usage ? usage.badges : '—'}</td>
          <td className="px-4 py-3 text-text-secondary text-xs">
            {usage
              ? (usage.locations.length ? usage.locations.map((place) => place.name).join(', ') : 'Nowhere yet')
              : '—'}
          </td>
          <td className="px-4 py-3 text-right whitespace-nowrap">
            <Link
              to={attendeesWithPermissionPath(eventId, row.id)}
              className="text-sm font-semibold text-text-secondary hover:text-accent mr-3"
            >
              Attendees
            </Link>
            {canEdit ? (
              <>
                <button type="button" onClick={onEdit} className="text-sm font-semibold text-accent mr-3">
                  Edit
                </button>
                <button type="button" onClick={onDelete} className="text-sm font-semibold text-danger">
                  Delete
                </button>
              </>
            ) : null}
          </td>
        </>
      )}
    </tr>
  );
}
