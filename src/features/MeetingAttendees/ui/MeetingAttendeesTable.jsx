import { Loader2 } from 'lucide-react';
import { COUNT_FILTERS } from '../constants';

const th = 'text-left text-xs font-semibold text-text-secondary px-3 py-2.5 border-b border-border';
const td = 'px-3 py-2.5 text-sm text-text-primary border-b border-border';

function Row({ row, checked, locked, onToggle }) {
  return (
    <tr className={checked ? 'bg-accent/5' : ''}>
      <td className={td}>
        <input
          type="checkbox"
          checked={checked}
          disabled={locked}
          onChange={() => onToggle(row.uuid)}
          aria-label={`Select ${row.name}`}
        />
      </td>
      <td className={td}>{row.name || '—'}</td>
      <td className={td}>{row.email || '—'}</td>
      <td className={td}>{row.company || '—'}</td>
      <td className={td}>
        {row.attendee_type}
        {row.is_exhibitor && (
          <span className="ml-2 text-[0.7rem] px-1.5 py-0.5 rounded bg-accent/10 text-accent">Exhibitor</span>
        )}
      </td>
      {COUNT_FILTERS.map(({ key, field }) => (
        <td key={key} className={`${td} text-right`}>{row[field] ?? 0}</td>
      ))}
    </tr>
  );
}

export default function MeetingAttendeesTable({ rows, loading, selection, onTogglePage }) {
  const pageChecked = rows.length > 0 && rows.every((row) => selection.selectedUuids.includes(row.uuid));
  return (
    <div className="relative overflow-x-auto border border-border rounded-lg">
      {loading && (
        <div className="absolute inset-0 bg-bg-primary/60 flex items-center justify-center z-10">
          <Loader2 className="animate-spin text-accent" size={22} />
        </div>
      )}
      <table className="w-full border-collapse">
        <thead className="bg-bg-secondary">
          <tr>
            <th className={th}>
              <input
                type="checkbox"
                checked={selection.selectAll || pageChecked}
                disabled={selection.selectAll || rows.length === 0}
                onChange={() => onTogglePage(rows)}
                aria-label="Select this page"
              />
            </th>
            <th className={th}>Name</th>
            <th className={th}>Email</th>
            <th className={th}>Company</th>
            <th className={th}>Attendee type</th>
            {COUNT_FILTERS.map(({ key, label }) => (
              <th key={key} className={`${th} text-right`}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Row
              key={row.badge_id}
              row={row}
              checked={selection.selectAll || selection.selectedUuids.includes(row.uuid)}
              locked={selection.selectAll}
              onToggle={selection.toggleOne}
            />
          ))}
          {rows.length === 0 && !loading && (
            <tr>
              <td className={`${td} text-center text-text-tertiary`} colSpan={5 + COUNT_FILTERS.length}>
                No attendees match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
