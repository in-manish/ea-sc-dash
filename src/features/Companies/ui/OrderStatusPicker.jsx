import { Loader2 } from 'lucide-react';
import { ORDER_STATUS_OPTIONS } from '../domain/orderStatusOptions';

const CHIP = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer';
const chipTone = (checked) => (checked ? 'border-accent text-accent bg-bg-secondary' : 'border-border text-text-secondary');

/** Checkbox chips for the order report's `status` filter. At least one must stay selected to send. */
export default function OrderStatusPicker({ value, onChange, disabled }) {
  const toggle = (status) =>
    onChange(value.includes(status) ? value.filter((s) => s !== status) : [...value, status]);

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Order status</span>
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUS_OPTIONS.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`${CHIP} ${chipTone(checked)}`}
            >
              <input
                type="checkbox"
                className="m-0"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="text-xs text-status-danger m-0">Pick at least one status.</p>
      )}
    </div>
  );
}

const COLUMN_GROUP_TITLES = { company: 'Company', poc: 'POC', team: 'Team', invites: 'Invites' };

function groupColumns(columns) {
  const groups = [];
  columns.forEach((column) => {
    let group = groups.find((g) => g.id === column.group);
    if (!group) {
      group = { id: column.group, title: COLUMN_GROUP_TITLES[column.group] || column.group, items: [] };
      groups.push(group);
    }
    group.items.push(column);
  });
  return groups;
}

/** Invitee report column checkboxes (state from useInviteeReportColumns). Untick to leave a column out. */
export function InviteeColumnPicker({ picker, disabled }) {
  const { columns, selected, loading, supported } = picker;
  if (loading) {
    return (
      <p className="text-xs text-text-tertiary m-0 inline-flex items-center gap-1.5">
        <Loader2 size={12} className="animate-spin" /> Loading columns…
      </p>
    );
  }
  if (!supported) {
    return <p className="text-xs text-text-tertiary m-0">Column choice isn&apos;t available yet: every column will be included.</p>;
  }
  const link = 'bg-transparent border-none p-0 text-xs text-accent cursor-pointer hover:underline disabled:opacity-50';
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Columns ({selected.length}/{columns.length})
        </span>
        <span className="flex gap-3">
          <button type="button" className={link} disabled={disabled} onClick={picker.selectAll}>All</button>
          <button type="button" className={link} disabled={disabled} onClick={picker.clear}>None</button>
        </span>
      </div>
      {groupColumns(columns).map((group) => (
        <div key={group.id}>
          <p className="text-[11px] text-text-tertiary m-0 mb-1">{group.title}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((column) => {
              const checked = selected.includes(column.key);
              return (
                <label key={column.key} title={column.description || column.label} className={`${CHIP} ${chipTone(checked)}`}>
                  <input type="checkbox" className="m-0" checked={checked} disabled={disabled} onChange={() => picker.toggle(column.key)} />
                  {column.label}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {selected.length === 0 && <p className="text-xs text-status-danger m-0">Tick at least one column.</p>}
    </div>
  );
}
