import { permission1CodeMap, permission1Selection } from '../domain/permission1Codes';

const CODE_RE = /^[A-Z0-9]$/;

/**
 * Checkboxes for the event's permission1 codes on create and edit attendee.
 *
 * Example: selected ['A'] with map {A: 'Lunch'} toggles that code.
 */
const Permission1CodePicker = ({ codeMap, selected, onChange, error, ready = true }) => {
  const entries = Object.entries(permission1CodeMap(codeMap)).filter(
    ([code, label]) => CODE_RE.test(String(code).trim().toUpperCase()) && String(label).trim(),
  );
  const chosen = permission1Selection(selected);
  const known = new Set(entries.map(([code]) => String(code).trim().toUpperCase()));
  const options = [
    ...entries.map(([code, label]) => ({
      code: String(code).trim().toUpperCase(),
      label: String(label).trim(),
    })),
    ...chosen
      .filter((code) => !known.has(code))
      .map((code) => ({ code, label: 'Not in this event' })),
  ];

  const toggle = (code) => {
    const next = chosen.includes(code)
      ? chosen.filter((item) => item !== code)
      : [...chosen, code];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-secondary m-0">Permission 1</p>
      {!ready ? (
        <p className="text-xs text-text-tertiary m-0">Loading codes…</p>
      ) : options.length === 0 ? (
        <p className="text-xs text-text-tertiary m-0">
          No codes yet. Add them under Settings → Attendees.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = chosen.includes(option.code);
            return (
              <label
                key={option.code}
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
                  onChange={() => toggle(option.code)}
                />
                <span className="font-semibold">{option.code}</span>
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
      {error ? <p className="text-xs text-status-danger m-0">{error}</p> : null}
    </div>
  );
};

export default Permission1CodePicker;
