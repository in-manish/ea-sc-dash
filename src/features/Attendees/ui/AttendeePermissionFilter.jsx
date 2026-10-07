import usePermissionCodes from '../../ScanLocations/hooks/usePermissionCodes';
import { PERMISSION_CODE_FILTER, PERMISSION_ID_FILTER } from '../domain/attendeePermissionLink';

const fieldClass = 'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none';

function selectedIds(filters) {
  const value = filters[PERMISSION_ID_FILTER];
  if (Array.isArray(value)) return value.map(String);
  if (value) return [String(value)];
  return [];
}

export default function AttendeePermissionFilter({ eventId, token, filters, updateFilter }) {
  const { codes, loading } = usePermissionCodes(eventId, token);
  const chosen = selectedIds(filters);
  const codeValue = filters[PERMISSION_CODE_FILTER] || '';

  const toggleId = (id) => {
    const next = chosen.includes(id) ? chosen.filter((item) => item !== id) : [...chosen, id];
    updateFilter(PERMISSION_ID_FILTER, next);
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
        Permission
      </h4>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">Permission ids</span>
        <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-bg-secondary">
          {loading ? <p className="m-0 px-3 py-2 text-xs text-text-tertiary">Loading…</p> : null}
          {!loading && codes.length === 0 ? (
            <p className="m-0 px-3 py-2 text-xs text-text-tertiary">No permission codes</p>
          ) : null}
          {codes.map((code) => {
            const id = String(code.id);
            return (
              <label key={id} className="flex items-start gap-2 px-3 py-2 text-sm text-text-primary">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={chosen.includes(id)}
                  onChange={() => toggleId(id)}
                />
                <span className="leading-snug">{code.code} {code.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">Permission codes</span>
        <input
          type="text"
          className={`${fieldClass} uppercase`}
          placeholder="A, B"
          value={codeValue}
          onChange={(e) => updateFilter(PERMISSION_CODE_FILTER, e.target.value.toUpperCase())}
        />
      </label>
    </div>
  );
}
