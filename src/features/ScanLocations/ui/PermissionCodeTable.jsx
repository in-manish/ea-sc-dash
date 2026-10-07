import { useState } from 'react';
import PermissionCodeTableRow from './PermissionCodeTableRow';

export default function PermissionCodeTable({
  codes,
  eventId,
  focusId,
  canEdit,
  usage,
  onSave,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const columns = 8;

  const save = async (id, patch) => {
    await onSave(id, patch);
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto border border-border rounded-2xl bg-bg-primary">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-tertiary">
            <th className="px-4 py-3 font-bold">Code</th>
            <th className="px-4 py-3 font-bold">Name</th>
            <th className="px-4 py-3 font-bold">Dates</th>
            <th className="px-4 py-3 font-bold">Time</th>
            <th className="px-4 py-3 font-bold">Active</th>
            <th className="px-4 py-3 font-bold">Badges</th>
            <th className="px-4 py-3 font-bold">Required at</th>
            <th className="px-4 py-3 font-bold"> </th>
          </tr>
        </thead>
        <tbody>
          {codes.map((row) => (
            <PermissionCodeTableRow
              key={row.id ?? row.code}
              row={row}
              eventId={eventId}
              focused={focusId != null && String(row.id) === String(focusId)}
              editing={editingId === row.id}
              canEdit={canEdit}
              columns={columns}
              usage={usage?.get(row.id)}
              onEdit={() => setEditingId(row.id)}
              onCancel={() => setEditingId(null)}
              onSave={save}
              onDelete={() => onDelete(row)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
