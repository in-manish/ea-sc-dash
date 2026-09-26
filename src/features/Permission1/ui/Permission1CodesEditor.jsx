import { Plus, Trash2 } from 'lucide-react';
import {
  nextPermission1Code,
  permission1CodeChoices,
} from '../domain/permission1Codes';

const fieldClass = (isModified) =>
  `w-full h-10 px-3 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${
    isModified
      ? 'border-amber-500 bg-[#fffbeb] text-amber-900 focus:border-amber-600 focus:ring-amber-500/20'
      : 'border-border bg-bg-primary text-text-primary focus:border-accent focus:ring-accent/10'
  }`;

/**
 * Edit the event permission1 code map (one letter or digit → label).
 *
 * Example: rows [{ code: 'A', label: 'Lunch' }] save as {"A":"Lunch"}.
 */
const Permission1CodesEditor = ({ rows, onChange, isModified }) => {
  const items = Array.isArray(rows) ? rows : [];
  const preview = items
    .map((row) => String(row.code || '').trim().toUpperCase())
    .filter((code) => code.length === 1)
    .join('|');

  const suggested = nextPermission1Code(items);

  const addRow = () => {
    if (!suggested) return;
    onChange([...items, { code: suggested, label: '' }]);
  };

  const updateRow = (index, patch) => {
    onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-tertiary m-0 leading-relaxed">
        Each code is one letter or digit. Attendee create, edit, and CSV upload
        join the selected codes with a bar{preview ? `, such as ${preview}` : ', such as A|B'}.
      </p>

      {items.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-bg-secondary">
          <p className="text-sm font-medium text-text-secondary mb-1">No codes yet</p>
          <p className="text-xs text-text-tertiary mb-4">Add a code and the name attendees will see.</p>
          <button
            type="button"
            className="btn btn-sm btn-secondary inline-flex items-center gap-1.5"
            onClick={addRow}
          >
            <Plus size={14} />
            Add code {suggested || ''}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.25rem] gap-3 px-0.5">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Code
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Label
            </span>
            <span className="sr-only">Remove</span>
          </div>
          {items.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.25rem] gap-3 items-center"
            >
              <select
                value={row.code}
                onChange={(e) => updateRow(index, { code: e.target.value })}
                className={`${fieldClass(isModified)} text-center font-semibold uppercase tracking-wide px-1`}
                aria-label={`Permission 1 code ${index + 1}`}
              >
                {!row.code && <option value="">—</option>}
                {permission1CodeChoices(items, index).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                className={fieldClass(isModified)}
                placeholder="Lunch"
                aria-label={`Permission 1 label ${index + 1}`}
              />
              <button
                type="button"
                className="h-10 w-9 inline-flex items-center justify-center rounded-md text-text-tertiary hover:text-status-danger hover:bg-bg-secondary bg-transparent border border-transparent cursor-pointer"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label={`Remove permission 1 code ${index + 1}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-secondary inline-flex items-center gap-1.5 mt-2"
            onClick={addRow}
            disabled={!suggested}
          >
            <Plus size={14} />
            Add code {suggested || ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default Permission1CodesEditor;
