import { MapPin } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDateTime';
import PermissionWindowLine from './PermissionWindowLine';

function PermissionChip({ permission }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-medium text-text-primary">
      <span>
        {permission.code ? (
          <span className="font-mono font-semibold text-accent">{permission.code}</span>
        ) : null}
        {permission.name ? <span className="ml-1">{permission.name}</span> : null}
        <PermissionWindowLine permission={permission} />
      </span>
    </span>
  );
}

export default function ScanLocationCard({ location, onEdit, onDelete, children }) {
  return (
    <article className="bg-bg-primary border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-accent/10 text-accent shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-text-primary truncate">{location.name}</h2>
            <p className="text-xs text-text-tertiary mt-1">
              Created {formatDateTime(location.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
          {location.deleted ? (
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-danger/10 text-danger">
              Deleted
            </span>
          ) : null}
          {location.specialPermission ? (
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-accent/10 text-accent">
              Special
            </span>
          ) : null}
          {onEdit ? (
            <button type="button" onClick={onEdit} className="text-xs font-semibold text-accent px-2 py-1">
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" onClick={onDelete} className="text-xs font-semibold text-danger px-2 py-1">
              Delete
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
          Permissions
        </p>
        {location.openEntry ? (
          <span className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Open entry
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {location.permissions.map((permission) => (
              <PermissionChip
                key={permission.id ?? `${permission.code}-${permission.name}`}
                permission={permission}
              />
            ))}
          </div>
        )}
      </div>
      {children}
    </article>
  );
}
