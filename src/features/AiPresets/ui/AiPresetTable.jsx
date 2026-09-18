import { Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDateTime';
import { MATCHMAKING_PRESET_KEY } from '../constants';

function StatusChip({ active, label }) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
        active ? 'bg-emerald-500/10 text-emerald-700' : 'bg-bg-secondary text-text-tertiary'
      }`}
    >
      {label}
    </span>
  );
}

export default function AiPresetTable({ rows, onEdit, onDelete, onPreview }) {
  if (!rows.length) {
    return (
      <div className="py-16 text-center bg-bg-primary border border-border rounded-lg">
        <p className="text-sm font-medium text-text-primary m-0">No presets yet</p>
        <p className="text-xs text-text-tertiary mt-1 mb-0">
          Create a system prompt preset. Matchmaking uses <span className="font-mono">mm_seeking_mapper</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary/40 text-text-tertiary text-xs font-semibold uppercase tracking-wider border-b border-border">
              <th className="py-3.5 px-5">Name</th>
              <th className="py-3.5 px-5">Key</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 hidden md:table-cell">Updated</th>
              <th className="py-3.5 px-5 w-[148px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0 hover:bg-bg-secondary/30 transition-colors"
              >
                <td className="py-3.5 px-5">
                  <button
                    type="button"
                    className="text-left bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => onEdit(row)}
                  >
                    <div className="font-medium text-text-primary text-sm">{row.name || 'Untitled'}</div>
                    <div className="text-xs text-text-tertiary mt-0.5">#{row.id}</div>
                  </button>
                </td>
                <td className="py-3.5 px-5 text-sm font-mono text-text-secondary">{row.preset_key}</td>
                <td className="py-3.5 px-5">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusChip active={row.is_active} label={row.is_active ? 'Active' : 'Inactive'} />
                    {row.is_default ? <StatusChip active label="Default" /> : null}
                  </div>
                </td>
                <td className="py-3.5 px-5 text-sm text-text-secondary hidden md:table-cell">
                  {formatDateTime(row.updated_at)}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1">
                    {row.preset_key === MATCHMAKING_PRESET_KEY ? (
                      <button
                        type="button"
                        className="p-1.5 rounded-md border-none bg-transparent text-text-tertiary hover:text-accent hover:bg-accent/10 cursor-pointer"
                        title="Preview matchmaking prompt"
                        onClick={() => onPreview(row)}
                      >
                        <Eye size={15} />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="p-1.5 rounded-md border-none bg-transparent text-text-tertiary hover:text-accent hover:bg-accent/10 cursor-pointer"
                      title="Edit"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-md border-none bg-transparent text-text-tertiary hover:text-danger hover:bg-red-50 cursor-pointer"
                      title="Delete"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
