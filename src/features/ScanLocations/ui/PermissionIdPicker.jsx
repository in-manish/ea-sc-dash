import { permissionIdList } from '../domain/permissionIds';
import PermissionWindowLine from './PermissionWindowLine';

function asError(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(' ');
  return String(value);
}

/**
 * Checkboxes for event permission codes. selected and onChange use numeric ids.
 */
export default function PermissionIdPicker({
  codes = [],
  selected,
  onChange,
  error,
  ready = true,
  label = 'Permissions',
  emptyHint = 'No permission codes yet.',
}) {
  const chosen = permissionIdList(selected);
  const known = new Set(codes.map((item) => item.id));
  const options = [
    ...codes.filter((item) => item.id != null),
    ...chosen
      .filter((id) => !known.has(id))
      .map((id) => ({ id, code: String(id), name: 'Not in this event' })),
  ];

  const toggle = (id) => {
    const next = chosen.includes(id) ? chosen.filter((item) => item !== id) : [...chosen, id];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-secondary m-0">{label}</p>
      {!ready ? <p className="text-xs text-text-tertiary m-0">Loading codes…</p> : null}
      {ready && options.length === 0 ? <p className="text-xs text-text-tertiary m-0">{emptyHint}</p> : null}
      {options.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = chosen.includes(option.id);
            return (
              <label
                key={option.id}
                className={`inline-flex items-center gap-2 py-1.5 px-3 border rounded-full text-xs cursor-pointer ${
                  active
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-primary border-border text-text-secondary'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => toggle(option.id)}
                />
                <span className="text-left">
                  <span className="font-semibold">{option.code}</span>
                  <span className="ml-1">{option.name}</span>
                  <PermissionWindowLine permission={option} />
                </span>
              </label>
            );
          })}
        </div>
      ) : null}
      {asError(error) ? <p className="text-xs text-danger m-0">{asError(error)}</p> : null}
    </div>
  );
}
